const {Router} = require('express');
const isAuth = require('../utils/isAuth')
const {createCase} = require('../controllers/apiControllers')
const Department = require('../models/department')

const router = Router();

router.post('/api/newcase', createCase)

router.post('/api/transfercase', async ( req, res) => {
    let {dept1, caseid, dept2 } = req.body;
    let doc = await Department.findOne({name: dept1})
    res.status(200).json(await doc.transferCase(caseid, dept2))
})

module.exports = router

