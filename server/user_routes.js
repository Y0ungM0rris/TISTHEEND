const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const knex = require('knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path'); 
const upload = multer({ dest: './uploads/' });
const MailService = require("./mail/mailer.service")
const MailAll = require('./mail/mailerAll.service')

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

// Конфигурация Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/') // Место сохранения загруженных файлов
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // Имя файла (уникальное)
  }
})

// Маршрут регистрации с Multer
router.post('/register', upload.single('photo'), async (req, res) => {
    const { name, username, email, password } = req.body;
    const photo = req.file; 

    // Проверка наличия всех данных
    if (!name || !username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Проверка существования пользователя с таким username
        const existingUserWithUsername = await db('users').where('username', username).first();
        if (existingUserWithUsername) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // Проверка существования пользователя с таким email
        const existingUserWithEmail = await db('users').where('email', email).first();
        if (existingUserWithEmail) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Добавление пользователя в базу данных
        const [userId] = await db('users').insert({
            name,
            username,
            email,
            password: hashedPassword,
            role_id: 5,
            //user_photo: photo ? photo.path : null
        }).returning('user_id');

        MailService.sendTestMail(email);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

router.use('/uploads', express.static(path.join(__dirname, './uploads')));




// Обновление имени пользователя
router.put('/update_user_name', async (req, res) => {
    const { user_id, new_name} = req.body;
    try {
        if (!user_id || !new_name ) {
            return res.status(400).send('Name is required for updating');
        }

        const updatedCount = await db('users')
            .where({ user_id })
            .update({ name: new_name});
        
        if (updatedCount > 0) {
            res.send('Name updated successfully');
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating name');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Поиск пользователя по электронной почте
        const user = await db('users').where('email', email).first();

        // Проверка наличия пользователя
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Проверка совпадения пароля
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Создание JWT токена с user_id
        const token = jwt.sign({ userId: user.user_id }, 'your_secret_key', { expiresIn: '1h' });

        // Отправка токена клиенту
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error authenticating user' });
    }
});


router.get('/user_offline_appointments', async (req, res) => {
    const { userId } = req.query; // Получение userId из запроса
    try {
        const offlineAppointments = await db.select().from('offline_appointment').where('user_id', userId); // Исправление запроса
        res.json(offlineAppointments);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching offline appointments');
    }
});

router.get('/user_online_appointments', async (req, res) => {
    const { userId } = req.query; // Получение userId из запроса
    try {
        const onlineAppointments = await db.select().from('online_appointment').where('user_id', userId); // Исправление запроса
        res.json(onlineAppointments);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching offline appointments');
    }
});


router.post('/logout', async (req, res) => {
    // Очистка cookie с токеном
    res.clearCookie('token');

    // Отправка ответа с сообщением об успешном выходе
    res.status(200).json({ message: 'User logged out successfully' });
});

router.put('/update_user_username', async (req, res) => {
    const { user_id, new_username } = req.body;
    try {
        if (!user_id || !new_username) {
            return res.status(400).send('User ID and new username are required for updating');
        }

        // Проверка уникальности нового юзернейма
        const existingUser = await db('users').where('username', new_username).whereNot('user_id', user_id).first();
        if (existingUser) {
            return res.status(400).send('Username is already taken');
        }

        const updatedCount = await db('users')
            .where({ user_id })
            .update({ username: new_username });

        if (updatedCount > 0) {
            res.send('Username updated successfully');
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating username');
    }
});



router.get('/user_role_id', async (req, res) => {
    const { userId } = req.query; // Получение userId из запроса
    try {
        const userRole = await db.select('role_id').from('users').where('user_id', userId); // Запрос для получения role_id
        if (userRole.length > 0) {
            res.json({ role_id: userRole[0].role_id });
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching user role');
    }
});

router.get('/user_info', async (req, res) => {
    const userId = parseInt(req.query.userId, 10); 
    try {
        const userInfo = await db('users')
            .select('users.username', 'users.name', 'role.role_name', 'users.user_photo')
            .leftJoin('role', 'users.role_id', 'role.role_id')
            .where('users.user_id', userId)
            .first();

        if (userInfo) {
            res.json(userInfo);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching user information');
    }
});

// Роутер Express для изменения фото пользователя
router.put('/update_user_photo/:userId', upload.single('photo'), async (req, res) => {
    const userId = req.params.userId;
    const photo = req.file;

    try {
        // Проверка существования пользователя
        const user = await db('users').where('user_id', userId).first();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Обновление фото пользователя в базе данных
        await db('users').where('user_id', userId).update({ user_photo: photo ? photo.path : null });

        res.json({ message: 'User photo updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating user photo' });
    }
});



router.get('/views', async (req, res) => {
    try {
        const views = await db.select().from('views'); 
        res.json(views);
    } catch (error) {
        console.error('Error fetching views:', error);
        res.status(500).send('Error fetching views');
    }
});


router.post('/views_add', upload.single('photo'), async (req, res) => {
    const { view_name, view_description, exhibit_id, view_url } = req.body;

    // Проверяем, был ли предоставлен файл
    const view_photo = req.file ? req.file.path : null;

    try {
        const newView = await db('views').insert({ view_name, view_description, view_photo, exhibit_id, view_url }).returning('*');
        res.status(201).json(newView[0]);
    } catch (error) {
        console.error('Error adding new view:', error);
        res.status(500).send('Error adding new view');
    }
});


// Удаление представления
router.delete('/delete_view', async (req, res) => {
    const { view_id } = req.body;
    try {
        if (!view_id) {
            return res.status(400).send('View ID is required for deletion');
        }

        const deletedCount = await db('views').where({ view_id }).del();
        
        if (deletedCount > 0) {
            res.send('View deleted successfully');
        } else {
            res.status(404).send('View not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting view');
    }
});



router.post('/reg', async (req, res) => {
    const { email } = req.body;
  
    try {
        MailService.sendTestMail('dmorev17@mail.ru')
        .then(() => {
            console.info("Письмо успешно отправлено на адрес: ", email);
            res.status(200).json({ message: "Письмо успешно отправлено" });
        })
        .catch(err => {
            console.warn("Произошла ошибка при отправке сообщения: ", err);
            res.status(500).json({ error: "Ошибка при отправке сообщения" });
        });
    } catch (error) {
        console.error('Ошибка при отправке письма:', error);
        res.status(500).json({ error: 'Ошибка при отправке письма' });
    }
});

router.get('/exhibits', async (req, res) => {
    const viewId = parseInt(req.query.viewId, 10); 
    try {
        const exhibits = await db('exhibit')
            .select('*')
            .where('view_id', viewId);

        if (exhibits.length > 0) {
            res.json(exhibits);
        } else {
            res.status(404).send('Exhibits not found for the given view id');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching exhibits by view id');
    }
});




router.get('/view_info', async (req, res) => {
    const viewId = parseInt(req.query.viewId, 10); // Получаем ID представления из параметра запроса
    try {
        const viewInfo = await db('views')
            .select('view_name', 'view_description', 'view_photo')
            .where('view_id', viewId)
            .first();

        if (viewInfo) {
            res.json(viewInfo);
        } else {
            res.status(404).send('View not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching view information');
    }
});

router.post('/exhibits_add', upload.single('exhibit_photo'), async (req, res) => {
    const { exhibit_name, exhibit_description, view_id } = req.body;
    const exhibit_photo = req.file ? req.file.path : null; // Получаем путь к загруженной фотографии

    try {
        const newExhibit = await db('exhibit').insert({
            exhibit_name,
            exhibit_description,
            exhibit_photo,
            view_id
        });

        res.status(201).json({ message: 'Exhibit added successfully', exhibit_id: newExhibit[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding exhibit');
    }

});


router.get('/exhibits_list_admin', async (req, res) => {
    const viewId = parseInt(req.query.viewId, 10); 
    try {
        const exhibits = await db('exhibit')
            .select('*');

        if (exhibits.length > 0) {
            res.json(exhibits);
        } else {
            res.status(404).send('Exhibits not found for the given view id');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching exhibits by view id');
    }
});

// Удаление экспоната
router.delete('/delete_exhibit', async (req, res) => {
    const { exhibit_id } = req.body;
    try {
        if (!exhibit_id) {
            return res.status(400).send('Exhibit ID is required for deletion');
        }

        const deletedCount = await db('exhibit').where({ exhibit_id }).del();
        
        if (deletedCount > 0) {
            res.send('Exhibit deleted successfully');
        } else {
            res.status(404).send('Exhibit not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting exhibit');
    }
});

router.get('/all_users_info', async (req, res) => {
    try {
        const allUsersInfo = await db('users')
            .select('user_id', 'users.username', 'users.name', 'role.role_name', 'users.user_photo')
            .leftJoin('role', 'users.role_id', 'role.role_id');

        if (allUsersInfo.length > 0) {
            res.json(allUsersInfo);
        } else {
            res.status(404).send('No users found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching user information');
    }
});


router.delete('/delete_user', async (req, res) => {
    const userId = parseInt(req.query.userId, 10);
    try {
        await db('users')
            .where('user_id', userId)
            .del();

        res.status(200).send('Пользователь успешно удален');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при удалении пользователя');
    }
});

router.put('/update_user_role', async (req, res) => {
    const { user_id, role_id } = req.body;
    try {
        await db('users')
            .where('user_id', user_id)
            .update({ role_id });
        res.status(200).send('User role updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating user role');
    }
});

// Отправка сообщения всем пользователям
router.post('/send-message-to-all-users', async (req, res) => {
    const { message } = req.body;

    try {
        const users = await db('users').select('email');

        users.forEach(async (user) => {
            MailAll.sendTestMail(user.email);
        });

        res.status(200).json({ message: 'Message sent successfully to all users' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending message to users' });
    }
});



module.exports = router;