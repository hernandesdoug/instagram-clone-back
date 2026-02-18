import express from "express";
import {seguirPerfil} from "../controllers/seguirController";

const seguirRoutes = express.Router();

seguirRoutes.post("/seguir", seguirPerfil);

export default seguirRoutes;


