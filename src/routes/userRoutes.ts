import express from "express";
import verifyToken from "../utils/verifyToken";
import {postUserByLogin, postUser, 
        updatePerfil, deletePerfil, getUserId, getUser} 
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

userRoutes.get("/user/:usuario", verifyToken, getUserId);

userRoutes.post("/user/login", postUserByLogin);

userRoutes.post("/user", upload.single('avatar'), verifyToken, postUser);

userRoutes.put("/user/:id", upload.single('avatar'), verifyToken, updatePerfil);

userRoutes.delete("/user/:id", verifyToken, deletePerfil);

userRoutes.get("/user/search/:busca", getUser);

export default userRoutes;


