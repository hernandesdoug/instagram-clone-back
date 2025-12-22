import express from "express";
import cors from "cors";


const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (request, response) => {
    response.send("Hello World!");
} );

app.listen(3333, () => {
    console.log("Servidor rodando");
});