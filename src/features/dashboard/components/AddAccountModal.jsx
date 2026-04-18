import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DialogFormFooter } from "@/components/ui/DialogFormFooter";
import { trimFormData } from "@/lib/formUtils";
import api from "@/lib/api";
import { BANKS } from "../constants";

const schema = z.object({
  bank: z.string().min(1, "Select a bank"),
  accountName: z.string().min(1, "Account name is required").max(50, "Too long"),
  accountType: z.enum(["checking", "savings"], { message: "Select an account type" }),
  accountNumber: z.string().min(1, "Account number is required").max(24, "Too long"),
  password: z.string().optional(),
});

/**
 * AddAccountModal - Create a new account via the backend API.
 */
export function AddAccountModal({ open, onOpenChange, onAdded }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { bank: "", accountName: "", accountType: "", accountNumber: "", password: "" },
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const onSubmit = async (data) => {
    const { bank, accountName, accountNumber, accountType, password } = trimFormData(data);
    try {
      const res = await api.post("/accounts", {
        accountName,
        accountNumber,
        accountType,
        bankName: bank,
        ...(password && { password }),
      });
      toast.success("Account added successfully");
      onAdded(res.data.data.account);
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to add account.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add account</DialogTitle>
          <DialogDescription>
            Enter your account details. You can upload statements for it later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 pt-2">
            <FormField label="Bank" required error={errors.bank?.message} id="bank">
              <Select {...register("bank")}>
                <option value="">Select bank</option>
                {BANKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField
              label="Account name"
              required
              error={errors.accountName?.message}
              id="accountName"
              hint="e.g. Personal checking, business savings, etc."
            >
              <Input
                type="text"
                placeholder="My account"
                {...register("accountName")}
              />
            </FormField>
            <FormField
              label="Account type"
              required
              error={errors.accountType?.message}
              id="accountType"
            >
              <Select {...register("accountType")}>
                <option value="">Select account type</option>
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </Select>
            </FormField>
            <FormField
              label="Account number"
              required
              error={errors.accountNumber?.message}
              id="accountNumber"
              hint="Last 4 digits will be used as a mask"
            >
              <Input
                type="text"
                placeholder="e.g. 1234567890124521"
                {...register("accountNumber")}
              />
            </FormField>
            <FormField
              label="PDF password"
              error={errors.password?.message}
              id="password"
              hint="Password to unlock statements for this account (if applicable)"
            >
              <Input
                type="password"
                placeholder="Leave blank if not needed"
                {...register("password")}
              />
            </FormField>
          </div>
          <DialogFormFooter
            onCancel={() => onOpenChange(false)}
            submitText="Add account"
            isLoading={isSubmitting}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
