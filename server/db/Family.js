const ObjectId = require('mongodb').ObjectId;
const DBPool = require('./DBPool');

module.exports = class Family extends DBPool{
    static COLLECTIONNAME = 'Family';
    constructor(dbname){
        super();
        this.dbname = !!dbname ? dbname : DBPool.DBNAME;
        this.familyColl = this.client.db(this.dbname).collection(Family.COLLECTIONNAME);
    }

    /**
     * function getFamily: 
     * Get a family document by id, from database 
     * @params: familyId - the family id
     * @returns : an family document
     *          : null when has error
     */
    async getFamily(familyId){
        if(!this.isConnected){await this.dbInstance();}
        let family;
        try{
            family = await this.familyColl.findOne({_id: ObjectId(familyId)});
        }catch(err){console.error(err);}
        return family;
    }

    /**
     * function createFamily: 
     * Create a family document, to database 
     * @params: familyObj - the family{family-name,background-image}
     * @returns : an family document
     *          : null when has error
     */
    async createFamily(familyObj){
        if(!this.isConnected){await this.dbInstance();}
        let family;
        try{
            let result = await this.familyColl.insertOne(familyObj);
            !!result.insertedId ?
                family = await this.getFamily(result.insertedId) : null;
            
        }catch(err){console.error(err);}
        return family;
    }

    /**
     * function getFamilies: 
     * Get a list of families documents by show type is public, from database 
     * @params: none
     * @returns : a list of families documents
     *          : an empty list when has error
     */
    async getFamilies(){
        if(!this.isConnected){await this.dbInstance();}
        let families = [];
        try{
            families = await this.familyColl.find().toArray();
        }catch(err){console.error(err);}
        return families;
    }
    /**
     * 
     * @returns array of families by show type is public
     */
    async getFamiliesPublic(){
        if(!this.isConnected){await this.dbInstance();}
        let families = [];
        try{
            families = await this.familyColl.find({showType:'public'}).toArray();
        }catch(err){console.error(err);}
        return families;
    }

    /**
     * 
     * @param {array of families' id} familyIds 
     * @returns array of families
     */
    async getFamiliesByids(familyIds){
        if(!this.isConnected){await this.dbInstance();}
        let families = [];
        try{
            
            families = await this.familyColl.find({_id: {$in: familyIds}}).toArray();
            let _public_families = await this.getFamiliesPublic();
            families.push(..._public_families);
        }catch(err){console.error(err);}
        return families;
    }

    /**
     * update backgroundImage's src
     * @param {*} familyId 
     * @param {*} imagePath 
     * @returns 
     */
    async updateBackgroundImage(familyId, imagePath){
        if(!this.isConnected){await this.dbInstance();}
        let family;
        try{
            let result = await this.familyColl.updateOne({_id:familyId}, {$set:{ backgroundImage: imagePath }});
            console.log(result);
            family = await this.getFamily(familyId);
        }catch(err){console.error(err);}
        return family;
    }
}