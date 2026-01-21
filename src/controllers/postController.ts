import pool from "../models/pool";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Request, Response } from "express";

const postarFoto = async (request, response) => {

}

const recuperarPosts = async (request, response) => {
    
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

export {postarFoto, recuperarPosts, apagarPost} 