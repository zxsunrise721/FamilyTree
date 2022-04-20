const fs = require('fs');
const _ = require('lodash');

/***************This is the test service *******************/
uploadFile = (req, res, next) =>{
    console.log(req);
    const {file} = req.file;
    fs.readFile(file.path, function(err,date){
        fs.writeFile(`${UPLOAD_PATH}/${file.originalname}`, data, function(err){
            if(err)res.json({err})
            res.json({message:'Success to upload'});
        });
    });
}

uploadAvatar = async (req, res, next) =>{
    try{
        if(!req.files){console.log('No file uploaded!'); return res.send({status:false, message:'No file uploaded!'});}
        // use the name of the input field (i.e. "avatar") to retrieve the uploaded file 
        let avatar = req.files.avatar;
        // use the mv() method to place the file in upload directory (i.e. "uploads")
        avatar.mv('./uploads/' + avatar.name);
        // send response
        return res.status(200).json({status:true, message:'File is uploaded', data:{name:avatar.name,mimetype:avatar.mimetype, size:avatar.size}});
    }catch(err){res.status(500).send(err)};
}

uploadPhotos = async (req, res) =>{
    try{
        if(!req.files){return res.send({status:false, message:'No file uploaded!'});}
        let data = [];
        _.forEach(_.keysIn(req.files.photos),(key)=>{
            let photo = req.files.photos[key];
            photo.mv('./uploads/' + photo.name);
            data.push({name:photo.name, mimetype:photo.mimetype, size:photo.size});
        });
        return res.status(200).json({status:true,message:'Files are uploaded!', data: data});
    }catch(err){res.status(500).send(err)};
}

module.exports = {uploadFile, uploadAvatar, uploadPhotos, }