import { useState } from "react";
import { LogIn, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSuccess?: (user: { name: string; email: string }) => void;
}

const initialFormData: LoginFormData = {
  email: "",
  password: "",
};

const LOGIN_API_URL = import.meta.env.DEV
  ? "/api/event_login"
  : "https://irpd4g3k43.execute-api.us-east-1.amazonaws.com/default/event_login";

export function LoginForm({ onSuccess }: LoginFormProps = {}) {
  const [formData, setFormData] = useState<LoginFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const validateForm = (): string | null => {
    if (!formData.email.trim()) {
      return "Email is required";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      return "Please enter a valid email address";
    }

    if (!formData.password) {
      return "Password is required";
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
      };

      const response = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage =
          result?.message || result?.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      toast.success("Login completed successfully!");
      resetForm();

      if (onSuccess) {
        onSuccess({
          name:
            result?.name ||
            result?.user?.name ||
            result?.data?.name ||
            result?.username ||
            formData.email.trim().split("@")[0],
          email:
            result?.email ||
            result?.user?.email ||
            result?.data?.email ||
            formData.email.trim(),
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        toast.error("Login request was blocked. In development this is usually a CORS or network issue.");
      } else {
        toast.error(error instanceof Error ? error.message : "Login failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-2 px-0">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Sign in with your email and password
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        <div className="space-y-3">
          <Label htmlFor="login-email" className="text-base">Email *</Label>
          <Input
            id="login-email"
            type="email"
            placeholder="Enter email"
            className="h-12 text-base"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="login-password" className="text-base">Password *</Label>
          <Input
            id="login-password"
            type="password"
            placeholder="Enter password"
            className="h-12 text-base"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" size="lg" onClick={resetForm} disabled={isSubmitting}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button size="lg" onClick={handleSubmit} disabled={isSubmitting}>
            <LogIn className="mr-2 h-4 w-4" />
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
