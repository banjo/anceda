import { Hono } from "hono";
import { serverController } from "./controllers/server-controller";

export const api = new Hono().route("/server", serverController);
