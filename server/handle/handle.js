const Family = require('../db/Family');
const FamilyMember = require('../db/FamilyMember');

const createFamily = async (req, res, next) =>{
    try{
        const familyName  = req.body.familyName;
        const showType = req.body.showType;
        // upload background-image file
        let img;
        if(!!req.files){
            // use the name of the input field (i.e. "background-image") to retrieve the uploaded file 
            img = req.files.backgroundImage;
            // use the mv() method to place the file in upload directory (i.e. "uploads")
            img.mv('./uploads/' + img.name);
        }
        const process = new Family();
        process.dbInstance();

        let family = {familyName: familyName,showType:showType, backgroundImage: (!!img)?`/uploads/${img.name}`:''};
        console.log(family);
        let newFamily = await process.createFamily(family);

        process.close();

        let _message = 'Family is created,' + !!img ? 'Background image is uploaded':'No background image uploaded!';
        let _bgImg = !!img ? {name:img.name,mimetype:img.mimetype, size:img.size} : '';
        let _data = {family: newFamily, bgImg:_bgImg,};
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
    try{
        const process = new FamilyMember();
        await process.dbInstance();
        let members = await process.getMembersByFamily();
        process.close();

        let _message = `Got families of public show.`;
        !!members && members.length === 0 ?
            res.status(404).json({ status:404, message: _message, data: null }) :
            res.status(200).json({ status:200, message: _message, data: members });
    }catch(err){ res.status(500).json({ status:500, error:err}) };
}

module.exports  = { createFamily, getFamilies, getMemberByFamily,}