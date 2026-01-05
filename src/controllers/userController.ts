import {User} from "../models/user"
import pool from "../models/pool";
import { RowDataPacket, ResultSetHeader } from "mysql2";


const postUserByLogin = async (request, response) => {
    try {
       
        const { usuario, senha } = request.body;
         console.log(request.body);
        const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM USUARIO_INSTAGRAM WHERE USUARIO = ?", [usuario]);

        if (rows.length === 0) {
            return response.status(400).json({
                message: "Usuario ou senha inválidos",
                type: "error",
            });
        }
        return response.status(201).json({
            message: "Login OK!",
            type: "success",
        }
)
    } catch (error) {
        return response.status(500).json({
            message: "Sign In Failed!",
            type: "error",
        });
    }
};
const postUser = async (request, response) => {
    try {
        const { usuario, senha , nomeCompleto, nomeUsuario} = request.body;
        const rows = `INSERT INTO USUARIO_INSTAGRAM(
            USUARIO, 
            SENHA, 
            NOMECOMPLETO, 
            NOMEUSUARIO
            ) 
            VALUES (?,?,?,?)   
        `;
         
        const params = [
            usuario, 
            senha, 
            nomeCompleto, 
            nomeUsuario
        ];

        const [result] = await pool.query<ResultSetHeader>(rows, params);

        return response.status(201).json({
            message: result.insertId,
            type: "success",
        })

    } catch (error) {
        console.log(error);
        return response.status(500).json({
            message: "Sign In Failed!",
            type: "error",
        });
    }
};
export {postUserByLogin, postUser};