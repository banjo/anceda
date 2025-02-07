import { createPublicApiInstance } from "./api-instance";
import { adminController } from "./controllers/admin-controller";
import { serverController } from "./controllers/server-controller";

export const api = createPublicApiInstance()
    .route("/server", serverController)
    .route("/admin", adminController);
