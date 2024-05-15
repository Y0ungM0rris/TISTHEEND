const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const knex = require('knex');


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

const OnlineAppointmentsRoutes = require('./Appointments/online_routes');
const OfflineAppointmentsRoutes = require('./Appointments/offline_routes');
const UserRoutes = require('./user_routes');

const app = express();
app.use(bodyParser.json());

app.use(OnlineAppointmentsRoutes);
app.use(OfflineAppointmentsRoutes);  
app.use(UserRoutes);