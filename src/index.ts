import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import userRoutes from "../src/routes/user";
import todoRoutes from "../src/routes/todo";
import "dotenv/config";

const app = new Elysia()
  .use(jwt({ 
    name: "jwt",
    secret: process.env.JWT_SECRET || "default_secret",
    exp: "1d"
  }))

  .get("/", () => "Hello Elysia")

  .group("/api", (app) => {
    return app.use(userRoutes).use(todoRoutes);
  })

  .listen(process.env.PORT || 8080);



console.log(
  `DailyPlan API is running at ${app.server?.hostname}:${app.server?.port}`
);
