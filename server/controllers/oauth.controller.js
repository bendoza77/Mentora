const axios = require('axios');
const ms = require('ms');
const User = require('../models/user.model');
const applyDailyStreak = require('../utils/streak');

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const sendTokenAndRedirect = (user, res) => {
    const token = user.signToken();
    res.cookie("mi", token, {
        maxAge: ms(process.env.JWT_EXPIRES),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax"
    });
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
};



const getGoogleAuthUrl = (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent",
    });

    res.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
}


const googleCallback = async (req, res, next) => {

    try {

        const { code } = req.query;

        const tokenResponse = await axios.post(
            GOOGLE_TOKEN_URL,
            new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                grant_type: "authorization_code"
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        const { access_token } = tokenResponse.data;

        const userInfo = await axios.get(GOOGLE_USERINFO_URL, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        const { email, name, picture, sub } = userInfo.data;

        let user = await User.findOne({ provider: "google", providerId: sub });

        if (!user) {
            user = await User.findOne({ email });
        }

        if (!user) {
            // New Google user — streak starts at 1 (registration = first login)
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            user = await User.create({
                fullname: name,
                email,
                avatar:        { url: picture, publicId: "" },
                provider:      "google",
                providerId:    sub,
                isVerified:    true,
                streak:        1,
                lastLoginDate: today,
            });
        } else {
            // Returning Google user — apply daily streak logic
            const streakChanged = applyDailyStreak(user);
            if (streakChanged) {
                await user.save({ validateModifiedOnly: true });
            }
        }

        sendTokenAndRedirect(user, res);

    } catch(err) {
        console.log(err);
    }

}

module.exports = {
    getGoogleAuthUrl,
    googleCallback
}