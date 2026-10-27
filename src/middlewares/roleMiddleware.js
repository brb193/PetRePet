function checkRole(allowedRoles) {
  if (!Array.isArray(allowedRoles)) {
    throw new TypeError('allowedRoles deve ser um array de nomes de perfis.');
  }

  return function authorizeRole(req, res, next) {
    const usuario = req.session?.usuario || req.usuario;
    const perfil = usuario?.perfil?.nome || usuario?.perfil;

    if (allowedRoles.includes(perfil)) {
      return next();
    }

    if (req.originalUrl.startsWith('/api/')) {
      return res.status(403).json({ error: 'Acesso proibido para este perfil' });
    }

    const mensagem = encodeURIComponent('Acesso negado para este perfil.');
    return res.redirect(`/?mensagem=${mensagem}`);
  };
}

module.exports = { checkRole };
