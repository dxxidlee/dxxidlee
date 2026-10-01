import { z } from "zod";

type JsonSchema = { [key: string]: unknown };

// Keywords structured outputs accepts as constraints. Anything else (lengths,
// ranges, item counts above 1) is moved into the description as guidance and
// enforced afterwards by zod.
const KEEP = new Set(["type", "enum", "const", "description", "required"]);

function strict(schema: JsonSchema): JsonSchema {
  const out: JsonSchema = {};
  const hints: string[] = [];

  for (const [key, value] of Object.entries(schema)) {
    if (key === "$schema") continue;
    if (KEEP.has(key)) out[key] = value;
    else if (key === "properties") {
      out.properties = Object.fromEntries(
        Object.entries(value as Record<string, JsonSchema>).map(([k, v]) => [k, strict(v)]),
      );
    } else if (key === "items") out.items = strict(value as JsonSchema);
    else if (key === "anyOf") out.anyOf = (value as JsonSchema[]).map(strict);
    else if (key === "additionalProperties") continue;
    else if (key === "minItems" && (value === 0 || value === 1)) out.minItems = value;
    else hints.push(`${key}: ${JSON.stringify(value)}`);
  }

  if (out.type === "object") out.additionalProperties = false;
  if (hints.length) {
    const prefix = typeof out.description === "string" ? `${out.description}\n\n` : "";
    out.description = `${prefix}{${hints.join(", ")}}`;
  }
  return out;
}

/** A structured-outputs JSON schema for a zod schema, with enums preserved. */
export function jsonOutputFormat(schema: z.ZodType) {
  return {
    type: "json_schema" as const,
    schema: strict(z.toJSONSchema(schema, { io: "output" }) as JsonSchema),
  };
}
