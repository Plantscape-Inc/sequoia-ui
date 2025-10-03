import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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

import { Address } from "../../../types/pslive.type";

export default function Addresses() {
    const API_URL = import.meta.env.VITE_PSLIVE_URL;
    const [searchParams, setSearchParams] = useSearchParams();

    const [loading, setLoading] = useState(false);
    const [addressesData, setAddressesData] = useState<Address[] | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const blankAddress: Address = {
        id: Math.floor(Math.random() * 10000) + 1,
        name1: "",
        name2: "",
        address1: "",
        address2: "",
        address3: "",
        city: "",
        state: "",
        zip: 0,
        contact: "",
        phone: "",
        extension: "",
        fax: "",
    };

    const [formData, setFormData] = useState<Address>(blankAddress);

    // Fetch addresses
    useEffect(() => {
        if (addressesData) return;
        setLoading(true);
        fetch(`${API_URL}/addresses`)
            .then((res) => res.json())
            .then(setAddressesData)
            .finally(() => setLoading(false));
    }, [addressesData, API_URL]);

    // Auto-open modal if URL has addressid
    useEffect(() => {
        if (!addressesData) return;
        const idParam = searchParams.get("addressid");
        if (!idParam) return;

        const addr = addressesData.find(a => a.id.toString() === idParam);
        if (addr) {
            handleRowClick(addr);
        }
    }, [searchParams, addressesData]);

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
            const method = editingAddress ? "PUT" : "POST";
            const url = editingAddress
                ? `${API_URL}/address/${editingAddress.id}`
                : `${API_URL}/address`;

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const err = await response.json();
                setError(err.message || "Failed to save address");
                return;
            }

            setSuccess(true);
            setAddressesData(null); // refresh list
            setFormData(blankAddress);
            setEditingAddress(null);

            setTimeout(() => {
                handleCloseModal();
                setSuccess(false);
            }, 1500);
        } catch (err) {
            setError(`An error occurred while saving the address: ${err}`);
        } finally {
            setSubmitting(false);
        }
    };

    // Open modal for create
    const handleOpenCreateModal = () => {
        setEditingAddress(null);
        setFormData(blankAddress);
        setShowModal(true);
        setSearchParams({ addressid: blankAddress.id.toString() });
    };

    // Open modal for editing
    const handleRowClick = (address: Address) => {
        setEditingAddress(address);
        setFormData(address);
        setShowModal(true);

        setSearchParams({ addressid: address.id.toString() });
    };

    // Close modal and reset
    const handleCloseModal = () => {
        setShowModal(false);
        setError(null);
        setSuccess(false);
        setEditingAddress(null);
        setFormData(blankAddress);
        setSearchParams({}); // remove addressid from URL
    };

    // Handle delete
    const handleDelete = async () => {
        if (!editingAddress) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this address?"
        );
        if (!confirmed) return;

        try {
            setSubmitting(true);
            setError(null);

            const response = await fetch(
                `${API_URL}/address/${editingAddress.id}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                const err = await response.json();
                setError(err.message || "Failed to delete address");
                return;
            }

            setAddressesData(null); // refresh list
            handleCloseModal();
        } catch (err) {
            setError(`An error occurred while deleting the address: ${err}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-200">
                    Addresses
                </h1>
                <Button onClick={handleOpenCreateModal} color="blue">
                    Create Address
                </Button>
            </div>

            {loading && (
                <div className="mt-6 flex justify-center">
                    <Spinner size="xl" />
                </div>
            )}

            {!loading && addressesData && (
                <Table hoverable>
                    <TableHead>
                        <TableHeadCell>ID</TableHeadCell>
                        <TableHeadCell>Name 1</TableHeadCell>
                        <TableHeadCell>Name 2</TableHeadCell>
                        <TableHeadCell>Address 1</TableHeadCell>
                        <TableHeadCell>City</TableHeadCell>
                        <TableHeadCell>State</TableHeadCell>
                        <TableHeadCell>ZIP</TableHeadCell>
                        <TableHeadCell>Contact</TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y">
                        {addressesData.map((address) => (
                            <TableRow
                                key={address.id}
                                className="cursor-pointer bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                                onClick={() => handleRowClick(address)}
                            >
                                <TableCell>{address.id}</TableCell>
                                <TableCell>{address.name1}</TableCell>
                                <TableCell>{address.name2 || "-"}</TableCell>
                                <TableCell>{address.address1}</TableCell>
                                <TableCell>{address.city}</TableCell>
                                <TableCell>{address.state}</TableCell>
                                <TableCell>{address.zip}</TableCell>
                                <TableCell>{address.contact}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Modal show={showModal} onClose={handleCloseModal}>
                <ModalHeader>
                    {editingAddress ? "Update Address" : "Create New Address"}
                </ModalHeader>
                <ModalBody>
                    {error && (
                        <Alert color="failure" className="mb-4">
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert color="success" className="mb-4">
                            Address saved successfully!
                        </Alert>
                    )}
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="id">ID</Label>
                            <TextInput
                                id="id"
                                name="id"
                                readOnly
                                contentEditable={false}
                                value={formData?.id || ""}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter primary name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="name1">Name 1</Label>
                            <TextInput
                                id="name1"
                                name="name1"
                                value={formData?.name1 || ""}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter primary name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="name2">Name 2</Label>
                            <TextInput
                                id="name2"
                                name="name2"
                                value={formData?.name2 || ""}
                                onChange={handleInputChange}
                                placeholder="Enter secondary name (optional)"
                            />
                        </div>
                        <div>
                            <Label htmlFor="address1">Address 1 *</Label>
                            <TextInput
                                id="address1"
                                name="address1"
                                value={formData?.address1 || ""}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter street address"
                            />
                        </div>
                        <div>
                            <Label htmlFor="address2">Address 2</Label>
                            <TextInput
                                id="address2"
                                name="address2"
                                value={formData?.address2 || ""}
                                onChange={handleInputChange}
                                placeholder="Apartment, suite, etc. (optional)"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="city">City</Label>
                                <TextInput
                                    id="city"
                                    name="city"
                                    value={formData?.city || ""}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="City"
                                />
                            </div>
                            <div>
                                <Label htmlFor="state">State</Label>
                                <TextInput
                                    id="state"
                                    name="state"
                                    value={formData?.state || ""}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="State"
                                />
                            </div>
                            <div>
                                <Label htmlFor="zip">ZIP</Label>
                                <TextInput
                                    id="zip"
                                    name="zip"
                                    type="number"
                                    value={formData?.zip || 0}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="ZIP Code"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="contact">Contact</Label>
                            <TextInput
                                id="contact"
                                name="contact"
                                value={formData?.contact || ""}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter contact name or phone"
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="flex justify-between items-center">
                    {/* Delete Button */}
                    <div>
                        {editingAddress && (
                            <Button color="failure" onClick={handleDelete}>
                                Delete
                            </Button>
                        )}
                    </div>

                    {/* Submit & Cancel */}
                    <div className="flex gap-2">
                        <Button onClick={handleSubmit} disabled={submitting} color="blue">
                            {submitting ? (
                                <Spinner size="sm" />
                            ) : editingAddress ? (
                                "Update Address"
                            ) : (
                                "Create Address"
                            )}
                        </Button>
                        <Button color="gray" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                    </div>
                </ModalFooter>
            </Modal>
        </div>
    );
}
