const Case = require('../models/case')
const Department = require('../models/department')

function createCase(req, res){
    let newCase = new Case({
        patientName: "Test",
        open: true,
        active: true
    });

    newCase.save().then(async (data) => {
        await Department.updateOne({name: "FrontDesk"}, {$push: {cases: data._id }})
        res.status(201).json({message: "New Case created"})
    })

}


module.exports = {createCase}