import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { createContract } from "./contract.mjs";
import { validateFlowTrace } from "./validate-flow.mjs";

const OPENAPI_FILE = new URL("../source/openapi.yaml", import.meta.url);

export function checkContract(spec) {
  const context = createContract(spec);
  const errors = [...context.errors];
  let flowCount = 0;
  for (const example of context.examples.values()) {
    if (example.kind !== "response" || example.operationId !== "getFlow" || example.status !== 200) continue;
    flowCount += 1;
    for (const error of validateFlowTrace(example.body)) errors.push(`${example.id}: ${error}`);
  }
  return { context, examples: context.examples, errors, flowCount };
}

export async function main() {
  let spec;
  try {
    spec = parse(await readFile(OPENAPI_FILE, "utf8"));
  } catch (error) {
    console.error(`Contract check failed: source/openapi.yaml: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  const result = checkContract(spec);
  if (result.errors.length > 0) {
    console.error(`Contract check failed with ${result.errors.length} error${result.errors.length === 1 ? "" : "s"}:`);
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(
    `Contract OK: ${result.examples.size} examples, ${result.flowCount} flow traces, ${Object.keys(spec.components?.schemas ?? {}).length} schemas, ${Object.keys(spec.paths ?? {}).length} paths.`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
