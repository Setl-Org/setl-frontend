import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { Field, TextInput, SelectInput, DialogActions } from "@/components/app/Field";
import { BankLogo } from "@/components/ui/BankLogo";
import { cn } from "@/lib/cn";
import { trimFormData } from "@/lib/formUtils";
import api from "@/lib/api";
import { BANKS } from "../constants";

const schema = z.object({
  bank: z.string({ invalid_type_error: "Pick your bank" }).min(1, "Pick your bank"),
  accountName: z.string().min(1, "Give the account a name").max(50, "Keep it under 50 characters"),
  accountType: z.enum(["checking", "savings"], { message: "Choose checking or savings" }),
  accountNumber: z.string().min(1, "Enter the account number").max(24, "That's longer than any account number"),
  password: z.string().optional(),
});

/**
 * AddAccountModal - Create a new account via the backend API. The bank is picked
 * from a logo grid (native radios, so arrow keys and screen readers work).
 */
export function AddAccountModal({ open, onOpenChange, onAdded }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { bank: "", accountName: "", accountType: "", accountNumber: "", password: "" },
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });
  const selectedBank = watch("bank");

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
      toast.success(`${accountName} added`);
      onAdded(res.data.data.account);
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Couldn't add the account. Check the details and try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add an account</DialogTitle>
          <DialogDescription>Pick your bank and enter the account details. You can upload statements for it next.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
          <fieldset aria-describedby={errors.bank ? "bank-error" : undefined}>
            <legend className="mb-2 text-[13.5px] font-medium text-ink">Bank</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {BANKS.map((b) => (
                <label
                  key={b}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-lg border px-2.5 py-2 text-[13px] font-medium transition-colors",
                    "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-violet",
                    selectedBank === b ? "border-violet/50 bg-lilac text-violet-ink" : "border-hairline text-ink hover:bg-sunken"
                  )}
                >
                  <input type="radio" value={b} className="sr-only" {...register("bank")} />
                  <BankLogo bankName={b} className="h-7 w-7 rounded-md" />
                  <span className="truncate">{b}</span>
                </label>
              ))}
            </div>
            {errors.bank && (
              <p id="bank-error" role="alert" className="mt-1.5 text-[12.5px] font-medium text-negative">
                {errors.bank.message}
              </p>
            )}
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Account name" required hint="For example, Salary account" error={errors.accountName?.message}>
              <TextInput placeholder="My account" autoComplete="off" {...register("accountName")} />
            </Field>
            <Field label="Account type" required error={errors.accountType?.message}>
              <SelectInput {...register("accountType")}>
                <option value="">Choose a type</option>
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </SelectInput>
            </Field>
          </div>

          <Field label="Account number" required hint="Setl shows only the last 4 digits" error={errors.accountNumber?.message}>
            <TextInput inputMode="numeric" autoComplete="off" placeholder="1234567890124521" {...register("accountNumber")} />
          </Field>

          <Field label="Statement PDF password" hint="Only if your bank locks its PDF statements" error={errors.password?.message}>
            {/* Deliberately not type="password": browsers then treat this dialog as a sign-in form and
                autofill the user's Setl email and password into it. Masked with CSS instead, and marked
                so password managers skip it. */}
            <TextInput
              type="text"
              autoComplete="off"
              spellCheck={false}
              data-1p-ignore=""
              data-lpignore="true"
              data-form-type="other"
              style={{ WebkitTextSecurity: "disc" }}
              placeholder="Leave blank if not needed"
              {...register("password")}
            />
          </Field>

          <DialogActions onCancel={() => onOpenChange(false)} submitLabel="Add account" submitIcon={Plus} submitting={isSubmitting} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
