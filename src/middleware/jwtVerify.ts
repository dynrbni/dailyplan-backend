import { status } from "elysia";

export const jwtVerify = async ({ headers, jwt }: any) => {
    const authHeader = headers['authorization'];
    if (!authHeader) {
        return status(401, {
            status: "error",
            message: "Authorization header missing"
        });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return status(401, {
            status: "error",
            message: "Token missing"
        });
    }

    try {
        const decoded = await jwt.verify(token);
        (headers as any).user = decoded;
        return;
    } catch (err) {
        return status(401, {
            status: "error",
            message:  "Invalid token"
     });
    }
}