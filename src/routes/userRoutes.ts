import express from "express";
import {postUserByLogin, postUser} from "../controllers/userController";
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
        const filename = file?.originalname.split(" ").join("-");
        cb(null, filename);
    }

})
const upload = multer({ storage })

const userRoutes = express.Router();

//userRoutes.get("/user/:id", getUserById);

userRoutes.post("/user/login", postUserByLogin);

userRoutes.post("/user", upload.single('avatar'), postUser);

//userRoutes.put("/user/:id", upload.single('avatar'), updateUser);

//userRoutes.delete("/user/:id", deleteUser);

export default userRoutes;


