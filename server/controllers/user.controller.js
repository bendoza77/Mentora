const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { deleteImage, imageUpload } = require("../utils/uploadImage");
const bcrypt = require("bcrypt");


const getUsers = catchAsync(async (req, res, next) => {

    const users = await User.find();

    return res.json({
        status: "success",
        data: { users }
    })


})

const getUserByID = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("Invalid user ID", 400));
    }

    const user = await User.findById(id);

    if(!user) return next(new AppError("User not found", 404));

    return res.json({
        status: "success",
        data: { user }
    })
})

const deleteUserByID = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("Invalid user ID", 400));
    }

    const user = await User.findById(id);

    if (!user) return next(new AppError("User not found", 404));

    if (req.user._id.toString() !== user._id.toString()) {
        return next(new AppError("You dont have permission to do this action"))
    }

    if (user.avatar) {
        await deleteImage(user.avatar.publicId);
    }
    
    await User.findByIdAndDelete(id);

    return res.json({
        status: "success",
        message: "User deleted successfully"
    })


})

const changePassword = catchAsync(async (req, res, next) => {

    const { currentPassword, newPassword, confrimPassword } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("ID is invalid", 400));
    }

    if (!newPassword || !confrimPassword) {
        return next(new AppError("All fields are required", 400));
    }

    if (newPassword !== confrimPassword) {
        return next(new AppError("Passwords don't match", 400));
    }

    const user = await User.findById(id).select('+password');

    if (!user) return next(new AppError("User not found", 404));

    // OAuth users have no password — skip current password verification
    if (!user.provider) {
        if (!currentPassword) {
            return next(new AppError("Current password is required", 400));
        }
        const compare = await user.correctPassword(currentPassword);
        if (!compare) return next(new AppError("Current password is incorrect", 400));
    }

    user.password = newPassword;

    // OAuth user is now setting a password — detach from OAuth-only login
    if (user.provider) {
        user.provider = null;
        user.providerId = null;
    }

    await user.save({ validateModifiedOnly: true });

    return res.json({
        status: "success",
        message: "Password changed successfully",
        data: { user }
    });

})

const updateUserByID = catchAsync(async (req, res, next) => {

    const { id } = req.params;
    const data = req.body;
    const { file } = req;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("Invalid user ID", 400));
    }

    const user = await User.findById(id);

    if (!user) return next(new AppError("User not found", 404));

    if (req.user._id.toString() !== user._id.toString()) {
        return next(new AppError("You dont have permission to do this action"))
    }

    if (file) {
        if (user.avatar?.publicId) await deleteImage(user.avatar.publicId);
        const results = await imageUpload("avatar", [file.path]);
        const uploaded = results[0];
        user.avatar = { url: uploaded.secure_url, publicId: uploaded.public_id };
    }

    const IMMUTABLE_FIELDS = ["password", "email", "role", "isVerified", "_id"];
    Object.keys(data).forEach((key) => {
        if (data[key] !== "" && !IMMUTABLE_FIELDS.includes(key)) user[key] = data[key];
    });

    await user.save({ validateModifiedOnly: true });

    return res.json({
        status: "success",
        data: { user }
    })


})

/* ═══════════════════════════════════════════════════════════════════════════
 * STATS ENDPOINTS
 * These power the real data shown on Dashboard and Analytics pages.
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ── Helper: build last-N-days activity data from recentActivity array ──── */
const buildDailyActivity = (recentActivity, days) => {
    const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];

    for (let i = days - 1; i >= 0; i--) {
        // Start of this calendar day
        const dayStart = new Date();
        dayStart.setHours(0, 0, 0, 0);
        dayStart.setDate(dayStart.getDate() - i);

        // Start of next calendar day
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayStart.getDate() + 1);

        const dayItems = recentActivity.filter(a => {
            const t = new Date(a.timestamp);
            return t >= dayStart && t < dayEnd;
        });

        const total   = dayItems.length;
        const correct = dayItems.filter(a => a.correct).length;
        const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

        result.push({
            label:    DAY_NAMES[dayStart.getDay()],
            problems: total,
            accuracy,
            score:    accuracy, // until exam scores are per-day, accuracy doubles as score
        });
    }
    return result;
}

/* ── Helper: group 30 days into 4 weeks ──────────────────────────────────── */
function buildWeeklyActivity(recentActivity) {
    const result = [];
    const now = new Date();

    for (let w = 3; w >= 0; w--) {
        const weekEnd = new Date(now);
        weekEnd.setDate(weekEnd.getDate() - w * 7);
        weekEnd.setHours(23, 59, 59, 999);

        const weekStart = new Date(weekEnd);
        weekStart.setDate(weekStart.getDate() - 6);
        weekStart.setHours(0, 0, 0, 0);

        const items   = recentActivity.filter(a => {
            const t = new Date(a.timestamp);
            return t >= weekStart && t <= weekEnd;
        });
        const total   = items.length;
        const correct = items.filter(a => a.correct).length;
        const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

        result.push({ label: `W${4 - w}`, problems: total, accuracy, score: accuracy });
    }
    return result;
}

/* ── Helper: build topic breakdown from recentActivity ───────────────────── */
function buildTopicBreakdown(recentActivity) {
    const map = {};

    recentActivity.forEach(({ topic, correct }) => {
        if (!map[topic]) map[topic] = { correct: 0, total: 0 };
        map[topic].total  += 1;
        if (correct) map[topic].correct += 1;
    });

    return Object.entries(map)
        .map(([name, { correct, total }]) => {
            const accuracy = Math.round((correct / total) * 100);
            const status =
                accuracy >= 75 ? 'strong' :
                accuracy >= 60 ? 'ok'     :
                accuracy >= 40 ? 'weak'   : 'critical';
            return { name, accuracy, problems: total, status };
        })
        .sort((a, b) => b.accuracy - a.accuracy);
}

/* ── GET /api/users/stats/me ─────────────────────────────────────────────── */
const getMyStats = catchAsync(async (req, res) => {
    const user = req.user; // set by protect middleware

    const totalAttempts  = user.stats?.totalAttempts  || 0;
    const correctAnswers = user.stats?.correctAnswers || 0;
    const problemsSolved = user.stats?.problemsSolved || 0;

    // Accuracy: 0-100. Shown as percentage.
    const accuracy = totalAttempts > 0
        ? Math.round((correctAnswers / totalAttempts) * 100)
        : 0;

    // Latest exam score (most recent entry in array)
    const examScores = user.stats?.examScores || [];
    const latestExam = examScores.length > 0 ? examScores[examScores.length - 1] : null;

    const activity = user.recentActivity || [];

    // Weekly chart data (last 7 days)
    const weeklyActivity  = buildDailyActivity(activity, 7);
    // Monthly chart data (4 weeks)
    const monthlyActivity = buildWeeklyActivity(activity);
    // Topic breakdown
    const topicBreakdown  = buildTopicBreakdown(activity);
    // Last 10 activities for dashboard recent-activity list
    const latestActivity  = [...activity].reverse().slice(0, 10);

    // Weak topic count (accuracy < 60%)
    const weakTopicCount = topicBreakdown.filter(t => t.accuracy < 60).length;

    return res.json({
        status: 'success',
        data: {
            streak:        user.streak        || 0,
            lastLoginDate: user.lastLoginDate || null,
            problemsSolved,
            accuracy,
            latestExamScore:    latestExam ? latestExam.score    : null,
            latestExamMaxScore: latestExam ? latestExam.maxScore : 100,
            latestExamSubject:  latestExam ? latestExam.subject  : null,
            weeklyActivity,
            monthlyActivity,
            topicBreakdown,
            latestActivity,
            weakTopicCount,
            totalExams: examScores.length,
        },
    });
});

/* ── POST /api/users/stats/activity ─────────────────────────────────────────
 * Called by the practice / AI tutor module when a user answers a problem.
 * Body: { topic, correct, difficulty }
 */
const addActivity = catchAsync(async (req, res, next) => {
    const { topic, correct, difficulty = 'medium' } = req.body;

    if (!topic || typeof correct !== 'boolean') {
        return next(new AppError('topic (string) and correct (boolean) are required', 400));
    }
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
        return next(new AppError('difficulty must be easy | medium | hard', 400));
    }

    const userId = req.user._id;

    // Push activity entry and update counters atomically
    const update = {
        $inc: {
            'stats.problemsSolved': 1,
            'stats.totalAttempts':  1,
            ...(correct ? { 'stats.correctAnswers': 1 } : {}),
        },
        $push: {
            recentActivity: {
                $each: [{ topic, correct, difficulty, timestamp: new Date() }],
                $slice: -50, // keep only the most recent 200 entries
            },
        },
    };

    const user = await User.findByIdAndUpdate(userId, update, { new: true });

    return res.json({ status: 'success', data: { stats: user.stats } });
});

/* ── POST /api/users/stats/exam ──────────────────────────────────────────────
 * Called by the exam module when a user completes an exam.
 * Body: { score, maxScore, subject }
 */
const addExamScore = catchAsync(async (req, res, next) => {
    const { score, maxScore = 100, subject = 'Math' } = req.body;

    console.log(score);

    if (typeof score !== 'number' || score < 0) {
        return next(new AppError('score (number >= 0) is required', 400));
    }

    const userId = req.user._id;

    const update = {
        $push: {
            'stats.examScores': {
                $each: [{ score, maxScore, subject, date: new Date() }],
                $slice: -10, // keep last 50 exam scores
            },
        },
    };

    const user = await User.findByIdAndUpdate(userId, update, { new: true });

    return res.json({ status: 'success', data: { examScores: user.stats.examScores } });
});

module.exports = {
    getUsers,
    getUserByID,
    deleteUserByID,
    updateUserByID,
    getMyStats,
    addActivity,
    addExamScore,
    changePassword,
}