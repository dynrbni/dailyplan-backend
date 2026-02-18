import prisma from "../database/prismaClient";
import { TodoStatus, TodoPriority } from "@prisma/client";

//get all todos/tasks
export const getAllTodosController = async () => {
    try {
        const todos = await prisma.todo.findMany({
            where:{
                deletedAt: null
            }
         })
        return {
            status: "success",
            data: todos
        }
    } catch (error) {
        console.error("Error fetching todos:", error);
        throw error;
    }
}

//get todo/task by id
export const getTodoByIdController = async (id: string) => {
    try {
        const todo = await prisma.todo.findFirst({
            where: {
                id,
            }
        })
        if (!todo) {
            return{
                status: "error",
                message: "Todo not found"
            }
        }
        return {
            status: "success",
            data: todo
        }
    } catch (error) {
        console.error("Error fetching todo by ID:", error);
        throw error;
    }
}

// create todo/task
export const createTodoController = async (options: { title: string; description: string; status?: TodoStatus; priority: TodoPriority; dueDate?: Date; }, id: any) => {
    try {
        const newTodo = await prisma.todo.create({
            data: {
                title: options.title,
                description: options.description,
                status: options.status ?? TodoStatus.PENDING,
                priority: options.priority ?? TodoPriority.MEDIUM,
                //convert date string ke date object
                dueDate: options.dueDate 
                ? new Date(options.dueDate) : undefined,
                userId: id
            }
        })
        return {
            status: "success",
            data: {
                 ...newTodo, 
                 userId: id 
            }
        }
    } catch (error) {
        console.error("Error creating todo:", error);
        throw error;
    }
}

//update todo/task (patch)
export const updateTodoController = async (id: string, options: { title?: string; description?: string; status?: TodoStatus; priority?: TodoPriority; dueDate?: Date; }) => {
    try {
        const existingTodo = await prisma.todo.findFirst({
            where: {
                id
            }
        })
        if (!existingTodo){
            return {
                status: "error",
                message: "Todo not found"
            }
        }
        const updatedTodo = await prisma.todo.update({
            where: {
                id
            },
            data: {
                title: options.title ?? existingTodo.title,
                description: options.description ?? existingTodo.description,
                status: options.status ?? existingTodo.status,
                priority: options.priority ?? existingTodo.priority,
                dueDate: options.dueDate 
                ? new Date(options.dueDate) : existingTodo.dueDate,
            }
        })
        return {
            status: "success",
            data: updatedTodo
        }
    } catch (error) {
        console.error("Error updating todo:", error);
        throw error;
    }
}

//soft delete tasks
export const deleteTodoController = async (id: string) => {
    try {
        const existingTodo = await prisma.todo.findFirst({
            where: {
                id
            }
        })
        if (!existingTodo){
            return {
                status: "error",
                message: "Todo not found"
            }
        }
        const deletedTodo = await prisma.todo.update({
            where: {
                id
            },
            data: {
                deletedAt: new Date()
            }
        })
        return {
            status: "success",
            msg: "Todo deleted successfully",
            data: deletedTodo
        }
    } catch (error) {
        console.error("Error deleting todo:", error);
        throw error;
    }
}