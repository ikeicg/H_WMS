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

async function transferCase( req, res) {
    let {dept1, caseid, dept2 } = req.body;
    let doc = await Department.findOne({name: dept1})
    let doc2 = await Department.findOne({name: dept2})
    if(!doc2){
        res.status(200).json({success: false, message: "Non-existent department"})
    }
    else{
        res.status(200).json(await doc.transferCase(caseid, dept2))
    }
}


module.exports = {createCase, transferCase}