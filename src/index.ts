import app from "./app";

const server = app.listen(process.env.PORT || 8080);

console.log(
  `DailyPlan API is running at ${server.server?.hostname}:${server.server?.port}`
);
