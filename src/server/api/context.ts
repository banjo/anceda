import { ApiAuthorizedInstance } from "@/server/api/api-instance";
import { getContext } from "hono/context-storage";

export const getApiContext = () => getContext<ApiAuthorizedInstance>().var;
