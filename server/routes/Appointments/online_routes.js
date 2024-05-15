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

router.use(bodyParser.json());

// Добавление онлайн записи
router.post('/online_appointments', async (req, res) => {
    const { user_id, views_id, online_date } = req.body;
    const online_status = "pending"; // Устанавливаем начальное значение статуса
    try {
      await db('online_appointment').insert({ user_id, views_id, online_date, online_status });
      res.status(201).send('Online appointment created successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating online appointment');
    }
});


// Удаление онлайн записи
router.delete('/delete_online_appointment', async (req, res) => {
const { user_id, online_id } = req.body;
    try {
        if (!online_id) {
            return res.status(400).send('Online ID is required for deletion');
        }

        const deletedCount = await db('online_appointment').where({ user_id, online_id: online_id }).del();
        
        if (deletedCount > 0) {
            res.send('Online appointment deleted successfully');
        } else {
            res.status(404).send('Online appointment not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting online appointment');
    }
});

// Обновление даты онлайн экскурсии
router.put('/update_online_appointment_date', async (req, res) => {
    const { online_id, new_date } = req.body;
    try {
        if (!online_id || !new_date) {
            return res.status(400).send('Online ID and new date are required for updating');
        }

        const updatedCount = await db('online_appointment')
            .where({ online_id})
            .update({ online_date: new_date });
        
        if (updatedCount > 0) {
            res.send('Online appointment date updated successfully');
        } else {
            res.status(404).send('Online appointment not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating online appointment date');
    }
});

// Обновление ссылки на подключение к онлайн экскурсии и изменение её статуса
router.put('/update_online_appointment_link', async (req, res) => {
    const { online_id, new_link } = req.body;
    try {
        if (!online_id || !new_link) {
            return res.status(400).send('Online ID and new link are required for updating');
        }

        const updatedCount = await db('online_appointment')
            .where({ online_id})
            .update({ link: new_link, online_status: "kikimoka" });
        
        if (updatedCount > 0) {
            res.send('Online appointment link and status updated successfully');
        } else {
            res.status(404).send('Online appointment not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating online appointment link and status');
    }
});


router.get('/online_appointments_list', async (req, res) => {
    try {
        const appointments = await db.select().from('online_appointment');
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching online appointments:', error);
        res.status(500).send('Error fetching online appointments');
    }
});

// Удаление онлайн записи
router.delete('/delete_online_appointment_admin', async (req, res) => {
    const { online_id } = req.body;
    try {
        if (!online_id) {
            return res.status(400).send('Online ID is required for deletion');
        }

        const deletedCount = await db('online_appointment').where({ online_id }).del();
        
        if (deletedCount > 0) {
            res.send('Online appointment deleted successfully');
        } else {
            res.status(404).send('Online appointment not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting online appointment');
    }
});

// Обновление даты онлайн экскурсии
router.put('/update_online_appointment_date_admin', async (req, res) => {
    const { online_id, new_date } = req.body;
    try {
        if (!online_id || !new_date) {
            return res.status(400).send('Online ID and new date are required for updating');
        }

        const updatedCount = await db('online_appointment')
            .where({ online_id })
            .update({ online_date: new_date });
        
        if (updatedCount > 0) {
            res.send('Online appointment date updated successfully');
        } else {
            res.status(404).send('Online appointment not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating online appointment date');
    }
});




// Обновление статуса онлайн записи
router.put('/update_online_appointment_status', async (req, res) => {
    const { online_id, new_status } = req.body;
    try {
        if (!online_id || !new_status) {
            return res.status(400).send('Online ID and new status are required for updating');
        }

        const updatedCount = await db('online_appointment') // Update the table name to 'online_appointment'
            .where({ online_id })
            .update({ online_status: new_status });
        
        if (updatedCount > 0) {
            res.send('Online appointment status updated successfully');
        } else {
            res.status(404).send('Online appointment not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating online appointment status');
    }
});





module.exports = router;