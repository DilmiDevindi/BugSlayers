const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function handleImageUpload(file){
    const result =await cloudinary.uploader.upload(file,{
        resource_type:'auto'
    })
    return result;
}

module.exports = { cloudinary, upload, handleImageUpload };
