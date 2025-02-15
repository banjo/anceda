import { createPublicApiInstance } from "./api-instance";
import { adminController } from "./controllers/admin-controller";

export const api = createPublicApiInstance().route("/admin", adminController);
