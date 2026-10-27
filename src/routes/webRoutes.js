const express = require('express');
const authWebController = require('../controllers/authWebController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/login', authWebController.renderLogin);
router.post('/login', authWebController.login);
router.get('/logout', authWebController.logout);
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', { usuario: req.session.usuario });
});
router.get('/', (req, res) => {
  return res.redirect(req.session.usuario ? '/dashboard' : '/login');
});

module.exports = router;
