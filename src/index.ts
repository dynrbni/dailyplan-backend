import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import userRoutes from "../src/routes/user";
import todoRoutes from "../src/routes/todo";
import "dotenv/config";

const app = new Elysia()
  .use(swagger({
    documentation:{
      info:{
        title: "DailyPlan API",
        description: "API for DailyPlan application built with Elysia and Prisma",
        version: "1.0.0"
      }
    }
  }))
  .use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }))
  .use(jwt({ 
    name: "jwt",
    secret: process.env.JWT_SECRET || "default_secret",
    exp: "1d"
  }))

  .get("/", () => "DailyPlan API King Dean is Running!")

  .group("/api", (app) => {
    return app.use(userRoutes).use(todoRoutes);
  })

  .listen(process.env.PORT || 8080);



console.log(
  `DailyPlan API is running at ${app.server?.hostname}:${app.server?.port}`
);
