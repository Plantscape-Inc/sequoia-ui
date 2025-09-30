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
} from "flowbite-react";
import { Account } from "../../../types/pslive.type";
import { useNavigate } from "react-router-dom";

export default function Accounts() {
    const API_URL = import.meta.env.VITE_PSLIVE_URL;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [accountsData, setAccountsData] = useState<Account[] | null>(null);

    useEffect(() => {
        if (accountsData) return;

        setLoading(true);

        fetch(`${API_URL}/accounts`)
            .then((data) => data.json())
            .then(setAccountsData)
            .finally(() => setLoading(false));
    }, [accountsData, API_URL]);

    interface Result {
        result: Account;
    }

    const addBlankAccount = () => {
        setLoading(true);
        fetch(`${API_URL}/newBlankAccount`, { method: "GET" })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to create account");
                return res.json();
            })
            .then((createdAccount: Result) => {
                setAccountsData((prev) =>
                    prev ? [createdAccount.result, ...prev] : [createdAccount.result]
                );
            })
            .catch(console.error)
            .finally(() => setLoading(false));
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

            // Remove deleted account from state
            setAccountsData((prev) =>
                prev ? prev.filter((account) => account.accountid !== accountid) : null
            );
        } catch (err) {
            console.error(err);
            alert("An error occurred while deleting the account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="relative text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
                Accounts
            </h1>

            <div className="mt-4 flex justify-center">
                <Button onClick={addBlankAccount}>Add New Account</Button>
            </div>

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
                            <TableHeadCell>Address</TableHeadCell>
                            <TableHeadCell>Bill To Address</TableHeadCell>
                            <TableHeadCell>Date</TableHeadCell>
                            <TableHeadCell>Locations</TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y">
                            {accountsData.map((account) => (
                                <TableRow
                                    key={account.accountid}
                                    className="bg-white dark:bg-gray-800"
                                    onClick={() =>
                                        navigate(`/psliveaccount?accountid=${account.accountid}`)
                                    }
                                >
                                    {/* Delete button */}
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
                                    <TableCell>{account.address}</TableCell>
                                    <TableCell>{account.billtoaddress}</TableCell>
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
