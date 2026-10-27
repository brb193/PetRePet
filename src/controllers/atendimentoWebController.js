const prisma = require('../utils/prisma');
const { positiveId, text } = require('../utils/formData');

async function listar(req, res) {
  const atendimentos = await prisma.atendimento.findMany({
    include: {
      pet: { include: { cliente: true } },
      veterinario: true,
    },
    orderBy: { dataAtendimento: 'desc' },
  });
  res.render('atendimentos/index', {
    atendimentos,
    usuario: req.session.usuario,
    mensagem: req.query.mensagem,
  });
}

async function carregarOpcoes() {
  const [pets, veterinarios] = await Promise.all([
    prisma.pet.findMany({ include: { cliente: true }, orderBy: { nome: 'asc' } }),
    prisma.usuario.findMany({
      where: { perfil: { nome: 'VETERINARIO' } },
      orderBy: { nome: 'asc' },
    }),
  ]);
  return { pets, veterinarios };
}

async function novo(req, res) {
  res.render('atendimentos/form', {
    usuario: req.session.usuario,
    atendimento: null,
    erro: null,
    ...(await carregarOpcoes()),
  });
}

async function criar(req, res) {
  const petId = positiveId(req.body.petId);
  const veterinarioId = positiveId(req.body.veterinarioId);
  const dataTexto = text(req.body.dataAtendimento);
  const dataAtendimento = dataTexto ? new Date(dataTexto) : null;
  const atendimento = { petId, veterinarioId, dataAtendimento: dataTexto };
  const opcoes = await carregarOpcoes();
  const erroForm = (erro) => res.status(400).render('atendimentos/form', {
    usuario: req.session.usuario, atendimento, erro, ...opcoes,
  });

  if (!Number.isInteger(petId) || !Number.isInteger(veterinarioId)) {
    return erroForm('Selecione um pet e um veterinário válidos.');
  }
  if (dataAtendimento && Number.isNaN(dataAtendimento.getTime())) {
    return erroForm('Informe uma data e hora válidas para o atendimento.');
  }
  if (!opcoes.pets.some((pet) => pet.id === petId)) return erroForm('O pet selecionado não existe.');
  if (!opcoes.veterinarios.some((veterinario) => veterinario.id === veterinarioId)) {
    return erroForm('O usuário selecionado não possui perfil de veterinário.');
  }

  await prisma.atendimento.create({
    data: {
      petId,
      veterinarioId,
      ...(dataAtendimento ? { dataAtendimento } : {}),
    },
  });
  return res.redirect('/atendimentos?mensagem=Agendamento%20criado.');
}

async function detalhe(req, res) {
  const id = positiveId(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.sendStatus(400);

  const atendimento = await prisma.atendimento.findUnique({
    where: { id },
    include: {
      pet: { include: { cliente: true } },
      veterinario: true,
      prescricoes: { orderBy: { id: 'asc' } },
    },
  });
  if (!atendimento) return res.sendStatus(404);
  return res.render('atendimentos/detalhe', {
    atendimento,
    usuario: req.session.usuario,
    erro: null,
    mensagem: req.query.mensagem,
  });
}

async function atualizarAgendamento(req, res) {
  const id = positiveId(req.params.id);
  const petId = positiveId(req.body.petId);
  const veterinarioId = positiveId(req.body.veterinarioId);
  const dataTexto = text(req.body.dataAtendimento);
  const dataAtendimento = dataTexto ? new Date(dataTexto) : null;
  const atendimentoForm = { id, petId, veterinarioId, dataAtendimento: dataTexto };
  const opcoes = await carregarOpcoes();
  const erroForm = (erro) => res.status(400).render('atendimentos/form', {
    usuario: req.session.usuario, atendimento: atendimentoForm, erro, ...opcoes,
  });

  if (!Number.isInteger(id) || id < 1) return res.sendStatus(400);
  if (!Number.isInteger(petId) || !Number.isInteger(veterinarioId)) {
    return erroForm('Selecione um pet e um veterinário válidos.');
  }
  if (dataAtendimento && Number.isNaN(dataAtendimento.getTime())) return erroForm('Informe uma data e hora válidas.');
  if (!opcoes.pets.some((pet) => pet.id === petId)) return erroForm('O pet selecionado não existe.');
  if (!opcoes.veterinarios.some((veterinario) => veterinario.id === veterinarioId)) {
    return erroForm('O usuário selecionado não possui perfil de veterinário.');
  }

  try {
    await prisma.atendimento.update({
      where: { id },
      data: { petId, veterinarioId, ...(dataAtendimento ? { dataAtendimento } : {}) },
    });
    return res.redirect(`/atendimentos/${id}?mensagem=Agendamento%20atualizado.`);
  } catch (error) {
    if (error.code === 'P2025') return res.sendStatus(404);
    throw error;
  }
}

async function editarAgendamento(req, res) {
  const id = positiveId(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.sendStatus(400);
  const atendimento = await prisma.atendimento.findUnique({ where: { id } });
  if (!atendimento) return res.sendStatus(404);
  return res.render('atendimentos/form', {
    usuario: req.session.usuario,
    atendimento: {
      ...atendimento,
      dataAtendimento: atendimento.dataAtendimento.toISOString().slice(0, 16),
    },
    erro: null,
    ...(await carregarOpcoes()),
  });
}

async function atualizarClinico(req, res) {
  const id = positiveId(req.params.id);
  const diagnostico = text(req.body.diagnostico);
  const status = text(req.body.status);
  const valorTexto = text(req.body.valor);
  const valor = valorTexto === '' ? null : Number(valorTexto.replace(',', '.'));
  const estadosPermitidos = ['AGENDADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO'];

  if (!Number.isInteger(id) || id < 1) return res.sendStatus(400);
  if (!estadosPermitidos.includes(status)) {
    return res.status(400).send('Informe um status válido para o atendimento.');
  }
  if (valor !== null && (!Number.isFinite(valor) || valor < 0)) {
    return res.status(400).send('Informe um valor válido, maior ou igual a zero.');
  }

  try {
    await prisma.atendimento.update({
      where: { id },
      data: { diagnostico: diagnostico || null, status, valor },
    });
    return res.redirect(`/atendimentos/${id}?mensagem=Dados%20clínicos%20atualizados.`);
  } catch (error) {
    if (error.code === 'P2025') return res.sendStatus(404);
    throw error;
  }
}

async function excluir(req, res) {
  const id = positiveId(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.sendStatus(400);
  try {
    await prisma.atendimento.delete({ where: { id } });
    return res.redirect('/atendimentos?mensagem=Atendimento%20excluído.');
  } catch (error) {
    if (error.code === 'P2003') {
      return res.redirect('/atendimentos?mensagem=Remova%20as%20prescrições%20antes%20de%20excluir%20este%20atendimento.');
    }
    if (error.code === 'P2025') return res.sendStatus(404);
    throw error;
  }
}

module.exports = {
  listar,
  novo,
  criar,
  detalhe,
  editarAgendamento,
  atualizarAgendamento,
  atualizarClinico,
  excluir,
};
