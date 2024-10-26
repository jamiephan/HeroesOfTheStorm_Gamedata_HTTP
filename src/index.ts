import { Hono } from "hono";
import proxy from "./proxy";

const app = new Hono();

app.route("/mods", proxy);

export default app;
