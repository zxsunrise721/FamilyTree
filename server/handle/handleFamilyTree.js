const Family = require('../db/Family');
const FamilyMember = require('../db/FamilyMember');
const FamilyTree = require('../db/FamilyTree');

/**
 * get a family tree, when the database not exists, create it.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getFamilyTree = async (req, res, next) => {
    const familyId = req.params.familyId;

    let process = new FamilyTree();
    await process.dbInstance();
    let tree = await process.getFamilyTree(familyId);
    if(!!!tree){ tree = await process.makeFamilyTree(familyId); }
    process.close();
    !!tree ?
        res.status(200).json({status:200,data:tree,message:`Got family tree by ${familyId}`}) :
        res.status(404).json({status:404,data:null, message:'create family tree failed!'});
}

/**
 * create a new family tree
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const createFamilyTree = async (req,res,next) =>{
    const familyId = req.params.familyId;
    let process = new FamilyTree();
    await process.dbInstance();
    let tree = await process.makeFamilyTree(familyId);
    process.close();
    res.status(200).json({status:200,data:tree,message:`Got family tree by ${familyId}`});
}

module.exports = {getFamilyTree, createFamilyTree,}