export function requireAdminAuth(req, res, next) {
    if (req.session && req.session.admin) {
        return next();
    }
    res.redirect(`${process.env.BASE_URL || ''}/adminlogin`);
}