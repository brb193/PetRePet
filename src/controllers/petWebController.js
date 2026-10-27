const prisma = require('../utils/prisma');
const { positiveId, text } = require('../utils/formData');

async function dadosFormulario(registro) {
  const clientes = await prisma.cliente.findMany({ orderBy: { nome: 'asc' } });
  return { clientes, registro, erro: null };
}

async function listar(req, res) {
  const pets = await prisma.pet.findMany({
    include: { cliente: true },
    orderBy: { nome: 'asc' },
  });
  res.render('pets/index', { pets, usuario: req.session.usuario, mensagem: req.query.mensagem });
}

async function novo(req, res) {
  res.render('pets/form', { usuario: req.session.usuario, ...(await dadosFormulario(null)) });
}

async function criar(req, res) {
  const nome = text(req.body.nome);
  const especie = text(req.body.especie);
  const raca = text(req.body.raca);
  const dataNascimento = text(req.body.dataNascimento);
  const clienteId = positiveId(req.body.clienteId);
  const data = dataNascimento ? new Date(dataNascimento) : null;
  const registro = { nome, especie, raca, dataNascimento, clienteId };
  const clientes = await prisma.cliente.findMany({ orderBy: { nome: 'asc' } });

  if (!nome || !especie || !raca || !Number.isInteger(clienteId) || (data && Number.isNaN(data.getTime()))) {
    return res.status(400).render('pets/form', {
      usuario: req.session.usuario, clientes, registro, erro: 'Preencha os dados do pet, a data deve ser válida e selecione o cliente responsável.',
    });
  }

  try {
    await prisma.pet.create({
      data: { nome, especie, raca, dataNascimento: data, clienteId },
    });
    return res.redirect('/pets?mensagem=Pet%20criado.');
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).render('pets/form', {
        usuario: req.session.usuario, clientes, registro, erro: 'O cliente selecionado não existe.',
      });
    }
    throw error;
  }
}

async function editar(req, res) {
  const id = positiveId(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.sendStatus(400);
  const registro = await prisma.pet.findUnique({ where: { id } });
  if (!registro) return res.sendStatus(404);
  res.render('pets/form', { usuario: req.session.usuario, ...(await dadosFormulario(registro)) });
}

async function atualizar(req, res) {
  const id = positiveId(req.params.id);
  const nome = text(req.body.nome);
  const especie = text(req.body.especie);
  const raca = text(req.body.raca);
  const dataNascimento = text(req.body.dataNascimento);
  const clienteId = positiveId(req.body.clienteId);
  const data = dataNascimento ? new Date(dataNascimento) : null;
  const registro = { id, nome, especie, raca, dataNascimento, clienteId };
  const clientes = await prisma.cliente.findMany({ orderBy: { nome: 'asc' } });
  const erroForm = (erro, status = 400) => res.status(status).render('pets/form', {
    usuario: req.session.usuario, clientes, registro, erro,
  });

  if (!Number.isInteger(id) || id < 1) return res.sendStatus(400);
  if (!nome || !especie || !raca || !Number.isInteger(clienteId) || (data && Number.isNaN(data.getTime()))) {
    return erroForm('Preencha os dados do pet, a data deve ser válida e selecione o cliente responsável.');
  }

  try {
    await prisma.pet.update({
      where: { id },
      data: { nome, especie, raca, dataNascimento: data, clienteId },
    });
    return res.redirect('/pets?mensagem=Pet%20atualizado.');
  } catch (error) {
    if (error.code === 'P2003') return erroForm('O cliente selecionado não existe.');
    if (error.code === 'P2025') return res.sendStatus(404);
    throw error;
  }
}

async function excluir(req, res) {
  const id = positiveId(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.sendStatus(400);
  try {
    await prisma.pet.delete({ where: { id } });
    return res.redirect('/pets?mensagem=Pet%20excluído.');
  } catch (error) {
    if (error.code === 'P2003') {
      return res.redirect('/pets?mensagem=Este%20pet%20possui%20atendimentos%20e%20não%20pode%20ser%20excluído.');
    }
    if (error.code === 'P2025') return res.sendStatus(404);
    throw error;
  }
}

module.exports = { listar, novo, criar, editar, atualizar, excluir };
