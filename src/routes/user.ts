import { Elysia } from "elysia";
import { getAllUsersController, getUserByIdController, loginUserController, registerUserController, updateUserController, deleteUserController } from "../controllers/user";

export const getUserRoutes = new Elysia({
    prefix: "/users"
})

.get('/', async () => getAllUsersController())
.get('/:id', async ({params}) => getUserByIdController(params.id))

export const authUserRoutes = new Elysia()

.post('/register', async (ctx) => 
    await registerUserController(ctx.body as {name: string; email: string; password: string}
))
.post('/login', async (ctx) => 
    await loginUserController(ctx.body as {email: string; password: string})
)

const updateUserRoutes = new Elysia({
    prefix: "/users"
})

.put('/:id', async ({params, body}) => {
    return await updateUserController(params.id, body as {name: string; email: string; password: string})
})

.delete('/:id', async ({params}) => {
    return await deleteUserController(params.id)
})

const userRoutes = new Elysia()
    .use(getUserRoutes)
    .use(authUserRoutes)
    .use(updateUserRoutes)

export default userRoutes;