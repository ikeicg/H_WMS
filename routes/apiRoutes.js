const {Router} = require('express');
const isAuth = require('../utils/isAuth')
const {createCase, transferCase} = require('../controllers/apiControllers')
const Department = require('../models/department')

const router = Router();

router.post('/api/newcase', createCase)

router.post('/api/transfercase', transferCase )

module.exports = router

