const express = require('express');
const controller = require('../controllers/prescricaoWebController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

const router = express.Router();
const allowed = [ensureAuthenticated, checkRole(['ADMIN', 'VETERINARIO'])];

router.get('/prescricoes', ...allowed, controller.listar);
router.post('/atendimentos/:atendimentoId/prescricoes', ...allowed, controller.criar);
router.post('/atendimentos/:atendimentoId/prescricoes/:id/excluir', ...allowed, controller.excluir);

module.exports = router;
