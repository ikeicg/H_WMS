const Case = require('../../models/case')
const Department = require('../../models/department')

function createCase(req, res){

    const {patientName } = req.body

    let newCase = new Case({
        patientName,
        open: true,
        queued: false,
        severity: 1
    });

    newCase.save().then(async (data) => {
        await Department.updateOne({name: "FrontDesk"}, {$push: {cases: data._id }})
        res.status(201).json({message: "New Case created"})
    })

}

async function transferCase( req, res) {
    let {dept1, caseId, dept2 } = req.body;
    let doc = await Department.findOne({name: dept1})
    let doc2 = await Department.findOne({name: dept2})
    if(!doc2){
        res.status(200).json({success: false, message: "Non-existent department"})
    }
    else{
        res.status(200).json(await doc.transferCase(caseId, dept2))
    }
}


module.exports = {createCase, transferCase}