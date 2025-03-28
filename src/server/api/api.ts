import { organizationController } from "@/server/api/controllers/organization-controller";
import { createPublicApiInstance } from "./api-instance";
import { adminController } from "./controllers/admin-controller";
import { publicController } from "@/server/api/controllers/public-controller";

export const api = createPublicApiInstance()
    .route("/admin", adminController)
    .route("/organization", organizationController)
    .route("/public", publicController);
