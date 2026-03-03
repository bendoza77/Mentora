const ms = require("ms");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { imageUpload } = require("../utils/uploadImage");
const User = require("../models/user.model");
const applyDailyStreak = require("../utils/streak");
const { sendPasswordResetEmail } = require("../services/emailService");

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

/* ── POST /api/auths/forgot-password ─────────────────────────────────────────
 * Accepts { email }. Generates a reset token, stores its hash in the DB,
 * and sends a reset link to the user's email. Always returns 200 to prevent
 * email enumeration attacks.
 */
const forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    if (!email) return next(new AppError('Please provide your email address', 400));

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always respond 200 — never reveal whether email exists (prevents enumeration)
    if (!user) {
        return res.json({ status: 'success', message: 'If that email is registered, a reset link has been sent.' });
    }

    // OAuth-only accounts have no password to reset
    if (user.provider && !user.password) {
        return res.json({ status: 'success', message: 'If that email is registered, a reset link has been sent.' });
    }

    const rawToken = user.createPasswordResetToken();
    await user.save({ validateModifiedOnly: true });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetURL  = `${clientUrl}/reset-password?token=${rawToken}`;

    try {
        await sendPasswordResetEmail({ to: user.email, name: user.fullname, resetURL });
    } catch (err) {
        // Roll back token if email fails
        user.passwordResetToken   = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateModifiedOnly: true });
        return next(new AppError('Failed to send reset email. Please try again later.', 500));
    }

    res.json({ status: 'success', message: 'If that email is registered, a reset link has been sent.' });
});

/* ── POST /api/auths/reset-password ──────────────────────────────────────────
 * Accepts { token, password, confirmPassword }.
 * Verifies the token hash, checks expiry, and updates the password.
 */
const resetPassword = catchAsync(async (req, res, next) => {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
        return next(new AppError('Token, password and confirm password are required', 400));
    }

    if (password !== confirmPassword) {
        return next(new AppError('Passwords do not match', 400));
    }

    // Hash the incoming raw token to compare against the stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        passwordResetToken:   hashedToken,
        passwordResetExpires: { $gt: Date.now() }, // must not be expired
    }).select('+password +passwordResetToken +passwordResetExpires');

    if (!user) {
        return next(new AppError('Reset link is invalid or has expired. Please request a new one.', 400));
    }

    user.password             = password;
    user.passwordResetToken   = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ status: 'success', message: 'Password reset successfully. You can now sign in.' });
});

module.exports = {
    signup,
    login,
    autoLogin,
    logout,
    forgotPassword,
    resetPassword,
};