import z from "zod";

const phone = z
  .string({ error: "Enter your phone number." })
  .trim()
  .regex(/^\+?[0-9][0-9\s()-]{6,19}$/, "Enter a valid phone number")
  .transform((value) => value.replace(/\D/g, ""))
  .pipe(
    z
      .string()
      .min(7, "Phone number must have at least 7 digits.")
      .max(15, "Phone number cannot exceed 15 digits."),
  );

const CreateOrderZodSchema = z
  .object({
    customerName: z
      .string({ error: "Enter your name." })
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(120, "Name cannot exceed 120 characters."),
    customerPhone: phone,
    shippingAddress: z
      .string({ error: "Enter your shipping address." })
      .trim()
      .min(5, "Shipping address must be at least 5 characters.")
      .max(1000, "Shipping address cannot exceed 1000 characters."),
    country: z
      .string({ error: "Enter your country." })
      .trim()
      .min(2, "Country name must be at least 2 characters.")
      .max(80, "Country name cannot exceed 80 characters.")
      .default("Bangladesh"),
    orderNotes: z
      .string({ error: "Order notes must be text." })
      .trim()
      .max(1000, "Order notes cannot exceed 1000 characters.")
      .optional(),
    paymentMethod: z
      .enum(["CASH_ON_DELIVERY", "BKASH"], {
        error: "Choose a valid payment method.",
      })
      .default("CASH_ON_DELIVERY"),
    items: z
      .array(
        z
          .object({
            productId: z.uuid({ error: "A selected product is invalid." }),
            quantity: z
              .number({ error: "Enter a valid product quantity." })
              .int("Quantity must be a whole number.")
              .min(1, "Order at least 1 item.")
              .max(100, "You can order up to 100 of one item."),
          })
          .strict(),
      )
      .min(1, "Your cart is empty.")
      .max(50, "An order can contain up to 50 different products."),
  })
  .strict();

export const OrderValidation = {
  CreateOrderZodSchema,
};
