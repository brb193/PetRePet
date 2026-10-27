const express = require('express');
const controller = require('../controllers/atendimentoWebController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

const router = express.Router();
const allRoles = [ensureAuthenticated, checkRole(['ADMIN', 'RECEPCIONISTA', 'VETERINARIO'])];
const schedulers = [ensureAuthenticated, checkRole(['ADMIN', 'RECEPCIONISTA'])];
const clinicians = [ensureAuthenticated, checkRole(['ADMIN', 'VETERINARIO'])];
const admins = [ensureAuthenticated, checkRole(['ADMIN'])];

router.get('/atendimentos', ...allRoles, controller.listar);
router.get('/atendimentos/novo', ...schedulers, controller.novo);
router.post('/atendimentos', ...schedulers, controller.criar);
router.get('/atendimentos/:id', ...allRoles, controller.detalhe);
router.get('/atendimentos/:id/agendamento/editar', ...schedulers, controller.editarAgendamento);
router.post('/atendimentos/:id/agendamento', ...schedulers, controller.atualizarAgendamento);
router.post('/atendimentos/:id/clinico', ...clinicians, controller.atualizarClinico);
router.post('/atendimentos/:id/excluir', ...admins, controller.excluir);

module.exports = router;
