const mongoose = require('mongoose');

const UserAvatarSchema = new mongoose.Schema({
        imageUrl: { type: String, trim: true, required: true },
        _user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', index: true }
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

module.exports = mongoose.model('User_Avatar', UserAvatarSchema);
