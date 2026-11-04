"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShoppingBag, Sparkles } from "lucide-react";
import { cn } from "cn";

import { useLogin } from "@/hook";
import { loginSchema } from "@/validation";
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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();

  const form = useForm({
    defaultValues: {
      email: "user1@gmail.com",
      password: "SecurePassword123!",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: ({ value }) => {
      login(value, {
        onSuccess: () => {
          toast.add({
            title: "Login successful",
            description: "Welcome back. Happy shopping!",
            type: "success",
          });
          router.push("/");
        },
        onError: (err) => {
          toast.add({
            title: "Unable to sign in",
            description: err.message || "Please check your details and try again.",
            type: "error",
          });
        },
      });
    },
  });

  return (
    <div
      className={cn(
        "grid w-full overflow-hidden rounded-3xl border border-border/70 bg-card shadow-xl shadow-primary/5 md:grid-cols-[1fr_0.92fr]",
        className,
      )}
      {...props}
    >
      <aside className="relative hidden min-h-[620px] flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground md:flex lg:p-12">
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
            Good to see you again.
          </h1>
          <p className="mt-4 text-sm leading-6 text-primary-foreground/80">
            Sign in to pick up where you left off, keep track of your orders, and
            get back to the things you love.
          </p>
        </div>

        <p className="relative text-xs text-primary-foreground/70">
          Your shopping account, all in one place.
        </p>
      </aside>

      <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 md:hidden">
            <span className="mb-5 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShoppingBag aria-hidden="true" className="size-5" />
            </span>
            <p className="text-sm font-semibold text-primary">Your Store</p>
          </div>

          <header className="mb-8">
            <p className="mb-2 text-sm font-medium text-primary">Welcome back</p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Enter your details to continue shopping.
            </p>
          </header>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void form.handleSubmit();
            }}
          >
            <FieldGroup className="gap-5">
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
                          className="h-12 rounded-xl pl-10 text-sm"
                          value={field.state.value}
                          onChange={(event) => field.handleChange(event.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </div>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                      <div className="flex items-center justify-between gap-3">
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <span className="text-xs text-muted-foreground">
                          Keep it private
                        </span>
                      </div>
                      <div className="relative">
                        <LockKeyhole
                          aria-hidden="true"
                          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                          id={field.name}
                          name={field.name}
                          type={isPasswordVisible ? "text" : "password"}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          aria-invalid={isInvalid}
                          className="h-12 rounded-xl pl-10 pr-12 text-sm"
                          value={field.state.value}
                          onChange={(event) => field.handleChange(event.target.value)}
                          onBlur={field.handleBlur}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setIsPasswordVisible((visible) => !visible)
                          }
                          aria-label={
                            isPasswordVisible ? "Hide password" : "Show password"
                          }
                          aria-pressed={isPasswordVisible}
                          className="absolute inset-y-0 right-1 flex size-10 items-center justify-center self-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {isPasswordVisible ? (
                            <EyeOff aria-hidden="true" className="size-4" />
                          ) : (
                            <Eye aria-hidden="true" className="size-4" />
                          )}
                        </button>
                      </div>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>

              <Field className="gap-4 pt-1">
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
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </>
                  )}
                </Button>

                <FieldDescription className="text-center leading-5">
                  Your account keeps your orders and shopping details together.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </div>
      </section>
    </div>
  );
}
