const {Schema, model} = require('mongoose');

const procedureSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    deartment: {
        type: Schema.Types.ObjectId,
        required: true
    },
    duration: {
        type: Number,
        required: true
    }
}, {timestamps: true})

module.exports = model("Procedure", procedureSchema);