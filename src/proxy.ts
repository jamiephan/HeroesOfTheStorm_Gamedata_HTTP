// Hono JS router for github file proxying
import { Hono } from "hono";
import downloadFile from "./helper/downloadFile";
import transform, { ALLOWED_FORMATS } from "./helper/transform";
import { HTTPException } from "hono/http-exception";
import Throw from "./helper/Throw";

type Bindings = {
  KV_CACHE: string;
  HEROES_DATA_CACHE: KVNamespace;
};

const proxy = new Hono<{ Bindings: Bindings }>();

proxy.get("/:path{.*}", async (c) => {
  // query params
  const version = c.req.query("version") || "latest";
  const format = c.req.query("format") || "txt";

  // Remove multiple "/" at the same time and trailing "/"
  const path =
    "mods/" + c.req.param("path")?.replace(/\/+/g, "/")?.replace(/\/$/, "");

  // if format is allowed
  if (!ALLOWED_FORMATS.includes(format)) {
    return Throw.UNACCEPTABLE_FORMAT();
  }

  const code = await downloadFile(version, path, c.env.HEROES_DATA_CACHE);

  if (!code) {
    return Throw.NOT_FOUND();
  }

  const transformed = transform(path, code, format);

  c.header("Content-Type", transformed.contentType);
  return c.body(transformed.code);
});

export default proxy;
