const prisma = require('../utils/prisma');
const { positiveId, text } = require('../utils/formData');

async function listar(req, res) {
  const prescricoes = await prisma.prescricao.findMany({
    include: {
      atendimento: {
        include: {
          pet: true,
        },
      },
    },
    orderBy: { id: 'desc' },
  });
  res.render('prescricoes/index', {
    prescricoes,
    usuario: req.session.usuario,
    mensagem: req.query.mensagem,
  });
}

async function criar(req, res) {
  const atendimentoId = positiveId(req.params.atendimentoId);
  const medicamento = text(req.body.medicamento);
  const dosagem = text(req.body.dosagem);
  const instrucoes = text(req.body.instrucoes);

  if (!Number.isInteger(atendimentoId) || atendimentoId < 1) return res.sendStatus(400);
  if (!medicamento || !dosagem) {
    return res.redirect(`/atendimentos/${atendimentoId}?mensagem=Medicamento%20e%20dosagem%20são%20obrigatórios.`);
  }

  try {
    await prisma.prescricao.create({
      data: { atendimentoId, medicamento, dosagem, instrucoes: instrucoes || null },
    });
    return res.redirect(`/atendimentos/${atendimentoId}?mensagem=Prescrição%20adicionada.`);
  } catch (error) {
    if (error.code === 'P2003') return res.sendStatus(404);
    throw error;
  }
}

async function excluir(req, res) {
  const atendimentoId = positiveId(req.params.atendimentoId);
  const id = positiveId(req.params.id);
  if (!Number.isInteger(atendimentoId) || atendimentoId < 1 || !Number.isInteger(id) || id < 1) {
    return res.sendStatus(400);
  }

  const resultado = await prisma.prescricao.deleteMany({ where: { id, atendimentoId } });
  if (resultado.count === 0) return res.sendStatus(404);
  return res.redirect(`/atendimentos/${atendimentoId}?mensagem=Prescrição%20removida.`);
}

module.exports = { listar, criar, excluir };
