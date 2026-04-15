import { useRef, useState } from "react";
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
import { Input } from "@/components/ui/Input";
import { DialogFormFooter } from "@/components/ui/DialogFormFooter";
import pdfApi from "@/lib/pdfApi";
import { useAuthStore } from "@/stores/authStore";

const schema = z.object({
  accountId: z.string().min(1, "Select an account"),
  startDate: z.string().min(1, "Select start date"),
  endDate: z.string().min(1, "Select end date"),
}).refine((d) => d.startDate <= d.endDate, {
  message: "End date must be on or after start date",
  path: ["endDate"],
});

export function UploadStatementsModal({
  open,
  onOpenChange,
  accounts,
  onUploaded,
}) {
  const fileRef = useRef(null);
  const [fileError, setFileError] = useState("");
  const user = useAuthStore((s) => s.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { accountId: "", startDate: "", endDate: "" },
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const onSubmit = async (data) => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setFileError("Please select a PDF file");
      return;
    }
    setFileError("");

    const account = accounts.find((a) => String(a._id) === String(data.accountId));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bank_name", account?.bankName || "Unknown Bank");
    if (user?._id) formData.append("user_id", user._id);
    if (data.accountId) formData.append("account_id", data.accountId);
    if (data.startDate) formData.append("start_date", data.startDate);
    if (data.endDate) formData.append("end_date", data.endDate);
    if (account?.password) formData.append("encrypted_password", account.password);

    try {
      await pdfApi.post("/extract-pdf/async", formData);
      onUploaded?.();
      toast.success("Statement uploaded. Processing started.");
      reset();
      fileRef.current.value = "";
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Upload failed. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload statement</DialogTitle>
          <DialogDescription>
            Choose the account and the statement period. Upload a PDF from your bank.
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
                {accounts.map((acc) => {
                  const mask = String(acc.accountNumber ?? "").replace(/\D/g, "").slice(-4);
                  return (
                    <option key={acc._id} value={acc._id}>
                      {acc.accountName} · {acc.bankName}{mask ? ` ····${mask}` : ""}
                    </option>
                  );
                })}
              </Select>
            </FormField>
            <FormField
              label="Start date"
              required
              error={errors.startDate?.message}
              id="startDate"
            >
              <Input type="date" {...register("startDate")} />
            </FormField>
            <FormField
              label="End date"
              required
              error={errors.endDate?.message}
              id="endDate"
            >
              <Input type="date" {...register("endDate")} />
            </FormField>
            <FormField label="PDF file" required id="file" error={fileError}>
              <input
                ref={fileRef}
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
