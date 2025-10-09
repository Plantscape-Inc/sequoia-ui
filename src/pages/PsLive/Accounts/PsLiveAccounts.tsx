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
import { Account } from "../../../types/pslive.type";
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

            console.log(data)

            setAccountsData((prev) =>
                prev ? [data, ...prev] : [data]
            );

            console.log(accountsData)

            setShowModal(false);
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
                            <Label htmlFor="address">Address ID</Label>
                            <TextInput
                                id="address"
                                type="number"
                                value={newAccount.address || 0}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="billtoaddress">Bill To Address ID</Label>
                            <TextInput
                                id="billtoaddress"
                                type="number"
                                value={newAccount.billtoaddress || 0}
                                onChange={(e) =>
                                    handleInputChange("billtoaddress", e.target.value)
                                }
                            />
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
                                    className="bg-white dark:bg-gray-800"
                                    onClick={(e) => {
                                        if (!e.target.innerText.includes("Delete")) {
                                            navigate(
                                                `/psliveaccount?accountid=${account.accountid}`
                                            );
                                        }
                                    }}
                                >
                                    <TableCell>
                                        <Button
                                            color="failure"
                                            size="sm"
                                            onClick={(e) => {
                                                e.preventDefault();
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
