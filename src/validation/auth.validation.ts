import z from "zod";

const emailSchema = z
  .string({ error: "Enter your email address." })
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "Enter a valid email address." }));

const passwordSchema = z
  .string({ error: "Enter a password." })
  .min(10, "Password must be at least 10 characters.")
  .max(72, "Password must not exceed 72 characters.")
  .refine(
    (password) => Buffer.byteLength(password, "utf8") <= 72,
    "Password must not exceed 72 characters.",
  );

const RegistrationZodSchema = z.object({
  name: z
    .string({ error: "Enter your name." })
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name cannot exceed 80 characters."),
  email: emailSchema,
  phone: z
    .string({ error: "Enter your phone number." })
    .trim()
    .regex(/^(?:\+?[1-9]\d{9,14}|01[3-9]\d{8})$/, "Enter a valid phone number"),
  password: passwordSchema
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
  confirmPassword: z
    .string({ error: "Please confirm your password." })
    .min(1, "Please confirm your password."),
});

const LoginZodSchema = z.object({
  email: emailSchema,
  password: z
    .string({ error: "Enter your password." })
    .min(1, "Password is required")
    .max(72, "Invalid email or password.")
    .refine(
      (password) => Buffer.byteLength(password, "utf8") <= 72,
      "Invalid email or password.",
    ),
});

export const UserValidation = {
  RegistrationZodSchema,
  LoginZodSchema,
};
