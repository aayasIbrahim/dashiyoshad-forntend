import { LoginForm } from "@/components/form/login-form"

export default function Page() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-muted/40 px-3 py-6 sm:p-6 md:p-10">
      <div className="w-full max-w-5xl">
        <LoginForm />
      </div>
    </main>
  )
}
