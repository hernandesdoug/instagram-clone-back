import express from "express";
import {postUserByLogin, postUser} from "../controllers/userController";

const userRoutes = express.Router();

//userRoutes.get("/user/:id", getUserById);

userRoutes.post("/user/login", postUserByLogin);

userRoutes.post("/user", postUser);

//userRoutes.put("/user/:id", updateUser);

//userRoutes.delete("/user/:id", deleteUser);

export default userRoutes;


