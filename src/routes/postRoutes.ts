import express from "express";
import {postarFoto, recuperarPosts, apagarPost} 
      from "../controllers/postController";
import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = "./uploads";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const filename = file?.originalname.split(" ").join("-")
        cb(null, filename);
    }

})
const upload = multer({ storage })

const postRoutes = express.Router();

postRoutes.get("/post/", recuperarPosts);

postRoutes.post("/post", upload.single('avatar'), postarFoto);

postRoutes.delete("/post/:id", apagarPost);

export default postRoutes;


