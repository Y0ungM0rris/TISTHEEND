const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  //host: 'smtp.mail.ru',
  //port: 465,
  service: 'mail',
  //secure: true,
  auth: {
    user: 'dmorev17@mail.ru',
    pass: 'ybnM9bgMRkQ7VKYmCNbV'
  }
});

const sendTestMail = (email) => {
  transporter.sendMail({
    from: 'Test App <dmorev17@mail.ru>',
    to: email,
    subject: 'Test Letter',
    text: 'Hello world',
    html: `<h1>Тестовое письмо</h1>
    <i>Здравствуйте, ${email}</i>
    <p>Учимся отправлять письма с Node.js</p>`
  })
  .then(() => console.info("Письмо успешно отправлено на адрес: ", email))
  .catch(err => console.warn("Произошла ошибка при отправке сообщения: ", err));
};

const MailService = {
  sendTestMail: sendTestMail
};

module.exports = MailService;
