const prisma = require('../utils/prisma');
const perfisSistema = ['ADMIN', 'VETERINARIO', 'RECEPCIONISTA'];

async function listar(req, res) {
  const perfis = await prisma.perfil.findMany({
    include: { _count: { select: { usuarios: true } } },
    orderBy: { nome: 'asc' },
  });
  res.render('perfis/index', { perfis, usuario: req.session.usuario, mensagem: req.query.mensagem });
}

function novo(req, res) {
  res.render('perfis/form', { usuario: req.session.usuario, registro: null, erro: null });
}

async function criar(req, res) {
  const nome = typeof req.body.nome === 'string' ? req.body.nome.trim().toUpperCase() : '';
  if (!nome) {
    return res.status(400).render('perfis/form', {
      usuario: req.session.usuario,
      registro: { nome },
      erro: 'Informe o nome do perfil.',
    });
  }

  try {
    await prisma.perfil.create({ data: { nome } });
    return res.redirect('/perfis?mensagem=Perfil%20criado.');
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).render('perfis/form', {
        usuario: req.session.usuario,
        registro: { nome },
        erro: 'Já existe um perfil com esse nome.',
      });
    }
    throw error;
  }
}

async function editar(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.sendStatus(400);
  const registro = await prisma.perfil.findUnique({ where: { id } });
  if (!registro) return res.sendStatus(404);
  res.render('perfis/form', { usuario: req.session.usuario, registro, erro: null });
}

async function atualizar(req, res) {
  const id = Number(req.params.id);
  const nome = typeof req.body.nome === 'string' ? req.body.nome.trim().toUpperCase() : '';
  const erroForm = (erro, status = 400) => res.status(status).render('perfis/form', {
    usuario: req.session.usuario,
    registro: { id, nome },
    erro,
  });
  if (!Number.isInteger(id) || id < 1) return res.sendStatus(400);
  if (!nome) return erroForm('Informe o nome do perfil.');

  try {
    const atual = await prisma.perfil.findUnique({ where: { id } });
    if (!atual) return res.sendStatus(404);
    if (perfisSistema.includes(atual.nome) && atual.nome !== nome) {
      return erroForm('Os perfis padrão do sistema não podem ser renomeados.');
    }
    await prisma.perfil.update({ where: { id }, data: { nome } });
    return res.redirect('/perfis?mensagem=Perfil%20atualizado.');
  } catch (error) {
    if (error.code === 'P2002') return erroForm('Já existe um perfil com esse nome.', 409);
    if (error.code === 'P2025') return res.sendStatus(404);
    throw error;
  }
}

async function excluir(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.sendStatus(400);
  const perfil = await prisma.perfil.findUnique({ where: { id } });
  if (!perfil) return res.sendStatus(404);
  if (perfisSistema.includes(perfil.nome)) {
    return res.redirect('/perfis?mensagem=Os%20perfis%20padrão%20do%20sistema%20não%20podem%20ser%20excluídos.');
  }
  const quantidadeUsuarios = await prisma.usuario.count({ where: { perfilId: id } });
  if (quantidadeUsuarios > 0) {
    return res.redirect('/perfis?mensagem=Não%20é%20possível%20excluir%20um%20perfil%20que%20possui%20usuários.');
  }

  try {
    await prisma.perfil.delete({ where: { id } });
    return res.redirect('/perfis?mensagem=Perfil%20excluído.');
  } catch (error) {
    if (error.code === 'P2025') return res.sendStatus(404);
    if (error.code === 'P2003') {
      return res.redirect('/perfis?mensagem=Este%20perfil%20está%20em%20uso%20e%20não%20pode%20ser%20excluído.');
    }
    throw error;
  }
}

module.exports = { listar, novo, criar, editar, atualizar, excluir };
