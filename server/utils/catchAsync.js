const catchAsync = (fn) => {
    return async (req, res, next) => {
        try {
            return await fn(req, res, next);
        } catch (err) {
            if (typeof next === "function") return next(err);
            throw err;
        }
    };
};

module.exports = catchAsync;