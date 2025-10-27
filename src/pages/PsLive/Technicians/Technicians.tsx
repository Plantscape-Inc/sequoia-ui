import { useEffect, useState } from "react";
import {
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Label,
    TextInput,
    Alert,
} from "flowbite-react";

import { Technician } from "../../../types/pslive.type"

export default function PsLiveTechnicians() {
    const API_URL = import.meta.env.VITE_PSLIVE_URL;

    const [loading, setLoading] = useState(false);
    const [technicians, setTechnicians] = useState<Technician[] | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [editingTech, setEditingTech] = useState<Technician | null>(null);

    const blankTechnician: Technician = {
        id: Math.floor(Math.random() * 10000) + 1,
        firstname: "",
        lastname: "",
        techid: "",
    };

    const [formData, setFormData] = useState<Technician>(blankTechnician);

    // Fetch all technicians
    useEffect(() => {
        if (technicians) return;
        setLoading(true);
        fetch(`${API_URL}/technicians`)
            .then((res) => res.json())
            .then(setTechnicians)
            .finally(() => setLoading(false));
    }, [technicians, API_URL]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle create/update
    const handleSubmit = async () => {
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            const method = editingTech ? "PUT" : "POST";
            const url = editingTech
                ? `${API_URL}/technician/${editingTech.id}`
                : `${API_URL}/technician`;

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const err = await response.json();
                setError(err.message || "Failed to save technician");
                return;
            }

            setSuccess(true);
            setTechnicians(null); // refresh list
            setFormData(blankTechnician);
            setEditingTech(null);

            setTimeout(() => {
                setShowModal(false);
                setSuccess(false);
            }, 1500);
        } catch (err) {
            setError(`An error occurred: ${err}`);
        } finally {
            setSubmitting(false);
        }
    };

    // Open modal for create
    const handleOpenCreateModal = () => {
        setEditingTech(null);
        setFormData(blankTechnician);
        setShowModal(true);
    };

    // Open modal for editing
    const handleRowClick = (tech: Technician) => {
        setEditingTech(tech);
        setFormData(tech);
        setShowModal(true);
    };

    // Close modal and reset
    const handleCloseModal = () => {
        setShowModal(false);
        setError(null);
        setSuccess(false);
        setEditingTech(null);
        setFormData(blankTechnician);
    };

    // Handle delete
    const handleDelete = async () => {
        if (!editingTech) return;
        const confirmed = window.confirm("Are you sure you want to delete this technician?");
        if (!confirmed) return;

        try {
            setSubmitting(true);
            setError(null);

            const response = await fetch(`${API_URL}/technician/${editingTech.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const err = await response.json();
                setError(err.message || "Failed to delete technician");
                return;
            }

            setTechnicians(null); // refresh list
            setShowModal(false);
        } catch (err) {
            setError(`An error occurred: ${err}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-200">Technicians</h1>
                <Button onClick={handleOpenCreateModal} color="blue">Create Technician</Button>
            </div>

            {loading && (
                <div className="mt-6 flex justify-center">
                    <Spinner size="xl" />
                </div>
            )}

            {!loading && technicians && (
                <Table hoverable>
                    <TableHead>
                        <TableHeadCell>ID</TableHeadCell>
                        <TableHeadCell>First Name</TableHeadCell>
                        <TableHeadCell>Last Name</TableHeadCell>
                        <TableHeadCell>Tech ID</TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y">
                        {technicians.map((tech) => (
                            <TableRow
                                key={tech.id}
                                className="cursor-pointer bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                                onClick={() => handleRowClick(tech)}
                            >
                                <TableCell>{tech.id}</TableCell>
                                <TableCell>{tech.firstname}</TableCell>
                                <TableCell>{tech.lastname}</TableCell>
                                <TableCell>{tech.techid}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Modal show={showModal} onClose={handleCloseModal}>
                <ModalHeader>{editingTech ? "Update Technician" : "Create New Technician"}</ModalHeader>
                <ModalBody>
                    {error && <Alert color="failure" className="mb-4">{error}</Alert>}
                    {success && <Alert color="success" className="mb-4">Technician saved successfully!</Alert>}
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="firstname">First Name</Label>
                            <TextInput
                                id="firstname"
                                name="firstname"
                                value={formData?.firstname || ""}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter first name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastname">Last Name</Label>
                            <TextInput
                                id="lastname"
                                name="lastname"
                                value={formData?.lastname || ""}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter last name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="techid">Tech ID</Label>
                            <TextInput
                                id="techid"
                                name="techid"
                                value={formData?.techid || ""}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter unique tech ID"
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="flex justify-between items-center">
                    {editingTech && (
                        <Button color="failure" onClick={handleDelete}>Delete</Button>
                    )}
                    <div className="flex gap-2">
                        <Button onClick={handleSubmit} disabled={submitting} color="blue">
                            {submitting ? <Spinner size="sm" /> : editingTech ? "Update Technician" : "Create Technician"}
                        </Button>
                        <Button color="gray" onClick={handleCloseModal}>Cancel</Button>
                    </div>
                </ModalFooter>
            </Modal>
        </div>
    );
}
