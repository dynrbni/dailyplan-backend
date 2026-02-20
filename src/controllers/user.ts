import prisma from "../database/prismaClient";

// get all users
export const getAllUsersController = async () => {
    try {
        const users = await prisma.user.findMany({
            where: {
                deletedAt: null
            },
        });
        return {
            status: "success",
            data: users
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

//get user by id (single user)
export const getUserByIdController = async (id: string) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id,
            }
        })
        if (!user) {
            return{
                status: "error",
                message: "User not found"
            }
        }
        return {
            status: "success",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        }
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
    }
}

//register user
export const registerUserController = async (options: {name: string, email: string, password: string}) => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: options.email,
            }
        })
        if (existingUser) {
            return {
                status: "error",
                message: "User with this email already exists"
            }
        }
        const hashedPassword = await Bun.password.hash(options.password, {
            algorithm: "bcrypt",
            cost: 10,
        });
        const newUser = await prisma.user.create({
            data: {
                name: options.name,
                email: options.email,
                password: hashedPassword,
            }
        })
        return{
            status: "success",
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
            }
        }
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
}

//login user
export const loginUserController = async (options: {email: string, password: string}) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: options.email,
            }
        })
        if (!user) {
            return{
                status: "error",
                message: "User not found"
            }
        }
        const isPasswordValid = Bun.password.verify(user.password, options.password);
        if (!isPasswordValid) {
            return {
                status: "error",
                message: "Invalid password"
            }
        }
        return {
            status: "success",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                msg: "Halo " + user.name + ", selamat datang kembali di DailyPlan!"
            }
        }
    } catch (error) {
        console.error("Error logging in user:", error);
        throw error;
    }
}

//update user by id
export const updateUserController = async (id: string, options: {name?: string; email?: string; password?: string}) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id,
            }
        })
        if (!user){
            return {
                status: "error",
                message: "User not found"
            }
        }

        const updateData: { name?: string; email?: string; password?: string } = {};
        if (options.name) updateData.name = options.name;
        if (options.email) updateData.email = options.email;
        if (options.password) {
            updateData.password = await Bun.password.hash(options.password, {
                algorithm: "bcrypt",
                cost: 10,
            });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: updateData,
        })
        return {
            status: "success",
            data: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
            }
        }
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}

//soft delete user by id
export const deleteUserController = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id,
            }
        })
        if (!user){
            return {
                status: "error",
                message: "User not found"
            }
        }
        const deletedUser = await prisma.user.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
            }
        })
        return {
            status: "success",
            message: "User deleted successfully"
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}