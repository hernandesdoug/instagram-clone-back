import pool from "../models/pool";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const postUserByLogin = async (request, response) => {
    try {
        const { usuario, senha } = request.body;
        console.log(request.body);
        const [rows] = await pool.query<RowDataPacket[]>("SELECT ID, NOMEUSUARIO FROM USUARIO_INSTAGRAM WHERE INFOCONTATO = ?", [usuario]);
        console.log([rows]);
        if (!usuario || !senha) {
            return response.status(400).json({
                message: "Usuario ou senha inválidos",
                type: "error",
            });
        }
        const user = rows[0];
         
        const secretKey = process.env.JWT_SECRET_KEY as string;
        
        const token = jwt.sign(
            {
            id: user.ID,
            nome: user.NOMEUSUARIO
            },
        secretKey,
        {expiresIn: "1h"}
        );

        return response.status(201).json({
            user: {
                id: user.ID,
                nome: user.NOMEUSUARIO,
            },
            token,
        })
    } catch (error) {
        return response.status(500).json({
            message: "Sign In Failed!",
            type: "error",
        });
    }
};
const postUser = async (request: Request, response: Response) => {
    try {
        const { infoContato,
            senha,
            nomeCompleto,
            nomeUsuario,
            descricaoBio
        } = request.body;
        const fotoPerfil = request.file

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
      
        const rows = `UPDATE USUARIO_INSTAGRAM SET
            INFOCONTATO = ?,
            NOMECOMPLETO = ?,
            NOMEUSUARIO = ?,
            SENHA = ?,
            DESCRICAOBIO = ?,
            FOTOPERFIL = ?      
            WHERE ID = ?
        `;

        const params = [  
            infoContato,
            nomeCompleto,
            nomeUsuario,
            senha,
            descricaoBio,
            fotoPerfil?.filename,
            id
        ];
        console.log(fotoPerfil);
        const [result] = await pool.query<ResultSetHeader>(rows, params);
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

const getUser = async (request, response) => {
    try {
        const { busca } = request.params;
        console.log(busca);
        const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM USUARIO_INSTAGRAM WHERE NOMECOMPLETO LIKE ?", [`%${busca}%`]);
        console.log([rows])
         if (rows.length === 0) {
            return response.status(404).json({
                message: "User not found",
                type: "error"
            });
        }
        const user = rows[0]
        const id = user.ID
        console.log(user);
        const imgPerfil = `http://localhost:3333/uploads/${user.FOTOPERFIL}`
        
        response.status(200).json({
            ...user, imgPerfil, id
        });           
    } catch (error) {
        console.log(error)
        response.status(500).json({
            message: "User data Failed!",
            type: "error",
        });
    }
}

const getUserId = async (request, response) => {
    try {
        const { usuario } = request.params;
        const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM USUARIO_INSTAGRAM WHERE NOMEUSUARIO = ?", [usuario]);

         if (rows.length === 0) {
            return response.status(404).json({
                message: "User not found",
                type: "error"
            });
        }
        const user = rows[0]
        const id = user.ID
        console.log(user);
        const imgPerfil = `http://localhost:3333/uploads/${user.FOTOPERFIL}`
        const [count1] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS qtde FROM USUARIO_SEGUE WHERE SEGUIDOR_ID = ?", [id]);
        const seguindo = count1[0].qtde
        const [count2] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS qtde FROM USUARIO_SEGUE WHERE SEGUINDO_ID = ?", [id]);
        const seguidores = count2[0].qtde
        response.status(200).json({
            ...user, seguindo, seguidores, imgPerfil
        });
           
    } catch (error) {
        response.status(500).json({
            message: "User data Failed!",
            type: "error",
        });
    }
}
export { postUserByLogin, postUser, updatePerfil, deletePerfil, getUserId, getUser};