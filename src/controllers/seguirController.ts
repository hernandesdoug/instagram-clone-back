import pool from "../models/pool";
import { RowDataPacket, ResultSetHeader } from "mysql2";

const seguirPerfil = async (request, response) => {
    try {
        const { idUsuario, usuarioId } = request.body;
        const seguidorId = Number(usuarioId);
        const seguindoId = idUsuario;

        const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM USUARIO_SEGUE  WHERE SEGUIDOR_ID = ? AND SEGUINDO_ID = ?", [seguidorId, seguindoId]);

        if (rows.length === 0) {
            const [result] = await pool.query<ResultSetHeader>(
                `INSERT INTO USUARIO_SEGUE(
            SEGUIDOR_ID, 
            SEGUINDO_ID, 
            IND_STATUS
            ) 
            VALUES (?,?,'S')`, [seguidorId, seguindoId]);

            return response.status(201).json({
                id: result.insertId,
                isSeguindo: true,
                type: "success",
            })
        }
        const segue = rows[0];

        if (segue.IND_STATUS === 'S') {
            await pool.query(
                `UPDATE USUARIO_SEGUE SET
                    IND_STATUS = 'N'
                 WHERE SEGUINDO_ID = ?  
                `,
                [segue.SEGUINDO_ID]
            );
            return response.status(200).json({
                isSeguindo: false,
                type: "deixou de seguir",
            })
        }

        if (segue.IND_STATUS === 'N') {
            await pool.query(
                `UPDATE USUARIO_SEGUE SET
                    IND_STATUS = 'S'
                 WHERE SEGUINDO_ID = ?  
                `,
                [segue.SEGUINDO_ID]
            );
            return response.status(200).json({
                isSeguindo: true,
                type: "seguindo novamente",
            })
        }

    } catch (error) {
        console.log(error);
        return response.status(500).json({
            message: "Insert Failed!",
            type: "error",
        });
    }
}

const buscaSeguindo = async (request, response) => {
    try {
        const { id } = request.params;

        const [rows] = await pool.query<RowDataPacket[]>("SELECT NOMECOMPLETO, NOMEUSUARIO, FOTOPERFIL, IND_STATUS FROM USUARIO_INSTAGRAM JOIN USUARIO_SEGUE ON SEGUIDOR_ID = ? WHERE ID = SEGUINDO_ID AND IND_STATUS = 'S'", [id]);

        response.status(200).json(rows);
    } catch (error) {
        console.log(error);
        return response.status(500).json({
            message: "Fetch Failed!",
            type: "error",
        });
    }
}

const buscaSeguidores = async (request, response) => {
    try {
        const { id } = request.params;

        const [rows] = await pool.query<RowDataPacket[]>("SELECT NOMECOMPLETO, NOMEUSUARIO, FOTOPERFIL, IND_STATUS FROM USUARIO_INSTAGRAM JOIN USUARIO_SEGUE ON SEGUINDO_ID = ? WHERE ID = SEGUIDOR_ID AND IND_STATUS = 'S'", [id]);

        response.status(200).json(rows);
    } catch (error) {
        console.log(error);
        return response.status(500).json({
            message: "Fetch Failed!",
            type: "error",
        });
    }
}

export { seguirPerfil, buscaSeguidores, buscaSeguindo } 