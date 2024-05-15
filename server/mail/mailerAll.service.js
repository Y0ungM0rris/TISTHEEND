const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: 'dmorev17@mail.ru',
    pass: 'ybnM9bgMRkQ7VKYmCNbV'
  }
});

sendTestMail = (email) => {
  transporter.sendMail({
    from: 'Дом музей <dmorev17@mail.ru>',
    to: email,
    subject: 'Дом-музей',
    html: `<h1>Привет!</h1>
    <b>Здравствуйте, ${email}</b>
    <p>Не забудьте посетить наш музей!</p>`
  })
  .then(() => console.info("Письмо успешно отправлено на адрес: ", email))
  .catch(err => console.warn("Произошла ошибка при отправке сообщения: ", err));
};

const MailService = {
  sendTestMail: sendTestMail
};

module.exports = MailService;
