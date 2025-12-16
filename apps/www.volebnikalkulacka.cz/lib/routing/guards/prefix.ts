import { createPrefixGuard } from "@kalkulacka-one/next";

import { PREFIXES } from "@/lib/routing/validators";

export const prefixGuard = createPrefixGuard(PREFIXES);
