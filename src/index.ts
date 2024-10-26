import { Hono } from "hono";
import proxy from "./proxy";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/", proxy);

export default app;
