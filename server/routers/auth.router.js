const express = require("express");
const { signup, login, autoLogin, logout, forgotPassword, resetPassword } = require("../controllers/auth.controller");
const protect = require("../middlewares/auth.middleware");
const upload = require("../config/multer");

const authRouter = express.Router();

authRouter.post("/signup",          upload.single("avatar"), signup);
authRouter.post("/login",           login);
authRouter.post("/me",              protect, autoLogin);
authRouter.post("/auto-login",      protect, autoLogin);
authRouter.post("/logout",          protect, logout);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password",  resetPassword);

module.exports = authRouter