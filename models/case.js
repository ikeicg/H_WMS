const {Schema, model} = require('mongoose')

const caseSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    patientName: {
        type: String,
        required: true
    },
    treatmentPlan: [
        {
            procedure: {type: Schema.Types.ObjectId, ref: "Procedure"},
            open: {
                type: Boolean,
                required: true
            },
            active: {
                type: Boolean,
                required: true
            },
            staff: [{type: Schema.Types.ObjectId, ref: "Staff"}],
        }
    ], 
    open: {
        type: Boolean,
        required: true
    }, 
    active: {
        type: Boolean,
        required: true
    },

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