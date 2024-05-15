const PORT = 5007;
const { Pool } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
var morgan = require('morgan');
const OnlineAppointmentsRouts = require('./routes/Appointments/online_routes');
const OfflineAppointmentsRouts = require('./routes/Appointments/offline_routes');
const UserRouts = require('./user_routes');
const MailService = require("./mail/mailer.service")

const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '1234',
    database: 'postgres',
  },
});

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '1234',
  port: 5432,
});








// Middleware для аутентификации пользователя
function authenticateUser(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = { userId: decoded.userId };
    next();
  });
}




MailService.sendTestMail('dmorev17@mail.ru');




const app = express();
app.use(bodyParser.json());

// Логирование запросов
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));







// Пример настройки CORS в Express


// Middleware для обработки запросов OPTIONS
app.options('*', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.send();
});

// Middleware для обработки других запросов
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

// Другие маршруты и настройки приложения...







// Роуты CRUD операций и бизнес логики 
app.use(OnlineAppointmentsRouts);
app.use(OfflineAppointmentsRouts);  
app.use(UserRouts);



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});