import { defineRouting } from "next-intl/routing";

import { appConfig } from "../config/app-config";

export const routing = defineRouting(appConfig.i18n);
