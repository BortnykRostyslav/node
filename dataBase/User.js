const rolesEnum = require('../configs/roles.enum');
const mongoose = require('mongoose');


const secureFields = [
    'password'
];


const UserSchema = new mongoose.Schema({
        firstName: {type: String, trim: true, default: ' '},
        lastName: {type: String, trim: true, default: ' '},
        email: {type: String, trim: true, lowercase: true, required: true, unique: true},
        age: {type: Number,min: 8, max: 101, require: true},
        password: {type: String, min: 5, required: true, default: ""},
        role: {type: String, enum: Object.values(rolesEnum), default: rolesEnum.USER}
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            virtuals: true,
            transform: function ( doc, ret ){
                for (const field of secureFields) {
                    delete ret[field];
                }

                return ret;
            }
        },
        toObject: {
            virtuals: true,
            transform: function ( doc, ret ){
                for (const field of secureFields) {
                    delete ret[field];
                }

                return ret;
            }
        }
    }
);

UserSchema.virtual('fullName').get(function(){
    return `${this.firstName} ${this.lastName}`.trim();
});

UserSchema.virtual('mainPhoto', {
    ref: 'User_Avatar',
    localField: '_id',
    foreignField: '_user_id',
    justOne: true,
    options: {
        sort: { updatedAt: -1 }
    }
});

UserSchema.pre(/^find/, function() {
    this.populate('mainPhoto');
});

module.exports = mongoose.model('User', UserSchema);