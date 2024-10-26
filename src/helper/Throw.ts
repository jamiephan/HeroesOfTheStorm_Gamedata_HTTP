import { HTTPException } from "hono/http-exception";

export function NOT_FOUND(message = "Not Found") {
  throw new HTTPException(404, {
    message,
  });
}

export function UNACCEPTABLE_FORMAT(message = "Unacceptable Format") {
  throw new HTTPException(406, {
    message,
  });
}

export function BAD_REQUEST(message = "Bad Request") {
  throw new HTTPException(400, {
    message,
  });
}

export default {
  NOT_FOUND,
  UNACCEPTABLE_FORMAT,
};
