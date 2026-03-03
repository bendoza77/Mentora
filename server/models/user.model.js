const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const validator = require("validator");

function noSpaces(value) {
    return !/\s/.test(value);
}

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
            trim: true,
            minlength: [3, "Full name must be at least 3 characters long"],
            maxlength: [50, "Full name must be less than 50 characters long"],
            lowercase: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Please enter a valid email address"],
        },

        password: {
            type: String,
            required: function () { return !this.provider; },
            trim: true,
            minlength: [8, "Password must be at least 8 characters long"],
            maxlength: [50, "Password must be less than 50 characters long"],
            validate: {
                validator: noSpaces,
                message: "Password must not contain spaces",
            },
            select: false
        },

        provider: {
            type: String,
            enum: ["google"],
            default: null,
        },

        providerId: {
            type: String,
            default: null,
        },

        role: {
            type: String,
            require: true,
            enum: ["user", "admin"],
            default: "user",
        },

        plan: {
            type: String,
            enum: ["free", "pro", "premium"],
            default: "free",
        },

        avatar: {
            url: {
                type: String,
                trim: true,
            },

            publicId: {
                type: String,
                trim: true,
            },
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        // ── Streak ───────────────────────────────────────────────────────────
        // Number of consecutive days the user has logged in.
        // Starts at 1 on registration (that day counts as day 1).
        // Grows by 1 each day they return. Resets to 1 on a missed day.
        streak: {
            type:    Number,
            default: 1,
            min:     1,
        },

        // The calendar date of the user's last login (normalised to midnight).
        // Used to determine whether today's login already incremented the streak.
        lastLoginDate: {
            type:    Date,
            default: null,
        },

        // ── Learning statistics ───────────────────────────────────────────────
        // All counters start at 0. They are incremented by the practice/exam
        // modules via POST /api/users/stats/activity and /stats/exam.
        stats: {
            // Total number of problems the user has attempted (correct + incorrect)
            problemsSolved: { type: Number, default: 0, min: 0 },

            // Number of problems the user answered correctly
            correctAnswers: { type: Number, default: 0, min: 0 },

            // Total attempts (same as problemsSolved — kept separate for clarity)
            totalAttempts:  { type: Number, default: 0, min: 0 },

            // History of exam scores (capped at 50 entries by the controller)
            examScores: [{
                score:   { type: Number, required: true },           // e.g. 74
                maxScore:{ type: Number, default: 100 },             // e.g. 100
                subject: { type: String, default: 'Math' },          // e.g. 'Math'
                date:    { type: Date,   default: () => new Date() },
                _id:     false,                                      // no sub-document _id
            }],
        },

        // ── Recent activity log ───────────────────────────────────────────────
        // Stores the last 200 problem attempts.
        // Used to compute: weekly chart, topic breakdown, accuracy trends.
        // Each entry: { topic, correct, difficulty, timestamp }
        recentActivity: {
            type: [{
                topic:      { type: String, required: true },
                correct:    { type: Boolean, required: true },
                difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
                timestamp:  { type: Date, default: () => new Date() },
                _id:        false,
            }],
            default: [],
        },

        // ── Daily AI usage tracker ────────────────────────────────────────────
        // Resets automatically each calendar day. Used to enforce the
        // 5-question/day limit for Free-plan users.
        aiUsage: {
            count:     { type: Number, default: 0 },
            resetDate: { type: Date,   default: null },
        },

        // ── Password reset ────────────────────────────────────────────────────
        passwordResetToken:   { type: String, select: false },
        passwordResetExpires: { type: Date,   select: false },
    },
    { timestamps: true }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.correctPassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.signToken = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES }
    );
};

// Generates a raw token (sent in email) and stores its SHA-256 hash in the DB.
// The raw token is never stored — only the hash — so a DB leak can't be used to reset passwords.
userSchema.methods.createPasswordResetToken = function () {
    const rawToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken   = crypto.createHash('sha256').update(rawToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return rawToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;