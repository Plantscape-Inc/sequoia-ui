import { useState } from "react";

import { Button, FileInput, Label } from "flowbite-react";



export default function InvoiceAuto() {

    const API_URL = "http://localhost:5555"

    const [file, setFile] = useState<File | null>(null);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("submit")

        if (!file) {
            alert("Please select a file first");
            return;
        }

        const formData = new FormData();
        formData.append("invoice", file);

        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            const response = await fetch(`${API_URL}/parsepdf`, {
                method: "POST",
                body: formData,
            });
            // const response = await fetch(`${API_URL}/test`, {
            //     method: "POST"
            // });

            console.log(response)

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            console.log(response)

            // Get the response as a blob (file)
            const blob = await response.blob();

            // Create a temporary link to download the file
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");

            // Optionally, get filename from response headers
            const disposition = response.headers.get("Content-Disposition");
            let filename = "downloaded-file";
            if (disposition?.includes("filename=")) {
                filename = disposition.split("filename=")[1].replace(/["']/g, "");
            }

            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            // Cleanup
            a.remove();
            window.URL.revokeObjectURL(url);

            console.log("File download triggered successfully.");
        } catch (err) {
            console.error(err);
        }

    };


    return (
        <div>
            <div>
                <h1 className="relative text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
                    Epicor Invoice Automation
                </h1>

                <form
                    className="flex max-w-md flex-col gap-4 mt-6 mx-auto"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <Label className="mb-2 block" htmlFor="invoicePdf">
                            Upload file
                        </Label>
                        <FileInput id="invoicePdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />

                    </div>
                    <Button type="submit">Submit</Button>
                </form>

            </div>

        </div>
    );
}
