import z from "zod";

const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9][0-9\s()-]{6,19}$/, "Enter a valid phone number")
  .transform((value) => value.replace(/\D/g, ""))
  .pipe(z.string().min(7).max(15));

const CreateOrderZodSchema = z
  .object({
    customerName: z.string().trim().min(2).max(120),
    customerPhone: phone,
    shippingAddress: z.string().trim().min(5).max(1000),
    country: z.string().trim().min(2).max(80).default("Bangladesh"),
    orderNotes: z.string().trim().max(1000).optional(),
    paymentMethod: z
      .enum(["CASH_ON_DELIVERY", "BKASH"])
      .default("CASH_ON_DELIVERY"),
    items: z
      .array(
        z
          .object({
            productId: z.uuid(),
            quantity: z.number().int().min(1).max(100),
          })
          .strict(),
      )
      .min(1)
      .max(50),
  })
  .strict();

export const OrderValidation = {
  CreateOrderZodSchema,
};
