const ObjectId = require('mongodb').ObjectId;
const DBPool = require('./DBPool');
const Family = require('../db/Family');
const FamilyMember = require('../db/FamilyMember');

module.exports = class FamilyTree extends DBPool {
    static COLLECTIONNAME = 'FamilyTree';
    constructor(dbname){
        super();
        this.dbname = !!dbname ? dbname : DBPool.DBNAME;
        this.treeColl = this.client.db(this.dbname).collection(FamilyTree.COLLECTIONNAME);
        this.processFamily = new Family();
        this.processFamilyMember = new FamilyMember();
    }

    async makeFamilyTree(familyId){
        if(!this.isConnected){await this.dbInstance();}
        let treeObj = { _id:ObjectId(familyId) };
        let rootMember = await this.processFamilyMember.getRootMembersByFamily(familyId);
        this.members = await this.processFamilyMember.getMembersByFamily(familyId);

        let rootObj = {id: rootMember._id,
                        name: rootMember.memberName, 
                        avatar: rootMember.avatar,
                        years: `${rootMember.birth}~${rootMember.death}`};

        if(!!rootMember.couple){ rootObj = {...rootObj, couple : rootMember.couple};}
        if(!!rootMember.children){ rootObj = this.childrenTree(rootObj, rootMember.children); }
        treeObj = {...treeObj, member: rootObj};

        let result = await this.treeColl.deleteOne({ _id:ObjectId(familyId) });
        result = await this.treeColl.insertOne(treeObj);
        let tree = await this.treeColl.findOne({ _id:ObjectId(familyId) });
        return tree;
    }

    childrenTree(lastNode, children){
        let childrenArr = [];
        children.forEach(child=>{
            let childMemberArr = this.members.filter(member=>member._id.toString()===child.toString());
            let childMember = childMemberArr.length>0?childMemberArr[0]:null;
            let childObj = {id: child, 
                            name: childMember.memberName,
                            avatar: childMember.avatar,
                            years: `${childMember.birth}~${childMember.death}`};
            if(!!childMember.couple){childObj={...childObj, couple : childObj.couple }; }
            if(!!childMember.children){ childObj = this.childrenTree(childObj, childMember.children); }
            childrenArr.push({member: childObj});
        });
        lastNode = {...lastNode, children: childrenArr};
        return lastNode;
    }

    async getFamilyTree(familyId){
        if(!this.isConnected){await this.dbInstance();}
        let tree = await this.treeColl.findOne({_id:ObjectId(familyId)});
        return tree;
    }

}

