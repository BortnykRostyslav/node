const mongoose = require('mongoose');

const ActionTokenSchema = new mongoose.Schema({
        token: {type: String, trim: true, required: true},
        actionToken: {type: String, trim: true, required: true},
        user: { type: mongoose.Schema.Types.ObjectId, trim: true, required: true, ref: 'User' }
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

ActionTokenSchema.pre('findOne', function () {
    this.populate('user');
});


module.exports = mongoose.model('Action_Token', ActionTokenSchema);