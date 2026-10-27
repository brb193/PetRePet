const prisma = require('../utils/prisma');
const { positiveId, text } = require('../utils/formData');

async function listar(req, res) {
  const clientes = await prisma.cliente.findMany({ orderBy: { nome: 'asc' } });
  res.render('clientes/index', { clientes, usuario: req.session.usuario, mensagem: req.query.mensagem });
}

function novo(req, res) {
  res.render('clientes/form', { usuario: req.session.usuario, registro: null, erro: null });
}

async function criar(req, res) {
  const nome = text(req.body.nome);
  const cpf = text(req.body.cpf);
  const telefone = text(req.body.telefone);
  const endereco = text(req.body.endereco);
  const registro = { nome, cpf, telefone, endereco };
  if (!nome || !cpf || !telefone) {
    return res.status(400).render('clientes/form', {
      usuario: req.session.usuario, registro, erro: 'Preencha nome, CPF e telefone.',
    });
  }

  try {
    await prisma.cliente.create({
      data: { nome, cpf, telefone, endereco: endereco || null },
    });
    return res.redirect('/clientes?mensagem=Cliente%20criado.');
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).render('clientes/form', {
        usuario: req.session.usuario, registro, erro: 'Já existe um cliente com esse CPF.',
      });
    }
    throw error;
  }
}

async function editar(req, res) {
  const id = positiveId(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.sendStatus(400);
  const registro = await prisma.cliente.findUnique({ where: { id } });
  if (!registro) return res.sendStatus(404);
  res.render('clientes/form', { usuario: req.session.usuario, registro, erro: null });
}

async function atualizar(req, res) {
  const id = positiveId(req.params.id);
  const nome = text(req.body.nome);
  const cpf = text(req.body.cpf);
  const telefone = text(req.body.telefone);
  const endereco = text(req.body.endereco);
  const registro = { id, nome, cpf, telefone, endereco };
  const erroForm = (erro, status = 400) => res.status(status).render('clientes/form', {
    usuario: req.session.usuario, registro, erro,
  });
  if (!Number.isInteger(id) || id < 1) return res.sendStatus(400);
  if (!nome || !cpf || !telefone) return erroForm('Preencha nome, CPF e telefone.');

  try {
    await prisma.cliente.update({
      where: { id },
      data: { nome, cpf, telefone, endereco: endereco || null },
    });
    return res.redirect('/clientes?mensagem=Cliente%20atualizado.');
  } catch (error) {
    if (error.code === 'P2002') return erroForm('Já existe um cliente com esse CPF.', 409);
    if (error.code === 'P2025') return res.sendStatus(404);
    throw error;
  }
}

async function excluir(req, res) {
  const id = positiveId(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.sendStatus(400);
  try {
    await prisma.cliente.delete({ where: { id } });
    return res.redirect('/clientes?mensagem=Cliente%20excluído.');
  } catch (error) {
    if (error.code === 'P2003') {
      return res.redirect('/clientes?mensagem=Este%20cliente%20possui%20pets%20e%20não%20pode%20ser%20excluído.');
    }
    if (error.code === 'P2025') return res.sendStatus(404);
    throw error;
  }
}

module.exports = { listar, novo, criar, editar, atualizar, excluir };
