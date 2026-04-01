import pool from "../models/pool";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const postUserByLogin = async (request, response) => {
    try {
        const { usuario, senha } = request.body;

        const [rows] = await pool.query<RowDataPacket[]>("SELECT ID, NOMEUSUARIO, SENHA, FOTOPERFIL FROM USUARIO_INSTAGRAM WHERE INFOCONTATO = ?", [usuario]);

        if (!usuario || !senha) {
            return response.status(400).json({
                message: "Usuario ou senha inválidos",
                type: "error",
            });
        }
        const user = rows[0];

        const isPasswordValid = await bcrypt.compare(senha, user.SENHA);
        if (!isPasswordValid) {
            return response.status(400).json({
                message: "senha incorreta!",
                type: "error",
            });
        }

        const secretKey = process.env.JWT_SECRET_KEY as string;

        const token = jwt.sign(
            {
                id: user.ID,
                nome: user.NOMEUSUARIO
            },
            secretKey,
            { expiresIn: "3h" }
        );

        return response.status(201).json({
            user: {
                id: user.ID,
                nome: user.NOMEUSUARIO,
                foto: user.FOTOPERFIL
            },
            token,
        })
    } catch (error) {
        return response.status(500).json({
            message: "Sign In Failed!",
            type: "error",
        });
    }
}
const postUser = async (request: Request, response: Response) => {
    try {
        const { infoContato,
            senha,
            nomeCompleto,
            nomeUsuario,
            descricaoBio
        } = request.body;
        const fotoPerfil = request.file

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(senha, saltRounds);

        const rows = `INSERT INTO USUARIO_INSTAGRAM(
            INFOCONTATO, 
            SENHA, 
            NOMECOMPLETO, 
            NOMEUSUARIO,
            DESCRICAOBIO,
            FOTOPERFIL
            ) 
            VALUES (?,?,?,?,?,?)   
        `;

        const params = [
            infoContato,
            hashedPassword,
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

const updatePerfil = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        const {
            infoContato,
            nomeCompleto,
            nomeUsuario,
            senha,
            descricaoBio
        } = request.body;
        const fotoPerfil = request.file;

        let sql = `UPDATE USUARIO_INSTAGRAM SET
            INFOCONTATO = ?,
            NOMECOMPLETO = ?,
            NOMEUSUARIO = ?,
            SENHA = ?,
            DESCRICAOBIO = ?
        `;
        if (fotoPerfil) {
            sql = sql + ',FOTOPERFIL = ?'
        }
        sql = sql + 'WHERE ID = ?'

        let params = [
            infoContato,
            nomeCompleto,
            nomeUsuario,
            senha,
            descricaoBio
        ];
        if (fotoPerfil) {
            params.push(fotoPerfil?.filename)
        }
        params.push(id);

        const [result] = await pool.query<ResultSetHeader>(sql, params);
        console.log(result);
        if (result.affectedRows === 0) {
            return response.status(404).json({
                message: "Usuario nao encontrado"
            });
        }
        response.status(200).json({
            message: "Dados alterados!",
            type: "success",
        });
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

        const [result] = await pool.query<ResultSetHeader>("DELETE FROM USUARIO_INSTAGRAM WHERE ID = ?", [id]);

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

const getUser = async (request, response) => {
    try {
        const { busca } = request.params;
        const [rows] = await pool.query<RowDataPacket[]>("SELECT ID, FOTOPERFIL, NOMEUSUARIO, NOMECOMPLETO FROM USUARIO_INSTAGRAM WHERE NOMEUSUARIO LIKE ?", [`%${busca}%`]);

        response.status(200).json(rows);
    } catch (error) {
        console.log(error)
        response.status(500).json({
            message: "User data Failed!",
            type: "error",
        });
    }
}

const getUserId = async (request: Request, response: Response) => {
    try {
        const { usuario } = request.params;
        const usuarioLogado = (request as any).user.id;

        const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM USUARIO_INSTAGRAM WHERE NOMEUSUARIO = ?", [usuario]);

        if (rows.length === 0) {
            return response.status(404).json({
                message: "User not found",
                type: "error"
            });
        }
        const user = rows[0]
        const id = user.ID

        const [count1] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS qtde FROM USUARIO_SEGUE WHERE SEGUIDOR_ID = ? AND IND_STATUS = 'S'", [id]);
        const seguindo = count1[0].qtde
        const [count2] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS qtde FROM USUARIO_SEGUE WHERE SEGUINDO_ID = ? AND IND_STATUS = 'S'", [id]);
        const seguidores = count2[0].qtde
        const [count3] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS qtde FROM USUARIO_FOTOS WHERE USUARIO_ID = ?", [id]);
        const postagens = count3[0].qtde

        const [verifica] = await pool.query<RowDataPacket[]>(
            `SELECT COUNT(*) AS qtde
                    FROM USUARIO_SEGUE
            WHERE SEGUIDOR_ID = ? AND SEGUINDO_ID = ? AND IND_STATUS = 'S'`,
            [usuarioLogado, id]);
        const isSeguindo = verifica[0].qtde > 0;

        response.status(200).json({
            ...user, seguindo, seguidores, postagens, isSeguindo
        });

    } catch (error) {
        response.status(500).json({
            message: "User data Failed!",
            type: "error",
        });
    }
}
const updatePassword = async (request, response) => {
    try {
        const { novaSenha } = request.body;
        const { id } = request.params;
         if (!id || !novaSenha) {
            return response.status(400).json({
                message: "Dados obrigatórios não enviados",
                type: "error",
            });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(novaSenha, saltRounds);

        await pool.query(
            `UPDATE USUARIO_INSTAGRAM SET
                SENHA = ?
            WHERE ID = ?
            `, [hashedPassword, id]
        )
        response.status(201).json({
            message: "Senha alterada com sucesso!",
            type: "success"
        })
       
    } catch (error) {
        console.log(error)
        response.status(500).json({
            message: "User data Failed!",
            type: "error",
        });
    }
}

export { postUserByLogin, postUser, updatePerfil, deletePerfil, getUserId, getUser, updatePassword };