import { Elysia } from "elysia";
import { getAllTodosController, getTodoByIdController, createTodoController, updateTodoController, deleteTodoController } from "../controllers/todo";
import { createTodoSchema, updateTodoSchema } from "../schemaValidation/todo.schema";
import { jwtVerify } from "../middleware/jwtVerify";
import { TodoPriority, TodoStatus } from "@prisma/client";

export const todoRoutes = new Elysia({
    prefix: "/tasks"
})

.onBeforeHandle(jwtVerify)
.get('/', async (ctx: any) => {
    const userId = ctx.headers?.user?.id;
    if (!userId) return { status: "error", message: "Unauthorized" };
    return getAllTodosController(userId);
})
.get('/:id', async (ctx: any) => {
    const userId = ctx.headers?.user?.id;
    if (!userId) return { status: "error", message: "Unauthorized" };
    return getTodoByIdController(ctx.params.id, userId);
})
.post('/create', async (ctx: any) => {
    const validation = createTodoSchema.safeParse(ctx.body);
    if (!validation.success) {
        return {
            status: "error",
            message: validation.error.flatten()
        }
    }
    const userId = ctx.headers?.user?.id;
    if (!userId) {
        return {
            status: "error",
            message: "Unauthorized"
        }
    }
   return await createTodoController(
    ctx.body as {
        title: string;
        description?: string;
        status?: TodoStatus;
        priority?: TodoPriority;
        dueDate?: Date;
    },
    userId
   ) 
})

.patch('/:id', async (ctx: any) => {
    const validation = updateTodoSchema.safeParse(ctx.body);
    if (!validation.success) {
        return {
            status: "error",
            message: validation.error.flatten()
        }
    }
    const userId = ctx.headers?.user?.id;
    if (!userId) return { status: "error", message: "Unauthorized" };
    return await updateTodoController(ctx.params.id, userId, ctx.body as {
        title?: string;
        description?: string;
        status?: TodoStatus;
        priority?: TodoPriority;
        dueDate?: Date;
     })
})

.delete('/:id', async (ctx: any) => {
    const userId = ctx.headers?.user?.id;
    if (!userId) return { status: "error", message: "Unauthorized" };
    return await deleteTodoController(ctx.params.id, userId)
})

export default todoRoutes;