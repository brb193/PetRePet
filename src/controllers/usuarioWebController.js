const bcrypt = require('bcryptjs');
const prisma = require('../utils/prisma');
const { positiveId, text } = require('../utils/formData');

async function listar(req, res) {
  const usuarios = await prisma.usuario.findMany({
    include: { perfil: true },
    orderBy: { nome: 'asc' },
  });
  res.render('usuarios/index', { usuarios, usuario: req.session.usuario, mensagem: req.query.mensagem });
}

async function novo(req, res) {
  const perfis = await prisma.perfil.findMany({ orderBy: { nome: 'asc' } });
  res.render('usuarios/form', { usuario: req.session.usuario, perfis, registro: null, erro: null });
}

async function criar(req, res) {
  const nome = text(req.body.nome);
  const email = text(req.body.email);
  const senha = typeof req.body.senha === 'string' ? req.body.senha : '';
  const perfilId = positiveId(req.body.perfilId);
  const perfis = await prisma.perfil.findMany({ orderBy: { nome: 'asc' } });
  const dados = { id: null, nome, email, perfilId };

  if (!nome || !email || !senha || !Number.isInteger(perfilId)) {
    return res.status(400).render('usuarios/form', {
      usuario: req.session.usuario,
      perfis,
      registro: dados,
      erro: 'Preencha todos os campos e selecione um perfil válido.',
    });
  }

  try {
    await prisma.usuario.create({
      data: { nome, email, senha: await bcrypt.hash(senha, 10), perfilId },
    });
    return res.redirect('/usuarios?mensagem=Usuário%20criado.');
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).render('usuarios/form', {
        usuario: req.session.usuario,
        perfis,
        registro: dados,
        erro: 'Este e-mail já está cadastrado.',
      });
    }
    if (error.code === 'P2003') {
      return res.status(400).render('usuarios/form', {
        usuario: req.session.usuario,
        perfis,
        registro: dados,
        erro: 'O perfil selecionado não existe.',
      });
    }
    throw error;
  }
}

async function editar(req, res) {
  const id = positiveId(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.sendStatus(400);

  const [registro, perfis] = await Promise.all([
    prisma.usuario.findUnique({ where: { id } }),
    prisma.perfil.findMany({ orderBy: { nome: 'asc' } }),
  ]);
  if (!registro) return res.sendStatus(404);
  res.render('usuarios/form', { usuario: req.session.usuario, perfis, registro, erro: null });
}

async function atualizar(req, res) {
  const id = positiveId(req.params.id);
  const nome = text(req.body.nome);
  const email = text(req.body.email);
  const senha = typeof req.body.senha === 'string' ? req.body.senha : '';
  const perfilIdNumero = positiveId(req.body.perfilId);
  const perfis = await prisma.perfil.findMany({ orderBy: { nome: 'asc' } });
  const registro = { id, nome, email, perfilId: perfilIdNumero };
  const erroForm = (mensagem, status = 400) => res.status(status).render('usuarios/form', {
    usuario: req.session.usuario,
    perfis,
    registro,
    erro: mensagem,
  });

  if (!Number.isInteger(id) || id < 1) return res.sendStatus(400);
  if (!nome || !email || !Number.isInteger(perfilIdNumero)) {
    return erroForm('Preencha nome, e-mail e selecione um perfil válido.');
  }
  if (req.session.usuario.id === id && req.session.usuario.perfil.id !== perfilIdNumero) {
    return erroForm('Não é possível alterar o próprio perfil de acesso.');
  }

  const data = { nome, email, perfilId: perfilIdNumero };
  if (senha.length > 0) data.senha = await bcrypt.hash(senha, 10);

  try {
    await prisma.usuario.update({ where: { id }, data });
    return res.redirect('/usuarios?mensagem=Usuário%20atualizado.');
  } catch (error) {
    if (error.code === 'P2002') return erroForm('Este e-mail já está cadastrado.', 409);
    if (error.code === 'P2003') return erroForm('O perfil selecionado não existe.');
    if (error.code === 'P2025') return res.sendStatus(404);
    throw error;
  }
}

async function excluir(req, res) {
  const id = positiveId(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.sendStatus(400);
  if (req.session.usuario.id === id) {
    return res.redirect('/usuarios?mensagem=Não%20é%20possível%20excluir%20a%20própria%20conta.');
  }

  try {
    await prisma.usuario.delete({ where: { id } });
    return res.redirect('/usuarios?mensagem=Usuário%20excluído.');
  } catch (error) {
    if (error.code === 'P2003') {
      return res.redirect('/usuarios?mensagem=Este%20usuário%20possui%20atendimentos%20e%20não%20pode%20ser%20excluído.');
    }
    if (error.code === 'P2025') return res.sendStatus(404);
    throw error;
  }
}

module.exports = { listar, novo, criar, editar, atualizar, excluir };
