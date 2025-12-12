import { flattenMessages } from "@/utilities";

import cs from "./cs.json";
import en from "./en.json";

export type SupportedLocale = "cs" | "en";

export const czechTranslations = flattenMessages(cs);
export const englishTranslations = flattenMessages(en);
