import { Hono } from "hono";
import proxy from "./proxy";
import badgeProxy from "./badgeProxy";
import CONFIG from "./config";

const app = new Hono();

app.get("/", (c) => c.redirect(CONFIG.HOME));
app.route("/badge/mods", badgeProxy);
app.route("/mods", proxy);

export default app;
