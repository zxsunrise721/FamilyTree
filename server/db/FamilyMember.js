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
        familyId = typeof familyId === 'string' ? ObjectId(familyId) : familyId;
        let members = [];
        try{
            members = await this.memberColl.find({familyId: familyId}).toArray();
        }catch(err){console.error(err);}
        return members;
    }

    async getRootMembersByFamily(familyId){
        if(!this.isConnected){await this.dbInstance();}
        familyId = typeof familyId === 'string' ? ObjectId(familyId) : familyId;
        let member;
        try{
            member = await this.memberColl.findOne({familyId: familyId, relationshipType: 'Root'});
        }catch(err){console.error(err);}
        return member;
    }

    async getMember(memberId){
        if(!this.isConnected){await this.dbInstance();}
        memberId = typeof memberId === 'string' ? ObjectId(memberId) : memberId;
        let member;
        try{
            member = await this.memberColl.findOne({ _id: memberId });
        }catch(err){console.error(err);}
        return member;
    }

    async getRelationMember(memberId){
        if(!this.isConnected){await this.dbInstance();}
        memberId = typeof memberId === 'string' ? ObjectId(memberId) : memberId;
        let members = [];
        try{
            members = await this.memberColl.find({ relationshipWith: memberId }).toArray();
        }catch(err){console.error(err);}
        return members;
    }

    async createFamilyMember(newMember){
        if(!this.isConnected){await this.dbInstance();}
        let member;
        try{
            let rsMember;
            if(!!newMember.relationshipWith && ObjectId.isValid(newMember.relationshipWith)){
                rsMember = await this.getMember(newMember.relationshipWith);
            }
            newMember = !!rsMember ? {...newMember, 
                                    familyId: ObjectId(newMember.familyId), 
                                    relationshipWith: !!rsMember ? rsMember._id: null,
                                    relationship:{ rsMemberId: rsMember._id, rsMemberName: rsMember.memberName } } :
                    {...newMember, familyId: ObjectId(newMember.familyId)};
            let result = await this.memberColl.insertOne(newMember);
            if(!!newMember.relationshipType && newMember.relationshipType==='Child'){
                if(!!rsMember){
                    let arr = !!rsMember.children ? rsMember.children : [];
                    arr.push(result.insertedId);
                    let upResult = await this.memberColl.updateOne({_id: rsMember._id},{$set:{children: arr}});
                }
            }else if(!!newMember.relationshipType && newMember.relationshipType==='Couple'){
                if(!!rsMember){
                    let arr = !!rsMember.couple ? rsMember.couple : [];
                    arr.push(result.insertedId);
                    let upResult = await this.memberColl.updateOne({_id: rsMember._id},{$set:{couple: arr}});
                }
            }
            member = !!result.insertedId ? await this.getMember(result.insertedId) : null;
        }catch(err){console.error(err);}
        return member;
    }

    async updateMemberAvatar(memberId, avatarSrc){
        if(!this.isConnected){await this.dbInstance();}
        memberId = typeof memberId === 'string' ? ObjectId(memberId) : memberId;
        let member;
        try{
            let result = await this.memberColl.updateOne({ _id: memberId }, {$set:{ avatar: avatarSrc }});
            member = result.modifiedCount>0 ? await this.getMember(memberId) : null;
        }catch(err){console.error(err);}
        return member;
    }
}