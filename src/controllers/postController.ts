import pool from "../models/pool";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Request, Response } from "express";

const postarFoto = async (request, response) => {
    try {
        const { usuarioId,
            legendaFoto
        } = request.body;
        const fotoPostagem = request.file;

        const rows = `INSERT INTO USUARIO_FOTOS(
            FOTO_POSTAGEM, 
            USUARIO_ID, 
            DATA_CRIACAO,
            LEGENDA_FOTO
            ) 
            VALUES (?,?,?,?)    
        `;

        const params = [
            usuarioId,
            legendaFoto,
            fotoPostagem?.filename
        ];

        const [result] = await pool.query<ResultSetHeader>(rows, params);

        return response.status(201).json({
            message: result.insertId,
            type: "success",
        })

    } catch (error) {
        console.log(error);
        return response.status(500).json({
            message: "Post Failed!",
            type: "error",
        });
    }
}

const recuperarPosts = async (request, response) => {
    try {
        
        const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM USUARIO_FOTOS");

        if (rows.length === 0) {
            return response.status(404).json({
                message: "Posts not found",
                type: "error"
            });
        }
        const posts = rows[0]

        response.status(200).json({
            ...posts
        });

    } catch (error) {
        response.status(500).json({
            message: "User data Failed!",
            type: "error",
        });
    }
}

const apagarPost = async (request, response) => {
    try {
        const { id } = request.params;

        const [result] = await pool.query<ResultSetHeader>("DELETE FROM USUARIO_FOTOS WHERE ID = ?", [id]);

        if (result.affectedRows === 0) {
            return response.status(404).json({
                message: "Post not found",
                type: "error"
            });
        }

        response.status(201).json({
            message: "Post deleted successfully",
            type: "success"
        })
    } catch (error) {
        response.status(500).json({
            message: "Delete Failed!",
            type: "error",
        });
    }
}

export { postarFoto, recuperarPosts, apagarPost } 