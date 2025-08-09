// Login form using shadcn Form components + react-hook-form.
// Currently "logs in" with mock data, shows toast, redirects to /dashboard.

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";

//shadcn
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Form, FormField, FormItem, FormControl, FormMessage } from "../ui/form";

export default function LoginForm() {
  const navigate = useNavigate();
  const { loginWithCredentials } = useAuth();

  // react-hook-form manages input state & validation
  const form = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values) => {
    try {
      await loginWithCredentials({ email: values.email, password: values.password });
      toast.success("Signed in");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Email field */}
        <FormField
          control={form.control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="email">Email</Label>
              <FormControl>
                <Input id="email" type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage /> {/* shows validation error */}
            </FormItem>
          )}
        />

        {/* Password field */}
        <FormField
          control={form.control}
          name="password"
          rules={{
            required: "Password is required",
            minLength: { value: 6, message: "Min 6 chars" },
          }}
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="password">Password</Label>
              <FormControl>
                <Input id="password" type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
    </Form>
  );
}