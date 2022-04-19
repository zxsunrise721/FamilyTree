const DBPool = require('./DBPool');
const ObjectId = require('mongodb').ObjectId;

module.exports = class User extends DBPool {
    static COLLECTION_NAME = 'user';
    constructor(dbname){
        super();
        this.dbname = dbname;
        this.userColl = this.client.db(this.dbname).collection(User.COLLECTION_NAME);
    }

    /**
     * function getUserDefalut: 
     * Get a default user document 'anonymous', from database, it is initial insert into db
     * @returns : an user document
     * @returns : null
     */
    async getUserDefalut(){
        if(!this.isConnected){ await this.dbInstance();}
        let user;
        try{
            user = await this.userColl.findOne({ name : 'anonymous'})
        }catch(e){console.error(e);}
        return user;
    }

    /**
     * function getUser: 
     * Get a user document by user id, from database,
     * @returns : an user document
     * @returns : null
     */
    async getUser( userId ){
        if(!this.isConnected){ await this.dbInstance();}
        let user;
        try{
            user = await this.userColl.findOne({ _id : ObjectId(userId)})
        }catch(e){console.error(e);}
        return user;
    }

    async getUserByNameAndPwd(userName, password){
        if(!this.isConnected){ await this.dbInstance();}
        let user;
        try{
            user = await this.userColl.findOne({ username : userName, password : password })
        }catch(e){console.error(e);}
        return user;
    }

    async getUserByName(userName){
        if(!this.isConnected){ await this.dbInstance();}
        let user;
        try{
            user = await this.userColl.findOne({ username : userName })
        }catch(e){console.error(e);}
        return user;
    }

    async createUser(newUser){
        if(!this.isConnected){ await this.dbInstance();}
        let userId;
        try{
            this.startTransaction();
            let result = await this.userColl.insertOne(newUser);
            userId = result.insertedId;
            !!userId ? this.session.commitTransaction() : this.session.abortTransaction();
        }catch(e){ this.session.abortTransaction(); console.error(e);}
        let user = await this.userColl.findOne({_id: ObjectId(userId)});
        return user;
    }

    async updateUserPassword(username, newPassword) {
        if(!this.isConnected){ await this.dbInstance();}
        let user;
        try{
            this.startTransaction();
            user = await this.getUserByName(username);
            let result = await this.userColl.updateOne( {_id:ObjectId(user._id)}, {$set:{password: newPassword}} );
            result.modifiedCount>0 ? this.session.commitTransaction() : this.session.abortTransaction();
            user = result.modifiedCount>0 ? await this.userColl.findOne({_id: ObjectId(user._id)}) : null;
        }catch(e){ this.session.abortTransaction(); console.error(e);}
        return user;
    }
}