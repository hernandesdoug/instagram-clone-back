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
            STATUS
            ) 
            VALUES (?,?,'S')`, [seguidorId, seguindoId]);

            return response.status(201).json({
                id: result.insertId,
                isSeguindo: true,
                type: "success",
            })
        };

        const segue = rows[0];
       
        if (segue.STATUS === 'S'){
            await pool.query(
                `UPDATE USUARIO_SEGUE SET
                    STATUS = 'N'
                 WHERE SEGUINDO_ID = ?  
                `,
                [segue.SEGUINDO_ID]
            );
            return response.status(200).json({
                isSeguindo: false,
                type: "deixou de seguir",
            })
        }

        if (segue.STATUS === 'N'){
            await pool.query(
                `UPDATE USUARIO_SEGUE SET
                    STATUS = 'S'
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

export { seguirPerfil } 