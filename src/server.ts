import "dotenv/config"
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import seguirRoutes from "./routes/seguirRoutes";
import postRoutes from "./routes/postRoutes";
const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.use(userRoutes);
app.use(seguirRoutes);
app.use(postRoutes);

app.listen(3333, () => {
    console.log("Servidor rodando");
});