// Importing express module
const express = require('express');
const router = express.Router();

const adminController = require('../controllers/Admin.controller');

router.post('/addtour', adminController.addTour);
router.get('/get/all', adminController.getAllTours);
router.get('/add/schedule/:tourID', adminController.getAddSchedule);
router.post('/add/schedule/:tourID', adminController.addSchedule);

router.get('/', (req, res, next) => {
	res.render('admin');
});

// Importing the router
module.exports = router;
