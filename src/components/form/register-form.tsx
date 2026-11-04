"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShoppingBag,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { cn } from "cn";

import { useRegistration } from "@/hooks";
import { UserValidation } from "@/validation";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "../ui/toast";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: registration, isPending } = useRegistration();

  const form = useForm({
    defaultValues: {
      name: "Ayas Ibrahim",
      email: "aayasabraham@gmail.com",
      phone: "01857792946",
      password: "SecurePassword123!",
      confirmPassword: "SecurePassword123!",
    },
    validators: {
      onSubmit: UserValidation.RegistrationZodSchema,
    },
    onSubmit: ({ value }) => {
      registration(
        {
          name: value.name,
          email: value.email,
          phone:value.phone,
          password: value.password,
        },
        {
          onSuccess: (res) => {
            if (!res.success) {
              toast.add({
                title: res.message,
                description: res.message || "Please try again.",
                type: "error",
              });
              return;
            }

            toast.add({
              title: "Account created",
             
              type: "success",
            });
          },
          onError: (err) => {
            toast.add({
            title: "Authorization failure",
              description: err.message || "Please try again.",
              type: "error",
            });
          },
        },
      );
    },
  });

  return (
    <div
      className={cn(
        "grid w-full overflow-hidden rounded-3xl border border-border/70 bg-card shadow-xl shadow-primary/5 md:grid-cols-[0.85fr_1.15fr]",
        className,
      )}
      {...props}
    >
      <aside className="relative hidden min-h-[720px] flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground md:flex lg:p-12">
        <div
          aria-hidden="true"
          className="absolute -right-24 -bottom-28 size-80 rounded-full border border-white/15"
        />
        <div
          aria-hidden="true"
          className="absolute -right-10 -bottom-14 size-52 rounded-full border border-white/15"
        />

        <div className="relative flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-white/15">
            <ShoppingBag aria-hidden="true" className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Your Store</span>
        </div>

        <div className="relative max-w-sm">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium">
            <Sparkles aria-hidden="true" className="size-3.5" />
            A better way to shop
          </span>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight lg:text-5xl">
            Make room for the good stuff.
          </h1>
          <p className="mt-4 text-sm leading-6 text-primary-foreground/80">
            Create an account to keep your orders organized and make your next
            shopping trip a little easier.
          </p>
        </div>

        <p className="relative text-xs text-primary-foreground/70">
          Your shopping account, all in one place.
        </p>
      </aside>

      <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-7 md:hidden">
            <span className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShoppingBag aria-hidden="true" className="size-5" />
            </span>
            <p className="text-sm font-semibold text-primary">Your Store</p>
          </div>

          <header className="mb-7">
            <p className="mb-2 text-sm font-medium text-primary">
              Get started
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Create your account
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Add your details below to join us.
            </p>
          </header>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void form.handleSubmit();
            }}
          >
            <FieldGroup className="gap-4">
              <form.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                      <div className="relative">
                        <UserRound
                          aria-hidden="true"
                          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          placeholder="Your name"
                          autoComplete="name"
                          aria-invalid={isInvalid}
                          className="h-11 rounded-xl pl-10 text-sm"
                          value={field.state.value}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          onBlur={field.handleBlur}
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email address</FieldLabel>
                      <div className="relative">
                        <Mail
                          aria-hidden="true"
                          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          autoCapitalize="none"
                          autoCorrect="off"
                          aria-invalid={isInvalid}
                          className="h-11 rounded-xl pl-10 text-sm"
                          value={field.state.value}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          onBlur={field.handleBlur}
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="phone">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Phone number</FieldLabel>
                      <div className="relative">
                        <Phone
                          aria-hidden="true"
                          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                          id={field.name}
                          name={field.name}
                          type="tel"
                          inputMode="tel"
                          placeholder="01XXXXXXXXX"
                          autoComplete="tel"
                          aria-invalid={isInvalid}
                          className="h-11 rounded-xl pl-10 text-sm"
                          value={field.state.value}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          onBlur={field.handleBlur}
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="password">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <div className="relative">
                        <LockKeyhole
                          aria-hidden="true"
                          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                          id={field.name}
                          name={field.name}
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          autoComplete="new-password"
                          aria-invalid={isInvalid}
                          className="h-11 rounded-xl pl-10 pr-12 text-sm"
                          value={field.state.value}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          onBlur={field.handleBlur}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((visible) => !visible)
                          }
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          aria-pressed={showPassword}
                          className="absolute inset-y-0 right-1 flex size-10 items-center justify-center self-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {showPassword ? (
                            <EyeOff aria-hidden="true" className="size-4" />
                          ) : (
                            <Eye aria-hidden="true" className="size-4" />
                          )}
                        </button>
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field
                name="confirmPassword"
                validators={{
                  onSubmit: ({ value }) =>
                    value === form.getFieldValue("password")
                      ? undefined
                      : { message: "Passwords do not match." },
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Confirm password
                      </FieldLabel>
                      <div className="relative">
                        <LockKeyhole
                          aria-hidden="true"
                          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                          id={field.name}
                          name={field.name}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Enter your password again"
                          autoComplete="new-password"
                          aria-invalid={isInvalid}
                          className="h-11 rounded-xl pl-10 pr-12 text-sm"
                          value={field.state.value}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          onBlur={field.handleBlur}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((visible) => !visible)
                          }
                          aria-label={
                            showConfirmPassword
                              ? "Hide confirmation password"
                              : "Show confirmation password"
                          }
                          aria-pressed={showConfirmPassword}
                          className="absolute inset-y-0 right-1 flex size-10 items-center justify-center self-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {showConfirmPassword ? (
                            <EyeOff aria-hidden="true" className="size-4" />
                          ) : (
                            <Eye aria-hidden="true" className="size-4" />
                          )}
                        </button>
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <Field className="gap-3 pt-1">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-12 w-full justify-center gap-2 rounded-xl text-sm"
                >
                  {isPending ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
                      />
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </>
                  )}
                </Button>
                <FieldDescription className="text-center leading-5">
                  By creating an account, you can keep your shopping details and
                  orders together.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
