import pool from "../models/pool";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Request, Response } from "express";

const postUserByLogin = async (request, response) => {
    try {
        const { usuario, senha } = request.body;
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
const postUser = async (request: Request, response: Response) => {
    try {
        const { usuario,
            senha,
            nomeCompleto,
            nomeUsuario,
            descricaoBio
        } = request.body;
        const fotoPerfil = request.file

        const rows = `INSERT INTO USUARIO_INSTAGRAM(
            USUARIO, 
            SENHA, 
            NOMECOMPLETO, 
            NOMEUSUARIO,
            DESCRICAOBIO,
            FOTOPERFIL
            ) 
            VALUES (?,?,?,?,?,?)   
        `;

        const params = [
            usuario,
            senha,
            nomeCompleto,
            nomeUsuario,
            descricaoBio,
            fotoPerfil?.filename
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

const updatePerfil = async (request, response) => {
    try {
        const { id } = request.params;

        const { usuario,
            senha,
            nomeCompleto,
            nomeUsuario,
            descricaoBio
        } = request.body;
        const fotoPerfil = request.file

        const rows = `UPDATE USUARIO_INSTAGRAM SET
            USUARIO = ?, 
            SENHA = ?, 
            NOMECOMPLETO = ?, 
            NOMEUSUARIO = ?,
            DESCRICAOBIO = ?,
            FOTOPERFIL = ?   
            WHERE ID = ?
        `;

        const params = [
            usuario,
            senha,
            nomeCompleto,
            nomeUsuario,
            descricaoBio,
            fotoPerfil?.filename,
            id
        ];

        const [result] = await pool.query<ResultSetHeader>(rows, params);

        if (result.affectedRows === 0) {
            return response.status(404).json({
                message: "Usuario nao encontrado"
            });
        }
    } catch (error) {
        response.status(500).json({
            message: "Update failed!",
            type: "error",
        });
    }
}

const deletePerfil = async (request, response) => {
    try {
        const { id } = request.params;

        const [result] = await pool.query<ResultSetHeader>("DELETE FROM COMPANIES WHERE ID = ?", [id]);

        if (result.affectedRows === 0) {
            return response.status(404).json({
                message: "User not found",
                type: "error"
            });
        }

        response.status(201).json({
            message: "User deleted successfully",
            type: "success"
        })
    } catch (error) {
        response.status(500).json({
            message: "Delete Failed!",
            type: "error",
        });
    }
}

const getUserId = async (request, response) => {
    try {
        const { id } = request.params;
        const [rows]: any = await pool.query("SELECT * FROM USUARIO_INSTAGRAM WHERE ID = ?", [id]);
    response.status(200).json(rows[0] ?? null);
    } catch (error) {
        response.status(500).json({
            message: "Delete Failed!",
            type: "error",
        });
    }
}
export { postUserByLogin, postUser, updatePerfil, deletePerfil, getUserId};