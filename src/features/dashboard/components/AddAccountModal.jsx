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
import { BANKS } from "../constants";

const schema = z.object({
  bank: z.string().min(1, "Select a bank"),
  name: z.string().min(1, "Account name is required").max(50, "Too long"),
  accountNumber: z.string().min(1, "Account number is required").max(24, "Too long"),
});

/**
 * AddAccountModal - Create a new account (bank + nickname). Dummy: generates a mask.
 */
export function AddAccountModal({ open, onOpenChange, onAdded }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { bank: "", name: "", accountNumber: "" },
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const onSubmit = (data) => {
    const cleaned = trimFormData(data);
    const id = `acc-${Date.now()}`;
    const num = String(cleaned.accountNumber).replace(/\D/g, "");
    const mask = num.length >= 4 ? "****" + num.slice(-4) : "****" + num;
    onAdded({
      id,
      bank: cleaned.bank,
      name: cleaned.name,
      accountNumber: cleaned.accountNumber,
      mask,
    });
    toast.success("Account added.");
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add account</DialogTitle>
          <DialogDescription>
            Select the bank and give this account a nickname. You can upload statements for it later.
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
              error={errors.name?.message}
              id="name"
              hint="e.g. Primary, Savings"
            >
              <Input
                type="text"
                placeholder="My account"
                {...register("name")}
              />
            </FormField>
            <FormField
              label="Account number"
              required
              error={errors.accountNumber?.message}
              id="accountNumber"
              hint="Last 4 digits used for mask (e.g. 4521)"
            >
              <Input
                type="text"
                placeholder="e.g. 1234567890124521"
                {...register("accountNumber")}
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
