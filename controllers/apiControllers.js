const Case = require('../models/case')

function createCase(req, res){
    let newCase = new Case({
        patientName: "Test",
        open: true,
        active: true
    });

    newCase.save().then(data => {
        res.status(201).json({message: "New Case created"})
    })

}


module.exports = {createCase}