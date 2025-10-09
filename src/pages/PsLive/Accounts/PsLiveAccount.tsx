import { useEffect, useState } from "react";
import {
    Button,
    Label,
    Spinner,
    TextInput,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Table,
    TableHead,
    TableHeadCell,
    TableBody,
    TableCell,
} from "flowbite-react";
import { Account, type Address } from "../../../types/pslive.type";
import AccountLocationDisplay from "./PsLiveAccountLocationDisplay";

export default function AccountEditor() {
    const API_URL = import.meta.env.VITE_PSLIVE_URL;

    const [accountId, setAccountId] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const [account, setAccount] = useState<Account | null>(null);
    const [tempAccount, setTempAccount] = useState<Account | null>(null);

    const [address, setAddress] = useState<Address | null>(null);
    const [billToAddress, setBillToAddress] = useState<Address | null>(null);

    // Address modal
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressList, setAddressList] = useState<Address[]>([]);
    const [addressFieldTarget, setAddressFieldTarget] = useState<"address" | "billtoaddress" | null>(null);

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
            const data: Account = await (await fetch(`${API_URL}/account/${newAccountId}`)).json();
            setAccount(data);
            setTempAccount(data);

            const addressResponse = await (await fetch(`${API_URL}/address/${data.address}`)).json();
            setAddress(addressResponse);

            if (data.billtoaddress === data.address) {
                setBillToAddress(addressResponse);
            } else {
                const billToAddressResponse = await (await fetch(`${API_URL}/address/${data.billtoaddress}`)).json();
                setBillToAddress(billToAddressResponse);
            }
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (field: keyof Account, value: unknown) => {
        if (!tempAccount) return;
        setTempAccount({ ...tempAccount, [field]: value } as Account);
    };

    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
        if (e)
            e.preventDefault();

        if (!accountId) {
            // alert("Please enter an Account ID");
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
            alert("Account Updated")
        } catch (err) {
            console.error(err);
            alert(`Something went wrong while fetching account ${accountId}.`);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {

        handleSubmit()

    }, [])


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

    return (
        <div>
            <h1 className="relative text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
                Account {accountId}
            </h1>

            {/* <form className="mx-auto mt-6 flex max-w-md flex-col gap-4" onSubmit={handleSubmit}>
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
                <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Loading..." : "Load Account"}
                    </Button>
                    <Button
                        type="button"
                        disabled={!accountId}
                        onClick={() => {
                            if (!accountId) return;
                            window.open(`${API_URL}/accountpdf/${accountId}`, "_blank");
                        }}
                    >
                        Download PDF
                    </Button>
                </div>
            </form> */}

            {loading && (
                <div className="mt-6 flex justify-center">
                    <Spinner size="xl" />
                </div>
            )}

            {account && tempAccount && (
                <div className="mx-auto max-w-4xl mt-8">
                    <Button
                        type="button"
                        disabled={!accountId}
                        onClick={() => {
                            if (!accountId) return;
                            window.open(`${API_URL}/accountpdf/${accountId}`, "_blank");
                        }}
                    >
                        Download PDF
                    </Button>
                    <form className="flex flex-wrap gap-4" onSubmit={handleSubmit}>
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

                            <Label htmlFor="address">Physical Address</Label>
                            <div className="flex gap-2">
                                {/* <TextInput id="address" type="number" value={address ? `${address.name1} ${address.address1 || "asdf"}` : "asdf"} readOnly /> */}
                                <Button
                                    size="xs"
                                    onClick={() => {
                                        setAddressFieldTarget("address");
                                        setShowAddressModal(true);
                                        fetchAddresses();
                                    }}
                                >
                                    {address ? address.name1 : "null"}
                                </Button>
                            </div>

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
                                    {billToAddress ? billToAddress.name1 : "null"}
                                </Button>
                            </div>
                        </div>

                        <div className="mt-4 w-full">
                            <Button type="submit">Update Account</Button>
                        </div>
                    </form>

                    <div className="m-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="relative text-center text-2xl font-bold text-gray-900 dark:text-gray-200">
                                Account Locations
                            </h3>
                            <Button
                                color="blue"
                                onClick={async () => {
                                    const newLocation = {
                                        id: Math.floor(Math.random() * 10000) + 1,
                                        accountid: account.accountid,
                                        location: "New Location",
                                        locationcode: "NewCode",
                                        locationitems: [],
                                    };

                                    try {
                                        const response = await fetch(`${API_URL}/accountlocation`, {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify(newLocation),
                                        });

                                        if (!response.ok) {
                                            const errorData = await response.json();
                                            throw new Error(errorData.message);
                                        }

                                        alert("Account location created successfully");
                                        window.location.reload();
                                    } catch (error) {
                                        console.error("Error creating location:", error);
                                        alert(`Error creating location: ${error}`);
                                    }
                                }}
                            >
                                + Add Location
                            </Button>
                        </div>

                        {account.locations.map((location) => (
                            <AccountLocationDisplay key={location.locationcode} location={location} />
                        ))}
                    </div>
                </div>
            )}

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
                                            onClick={async () => {
                                                if (!tempAccount || !addressFieldTarget) return;

                                                // Update tempAccount
                                                handleChange(addressFieldTarget, addr.id);

                                                // Update display state
                                                if (addressFieldTarget === "address") {
                                                    setAddress(addr);
                                                    tempAccount.address = addr.id
                                                } else if (addressFieldTarget === "billtoaddress") {
                                                    setBillToAddress(addr);
                                                    tempAccount.billtoaddress = addr.id
                                                }
                                                setShowAddressModal(false);
                                                setAddressFieldTarget(null);
                                                await handleSubmit();
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
        </div>
    );
}
