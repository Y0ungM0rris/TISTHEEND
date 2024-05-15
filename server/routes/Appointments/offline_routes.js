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
const status = 'awaits';

// Добавление офлайн записи
router.post('/offline_appointments', async (req, res) => {
    const { user_id, views_id, offline_date } = req.body;
    try {
      await db('offline_appointment').insert({ user_id, views_id, offline_date, offline_status: status });
      res.status(201).send('Offline appointment created successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating offline appointment');
    }
  });



// Удаление офлайн записи
router.delete('/delete_offline_appointment', async (req, res) => {
    const { user_id, offline_id } = req.body;
    try {
        if (!offline_id) {
            return res.status(400).send('Offline ID is required for deletion');
        }

        const deletedCount = await db('offline_appointment').where({ user_id, offline_id: offline_id }).del();
        
        if (deletedCount > 0) {
            res.send('Offline appointment deleted successfully');
        } else {
            res.status(404).send('Offline appointment not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting offline appointment');
    }
});

// Обновление даты офлайн экскурсии
router.put('/update_offline_appointment_date', async (req, res) => {
    const { offline_id, new_date } = req.body;
    try {
        if (!offline_id || !new_date) {
            return res.status(400).send('Offline ID and new date are required for updating');
        }

        const updatedCount = await db('offline_appointment')
            .where({ offline_id})
            .update({ offline_date: new_date });
        
        if (updatedCount > 0) {
            res.send('Offline appointment date updated successfully');
        } else {
            res.status(404).send('Offline appointment not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating offline appointment date');
    }
});

router.get('/offline_appointments_list', async (req, res) => {
    try {
        const appointments = await db.select().from('offline_appointment');
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching offline appointments:', error);
        res.status(500).send('Error fetching offline appointments');
    }
});







// Удаление офлайн записи
router.delete('/delete_offline_appointment_admin', async (req, res) => {
    const { offline_id } = req.body;
    try {
        if (!offline_id) {
            return res.status(400).send('Offline ID is required for deletion');
        }

        const deletedCount = await db('offline_appointment').where({ offline_id }).del();
        
        if (deletedCount > 0) {
            res.send('Offline appointment deleted successfully');
        } else {
            res.status(404).send('Offline appointment not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting offline appointment');
    }
});

// Обновление даты офлайн экскурсии
router.put('/update_offline_appointment_date_admin', async (req, res) => {
    const { offline_id, new_date } = req.body;
    try {
        if (!offline_id || !new_date) {
            return res.status(400).send('Offline ID and new date are required for updating');
        }

        const updatedCount = await db('offline_appointment')
            .where({ offline_id })
            .update({ offline_date: new_date });
        
        if (updatedCount > 0) {
            res.send('Offline appointment date updated successfully');
        } else {
            res.status(404).send('Offline appointment not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating offline appointment date');
    }
});



// Обновление статуса офлайн экскурсии
router.put('/update_offline_appointment_status', async (req, res) => {
    const { offline_id, new_status } = req.body;
    try {
        if (!offline_id || !new_status) {
            return res.status(400).send('Offline ID and new status are required for updating');
        }

        const updatedCount = await db('offline_appointment')
            .where({ offline_id })
            .update({ offline_status: new_status });
        
        if (updatedCount > 0) {
            res.send('Offline appointment status updated successfully');
        } else {
            res.status(404).send('Offline appointment not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating offline appointment status');
    }
});




module.exports = router;