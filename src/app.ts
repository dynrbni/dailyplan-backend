import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import userRoutes from "./routes/user";
import todoRoutes from "./routes/todo";
import "dotenv/config";

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "DailyPlan API",
          description:
            "API for DailyPlan application built with Elysia and Prisma",
          version: "1.0.0",
        },
      },
    })
  )
  .use(
    cors({
      origin: true,
      methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "default_secret",
      exp: "1d",
    })
  )

  .get("/", () => "DailyPlan API King Dean is Running!")

  .group("/api", (app) => {
    return app.use(userRoutes).use(todoRoutes);
  });

export default app;
