import jwt from "jsonwebtoken";


function verifyToken (request, response, next) {
    const header = request.headers["authorization"]; 
    const token = header && header.split(" ")[1];

    if (!token){
        return response.status(401).json(
            {
                message: "Token not provided!",
                type: "error",
            }
        )
    }
    const secretKey = process.env.JWT_SECRET_KEY as string;   
    jwt.verify(token, secretKey, (error, decoded) => {
        if (error) {
            return response.status(403).json(
            {
                message: "Expired Token!",
                type: "error",
            }
        )
        }
        request.user = decoded;
        next();
    })
}

export default verifyToken;