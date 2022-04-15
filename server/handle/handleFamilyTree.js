const Family = require('../db/Family');
const FamilyMember = require('../db/FamilyMember');
const FamilyTree = require('../db/FamilyTree');

const getFamilyTree = async (req, res, next) => {
    const familyId = req.params.familyId;

    let process = new FamilyTree();
    await process.dbInstance();
    let tree = await process.getFamilyTree(familyId);

    process.close();
    res.status(200).json({status:200,data:tree});
}

const createFamilyTree = async (req,res,next) =>{
    const familyId = req.params.familyId;
    let process = new FamilyTree();
    await process.dbInstance();
    let tree;
    tree = await process.makeFamilyTree(familyId);

    process.close();
    res.status(200).json({status:200,data:tree});
}

module.exports = {getFamilyTree, createFamilyTree,}