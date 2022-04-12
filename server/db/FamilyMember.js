const ObjectId = require('mongodb').ObjectId;
const DBPool = require('./DBPool');

module.exports = class FamilyMember extends DBPool {
    static COLLECTIONNAME = 'FamilyMember';
    constructor(dbname){
        super();
        this.dbname = !!dbname ? dbname : DBPool.DBNAME;
        this.memberColl = this.client.db(this.dbname).collection(FamilyMember.COLLECTIONNAME);
    }

    async getMembersByFamily(familyId){
        if(!this.isConnected){await this.dbInstance();}
        let members = [];
        try{
            members = await this.memberColl.find({familyId: ObjectId(familyId)}).toArray();
        }catch(err){console.error(err);}
        return members;
    }
}