const {Schema, model} = require('mongoose')

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
            body: String,
            time: Date
        }
    ],
    treatmentPlan: [
        {
            procedure: {type: Schema.Types.ObjectId, ref: "Procedure"},
            active: {
                type: Boolean,
            },
            open: {
                type: Boolean,
            },
            archived: {
                type: Boolean
            },
            scheduled: {
                type: Boolean,
            },
            instances: [ Date ],
            objective: {
                type: String
            }, 
            documentation: {
                type: [String]
            },
        }
    ], 
    open: {
        type: Boolean,
        required: true
    }

}, {timestamps: true})

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