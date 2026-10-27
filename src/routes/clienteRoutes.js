const express = require('express');
const controller = require('../controllers/clienteWebController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

const router = express.Router();
const allowed = [ensureAuthenticated, checkRole(['ADMIN', 'RECEPCIONISTA'])];

router.get('/clientes', ...allowed, controller.listar);
router.get('/clientes/novo', ...allowed, controller.novo);
router.post('/clientes', ...allowed, controller.criar);
router.get('/clientes/:id/editar', ...allowed, controller.editar);
router.post('/clientes/:id/editar', ...allowed, controller.atualizar);
router.post('/clientes/:id/excluir', ...allowed, controller.excluir);

module.exports = router;
