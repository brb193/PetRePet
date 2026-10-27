const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function renderLogin(req, res) {
  if (req.session.usuario) {
    return res.redirect('/dashboard');
  }

  return res.render('login', { erro: null, email: '' });
}

async function login(req, res, next) {
  const { email, senha } = req.body;

  if (typeof email !== 'string' || typeof senha !== 'string' || !email || !senha) {
    return res.status(400).render('login', {
      erro: 'Informe o e-mail e a senha.',
      email: typeof email === 'string' ? email : '',
    });
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email },
    include: { perfil: true },
  });

  if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
    return res.status(401).render('login', {
      erro: 'E-mail ou senha inválidos.',
      email,
    });
  }

  const usuarioAutenticado = {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil,
  };

  req.session.regenerate((error) => {
    if (error) {
      return next(error);
    }

    req.session.usuario = usuarioAutenticado;
    return req.session.save((saveError) => {
      if (saveError) {
        return next(saveError);
      }

      return res.redirect('/dashboard');
    });
  });
}

function logout(req, res, next) {
  if (!req.session) {
    return res.redirect('/login');
  }

  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie('connect.sid');
    return res.redirect('/login');
  });
}

module.exports = { renderLogin, login, logout };
