// Signup form mirroring Login, with Name + Confirm Password.
// Still mock — just writes to auth store and navigates.

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";

//shadcn
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Form, FormField, FormItem, FormControl, FormMessage } from "../ui/form";

export default function SignupForm() {
  const navigate = useNavigate();
  const { signupWithCredentials } = useAuth();

  const form = useForm({
    defaultValues: { name: "", email: "", password: "", confirm: "" },
    mode: "onSubmit",
  });

  // Watch password so we can compare with confirm
  const pwd = form.watch("password");

  const onSubmit = async (values) => {
    try {
      await signupWithCredentials({ name: values.name, email: values.email, password: values.password });
      toast.success("Account created");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Signup failed");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="name">Name</Label>
              <FormControl>
                <Input id="name" placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
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
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
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

        {/* Confirm password */}
        <FormField
          control={form.control}
          name="confirm"
          rules={{
            required: "Please confirm your password",
            validate: (val) => val === pwd || "Passwords do not match",
          }}
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="confirm">Confirm password</Label>
              <FormControl>
                <Input id="confirm" type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Create account
        </Button>
      </form>
    </Form>
  );
}