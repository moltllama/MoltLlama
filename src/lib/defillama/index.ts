export { DefiLlamaClient } from "./client";
export * from "./types";

import { dataProvider } from "@/lib/providers";

/** @deprecated Use `dataProvider` from "@/lib/providers" */
export const defiLlama = dataProvider;
