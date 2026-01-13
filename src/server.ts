import "dotenv/config"
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.use(userRoutes);

app.listen(3333, () => {
    console.log("Servidor rodando");
});