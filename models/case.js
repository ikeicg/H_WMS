const {Schema, model, Types} = require('mongoose')

const caseSchema = new Schema({
    _id: {
        type: Number
    },
    patientName: {
        type: String,
        required: true
    },
    severity: {
        type: Number,
        required: true
    }, 
    diagnosis: [
        {
            body: String,
            staff: {type: Schema.Types.ObjectId, ref: "Staff"}
        }
    ],
    vitals: [
        {
            temperature: String,
            bloodPressure: String,
            time: Date
        }
    ],
    treatmentPlan: [
        {
            procedure: {type: Schema.Types.ObjectId, ref: "Procedure"},
            id: Number,
            active: {
                type: Boolean,
            }, // The procedure is being actively handled or not
            open: {
                type: Boolean,
            }, // The procedure is still live or closed
            scheduled: {
                type: Boolean,
            }, // The procedure is scheduled for later or not
            instances: [ Date ],
            objective: {
                type: String
            }, 
            documentation: [
                {
                    text: String,
                    date: Date,
                    staff: {type: Schema.Types.ObjectId, ref: "Staff"}
                }
            ],
        }
    ], 
    queued: {
        type: Boolean,
    }, 
    open: {
        type: Boolean,
        required: true
    }

}, {timestamps: true})


caseSchema.methods.setSeverity = function(val) {
    let value = val <= 3 ? Number(val) : 3
    this.severity = value;
}

caseSchema.methods.addDiagnosis = function(body, staffId){
    staffId = Types.ObjectId(staffId)

    this.diagnosis.push({
        body, 
        staff: staffId
    })
}

caseSchema.methods.addVitals = function(temp, pressure){
    let date = Types.Date(Date.now())

    this.vitals.push({
        temperature: temp,
        bloodPressure: pressure,
        time: date
    })
}

caseSchema.methods.addTreatment = function(prod, objective){
    let procedure = Types.ObjectId(prod)
    let id = this.treatmentPlan.length + 1

    this.treatmentPlan.push({
        procedure,
        id,
        objective,
        active: false,
        open: true,
        scheduled: false,
        instances: [],
        documentation: []
    })
},

caseSchema.methods.closeCase = function(){
    this.open = false;
}



// Create AutoIncrement Id for Case schema
caseSchema.pre('save', async function(next){
  let doc = this;
  
  if(doc.isNew){

    try{
        docCount = await doc.constructor.countDocuments({})
        doc._id = docCount+1
        next()
    }
    catch(error){
        next(error)
    }
    
  }
  else {
    next()
  }
  
})
 
module.exports = model('Case', caseSchema)