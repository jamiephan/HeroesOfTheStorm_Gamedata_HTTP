import { Hono } from "hono";
import proxy from "./proxy";
import badgeProxy from "./badgeProxy";

const app = new Hono();

app.route("/badge/mods", badgeProxy);
app.route("/mods", proxy);

export default app;
