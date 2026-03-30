import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
interface TokenPayload extends JwtPayload {
    id: number;
    nome: string;
}

function verifyToken(request: Request, response: Response, next: NextFunction) {
    try {
        const header = request.headers["authorization"];
        const token = header && header.split(" ")[1];

        if (!token) {
            return response.status(401).json({
                message: "Token not provided!",
                type: "error",
            });
        }

        const secretKey = process.env.JWT_SECRET_KEY as string;
        const decoded = jwt.verify(token, secretKey) as TokenPayload;

        (request as any).user = {
            id: decoded.id,
            nome: decoded.nome
        };
        next();
    } catch (error) {
        return response.status(403).json({
            message: "Token inválido ou expirado!",
            type: "error",
        });
    }
}

export default verifyToken;