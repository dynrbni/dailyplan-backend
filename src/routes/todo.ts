import { Elysia } from "elysia";
import { getAllTodosController, getTodoByIdController, createTodoController, updateTodoController, deleteTodoController } from "../controllers/todo";
import { createTodoSchema, updateTodoSchema } from "../schemaValidation/todo.schema";
import { jwtVerify } from "../middleware/jwtVerify";
import { TodoPriority, TodoStatus } from "@prisma/client";

export const todoRoutes = new Elysia({
    prefix: "/tasks"
})

.onBeforeHandle(jwtVerify)
.get('/', async () => getAllTodosController())
.get('/:id', async ({params}) => getTodoByIdController(params.id))
.post('/create', async (ctx: any) => {
    const validation = createTodoSchema.safeParse(ctx.body);
    if (!validation.success) {
        return {
            status: "error",
            message: validation.error.flatten()
        }
    }
    const user = jwtVerify(ctx);
    if (!user) {
        return {
            status: "error",
            message: "Unauthorized"
        }
    }
   return await createTodoController(
    ctx.body as {
        title: string;
        description: string;
        status?: TodoStatus;
        priority: TodoPriority;
        dueDate?: Date;
    },
    (ctx).headers.user.id
   ) 
})

.patch('/:id', async ({params, body}) => {
    const validation = updateTodoSchema.safeParse(body);
    if (!validation.success) {
        return {
            status: "error",
            message: validation.error.flatten()
        }
    }
    return await updateTodoController(params.id, body as {
        title?: string;
        description?: string;
        status?: TodoStatus;
        priority?: TodoPriority;
        dueDate?: Date;
     })
})

.delete('/:id', async ({params}) => {
    return await deleteTodoController(params.id)
})

export default todoRoutes;