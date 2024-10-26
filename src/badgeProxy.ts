import { Hono } from "hono";
import * as xmljs from "xml-js";
import * as JSONPath from "jsonpath";
import * as xpath from "xpath";
import { DOMParser as dom } from "@xmldom/xmldom";

import downloadFile from "./helper/downloadFile";
import Throw from "./helper/Throw";

type Bindings = {
  KV_CACHE: string;
  HEROES_DATA_CACHE: KVNamespace;
};

const proxy = new Hono<{ Bindings: Bindings }>();

proxy.get("/:path{.*}", async (c) => {
  // query params
  const version = c.req.query("version") || "latest";
  const pathQuery = c.req.query("path");
  const label = c.req.query("label");

  // Remove multiple "/" at the same time and trailing "/"
  const path =
    "mods/" + c.req.param("path")?.replace(/\/+/g, "/")?.replace(/\/$/, "");

  // Get extension

  const code = await downloadFile(version, path, c.env.HEROES_DATA_CACHE);

  if (!code) {
    return Throw.NOT_FOUND();
  }

  const extension = path.split(".").pop()?.toLowerCase();

  if (!extension) {
    return Throw.UNACCEPTABLE_FORMAT("Unable to determine file extension");
  }

  const response = {
    schemaVersion: 1,
    label: label || "Heroes Game Data",
    message: "",
    color: "#4381C3",
    namedLogo: "battledotnet",
    logoColor: "#4381C3",
    style: "for-the-badge",
  };

  switch (true) {
    case extension === "xml" || extension.startsWith("storm"):
      // XML need xpath
      if (!pathQuery) {
        return Throw.BAD_REQUEST(
          "path query parameter is required for XML files"
        );
      }

      // Using XPATH vert slow....
      // const doc = new dom().parseFromString(code, "text/xml");

      // // @ts-ignore
      // const nodes = xpath.select(pathQuery, doc);
      // // @ts-ignore
      // if (!nodes || nodes.length === 0 || !nodes?.[0]?.value) {
      //   return Throw.NOT_FOUND("No results found for xpath query");
      // }
      // // @ts-ignore
      // response.message = nodes[0].value;

      // Using JSONPath instead
      const json = xmljs.xml2json(code, { compact: true });
      const result = JSONPath.query(JSON.parse(json), pathQuery);
      if (!result || result.length === 0) {
        return Throw.NOT_FOUND("No results found for path query");
      }
      if (result.length > 1) {
        return Throw.BAD_REQUEST("Multiple results found for path query");
      }
      // If not a string, throw an error
      if (typeof result[0] !== "string") {
        return Throw.BAD_REQUEST("Path result is not a string");
      }
      response.message = result[0];
      break;
    case extension == "txt":
      response.message = code;
      break;
    case extension == "galaxy":
      return Throw.UNACCEPTABLE_FORMAT(".galaxy files are not supported");
      break;
    default:
      return Throw.UNACCEPTABLE_FORMAT("Unsupported file extension");
  }

  return c.json(response);
});

export default proxy;
