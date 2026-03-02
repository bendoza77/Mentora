const cloudinary = require("../config/cloudinary.js");
const fs = require('fs');


const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    resource_type: "image",
    quality: "auto",
    format: "webp",
    transformation: [
        { width: 500, height: 500, crop: "fit", gravity: "center" }
    ]
}

const imageUpload = async (folder, files) => {
    const uploadedPrimes = files.map(file => cloudinary.uploader.upload(file, { ...options, folder }));
    return Promise.all(uploadedPrimes);
}

const deleteImage = async (publicId) => {
    try {

        const result = await cloudinary.uploader.destroy(publicId);
        return result;

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    imageUpload,
    deleteImage
}