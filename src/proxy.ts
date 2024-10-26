// Hono JS router for github file proxying
import { Hono } from "hono";
import getGitFile from "./helper/getGitFile";
import transform, { ALLOWED_FORMATS } from "./helper/transform";

const proxy = new Hono();

proxy.get("/:path{.*}", async (c) => {
  // query params
  const version = c.req.query("version") || "latest";
  const format = c.req.query("format") || "txt";

  const path = c.req.param("path");
  // if format is allowed
  if (!ALLOWED_FORMATS.includes(format)) {
    return c.text("Not Allowed", 405);
  }

  const response = await getGitFile(version, path);

  if (response.code === 404) {
    return c.text("Not Found", 404);
  }

  const transformed = transform(path, response.data, format);

  c.header("Content-Type", transformed.contentType);
  return c.body(transformed.code);
});

export default proxy;
