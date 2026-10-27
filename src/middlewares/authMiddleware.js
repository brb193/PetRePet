function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.usuario) {
    return next();
  }

  if (req.originalUrl.startsWith('/api/')) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  return res.redirect('/login');
}

module.exports = { ensureAuthenticated };
