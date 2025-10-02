import { useEffect, useState } from "react";
import {
    Button,
    Label,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TextInput,
} from "flowbite-react";
import { ScheduleLine } from "../../../types/pslive.type";

export default function ScheduleEditor() {
    const API_URL = import.meta.env.VITE_PSLIVE_URL;

    const [techId, setTechId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [schedule, setSchedule] = useState<ScheduleLine[]>([]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const techparam = params.get("techid");

        if (techparam) {
            setTechId(techparam);
            fetchSchedule(techparam);
        }
    }, []);


    async function fetchSchedule(id: string) {
        if (!id) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/schedule/${id}`);
            if (!response.ok) throw new Error("Failed to fetch schedule");

            const data: ScheduleLine[] = await response.json();
            console.log(data)
            setSchedule(data);
        } catch (err) {
            console.error(err);
            alert("Error fetching schedule");
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchSchedule(techId);
    };

    const handleChange = (
        id: number,
        field: keyof ScheduleLine,
        value: string | number
    ) => {
        setSchedule((prev) =>
            prev.map((line) =>
                line.id === id ? { ...line, [field]: value } : line
            )
        );
    };

    const handleUpdate = async (line: ScheduleLine) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/schedule/${line.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(line),
            });

            // if (!response.ok) throw new Error("Failed to update schedule");
            console.log(await response.json())

            alert("Schedule updated!");
            fetchSchedule(techId);
        } catch (err) {
            console.error(err);
            alert("Update failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this schedule line?")) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/schedule/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete schedule");

            alert("Schedule deleted!");
            setSchedule((prev) => prev.filter((line) => line.id !== id));
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        } finally {
            setLoading(false);
        }
    };

    const addScheduleLine = async () => {
        const newLine: Omit<ScheduleLine, "id"> = {
            technician: techId,
            day: "",
            orderid: -1,
            account: "",
            totalmins: 0,
            zipcode: 0,
        };

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/schedule`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newLine),
            });

            if (!response.ok) throw new Error("Failed to add schedule");

            await fetchSchedule(techId);
        } catch (err) {
            console.error(err);
            alert("Add failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="relative text-center text-4xl font-bold text-gray-900 dark:text-gray-200">
                Technician Schedule
            </h1>

            {/* Fetch Schedule Form */}
            <form
                className="mx-auto mt-6 flex max-w-md flex-col gap-4"
                onSubmit={handleSubmit}
            >
                <div>
                    <Label className="mb-2 block" htmlFor="techid">
                        Enter Technician ID
                    </Label>
                    <TextInput
                        id="techid"
                        type="text"
                        value={techId}
                        onChange={(e) => setTechId(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Fetch Schedule"}
                </Button>
            </form>

            {loading && (
                <div className="mt-6 flex justify-center">
                    <Spinner size="xl" />
                </div>
            )}

            {/* Schedule Table */}
            {schedule.length > 0 && (
                <div className="m-8">
                    <div className="flex justify-between items-center">
                        <h3 className="m-2 text-2xl font-bold text-gray-900 dark:text-gray-200">
                            Schedule for {techId}
                        </h3>
                        <Button onClick={addScheduleLine}>Add Schedule Line</Button>
                    </div>
                    <Table hoverable>
                        <TableHead>
                            <TableHeadCell>ID</TableHeadCell>
                            <TableHeadCell>Technician</TableHeadCell>
                            <TableHeadCell>Day</TableHeadCell>
                            <TableHeadCell>Account</TableHeadCell>
                            <TableHeadCell>Total Minutes</TableHeadCell>
                            <TableHeadCell>Zipcode</TableHeadCell>
                            <TableHeadCell>Actions</TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y">
                            {schedule.map((line) => (
                                <tr key={line.id}>
                                    <TableCell>{line.id}</TableCell>
                                    <TableCell>
                                        <TextInput
                                            value={line.technician}
                                            onChange={(e) =>
                                                handleChange(line.id, "technician", e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextInput
                                            value={line.day}
                                            onChange={(e) =>
                                                handleChange(line.id, "day", e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextInput
                                            type="string"
                                            value={line.account}
                                            readOnly
                                            onChange={(e) =>
                                                handleChange(line.id, "account", e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextInput
                                            type="number"
                                            value={line.totalmins}
                                            readOnly
                                            onChange={(e) =>
                                                handleChange(line.id, "totalmins", Number(e.target.value))
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextInput
                                            type="number"
                                            value={line.zipcode}
                                            readOnly
                                            onChange={(e) =>
                                                handleChange(line.id, "zipcode", Number(e.target.value))
                                            }
                                        />
                                    </TableCell>
                                    <TableCell className="flex gap-2">
                                        <Button size="xs" onClick={() => handleUpdate(line)}>
                                            Save
                                        </Button>
                                        <Button
                                            size="xs"
                                            color="failure"
                                            onClick={() => handleDelete(line.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </tr>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
