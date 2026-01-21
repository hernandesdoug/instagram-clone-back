import express from "express";
import {seguirPerfil, deixarSeguir, buscarSeguidores, buscarSeguindo} 
      from "../controllers/seguirController";

const seguirRoutes = express.Router();

seguirRoutes.post("/seguir", seguirPerfil);

seguirRoutes.delete("/seguir/:id", deixarSeguir);

seguirRoutes.get("/seguir/:id", buscarSeguidores);

seguirRoutes.get("/seguir/:id", buscarSeguindo);

export default seguirRoutes;


