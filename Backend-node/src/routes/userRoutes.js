const express = require('express');
const userController = require('../controllers/userController');
const taskController = require('../controllers/taskController');
const sheduleController = require('../controllers/sheduleController');
const reminderController = require('../controllers/reminderController');
const fileController = require('../controllers/fileController');
const trasnlateController = require('../controllers/trasnlateController');
const rekognitionController = require('../controllers/rekognitionController');
const pollyController = require('../controllers/pollyController')

const router = express.Router();

router.post('/users/register', userController.createUser);
router.post('/auth/confirm', userController.confirmUser);
router.post('/auth/login', userController.authUser);
router.get('/users/profile/:id_user', userController.getUserProfile);
router.put('/users/profile/:id_user', userController.updateUserProfile);
router.delete('/users/delete/:id_user', userController.deleteUser);

router.post('/user/task', taskController.createTask);
router.put('/user/task/:task_id', taskController.updateTask);
router.delete('/user/task/:task_id', taskController.deleteTask);
router.get('/user/task/:task_id', taskController.getTask);
router.get('/user/tasks', taskController.getAllTask);

router.post('/user/shedule', sheduleController.createSchedule);
router.put('/user/shedule/:schedule_id', sheduleController.updateSchedule);
router.delete('/user/shedule/:schedule_id', sheduleController.deleteSchedule);
router.get('/user/shedule/:schedule_id', sheduleController.getScheduleById);
router.get('/user/shedules', sheduleController.getAllSchedules);
router.get('/user/shedules/:user_id', sheduleController.getSchedulesByUserId);

router.post('/user/reminder', reminderController.createReminder);
router.put('/user/reminder/:reminder_id', reminderController.updateReminder);
router.delete('/user/reminder/:reminder_id', reminderController.deleteReminder);
router.get('/user/reminder/:reminder_id', reminderController.getReminderById);
router.get('/user/reminders', reminderController.getAllReminders);
router.get('/user/reminders/:user_id', reminderController.getRemindersByUserId);

router.post('/user/file', fileController.uploadFile);
router.delete('/user/file/:file_id', fileController.deleteFile);
router.get('/user/file/:file_id', fileController.getFileById);
router.get('/user/files', fileController.getAllFiles);
router.get('/user/files/:user_id', fileController.getFilesByUserId);

router.post('/user/trasnlate', trasnlateController.translateDocument);
router.post('/user/rekognition', rekognitionController.imageRecognition);
router.post('/user/polly', pollyController.textToSpeech);

module.exports = router;