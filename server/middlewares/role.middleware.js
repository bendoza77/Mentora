const AppError = require("../utils/AppError")

const allowedTo = (...roles) => {

    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You dont have permission to do this action"));
        }

        next();
    }


}

module.exports = allowedTo