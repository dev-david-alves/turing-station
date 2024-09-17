import { z } from "zod";

// Define the rules schema
const rulesSchema = z.object({
  label: z.array(z.string()), // array of strings
});

// Define the state schema
const stateSchema = z.object({
  id: z.number().int().nonnegative(),
  x: z.number(),
  y: z.number(),
  isStartState: z.boolean(),
  isFinalState: z.boolean(),
  label: z.string(),
});

// Define the schema for regular links
const linkSchema = z.object({
  isSelfLink: z.literal(false),
  stateA: z.number().int().nonnegative(),
  stateB: z.number().int().nonnegative(),
  rules: z.array(rulesSchema),
  parallelPart: z.number(),
  perpendicularPart: z.number(),
  lineAngleAdjust: z.number(),
});

// Define the schema for self-links
const selfLinkSchema = z.object({
  isSelfLink: z.literal(true),
  state: z.number().int().nonnegative(),
  rules: z.array(rulesSchema),
  anchorAngle: z.number(),
});

// Define the schema for initialStateLink
const initialStateLinkSchema = z.object({
  state: z.number().int().nonnegative(),
  deltaX: z.number(),
  deltaY: z.number(),
});

// Define the main schema for dmt
const mtSchema = z.object({
  name: z.string().min(1),
  canvasScale: z.number().min(0.5).max(2.0),
  variant: z.union([z.literal("tm"), z.literal("ndtm"), z.literal("mttm")]),
  numTapes: z.number().positive(),
  states: z.array(stateSchema),
  links: z.array(
    z.union([
      linkSchema, // handles regular links
      selfLinkSchema, // handles self-links
    ]),
  ),
  initialStateLink: z.nullable(initialStateLinkSchema),
});

// Test the object against the schema
export const checkFileFormat = (dmt) => {
  const parsed = mtSchema.safeParse(dmt);

  if (parsed.success) {
    dmt.links.forEach((link) => {
      link.rules.forEach((rule) => {
        if (rule.label.length !== dmt.numTapes * 3) {
          parsed.success = false;
          parsed.error = {
            message: "Número de fitas incompatível com o número de regras!",
          };
        }
      });
    });
  }

  if (parsed.error) console.log(parsed.error);
  return parsed;
};
