const {Router} = require('express');
const isAuth = require('../utils/isAuth')

const router = Router();

router.get('/createuser', isAuth, (req, res) => {
    res.send("OMG")
})


module.exports = router

