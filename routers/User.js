const express = require('express');
const bcrypt = require('bcrypt');

const nodemailer =require('nodemailer');
const data = require('../utils/mocks/data.js');
const User = require('../models/User.js');
const { generateToken } = require('../utils/auth/generateToken.js');

const userRouter = express.Router();

userRouter.get('/seed', async (req, res, next) => {
  try {
    await User.deleteMany({});
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
  } catch (err) {
    next(err);
  }
});

userRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ 
      data: users,
      message: 'Users listed',
    });
  } catch (err) {
    next(err);
  }  
});

userRouter.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findOne({ _id: id });
    res.status(200).json({ 
      data:user,
      message: 'User retrieved',
     });
  } catch (err) {
    next(err);
  }
})

userRouter.post('/home', async (req, res, next) => {
  
  try {
    res.send('<script>window.location.href="http://localhost:3002/factura.html";</script>');
  } catch (err) {
    next(err);
  }
})

userRouter.post('/register', async (req, res, next) => {
  try {
    const user = new User({ 
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      direccion: req.body.direccion,
      telefono: req.body.telefono,
    })

    const createdUsers = await user.save();

    /*res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      direccion: user.direccion,
      telefono: user.telefono,
      isAdmin: user.isAdmin,
      token: generateToken(createdUsers)
    })*/

    res.send('<script>window.location.href="http://localhost:3002/login.html";</script>');
  } catch (err) {
    next(err);
  }
})

userRouter.post('/login', async (req, res, next) => {
  //const { email } = req.body.email;
  try {
    const user = await User.findOne({ email: req.body.email });
    if(user){
      if(bcrypt.compareSync(req.body.password, user.password)){

        /*return res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          direccion: user.direccion,
          telefono: user.telefono,
          isAdmin: user.isAdmin,
          token: generateToken(user)
        })*/
      }
    }

    res.send('<script>window.location.href="http://localhost:3002/home.html";</script>');
  } catch (err) {
    next(err);
  }
})


userRouter.post('/factura', async (req, res, next) => {
  const { name, email, direccion, telefono } = req.body;

  contentHTML = `
    <header class="clearfix">
      <div id="logo">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEOawdr1j0fD9FR-EpngZZG9NLajG8QFD2UYF3svh78ba9KnhIxH8UziSD_6HV5UBNfmk&usqp=CAU">
      </div>
      <h1>INVOICE 3-2-1</h1>
      <div id="company" class="clearfix">
        <div>Company Name</div>
        <div>455 Foggy Heights,<br /> AZ 85004, US</div>
        <div>(602) 519-0450</div>
        <div><a href="mailto:company@example.com">company@example.com</a></div>
      </div>
      <div id="project">
        <div><span>PROJECT</span> Website development</div>
        <div><span>CLIENT</span>${name}</div>
        <div><span>ADDRESS</span>${direccion}</div>
        <div><span>EMAIL</span> <a href="">${email}</a></div>
        <div><span>DATE</span> Noviembre 10, 2021</div>
        <div><span>PHONE</span>${telefono}</div>
      </div>
    </header>
    <main>
      <table>
        <thead>
          <tr>
            <th class="service">SERVICE</th>
            <th class="desc">DESCRIPTION</th>
            <th>PRICE</th>
            <th>QTY</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="service">Design</td>
            <td class="desc">Creating a recognizable design solution based on the company's existing visual identity</td>
            <td class="unit">$40.00</td>
            <td class="qty">26</td>
            <td class="total">$1,040.00</td>
          </tr>
          <tr>
            <td class="service">Development</td>
            <td class="desc">Developing a Content Management System-based Website</td>
            <td class="unit">$40.00</td>
            <td class="qty">80</td>
            <td class="total">$3,200.00</td>
          </tr>
          <tr>
            <td class="service">SEO</td>
            <td class="desc">Optimize the site for search engines (SEO)</td>
            <td class="unit">$40.00</td>
            <td class="qty">20</td>
            <td class="total">$800.00</td>
          </tr>
          <tr>
            <td class="service">Training</td>
            <td class="desc">Initial training sessions for staff responsible for uploading web content</td>
            <td class="unit">$40.00</td>
            <td class="qty">4</td>
            <td class="total">$160.00</td>
          </tr>
          <tr>
            <td colspan="4">SUBTOTAL</td>
            <td class="total">$5,200.00</td>
          </tr>
          <tr>
            <td colspan="4">TAX 25%</td>
            <td class="total">$1,300.00</td>
          </tr>
          <tr>
            <td colspan="4" class="grand total">GRAND TOTAL</td>
            <td class="grand total">$6,500.00</td>
          </tr>
        </tbody>
      </table>
      <div id="notices">
        <div>NOTICE:</div>
        <div class="notice">A finance charge of 1.5% will be made on unpaid balances after 30 days.</div>
      </div>
    </main>
    <footer>
      Invoice was created on a computer and is valid without the signature and seal.
    </footer>
    `;

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'sergio.ac.1503@gmail.com',
          pass: 'kjdguugxigjrbpui',
      }
  });


  let info = await transporter.sendMail({
      from: '"Mentoring form', // sender address,
      to: 'sergio.aroni@unmsm.edu.pe, aroni.carbajals@gmail.com',
      //to: mentorizados.email,
      subject: 'Detail Facture',
      //text: 'Hello World'
      html: contentHTML
  })

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  res.redirect('/success.html'); 

  /*console.log(req.body);
  res.send("recibido")*/
})

module.exports = userRouter;