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
    Label,
    TextInput,
    ModalFooter,
    ModalBody,
    ModalHeader,
} from "flowbite-react";
import { Account, Address } from "../../../types/pslive.type";
import { useNavigate } from "react-router-dom";

export default function Accounts() {
    const API_URL = import.meta.env.VITE_PSLIVE_URL;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [accountsData, setAccountsData] = useState<Account[] | null>(null);

    // New state for modal visibility & form data
    const [showModal, setShowModal] = useState(false);
    const [newAccount, setNewAccount] = useState<Partial<Account>>({
        accountid: "",
        address: 0,
        billtoaddress: 0,
        chemicalinfo: "",
        waterinfo: "",
        miscnotes: "",
        date: new Date().toISOString(),
        locations: [],
    });

    // Address modal states
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressList, setAddressList] = useState<Address[]>([]);
    const [addressFieldTarget, setAddressFieldTarget] = useState<"address" | "billtoaddress" | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [selectedBillToAddress, setSelectedBillToAddress] = useState<Address | null>(null);

    useEffect(() => {
        if (accountsData) return;
        setLoading(true);
        fetch(`${API_URL}/accounts`)
            .then((data) => data.json())
            .then(setAccountsData)
            .finally(() => setLoading(false));
    }, []);

    const handleInputChange = (field: keyof Account, value: string) => {
        setNewAccount((prev) => ({
            ...prev,
            [field]:
                field === "address" || field === "billtoaddress"
                    ? Number(value)
                    : value,
        }));
    };

    async function fetchAddresses() {
        try {
            const response = await fetch(`${API_URL}/addresses`);
            if (!response.ok) throw new Error("Failed to fetch addresses");
            const data: Address[] = await response.json();
            setAddressList(data);
        } catch (err) {
            console.error(err);
            alert("Error fetching addresses");
        }
    }

    const handleCreateAccount = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/account`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAccount),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create account");

            setAccountsData((prev) =>
                prev ? [data, ...prev] : [data]
            );

            // Reset form
            setShowModal(false);
            setNewAccount({
                accountid: "",
                address: 0,
                billtoaddress: 0,
                chemicalinfo: "",
                waterinfo: "",
                miscnotes: "",
                date: new Date().toISOString(),
                locations: [],
            });
            setSelectedAddress(null);
            setSelectedBillToAddress(null);
        } catch (err) {
            console.error(err);
            alert("Failed to create account.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async (accountid: string | number) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this account?"
        );
        if (!confirmed) return;

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/account/${accountid}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete account");

            setAccountsData((prev) =>
                prev ? prev.filter((account) => account.accountid !== accountid) : null
            );
        } catch (err) {
            console.error(err);
            alert("An error occurred while deleting the account.");
        } finally {
            navigate("/psliveaccounts");
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="relative text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
                Accounts
            </h1>

            <div className="mt-4 flex justify-center">
                <Button onClick={() => setShowModal(true)}>Add New Account</Button>
            </div>

            {/* Modal for adding a new account */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <ModalHeader>Create New Account</ModalHeader>
                <ModalBody>
                    <div className="space-y-3">
                        <div>
                            <Label htmlFor="accountid">Account ID</Label>
                            <TextInput
                                id="accountid"
                                placeholder="e.g. account123456"
                                value={newAccount.accountid || ""}
                                onChange={(e) => handleInputChange("accountid", e.target.value.replace(" ", ""))}
                            />
                        </div>

                        <div>
                            <Label htmlFor="address">Physical Address</Label>
                            <div className="flex gap-2">
                                <Button
                                    size="xs"
                                    onClick={() => {
                                        setAddressFieldTarget("address");
                                        setShowAddressModal(true);
                                        fetchAddresses();
                                    }}
                                >
                                    {selectedAddress ? selectedAddress.name1 : "Select Address"}
                                </Button>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="billtoaddress">Bill To Address</Label>
                            <div className="flex gap-2">
                                <Button
                                    size="xs"
                                    onClick={() => {
                                        setAddressFieldTarget("billtoaddress");
                                        setShowAddressModal(true);
                                        fetchAddresses();
                                    }}
                                >
                                    {selectedBillToAddress ? selectedBillToAddress.name1 : "Select Address"}
                                </Button>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="chemicalinfo">Chemical Info</Label>
                            <TextInput
                                id="chemicalinfo"
                                value={newAccount.chemicalinfo || ""}
                                onChange={(e) =>
                                    handleInputChange("chemicalinfo", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <Label htmlFor="waterinfo">Water Info</Label>
                            <TextInput
                                id="waterinfo"
                                value={newAccount.waterinfo || ""}
                                onChange={(e) => handleInputChange("waterinfo", e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="miscnotes">Misc Notes</Label>
                            <TextInput
                                id="miscnotes"
                                value={newAccount.miscnotes || ""}
                                onChange={(e) => handleInputChange("miscnotes", e.target.value)}
                            />
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button onClick={handleCreateAccount}>Create</Button>
                    <Button color="gray" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Address Selection Modal */}
            <Modal show={showAddressModal} size="5xl" onClose={() => setShowAddressModal(false)}>
                <ModalHeader>Select Address</ModalHeader>
                <ModalBody>
                    <Table hoverable>
                        <TableHead>
                            <TableHeadCell>ID</TableHeadCell>
                            <TableHeadCell>Name</TableHeadCell>
                            <TableHeadCell>City</TableHeadCell>
                            <TableHeadCell>State</TableHeadCell>
                            <TableHeadCell>Zip</TableHeadCell>
                            <TableHeadCell>Select</TableHeadCell>
                        </TableHead>
                        <TableBody>
                            {addressList.map((addr) => (
                                <tr key={addr.id}>
                                    <TableCell>{addr.id}</TableCell>
                                    <TableCell>{addr.name1}</TableCell>
                                    <TableCell>{addr.city}</TableCell>
                                    <TableCell>{addr.state}</TableCell>
                                    <TableCell>{addr.zip}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="xs"
                                            onClick={() => {
                                                if (!addressFieldTarget) return;

                                                // Update newAccount with address ID
                                                handleInputChange(addressFieldTarget, String(addr.id));

                                                // Update display state
                                                if (addressFieldTarget === "address") {
                                                    setSelectedAddress(addr);
                                                } else if (addressFieldTarget === "billtoaddress") {
                                                    setSelectedBillToAddress(addr);
                                                }

                                                setShowAddressModal(false);
                                                setAddressFieldTarget(null);
                                            }}
                                        >
                                            Choose
                                        </Button>
                                    </TableCell>
                                </tr>
                            ))}
                        </TableBody>
                    </Table>
                </ModalBody>
                <ModalFooter>
                    <Button color="gray" onClick={() => setShowAddressModal(false)}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>

            {loading && (
                <div className="mt-6 flex justify-center">
                    <Spinner size="xl" />
                </div>
            )}

            {!loading && accountsData && (
                <div className="mt-6">
                    <Table hoverable>
                        <TableHead>
                            <TableHeadCell>Options</TableHeadCell>
                            <TableHeadCell>Account ID</TableHeadCell>
                            <TableHeadCell>Date</TableHeadCell>
                            <TableHeadCell>Locations</TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y">
                            {accountsData.map((account) => (
                                <TableRow
                                    key={account.accountid}
                                    className="bg-white dark:bg-gray-800 cursor-pointer"
                                    onClick={() =>
                                        navigate(`/psliveaccount?accountid=${account.accountid}`)
                                    }
                                >
                                    <TableCell>
                                        <Button
                                            color="failure"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation(); // ✅ prevent row click
                                                handleDeleteAccount(account.accountid);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>

                                    <TableCell>{account.accountid}</TableCell>
                                    <TableCell>
                                        {account.date
                                            ? new Date(account.date).toLocaleDateString()
                                            : "-"}
                                    </TableCell>
                                    <TableCell>
                                        {account.locations.length > 0
                                            ? account.locations.map((loc) => loc.location).join(", ")
                                            : "-"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

        </div>
    );
}