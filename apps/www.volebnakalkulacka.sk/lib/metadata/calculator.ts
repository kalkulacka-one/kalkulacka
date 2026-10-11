import { createCalculatorMetadata } from "@kalkulacka-one/next/metadata";

import { canonical, mappedParams } from "@/lib/routing";

export const calculatorMetadata = createCalculatorMetadata({ canonical, mappedParams });
