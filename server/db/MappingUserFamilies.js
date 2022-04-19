const ObjectId = require('mongodb').ObjectId;
const DBPool = require('./DBPool');

module.exports = class MappingUserFamilies extends DBPool {
    static COLLECTIONNAME = 'Mapping_User_Family';
    constructor(dbname){
        super();
        this.dbname = !!dbname ? dbname : DBPool.DBNAME;
        this.mappingColl = this.client.db(this.dbname).collection(MappingUserFamilies.COLLECTIONNAME);
    }

    async getMappings(){
        if(!this.isConnected){await this.dbInstance();}
        let mappings = [];
        mappings = await this.mappingColl.find().toArray();
        return mappings;
    }

    async getMapping(_id){
        if(!this.isConnected){await this.dbInstance();}
        _id = typeof _id=== 'string' ? ObjectId(_id) : _id; 
        let mapping;
        mapping = await this.mappingColl.findOne({_id: _id});
        return mapping;
    }

    async getMappingByUser(userId){
        if(!this.isConnected){await this.dbInstance();}
        userId = typeof userId === 'string' ? ObjectId(userId) : userId;
        let mapping = await this.mappingColl.findOne({userId: userId});
        return mapping;
    }

    async newMapping(newMapping){
        if(!this.isConnected){await this.dbInstance();}
        let mapping;
        newMapping = {...newMapping, 
                        userId: ObjectId(newMapping.userId), 
                        familyIds:[ObjectId(...newMapping.familyIds)]};
        let result = await this.mappingColl.insertOne(newMapping);
        if(!!result.insertedId){ 
            mapping = await this.mappingColl.findOne({_id: result.insertedId});
        }
        return mapping;
    }

    async updateMappingByUser(userId, familyIds){
        if(!this.isConnected){await this.dbInstance();}
        let mapping;
        userId = typeof userId === 'string' ? ObjectId(userId) : userId;
        mapping = await this.getMappingByUser(userId);
        let families = mapping.familyIds;
        let addIds = [];
        familyIds.forEach(id =>{
            let match = families.filter(family=>family.toString()===id);
            if(match.length==0){addIds.push(id);}
        });
        if(addIds.length===0){ return mapping; }
        addIds = [...families, ObjectId(...addIds)];
        let result = await this.mappingColl.updateOne({userId: userId}, {$set: {familyIds: addIds}});
        if(result.modifiedCount>0){
            mapping = await this.getMappingByUser(userId);
        }
        return mapping;
    }

    async updateMapping(_id, familyIds){
        if(!this.isConnected){await this.dbInstance();}
        let mapping;
        _id = typeof _id === 'string' ? ObjectId(_id) : _id;
        familyIds = [ObjectId(...familyIds)];
        let result = await this.mappingColl.updateOne({_id: _id}, {$set: {familyIds: familyIds}});
        if(result.modifiedCount>0){
            mapping = await this.getMapping(_id);
        }
        return mapping;
    }
}