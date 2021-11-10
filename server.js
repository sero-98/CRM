const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

const { config } = require('./config/index.js');
/*const mentorRouter = require('./routers/mentor.js');
const mentoriaRouter = require('./routers/mentoria.js');
const mentorizadoRouter = require('./routers/mentorizado.js');
const hoja_vidaRouter = require('./routers/hoja_vida.js');*/
const userRouter = require('./routers/User.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(config.mongodb_uri, {
  
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected!!!!')
});

//Http request Logger
app.use(morgan('tiny'));

//RUTAS
app.use('/api/user', userRouter);
/*app.use('/api/mentor', mentorRouter);
app.use('/api/mentoria', mentoriaRouter);
app.use('/api/mentorizado', mentorizadoRouter);
app.use('/api/hoja', hoja_vidaRouter);*/

app.get('/server', (req, res) => {
  res.json('Server is ready');
  console.log(`${config.dev}`);
});

//Puerto
app.listen(config.port, () => {
  console.log(`http://localhost:${config.port}`);
});
