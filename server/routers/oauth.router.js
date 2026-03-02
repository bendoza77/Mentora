const express = require('express');
const { googleCallback, getGoogleAuthUrl } = require('../controllers/oauth.controller');
const protect = require('../middlewares/auth.middleware');

const oauthRouter = express.Router();


oauthRouter.get('/google', getGoogleAuthUrl);
oauthRouter.get('/google/callback', googleCallback);

module.exports = oauthRouter;