import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { FileUp, FileText, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { Field, TextInput, SelectInput, DialogActions } from "@/components/app/Field";
import { cn } from "@/lib/cn";
import { maskAccountNumber } from "@/lib/format";
import pdfApi from "@/lib/pdfApi";
import { useAuthStore } from "@/stores/authStore";

const schema = z
  .object({
    accountId: z.string().min(1, "Choose the account this statement belongs to"),
    startDate: z.string().min(1, "Pick the first day of the statement"),
    endDate: z.string().min(1, "Pick the last day of the statement"),
  })
  .refine((d) => d.startDate <= d.endDate, {
    message: "The end date can't be before the start date",
    path: ["endDate"],
  });

/** UploadStatementsModal - Send a PDF statement to the parser for one account and period. */
export function UploadStatementsModal({ open, onOpenChange, accounts, onUploaded }) {
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [dragging, setDragging] = useState(false);
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

  function pickFile(files) {
    const file = files?.[0];
    if (!file) return;
    if (file.type && file.type !== "application/pdf") {
      fileRef.current.value = "";
      setFileName("");
      setFileError("That isn't a PDF. Download the statement as a PDF from your bank.");
      return;
    }
    if (files !== fileRef.current.files) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileRef.current.files = dt.files;
    }
    setFileName(file.name);
    setFileError("");
  }

  const onSubmit = async (data) => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setFileError("Choose the PDF statement to upload");
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
      toast.success("Statement uploaded. Setl is reading it now.");
      reset();
      fileRef.current.value = "";
      setFileName("");
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.response?.data?.error || "The upload didn't go through. Check your connection and try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload a statement</DialogTitle>
          <DialogDescription>Choose the account and the period the statement covers, then add the PDF from your bank.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
          <Field label="Account" required error={errors.accountId?.message}>
            <SelectInput {...register("accountId")}>
              <option value="">Choose an account</option>
              {accounts.map((acc) => (
                <option key={acc._id} value={acc._id}>
                  {acc.accountName} · {acc.bankName} {maskAccountNumber(acc.accountNumber)}
                </option>
              ))}
            </SelectInput>
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="From" required error={errors.startDate?.message}>
              <TextInput type="date" {...register("startDate")} />
            </Field>
            <Field label="To" required error={errors.endDate?.message}>
              <TextInput type="date" {...register("endDate")} />
            </Field>
          </div>

          <div>
            <p className="mb-1.5 text-[13.5px] font-medium text-ink" id="statement-file-label">
              PDF statement
            </p>
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                pickFile(e.dataTransfer.files);
              }}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-7 text-center transition-colors",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-violet",
                dragging ? "border-violet bg-lilac" : fileError ? "border-negative/50 bg-negative-soft/40" : "border-hairline-strong hover:border-violet/50 hover:bg-sunken"
              )}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,application/pdf"
                aria-labelledby="statement-file-label"
                aria-describedby={fileError ? "statement-file-error" : undefined}
                className="sr-only"
                onChange={(e) => pickFile(e.target.files)}
              />
              {fileName ? (
                <>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lilac text-violet-ink">
                    <FileText className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="max-w-full truncate text-[14px] font-medium text-ink">{fileName}</span>
                  <span className="text-[12.5px] text-ink-muted">Click to choose a different file</span>
                </>
              ) : (
                <>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sunken text-ink-muted">
                    <FileUp className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-[14px] font-medium text-ink">Drop the PDF here, or click to browse</span>
                  <span className="text-[12.5px] text-ink-muted">One statement per upload</span>
                </>
              )}
            </label>
            {fileError && (
              <p id="statement-file-error" role="alert" className="mt-1.5 text-[12.5px] font-medium text-negative">
                {fileError}
              </p>
            )}
          </div>

          <DialogActions onCancel={() => onOpenChange(false)} submitLabel="Upload" submitIcon={Upload} submitting={isSubmitting} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
