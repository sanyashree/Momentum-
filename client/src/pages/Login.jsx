// Two-column login page (shadcn-style) using only your logo in the header
// and banner.jpeg as the right-side image.
// Make sure both logo.jpeg and banner.jpeg are in the public/ folder.

import { Card } from "../components/ui/card";
import LoginForm from "../components/forms/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT: Logo + Login Form */}
      <div className="flex flex-col">
       
        {/* Centered form card */}
        <main className="flex-1 grid place-items-center px-6 pb-12">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Login to your account</h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>

            <Card className="p-6 space-y-6">
              <LoginForm />

              {/* Actions row */}
              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Forgot your password?
                </a>                
              </div>

              {/* Sign up link */}
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <a className="underline font-medium" href="/signup">
                  Sign up
                </a>
              </p>
            </Card>
          </div>
        </main>
      </div>

      {/* RIGHT: Banner image */}
      <div className="hidden lg:block bg-muted">
        <div
          className="h-full w-full bg-center bg-cover"
          style={{
            backgroundImage: "url('/banner.jpeg')", // From public/banner.jpeg
          }}
          role="img"
          aria-label="Banner"
        />
      </div>
    </div>
  );
}