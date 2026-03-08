const express = require("express");
const { default: mongoose } = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// routers
const userRouter = require("./routers/user.router");
const authRouter = require("./routers/auth.router");
const { GlobalErrorHandler } = require("./controllers/error.controller");
const oauthRouter = require("./routers/oauth.router");
// const paymentRouter = require("./routers/payment.router");
const { webhook } = require("./controllers/payment.controller");

// security
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const aiRouter = require("./routers/ai.router");


const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes"
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many login attempts, please try again after 15 minutes"
});

const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(helmet());

const corsOptions = {
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(cookieParser());

// ── Stripe webhook — must receive RAW body (registered BEFORE express.json()) ──
// Stripe verifies webhook authenticity using a signature computed over the raw bytes.
// If express.json() runs first, the raw body is lost and signature verification fails.
// app.post("/api/payments/webhook", express.raw({ type: "application/json" }), webhook);

// ── TBC webhook uses regular JSON body ───────────────────────────────────────
// TBC sends a standard JSON payload — no raw body needed.
// This route lives inside paymentRouter (mounted at /api/payments below),
// so it's automatically parsed by express.json() which runs next.
// Route: POST /api/payments/tbc/webhook

app.use(express.json());
app.use(globalLimiter);


// routers

app.use("/api/users", userRouter);
app.use("/api/auths", authRouter);
app.use("/api/oauth", oauthRouter);
app.use("/api/ai", aiRouter);
// app.use("/api/payments", paymentRouter);



// global error hanlder

app.use(GlobalErrorHandler);

mongoose.connect(process.env.DB_URL).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((err) => {
    console.log(err);
    process.exit(1);
});