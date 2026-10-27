require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('node:path');
const webRoutes = require('./routes/webRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const petRoutes = require('./routes/petRoutes');
const atendimentoRoutes = require('./routes/atendimentoRoutes');
const prescricaoRoutes = require('./routes/prescricaoRoutes');

const app = express();
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('SESSION_SECRET não está configurada.');
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  }),
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', webRoutes);
app.use('/', usuarioRoutes);
app.use('/', clienteRoutes);
app.use('/', petRoutes);
app.use('/', atendimentoRoutes);
app.use('/', prescricaoRoutes);
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  console.error('Erro ao processar requisição:', error);
  return res.status(500).send('Ocorreu um erro interno. Tente novamente mais tarde.');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`PetRePet disponível na porta ${port}`);
});
