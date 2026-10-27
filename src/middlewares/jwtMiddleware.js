const jwt = require('jsonwebtoken');

function verifyJWT(req, res, next) {
  const authorization = req.get('Authorization');
  const match = authorization && authorization.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new Error('JWT_SECRET não está configurada.'));
  }

  jwt.verify(match[1], secret, (error, decoded) => {
    if (error || !decoded || typeof decoded !== 'object') {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const usuario = decoded.usuario ?? decoded;
    if (typeof usuario !== 'object' || Array.isArray(usuario)) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    req.usuario = usuario;
    return next();
  });
}

module.exports = { verifyJWT };
