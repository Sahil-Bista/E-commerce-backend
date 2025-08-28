import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudConfig.js";

const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : {
        folder : 'image folder',
        //this means no matter what yhe original file type isFinite, it will be ocnverted to a PNG format before storing
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        public_id : (req, file) => `file-${Date.now()}`
    }
});

const parser = multer({storage : storage});
export default parser;
