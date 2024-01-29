const {Router} = require('express');
const isAuth = require('../utils/isAuth')
const {createCase, transferCase} = require('../controllers/apiControllers/caseControllers')
const Department = require('../models/department')
const verifyRoles = require("../middleware/verifyRoles")

const router = Router();

// Case Endpoints

router.post('/api/case/newcase', verifyRoles(['FrontDesk']), createCase)

router.post('/api/case/transfercase', verifyRoles('*'), transferCase )


// Department Endpoints




module.exports = router

