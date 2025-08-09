// Page component that wraps the Signup form in a nice card.
import { Card } from "../components/ui/card";
import SignupForm from "../components/forms/SignupForm";

export default function Signup() {
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        {/* Header */}
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Join Momentum and start tracking your streaks
          </p>
        </div>

        {/* Form */}
        <SignupForm />

        {/* Footer */}
        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <a className="underline font-medium" href="/login">
            Sign in
          </a>
        </p>
      </Card>
    </div>
  );
}