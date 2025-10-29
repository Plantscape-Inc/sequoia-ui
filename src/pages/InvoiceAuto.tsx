import { useState } from "react";

import { Button, FileInput, Label, Spinner } from "flowbite-react";

export default function InvoiceAuto() {
  const API_URL = import.meta.env.VITE_EPICOR_INVOICE_AUTO_API_URL;

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("invoice", file);

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/parsepdf`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      const disposition = response.headers.get("Content-Disposition");
      let filename = "downloaded-file";
      if (disposition?.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/["']/g, "");
      }

      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h1 className="relative text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
          Epicor Invoice Automation
        </h1>

        <form
          className="mx-auto mt-6 flex max-w-md flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <div>
            <Label className="mb-2 block" htmlFor="invoicePdf">
              Upload file
            </Label>
            <FileInput
              id="invoicePdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>

        {loading && (
          <div className="mt-6 flex justify-center">
            <Spinner size="xl" />
          </div>
        )}
      </div>
    </div>
  );
}
