import { z } from "zod";

// Define the rules schema
const rulesSchema = z.object({
  label: z.array(z.string()), // array of strings
  width: z.number(), // a floating-point number
});

// Define the state schema
const stateSchema = z.object({
  id: z.number().int(),
  x: z.number(),
  y: z.number(),
  isStartState: z.boolean(),
  isFinalState: z.boolean(),
  label: z.string(),
});

// Define the schema for regular links
const linkSchema = z.object({
  isSelfLink: z.literal(false),
  stateA: z.number().int(),
  stateB: z.number().int(),
  rules: z.array(rulesSchema),
  parallelPart: z.number(),
  perpendicularPart: z.number(),
  lineAngleAdjust: z.number(),
});

// Define the schema for self-links
const selfLinkSchema = z.object({
  isSelfLink: z.literal(true),
  state: z.number().int(),
  rules: z.array(rulesSchema),
  anchorAngle: z.number(),
});

// Define the schema for initialStateLink
const initialStateLinkSchema = z.object({
  state: z.number().int(),
  deltaX: z.number(),
  deltaY: z.number(),
});

// Define the main schema for dmt
const mtSchema = z.object({
  canvasScale: z.number(),
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
  console.log(parsed.error);
  return parsed;
};
