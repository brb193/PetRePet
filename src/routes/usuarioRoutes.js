const express = require('express');
const controller = require('../controllers/usuarioWebController');
const perfilController = require('../controllers/perfilWebController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

const router = express.Router();
const adminOnly = [ensureAuthenticated, checkRole(['ADMIN'])];

router.get('/perfis', ...adminOnly, perfilController.listar);
router.get('/perfis/novo', ...adminOnly, perfilController.novo);
router.post('/perfis', ...adminOnly, perfilController.criar);
router.get('/perfis/:id/editar', ...adminOnly, perfilController.editar);
router.post('/perfis/:id/editar', ...adminOnly, perfilController.atualizar);
router.post('/perfis/:id/excluir', ...adminOnly, perfilController.excluir);

router.get('/usuarios', ...adminOnly, controller.listar);
router.get('/usuarios/novo', ...adminOnly, controller.novo);
router.post('/usuarios', ...adminOnly, controller.criar);
router.get('/usuarios/:id/editar', ...adminOnly, controller.editar);
router.post('/usuarios/:id/editar', ...adminOnly, controller.atualizar);
router.post('/usuarios/:id/excluir', ...adminOnly, controller.excluir);

module.exports = router;
