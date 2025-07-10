import {v2 as cloudinary } from 'cloudinary';
<<<<<<< HEAD

=======
>>>>>>> d6b561af56b0ee528cc1435a0657d530b31c79fa
const connectCloudinary = async ()=>{
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
    })
}

export default connectCloudinary;