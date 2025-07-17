function ensureAuthenticated(req, res, next) {
    if (req.headers['x-api-key'] === process.env.BOT_API_KEY)  {
        return next();
    }
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
}

module.exports = ensureAuthenticated;