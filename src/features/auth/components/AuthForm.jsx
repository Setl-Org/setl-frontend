import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Lock, User } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/stores/authStore";
import { trimFormData } from "@/lib/formUtils";
import { loginSchema, signUpSchema } from "../schemas/authSchemas";
import api from "@/lib/api";

const MODES = { signIn: "signIn", signUp: "signUp" };

/**
 * AuthForm - Email/password form for sign in or sign up.
 *
 * @param {Object} props
 * @param {"signIn" | "signUp"} props.mode
 * @param {(data: Object) => Promise<void>} [props.onSubmit]
 */
export function AuthForm({ mode, onSubmit }) {
  const isSignUp = mode === MODES.signUp;
  const schema = isSignUp ? signUpSchema : loginSchema;
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: isSignUp
      ? { name: "", email: "", password: "", confirmPassword: "" }
      : { email: "", password: "" },
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const handleFormSubmit = async (data) => {
    try {
      const cleaned = trimFormData(data);
      if (onSubmit) {
        await onSubmit(cleaned);
      } else if (isSignUp) {
        const [firstName, ...rest] = (cleaned.name || "").trim().split(" ");
        const lastName = rest.join(" ") || "-";
        await api.post("/signup", {
          email: cleaned.email,
          password: cleaned.password,
          firstName,
          lastName,
        });
        toast.success("Account created. Sign in to continue.");
        navigate("/auth?mode=signIn", { replace: true });
      } else {
        const response = await api.post("/signin", {
          email: cleaned.email,
          password: cleaned.password,
        });
        const { user, token } = response.data.data;
        useAuthStore.getState().login(user, token);
        toast.success("Signed in.");
        const from = location.state?.from ?? { pathname: "/dashboard" };
        navigate(from, { replace: true });
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.errorMessage ||
        err?.message ||
        (isSignUp ? "Sign up failed." : "Sign in failed.");
      toast.error(message);
      throw err;
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {isSignUp && (
        <FormField label="Name" required error={errors.name?.message} id="name">
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Your name"
              className="pl-9"
              {...register("name")}
            />
          </div>
        </FormField>
      )}
      <FormField label="Email" required error={errors.email?.message} id="email">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="email"
            placeholder="you@company.com"
            className="pl-9"
            {...register("email")}
          />
        </div>
      </FormField>
      <FormField
        label="Password"
        required
        error={errors.password?.message}
        id="password"
        hint={isSignUp ? "Min 8 characters, with upper, lower, and number" : undefined}
      >
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="password"
            placeholder="••••••••"
            className="pl-9"
            {...register("password")}
          />
        </div>
      </FormField>
      {isSignUp && (
        <FormField
          label="Confirm password"
          required
          error={errors.confirmPassword?.message}
          id="confirmPassword"
        >
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="password"
              placeholder="••••••••"
              className="pl-9"
              {...register("confirmPassword")}
            />
          </div>
        </FormField>
      )}
      <Button
        type="submit"
        variant="primary"
        className="w-full min-h-[48px] rounded-full bg-ink text-white transition hover:bg-ink/85 focus-visible:ring-violet"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}
      </Button>
    </form>
  );
}
