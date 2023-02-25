const OAuth = require('../../dataBase/OAuth');
const ActionToken = require('../../dataBase/ActionToken');

module.exports = {
    createOauthPair: (tokenData) => {
        return OAuth.create(tokenData);
    },

    getByParams: (searchData = {}) => {
        return OAuth.findOne(searchData);
    },

    deleteOneByParams (deleteData = {}){
        return  OAuth.deleteOne(deleteData);
    },

    deleteManyByParams (deleteData = {}){
        return  OAuth.deleteMany(deleteData);
    },

    //Action Token Schema Functions

    createActionToken(tokenData){
        return ActionToken.create(tokenData);
    },

    deleteActionTokenByParams(deleteData) {
        return  OAuth.deleteOne(deleteData);
    },

    findActionTokenByParams(searchData){
        return ActionToken.findOne(searchData);
    }
};