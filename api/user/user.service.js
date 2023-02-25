const User = require('../../dataBase/User');
const UserAvatar = require('../../dataBase/UserAvatar');
const {buildFilterQuery} = require('./user.util');
const {oauthService, fileService} = require('../../services');

module.exports = {
    /**
     * @returns {Promise<User>}
     * @param searchObject
     */

    findUserByParams: (searchObject) => {
        return User.findOne(searchObject);
    },

    /**
     * @returns {Promise<{data: Array<User>, page: Number, perPage: Number, total: Number}>}
     */

    getAllUsers: async (query = {}) => {
        const {page = 1, perPage = 5, sortBy = 'createdAt', order = 'ASC', ...filterQuery} = query;
        const skip = (page - 1) * perPage;

        const search = buildFilterQuery(filterQuery);

        const orderValue = order === 'ASC' ? -1 : 1;

        const users = await User
            .find(search)
            .limit(perPage)
            .skip(skip)
            .sort({[sortBy]: [orderValue]});

        const total = await User.countDocuments(search);

        return {
            data: users,
            page,
            perPage,
            total
        };
    },

    /**
     *
     * @param userId {String}
     * @param newUserObject {Partial<User>}
     * @returns {Promise<User>}
     */

    updateUser: async (userId, newUserObject) => {
        return User.findByIdAndUpdate(userId, newUserObject);
    },

    deleteUserById: async (userId) => {
        return User.deleteOne({_id: userId});
    },

    createUser: async (userObject) => {
        const hashPassword = await oauthService.hashPassword(userObject.password);

        return User.create({...userObject, password: hashPassword});
    },

    uploadNewAvatar(_user_id, imageUrl) {
        return UserAvatar.create({imageUrl, _user_id});
    },

    getUserAvatars(userId){
        return UserAvatar.find({_user_id: userId}).sort({ updatedAt: -1 });
    },

    async setAvatarAsMain(avatarId) {
        const updatedAvatar = await UserAvatar.findByIdAndUpdate(avatarId, { updatedAt: new Date() }).lean();

        return module.exports.getUserAvatars(updatedAvatar._user_id)
    },

    async deleteUserAvatar(avatarId){
        const deletedItem = await UserAvatar.findByIdAndDelete(avatarId);


        await fileService.deleteImageFromS3(deletedItem.imageUrl);
    }
};