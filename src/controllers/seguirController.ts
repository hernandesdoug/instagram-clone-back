import pool from "../models/pool";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Request, Response } from "express";


const seguirPerfil = async (request, response) => {
    try {
        const { seguidorId,
                seguindoId,
        } = request.body;
        const rows = `INSERT INTO USUARIO_SEGUE(
            SEGUIDOR_ID, 
            SEGUINDO_ID, 
            DATA_CRIACAO
            ) 
            VALUES (?,?,?)   
        `;
        const params = [
            seguidorId,
            seguindoId
        ];
        const [result] = await pool.query<ResultSetHeader>(rows, params);
        return response.status(201).json({
            message: result.insertId,
            type: "success",
        })
    } catch (error) {
        console.log(error);
        return response.status(500).json({
            message: "Insert Failed!",
            type: "error",
        });
    }
}

const deixarSeguir = async (request, response) => {
    try {
        const { id } = request.params;

        const [result] = await pool.query<ResultSetHeader>("DELETE FROM USUARIO_SEGUE WHERE ID = ?", [id]);

        if (result.affectedRows === 0) {
            return response.status(404).json({
                message: "Seguidor não encontrado",
                type: "error"
            });
        }

        response.status(201).json({
            message: "Você parou de seguir",
            type: "success"
        })
    } catch (error) {
        response.status(500).json({
            message: "Delete Failed!",
            type: "error",
        });
    }   
}

const buscarSeguidores = async (request, response) => {
    try {
        const { id } = request.params;
        const [rows]: any = await pool.query("SELECT COUNT(*) FROM USUARIO_SEGUE WHERE SEGUIDOR_ID = ?", [id]);
        response.status(200).json(
            rows[0] ?? null);
    } catch (error) {
        response.status(500).json({
            message: "Data recover Failed!",
            type: "error",
        });
    }
}

const buscarSeguindo = async (request, response) => {
    try {
        const { id } = request.params;
        const [rows]: any = await pool.query("SELECT COUNT(*) FROM USUARIO_SEGUE WHERE SEGUINDO_ID = ?", [id]);
        response.status(200).json(
            rows[0] ?? null);
    } catch (error) {
        response.status(500).json({
            message: "Data recover Failed!",
            type: "error",
        });
    }
}

export {seguirPerfil, deixarSeguir, buscarSeguidores, buscarSeguindo} 