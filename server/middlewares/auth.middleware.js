const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {

    try {

        const token = req.cookies?.mi;

        if (!token) {
            return next(new AppError("User is not login", 401));
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) return next(new AppError("Invalid token", 401));

        const user = await User.findById(decode.id);

        if (!user) return next(new AppError("User not found", 404));

        req.user = user;

        next();



    } catch(err) {
        console.log(err);
    }


}

module.exports = protect;