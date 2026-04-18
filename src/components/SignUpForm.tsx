import { useState } from "react";
import { Save, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  grade: number | null;
}

interface SignUpFormProps {
  onSuccess?: () => void;
}

const initialFormData: SignUpFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  grade: null,
};

const SIGNUP_API_URL = import.meta.env.DEV
  ? "/api/event_signup"
  : "https://5boz4vmp1k.execute-api.us-east-1.amazonaws.com/default/event_signup";

export function SignUpForm({ onSuccess }: SignUpFormProps = {}) {
  const [formData, setFormData] = useState<SignUpFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return "Name is required";
    }

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

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      return "Confirmation password is required";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Password and confirmation password must match";
    }

    if (!formData.grade) {
      return "Grade is required";
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
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        grade: formData.grade,
        role: "public",
      };

      const response = await fetch(
        SIGNUP_API_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage =
          result?.message || result?.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      toast.success("Signup completed successfully!");
      resetForm();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error during signup:", error);
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        toast.error("Signup request was blocked. In development this is usually a CORS or network issue.");
      } else {
        toast.error(error instanceof Error ? error.message : "Signup failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-2 px-0">
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>
          Sign up a public user with name, email, password, and grade
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        <div className="space-y-3">
          <Label htmlFor="signup-name" className="text-base">Name *</Label>
          <Input
            id="signup-name"
            placeholder="Enter full name"
            className="h-12 text-base"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="signup-email" className="text-base">Email *</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="Enter email"
            className="h-12 text-base"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <Label htmlFor="signup-password" className="text-base">Password *</Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="Enter password"
              className="h-12 text-base"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="signup-confirm-password" className="text-base">Confirmation Password *</Label>
            <Input
              id="signup-confirm-password"
              type="password"
              placeholder="Confirm password"
              className="h-12 text-base"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="signup-grade" className="text-base">Grade *</Label>
          <Select
            value={formData.grade ? formData.grade.toString() : undefined}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, grade: parseInt(value, 10) }))
            }
          >
            <SelectTrigger id="signup-grade" className="h-12 text-base">
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 9 }, (_, i) => i + 2).map((grade) => (
                <SelectItem key={grade} value={grade.toString()}>
                  Class {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border bg-gray-50 p-4 text-base text-gray-600">
          Role will be submitted as <span className="font-medium">public</span>.
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" size="lg" onClick={resetForm} disabled={isSubmitting}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button size="lg" onClick={handleSubmit} disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
