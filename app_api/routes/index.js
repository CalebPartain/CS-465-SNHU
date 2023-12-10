const express = require('express');
const router = express.Router();
const jwt = require("express-jwt");

const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
    algorithms: ["HS256"]
});

const authController = require('../controllers/authentication');
const ctrlTrips = require('../controllers/trips');



/* GET home page. */
router.get('/', ctrlTrips.tripsList);


router
    .route('/login')
    .post(authController.login);


router
    .route('/register')
    .post(authController.register);


router
    .route('/trips')
    .get(ctrlTrips.tripsList)
    .post(auth, ctrlTrips.tripsAddTrip);


router

    .route('/trips/:tripCode')
    .get(ctrlTrips.tripsFindByCode)
    .put(auth, ctrlTrips.tripsUpdateTrip);


module.exports = router;
