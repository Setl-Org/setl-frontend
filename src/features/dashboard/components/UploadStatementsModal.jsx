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
import { Select } from "@/components/ui/Select";
import { DialogFormFooter } from "@/components/ui/DialogFormFooter";
import { MONTHS } from "../constants";

const schema = z.object({
  accountId: z.string().min(1, "Select an account"),
  month: z.string().min(1, "Select month"),
  year: z.string().min(1, "Select year"),
});

const YEARS = ["2025", "2024", "2023"];

/**
 * UploadStatementsModal - Select account, month, year and upload PDF. Dummy: no real file upload.
 */
export function UploadStatementsModal({
  open,
  onOpenChange,
  accounts,
  onUploaded,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { accountId: "", month: "", year: "" },
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const onSubmit = () => {
    onUploaded?.();
    toast.success("Statement upload started. We'll parse it shortly.");
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload statement</DialogTitle>
          <DialogDescription>
            Choose the account and the statement month. Upload a PDF from your bank.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 pt-2">
            <FormField
              label="Account"
              required
              error={errors.accountId?.message}
              id="accountId"
            >
              <Select {...register("accountId")}>
                <option value="">Select account</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} · {acc.bank} {acc.mask}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField
              label="Month"
              required
              error={errors.month?.message}
              id="month"
            >
              <Select {...register("month")}>
                <option value="">Select month</option>
                {MONTHS.map((m, i) => (
                  <option key={m} value={String(i + 1)}>
                    {m}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField
              label="Year"
              required
              error={errors.year?.message}
              id="year"
            >
              <Select {...register("year")}>
                <option value="">Select year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="PDF file" id="file" hint="PDF statement from your bank (optional for demo)">
              <input
                type="file"
                accept=".pdf"
                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-tertiary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-tertiary hover:file:bg-tertiary/20"
              />
            </FormField>
          </div>
          <DialogFormFooter
            onCancel={() => onOpenChange(false)}
            submitText="Upload"
            isLoading={isSubmitting}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
