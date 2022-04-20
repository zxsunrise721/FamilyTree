const MappingUserFamilies = require('../db/MappingUserFamilies');
const { sendResponse } = require('../helper');

/**
 * get all mappings
 * @param {*} req 
 * @param {*} res 
 */
const getMappings = async (req,res) =>{
    try{
        const process = new MappingUserFamilies();
        await process.dbInstance();
        let mappings = await process.getMappings();
        process.close();
        !!mappings.length>0 ?
            sendResponse(res, 200, mappings, 'success to get all mappings'):
            sendResponse(res, 404, null, 'no any mapping found');
    }catch(err){console.error(err);}
}

/**
 * get mapping by mapping id
 * @param {*} req 
 * @param {*} res 
 */
const getMapping = async (req,res) =>{
    const id = req.params.id;
    try{
        const process = new MappingUserFamilies();
        await process.dbInstance();
        let mapping = await process.getMapping(id);
        process.close();
        !!mapping ?
            sendResponse(res, 200, mapping, 'success to get mapping'):
            sendResponse(res, 404, null, 'no mapping found');
    }catch(err){console.error(err);}
}

/**
 * get mapping by user
 * @param {*} req 
 * @param {*} res 
 */
const getMappingByUser = async (req,res) =>{
    const userId = req.params.userId;
    try{
        const process = new MappingUserFamilies();
        await process.dbInstance();
        let mapping = await process.getMappingByUser(userId);
        process.close();
        !!mapping ?
            sendResponse(res, 200, mapping, `success to get mapping by user:${userId}`):
            sendResponse(res, 404, null, `no mapping found  by user:${userId}`);
    }catch(err){console.error(err);}
}

/**
 * create a mapping with new user
 * @param {*} req 
 * @param {*} res 
 */
const createMappingByUser = async (req,res) =>{
    const newMapping = req.body;
    try{
        const process = new MappingUserFamilies();
        await process.dbInstance();
        // find a mapping by user
        let mapping = await process.getMappingByUser(newMapping.userId);
        if(!!mapping){      // if exists
            console.log('update exists!!');
            console.log('user:',newMapping.userId,'families:',newMapping.familyIds);
            mapping = await process.updateMappingByUser(newMapping.userId, newMapping.familyIds);
        }else{ 
            console.log('create new!!')
            mapping = await process.newMapping(newMapping);
        }
        process.close();
        !!mapping ?
            sendResponse(res, 200, mapping, `success to get mapping by user:${newMapping.userId}`):
            sendResponse(res, 404, null, `no mapping found  by user:${newMapping.userId}`);
    }catch(err){console.error(err);}
}

module.exports = { getMappings, getMapping, getMappingByUser, createMappingByUser};