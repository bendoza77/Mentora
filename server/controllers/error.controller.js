const sendErrorProd = (err, res) => {

    res.status(err.statusCode || 500).json({
        status: err.status || "error",
        message: err.message,
        stack: err.stack,
        err
    })


}

const sendErrorDev = (err, res) => {


    res.status(err.statusCode || 500).json({
        status: err.status || "fail",
        message: err.message,
        stack: err.stack,
        err
    })
    
}




const GlobalErrorHandler = (err, req, res, next) => {

    if (process.env.NODE_ENV === "development") {
        return sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === "production") {
        return sendErrorProd(err, res);
    }

}

module.exports = {
    GlobalErrorHandler
}