import express from "express";
import {postUserByLogin, postUser, 
        updatePerfil, deletePerfil, getUserId} 
      from "../controllers/userController";
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

const userRoutes = express.Router();

userRoutes.get("/user/:usuario", getUserId);

userRoutes.post("/user/login", postUserByLogin);

userRoutes.post("/user", upload.single('avatar'), postUser);

userRoutes.put("/user/:id", upload.single('avatar'), updatePerfil);

userRoutes.delete("/user/:id", deletePerfil);

export default userRoutes;


