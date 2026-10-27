const express = require('express');
const controller = require('../controllers/petWebController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

const router = express.Router();
const allowed = [ensureAuthenticated, checkRole(['ADMIN', 'RECEPCIONISTA', 'VETERINARIO'])];

router.get('/pets', ...allowed, controller.listar);
router.get('/pets/novo', ...allowed, controller.novo);
router.post('/pets', ...allowed, controller.criar);
router.get('/pets/:id/editar', ...allowed, controller.editar);
router.post('/pets/:id/editar', ...allowed, controller.atualizar);
router.post('/pets/:id/excluir', ...allowed, controller.excluir);

module.exports = router;
