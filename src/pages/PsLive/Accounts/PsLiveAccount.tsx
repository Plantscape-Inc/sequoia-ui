import { useEffect, useState } from "react";
import {
    Button,
    Label,
    Spinner,
    Table,
    TableBody,
    TableHead,
    TableHeadCell,
    TextInput,
} from "flowbite-react";
import { Account } from "../../../types/pslive.type";
import AccountLocationDisplay from './PsLiveAccountLocationDisplay'

export default function AccountEditor() {
    const API_URL = import.meta.env.VITE_PSLIVE_URL;

    const [accountId, setAccountId] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const [account, setAccount] = useState<Account | null>(null);
    const [tempAccount, setTempAccount] = useState<Account | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const accountParam = params.get("accountid");

        if (accountParam) {
            setAccountId(accountParam);
            updateAccount(accountParam);
        }
    }, []);

    async function updateAccount(newAccountId: string) {
        if (!newAccountId) return;

        setLoading(true);
        try {
            const data = await (await fetch(`${API_URL}/account/${newAccountId}`)).json();
            setAccount(data);
            setTempAccount(data);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (field: keyof Account, value: unknown) => {
        if (!tempAccount) return;
        setTempAccount({ ...tempAccount, [field]: value } as Account);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!accountId) {
            alert("Please enter an Account ID");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/account/${accountId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tempAccount),
            });

            if (!response.ok) throw new Error("Failed to update account");

            await updateAccount(accountId);
        } catch (err) {
            console.error(err);
            alert("Something went wrong while saving the account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="relative text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
                Account
            </h1>

            <form
                className="mx-auto mt-6 flex max-w-md flex-col gap-4"
                onSubmit={handleSubmit}
            >
                <div>
                    <Label className="mb-2 block" htmlFor="accountid">
                        Enter Account ID
                    </Label>
                    <TextInput
                        id="accountid"
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Load Account"}
                </Button>
            </form>

            {loading && (
                <div className="mt-6 flex justify-center">
                    <Spinner size="xl" />
                </div>
            )}

            {account && tempAccount && (
                <div className="mx-auto max-w-4xl mt-8">
                    <form
                        className="flex flex-wrap gap-4"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex min-w-[200px] flex-1 flex-col gap-4">
                            <Label htmlFor="chemicalinfo">Chemical Info</Label>
                            <TextInput
                                id="chemicalinfo"
                                value={tempAccount.chemicalinfo || ""}
                                onChange={(e) => handleChange("chemicalinfo", e.target.value)}
                            />

                            <Label htmlFor="waterinfo">Water Info</Label>
                            <TextInput
                                id="waterinfo"
                                value={tempAccount.waterinfo || ""}
                                onChange={(e) => handleChange("waterinfo", e.target.value)}
                            />

                            <Label htmlFor="miscnotes">Misc Notes</Label>
                            <TextInput
                                id="miscnotes"
                                value={tempAccount.miscnotes || ""}
                                onChange={(e) => handleChange("miscnotes", e.target.value)}
                            />
                        </div>

                        <div className="flex min-w-[200px] flex-1 flex-col gap-4">
                            <Label htmlFor="date">Date</Label>
                            <TextInput
                                id="date"
                                type="date"
                                value={tempAccount.date}
                                onChange={(e) => handleChange("date", e.target.value)}
                            />

                            <Label htmlFor="address">Address ID</Label>
                            <TextInput
                                id="address"
                                type="number"
                                value={tempAccount.address}
                                onChange={(e) => handleChange("address", Number(e.target.value))}
                            />

                            <Label htmlFor="billtoaddress">Bill To Address ID</Label>
                            <TextInput
                                id="billtoaddress"
                                type="number"
                                value={tempAccount.billtoaddress}
                                onChange={(e) =>
                                    handleChange("billtoaddress", Number(e.target.value))
                                }
                            />
                        </div>

                        <div className="mt-4 w-full">
                            <Button type="submit">Update Account</Button>
                        </div>
                    </form>

                    <div className="m-8">
                        <h3 className="relative text-center text-2xl font-bold text-gray-900 dark:text-gray-200">
                            Account Locations
                        </h3>
                        <Table hoverable>
                            <TableHead>
                                <TableHeadCell>ID</TableHeadCell>
                                <TableHeadCell>Options</TableHeadCell>
                                <TableHeadCell>Location</TableHeadCell>
                                <TableHeadCell>Location Code</TableHeadCell>
                                <TableHeadCell>Items</TableHeadCell>
                            </TableHead>
                            <TableBody className="divide-y">
                                {account.locations.map((location) => {
                                    return (
                                        <AccountLocationDisplay
                                            key={location.locationcode}
                                            location={location}

                                        />

                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
        </div>
    );
}
