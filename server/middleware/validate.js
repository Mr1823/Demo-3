import { z } from "zod";

/**
 * Express middleware factory: validate request body against a Zod schema.
 * @param {z.ZodSchema} schema
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }
    next(error);
  }
};

// ─── Schemas ─────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  metalType: z.enum(["gold", "silver"]).optional(),
  weight: z.number().min(0).optional(),
  wastagePercent: z.number().min(0).max(100).optional(),
  gstPercent: z.number().min(0).max(100).optional(),
  isQuoteOnly: z.boolean().optional(),
}).passthrough();

export const updateRatesSchema = z.object({
  gold: z.number().positive().optional(),
  silver: z.number().positive().optional(),
  rate: z.number().positive().optional(),
  silverRate: z.number().positive().optional(),
}).refine(
  (data) => data.gold || data.silver || data.rate || data.silverRate,
  { message: "At least one rate value is required" }
);

export const quoteRequestSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  productName: z.string().optional(),
  productImage: z.string().optional(),
  customerName: z.string().min(1, "Customer name is required"),
  customerMobile: z.string().min(10, "Valid mobile number is required"),
});

export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive().optional(),
  })).min(1, "At least one item required"),
  shippingAddress: z.object({}).passthrough().optional(),
});
