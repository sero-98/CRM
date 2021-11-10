const bcrypt = require('bcrypt');

const data = {
  users: [
    {
      name: 'Joel',
      email: 'sergio.aroni@unmsm.edu.pe',
      password: bcrypt.hashSync('admin', 8),
      direccion: 'R. Fellner, Pazmaniteng 24-9',
      telefono: '165498536',
      isAdmin: false,
    },
    {
      name: 'Angel',
      email: 'aroni.carbajals@gmail.com',
      password: bcrypt.hashSync('admin', 8),
      direccion: 'F. Rocket, Furrerter 25-7',
      telefono: '753514854',
      isAdmin: false,
    }
  ],
}

module.exports = data;