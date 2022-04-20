const ObjectId = require('mongodb').ObjectId;
const DBPool = require('./DBPool');

module.exports = class FamilyMember extends DBPool {
    static COLLECTIONNAME = 'FamilyMember';
    constructor(dbname){
        super();
        this.dbname = !!dbname ? dbname : DBPool.DBNAME;
        this.memberColl = this.client.db(this.dbname).collection(FamilyMember.COLLECTIONNAME);
    }

    /**
     * 
     * @param {*} familyId 
     * @returns members by family
     */
    async getMembersByFamily(familyId){
        if(!this.isConnected){await this.dbInstance();}
        familyId = typeof familyId === 'string' ? ObjectId(familyId) : familyId;
        let members = [];
        try{
            members = await this.memberColl.find({familyId: familyId}).toArray();
        }catch(err){console.error(err);}
        return members;
    }

    /**
     * 
     * @param {*} familyId 
     * @returns the root of member by family
     */
    async getRootMembersByFamily(familyId){
        if(!this.isConnected){await this.dbInstance();}
        familyId = typeof familyId === 'string' ? ObjectId(familyId) : familyId;
        let member;
        try{
            member = await this.memberColl.findOne({familyId: familyId, relationshipType: 'Root'});
        }catch(err){console.error(err);}
        return member;
    }

    /**
     * 
     * @param {*} memberId 
     * @returns member with his id
     */
    async getMember(memberId){
        if(!this.isConnected){await this.dbInstance();}
        memberId = typeof memberId === 'string' ? ObjectId(memberId) : memberId;
        let member;
        try{
            member = await this.memberColl.findOne({ _id: memberId });
        }catch(err){console.error(err);}
        return member;
    }

    /**
     * 
     * @param {*} memberId 
     * @returns member's relation members
     */
    async getRelationMember(memberId){
        if(!this.isConnected){await this.dbInstance();}
        memberId = typeof memberId === 'string' ? ObjectId(memberId) : memberId;
        let members = [];
        try{
            members = await this.memberColl.find({ relationshipWith: memberId }).toArray();
        }catch(err){console.error(err);}
        return members;
    }

    /**
     * create member in family
     * @param {*} newMember 
     * @returns new member
     */
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

    /**
     * update member's infomation in current family
     * @param {*} newMember 
     * @returns an updated member
     */
    async updateFamilyMember(newMember){
        if(!this.isConnected){await this.dbInstance();}
        let member;
        let _id = newMember._id;
        try{
            let rsMember;
            if(!!newMember.relationshipWith && ObjectId.isValid(newMember.relationshipWith)){
                rsMember = await this.getMember(newMember.relationshipWith);
                newMember =  {...newMember, relationshipWith: !!rsMember ? rsMember._id: null,
                                            relationship:{ rsMemberId: rsMember._id, rsMemberName: rsMember.memberName } }
            }
            // get member info before updating, get the old relationshipType and relationshipWith
            member = await this.getMember(newMember._id);
            let oldRsType = member.relationshipType;
            let oldRsWith = member.relationshipWith;
            // update member
            delete newMember._id;
            let result = await this.memberColl.updateOne({_id: ObjectId(_id)},{$set: newMember});
            // processing relationship
            if(!!newMember.relationshipType && newMember.relationshipType==='Child'){
                if(!!rsMember){
                    let arr = !!rsMember.children ? rsMember.children : [];
                    arr.push(newMember._id);
                    let upResult = await this.memberColl.updateOne({_id: rsMember._id},{$set:{children: arr}});
                }
            }else if(!!newMember.relationshipType && newMember.relationshipType==='Couple'){
                if(!!rsMember){
                    let arr = !!rsMember.couple ? rsMember.couple : [];
                    arr.push(newMember._id);
                    let upResult = await this.memberColl.updateOne({_id: rsMember._id},{$set:{couple: arr}});
                }
            }
            member = !!result.modifiedCount>0 ? await this.getMember(_id) : null;
        }catch(err){console.error(err);}
        return member;
    }

    /**
     * update member's avatar src
     * @param {*} memberId 
     * @param {*} avatarSrc 
     * @returns an updated member
     */
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