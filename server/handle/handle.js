const fs = require('fs');
const { SAVEIMAGEPATH, IMAGEPATH } = require('./constant');
const Family = require('../db/Family');
const FamilyMember = require('../db/FamilyMember');

const createFamily = async (req, res, next) =>{
    try{
        const familyName  = req.body.familyName;
        const showType = req.body.showType;
        // upload background-image file
        let img;
        if(!!req.files){
            img = req.files.backgroundImage;    // use the name of the input field (i.e. "background-image") to retrieve the uploaded file 
            img.mv('./uploads/' + img.name);    // use the mv() method to place the file in upload directory (i.e. "uploads")
        }
        const process = new Family();
        await process.dbInstance();
        let familyObj = {familyName: familyName,showType:showType, backgroundImage: ''};   // create family collection
        let family = await process.createFamily(familyObj);
        let imgname;
        if(!!img){
            let saveTo = SAVEIMAGEPATH + family._id;
            let imgpath = IMAGEPATH + family._id;
            imgname = `bgImg_`+img.name;
            if(!fs.existsSync(saveTo)){ fs.mkdirSync(saveTo); }
            fs.copyFileSync('./uploads/' + img.name, `${saveTo}/${imgname}`);
            let data = fs.readFileSync(`${saveTo}/${imgname}`);
            if(!!data){
                family = await process.updateBackgroundImage(family._id, `${imgpath}/${imgname}`);
            }
        }
        process.close();

        let _message = 'Family is created,' + !!img ? 'Background image is uploaded':'No background image uploaded!';
        let _bgImg = !!img ? {name:!!imgname?imgname:img.name,mimetype:img.mimetype, size:img.size} : '';
        let _data = {family: family, bgImg:_bgImg,};
        // send response
        return res.status(200).json({ status:200, message: _message, data: _data });
    }catch(err){ res.status(500).json({ status:500, error:err}) };
}

const getFamilies = async (req, res) => {
    try{
        const process = new Family();
        await process.dbInstance();
        let families = await process.getFamilies();
        process.close();
        
        let _message = `Got families of public show.`;
        !!families && families.length === 0 ?
            res.status(404).json({ status:404, message: _message, data: null }) :
            res.status(200).json({ status:200, message: _message, data: families });
    }catch(err){ res.status(500).json({ status:500, error:err}) };
}

const getMemberByFamily = async (req, res) => {
    const familyId = req.params.familyId
    try{
        const process = new FamilyMember();
        await process.dbInstance();
        let members = await process.getMembersByFamily(familyId);
        process.close();

        let _message = `Got families of public show.`;
        !!members && members.length === 0 ?
            res.status(404).json({ status:404, message: _message, data: null }) :
            res.status(200).json({ status:200, message: _message, data: members });
    }catch(err){ res.status(500).json({ status:500, error:err}) };
}

const getMemberById = async (req, res) => {
    const memberId = req.params.memberId;
    try{
        const process = new FamilyMember();
        await process.dbInstance();
        let members = await process.getMember(memberId);
        process.close();

        let _message = `Got family member by id:${memberId}.`;
        !!members && members.length === 0 ?
            res.status(404).json({ status:404, message: _message, data: null }) :
            res.status(200).json({ status:200, message: _message, data: members });
    }catch(err){ res.status(500).json({ status:500, error:err}) };
}

const createFamilyMember = async (req, res) => {
    try{
        let memberObj = {   familyId:req.body.familyId, 
                            memberName: req.body.memberName,
                            avatar : '',
                            birth: !!req.body.birth ? req.body.birth : '',
                            death: !!req.body.death ? req.body.death : '',
                            profile: !!req.body.profile ? req.body.profile : '',
                            relationshipType: !!req.body.relationshipType ? req.body.relationshipType : null,
                            relationshipWith: !!req.body.relationshipWith ? req.body.relationshipWith : null,};
        let img;
        if(!!req.files){
            img = req.files.avatar;
            img.mv('./uploads/'+img.name);
        }

        const process = new FamilyMember();
        await process.dbInstance();
        let member = await process.createFamilyMember(memberObj);
        if(!!img){
            let saveTo = SAVEIMAGEPATH + member.familyId.toString();
            let imgpath = IMAGEPATH + member.familyId.toString();
            imgname = `${member._id}`+img.name;
            fs.copyFileSync('./uploads/' + img.name, `${saveTo}/${imgname}`);
            let data = fs.readFileSync(`${saveTo}/${imgname}`);
            if(!!data){ member = await process.updateMemberAvatar(member._id, `${imgpath}/${imgname}`); }
        }
        process.close();

        let _message = `Success to create family member.`;
        !!member ? res.status(200).json({ status:200, message: _message, data: member }) :
            res.status(404).json({ status:404, message: _message, data: null });
    }catch(err){ res.status(500).json({ status:500, error:err}) };
}

module.exports  = { createFamily, getFamilies, getMemberByFamily, createFamilyMember, getMemberById, }