import {
    TableRow,
    TableCell,
    TextInput,
    Button,
    Dropdown,
    DropdownItem,
} from "flowbite-react";
import { useState } from "react";
import { ArrowUp } from "lucide-react";
import type { OrderJobTime } from "../../../types/pslive.type";

// Single row editable component
interface EditableOrderJobTimeRowProps {
    job: OrderJobTime;
}

export default function OrderJobTimeRow({ job }: EditableOrderJobTimeRowProps) {
    const API_URL = import.meta.env.VITE_PSLIVE_URL;
    const [localJob, setLocalJob] = useState<OrderJobTime>(job);

    const handleFieldChange = (
        field: keyof OrderJobTime,
        value: string | number | null,
    ) => {
        const updated = { ...localJob, [field]: value };
        setLocalJob(updated);
    };

    async function updateJob(newJob: OrderJobTime) {
        try {
            const response = await fetch(`${API_URL}/orderjobtime/${newJob.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newJob),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update job time");
            }

            alert(`Updated job ${newJob.id} successfully`);
        } catch (error) {
            alert(`Error updating job: ${error}`);
        }
    }

    const deleteJob = async () => {
        try {
            const response = await fetch(`${API_URL}/orderjobtime/${job.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

        } catch (error) {
            alert(`Error deleting job: ${error}`);
        } finally {
            window.location.reload();
        }
    };

    return (
        <TableRow className="bg-white dark:bg-gray-800">
            <TableCell>
                {localJob !== job && (
                    <div className="flex justify-center">
                        <Button
                            onClick={() => updateJob(localJob)}
                            size="sm"
                            color="white"
                            className="rounded border border-gray-400 bg-green-600 shadow-sm hover:border-gray-600"
                        >
                            <ArrowUp className="h-4 w-4 text-white" />
                        </Button>
                    </div>
                )}
            </TableCell>
            <TableCell>
                <Dropdown
                    label="Options"
                    inline={true}
                    color="gray"
                    size="sm"
                    arrowIcon={true}
                >
                    <DropdownItem onClick={deleteJob}>Delete</DropdownItem>
                </Dropdown>
            </TableCell>
            <TableCell>{localJob.id}</TableCell>
            <TableCell>{localJob.orderid}</TableCell>
            <TableCell>
                <TextInput
                    value={localJob.option}
                    onChange={(e) => handleFieldChange("option", e.target.value)}
                />
            </TableCell>
            <TableCell>
                <TextInput
                    type="number"
                    value={localJob.fp}
                    onChange={(e) => handleFieldChange("fp", parseFloat(e.target.value))}
                />
            </TableCell>
            <TableCell>
                <TextInput
                    type="number"
                    value={localJob.plntr ?? 0}
                    onChange={(e) =>
                        handleFieldChange(
                            "plntr",
                            e.target.value ? parseFloat(e.target.value) : null,
                        )
                    }
                />
            </TableCell>
            <TableCell>
                <TextInput
                    type="number"
                    value={localJob.vine ?? 0}
                    onChange={(e) =>
                        handleFieldChange(
                            "vine",
                            e.target.value ? parseFloat(e.target.value) : null,
                        )
                    }
                />
            </TableCell>
            <TableCell>
                <TextInput
                    type="number"
                    value={localJob.travel}
                    onChange={(e) =>
                        handleFieldChange("travel", parseFloat(e.target.value))
                    }
                />
            </TableCell>
            <TableCell>
                <TextInput
                    type="number"
                    value={localJob.total}
                    onChange={(e) =>
                        handleFieldChange("total", parseFloat(e.target.value))
                    }
                />
            </TableCell>
        </TableRow>
    );
}
