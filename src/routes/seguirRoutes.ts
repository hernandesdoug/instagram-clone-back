import express from "express";
import { seguirPerfil, buscaSeguidores, buscaSeguindo} from "../controllers/seguirController";

const seguirRoutes = express.Router();

seguirRoutes.post("/seguir", seguirPerfil);

seguirRoutes.get("/seguir/seguidores/:id", buscaSeguidores);

seguirRoutes.get("/seguir/seguindo/:id", buscaSeguindo);

export default seguirRoutes;
