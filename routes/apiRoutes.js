const {Router} = require('express');
const isAuth = require('../utils/isAuth')
const {createCase} = require('../controllers/apiControllers')

const router = Router();

router.post('/api/newcase', createCase)

module.exports = router

