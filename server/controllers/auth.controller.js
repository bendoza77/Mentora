const ms = require("ms");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { imageUpload } = require("../utils/uploadImage");
const User = require("../models/user.model");
const applyDailyStreak = require("../utils/streak");

const createSendToken = (user, statusCode, message, res) => {
    const token = user.signToken();

    const cookiesOption = {
        maxAge: ms(process.env.JWT_EXPIRES),
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "Lax",
    };

    res.cookie("mi", token, cookiesOption);

    user.password = undefined;

    return res.status(statusCode).json({
        status: "success",
        message,
        token,
        data: { user },
    });
};

const signup = catchAsync(async (req, res, next) => {
    const { fullname, email, password, confirmPassword } = req.body;
    const { file } = req;

    if (!fullname || !email || !password || !confirmPassword) {
        return next(new AppError("All fields are required", 400));
    }

    if (password !== confirmPassword) {
        return next(
            new AppError("Password and confirm password do not match", 400)
        );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError("Email already in use", 409));
    }

    let img;

    if (file) {
        const uploaded = await imageUpload("avatar", [file.path]);
        const result = Array.isArray(uploaded) ? uploaded[0] : uploaded;
        if (result?.secure_url && result?.public_id) {
            img = { url: result.secure_url, publicId: result.public_id };
        }
    }

    // Today's date normalised to midnight (the registration day counts as day 1)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const payload = {
        fullname,
        email,
        password,
        streak:        1,      // every new account starts at streak = 1
        lastLoginDate: today,  // registration day is their first "login"
        ...(img ? { avatar: img } : {}),
    };

    const newUser = await User.create(payload);

    createSendToken(newUser, 201, "User created successfully", res);
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new AppError("Incorrect email or password", 401));
    }

    const isPasswordCorrect = await user.correctPassword(password);

    if (!isPasswordCorrect) {
        return next(new AppError("Incorrect email or password", 401));
    }

    // Update streak (only once per calendar day — applyDailyStreak returns false if already done)
    const streakChanged = applyDailyStreak(user);
    if (streakChanged) {
        // Save only the streak fields — avoids re-running expensive pre-save hooks unnecessarily
        await user.save({ validateModifiedOnly: true });
    }

    createSendToken(user, 200, "Logged in successfully", res);
});

const autoLogin = catchAsync(async (req, res, next) => {
    const { user } = req;

    if (user) {
        const streakChanged = applyDailyStreak(user);
        if (streakChanged) {
            await user.save({ validateModifiedOnly: true });
        }

        return res.json({
            status: "success",
            data: { user }
        });
    }
});


const logout = catchAsync(async (req, res, next) => {

    res.clearCookie("mi", {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "Lax",
    })

    return res.json({
        status: "succasse",
        message: "You logout succassefuly"
    })


})

module.exports = {
    signup,
    login,
    autoLogin,
    logout
};