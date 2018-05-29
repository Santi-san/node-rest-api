const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    profile_pic: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Student', studentSchema);