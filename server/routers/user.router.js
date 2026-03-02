const express = require("express");
const {
    getUsers,
    getUserByID,
    deleteUserByID,
    updateUserByID,
    getMyStats,
    addActivity,
    addExamScore,
    changePassword,
} = require("../controllers/user.controller");
const protect    = require("../middlewares/auth.middleware");
const allowedTo  = require("../middlewares/role.middleware");
const upload     = require("../config/multer");

const userRouter = express.Router();

/* ── Admin / general ── */
userRouter.get("/", protect, getUsers);

/* ── Stats routes ────────────────────────────────────────────────────────────
 * MUST come before /:id to avoid "stats" being treated as an ID parameter.
 *
 * GET  /api/users/stats/me           → dashboard + analytics real data
 * POST /api/users/stats/activity     → record a practice problem result
 * POST /api/users/stats/exam         → record a completed exam score
 */
userRouter.get( "/stats/me",        protect, getMyStats);
userRouter.post("/stats/activity",  protect, addActivity);
userRouter.post("/stats/exam",      protect, addExamScore);
userRouter.post("/change-password/:id", protect, changePassword);

/* ── User CRUD (by ID) ── */
userRouter
    .route("/:id")
    .get(    protect, protect, getUserByID)
    .delete( protect, protect, allowedTo("user"), deleteUserByID)
    .patch(  protect, protect, allowedTo("user"), upload.single("avatar"), updateUserByID)

module.exports = userRouter;
