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

    async getMember(memberId){
        if(!this.isConnected){await this.dbInstance();}
        let member;
        try{
            member = await this.memberColl.findOne({ _id: ObjectId(memberId) });
        }catch(err){console.error(err);}
        return member;
    }

    async createFamilyMember(newMember){
        if(!this.isConnected){await this.dbInstance();}
        let member;
        try{
            let rsMember;
            if(!!newMember.relationshipWith){
                rsMember = await this.memberColl.findOne({ _id: ObjectId(newMember.relationshipWith) });
            }
            newMember = {...newMember, 
                    familyId: ObjectId(newMember.familyId), 
                    relationshipWith: !!newMember.relationshipWith ? ObjectId(newMember.relationshipWith): null,
                    relationship:{ rsMemberId: rsMember._id, rsMemberName: rsMember.memberName } };
            let result = await this.memberColl.insertOne(newMember);
            member = !!result.insertedId ? await this.getMember(result.insertedId) : null;
        }catch(err){console.error(err);}
        return member;
    }

    async updateMemberAvatar(memberId, avatarSrc){
        if(!this.isConnected){await this.dbInstance();}
        let member;
        try{
            let result = await this.memberColl.updateOne({ _id:ObjectId(memberId) }, {$set:{ avatar: avatarSrc }});
            member = result.modifiedCount>0 ? await this.getMember(memberId) : null;
        }catch(err){console.error(err);}
        return member;
    }
}