/**
 * Daily Streak Utility
 * ====================
 * Handles the "login streak" logic — a streak grows by 1 per day, max once per day.
 *
 * RULES:
 *  - New account:       streak = 1, lastLoginDate = today
 *  - Login same day:    no change (streak already counted today)
 *  - Login next day:    streak += 1 (consecutive — keep the chain going)
 *  - Login after gap:   streak = 1 (chain is broken — restart from 1)
 *
 * WHY new Date() instead of Date.now()?
 *   We need to compare by calendar day, not by timestamp.
 *   setHours(0,0,0,0) normalises any Date to midnight so two logins
 *   on the same calendar day produce the same value regardless of time.
 *
 * @param   {Document} user   - Mongoose user document (modified in place)
 * @returns {boolean}         - true if the streak was updated, false if already counted today
 */
function applyDailyStreak(user) {
    // Normalise today to midnight (local server time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // First login ever (or lastLoginDate not set)
    if (!user.lastLoginDate) {
        user.streak        = 1;
        user.lastLoginDate = today;
        return true;
    }

    // Normalise the stored lastLoginDate to midnight for a clean day-level comparison
    const lastLogin = new Date(user.lastLoginDate);
    lastLogin.setHours(0, 0, 0, 0);

    // Already logged in today — nothing to do
    if (lastLogin.getTime() === today.getTime()) {
        return false;
    }

    // Build yesterday's midnight
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (lastLogin.getTime() === yesterday.getTime()) {
        // Consecutive day → extend the streak
        user.streak += 1;
    } else {
        // Gap of 2+ days → streak is broken, restart at 1
        user.streak = 1;
    }

    user.lastLoginDate = today;
    return true;
}

module.exports = applyDailyStreak;
