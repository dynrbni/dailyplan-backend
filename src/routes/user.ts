import { Elysia } from "elysia";
import { getAllUsersController, getUserByIdController, loginUserController, registerUserController, updateUserController, deleteUserController } from "../controllers/user";
import { registerSchema, loginSchema, updateUserSchema } from "../schemaValidation/user.schema";
import { jwtVerify } from "../middleware/jwtVerify";

export const getUserRoutes = new Elysia({
    prefix: "/users"
})
.onBeforeHandle(jwtVerify)
.get('/', async () => getAllUsersController())
.onBeforeHandle(jwtVerify)
.get('/:id', async ({params}) => getUserByIdController(params.id))

export const authUserRoutes = new Elysia()
.post('/register', async (ctx) => {
    const validation = registerSchema.safeParse(ctx.body);
    if (!validation.success) {
        return {
            status: "error",
            message: validation.error.flatten()
        }
    }
    const result = await registerUserController(ctx.body as {name: string; email: string; password: string});
    if(result.status === "success" && result.data){
        const token = await (ctx as any).jwt.sign({
            id: result.data.id,
            email:result.data.email
        })
        return {
            result: result,
            token: token,
        }
        
    }
    return result;
})
.post('/login', async (ctx) => {
    const validation = loginSchema.safeParse(ctx.body);
    if (!validation.success) {
        return {
            status: "error",
            message: validation.error.flatten()
        }
    }
    const result = await loginUserController(ctx.body as {email: string; password: string});
    if(result.status === "success" && result.data){
        const token = await (ctx as any).jwt.sign({
            id: result.data.id,
            email:result.data.email
        })
        return {
            result: result,
            token: token,
        }
    }
    return result;
})

const updateUserRoutes = new Elysia({
    prefix: "/users"
})

.onBeforeHandle(jwtVerify)
.patch('/:id', async ({params, body}) => {
    return await updateUserController(params.id, body as {name?: string; email?: string; password?: string})
})
.delete('/:id', async ({params}) => {
    return await deleteUserController(params.id)
})

const userRoutes = new Elysia()
    .use(getUserRoutes)
    .use(authUserRoutes)
    .use(updateUserRoutes)

export default userRoutes;