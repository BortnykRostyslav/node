const mongoose = require('mongoose');

const OAuthSchema = new mongoose.Schema({
        accessToken: {type: String, trim: true, required: true},
        refreshToken: {type: String, trim: true, required: true},
        user: {type: mongoose.Schema.Types.ObjectId, trim: true, required: true, ref: 'User'}
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

OAuthSchema.virtual('testUser', {
    ref: 'User',
    localField: 'user',
    foreignField: '_id'
});

OAuthSchema.pre('findOne', function () {
    this.populate('user');
    this.populate('testUser');
});

module.exports = mongoose.model('OAuth', OAuthSchema);