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
} from "flowbite-react";
import { Order, type Account } from "../../../types/pslive.type";
import { useNavigate } from "react-router-dom";
import AccountSelectionModal from "../Accounts/PsLiveAccountSelectionModal";

export default function Orders() {
    const API_URL = import.meta.env.VITE_PSLIVE_URL;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [ordersData, setOrdersData] = useState<Order[] | null>(null);

    const [showAccountModal, setShowAccountModal] = useState<boolean>(false);

    const [accountList, setAccountList] = useState<Account[]>([]);


    // Modal + form state
    const [showModal, setShowModal] = useState(false);
    const [newOrder, setNewOrder] = useState<Partial<Order>>({
        orderid: 0,
        accountlocid: "",
        contracttype: "",
        entrydate: new Date().toISOString(),
        salesrep: "",
        technician: "",
        billto: 0,
        fp: 0,
        travel: 0,
        total: 0,
    });

    useEffect(() => {
        if (ordersData) return;
        setLoading(true);
        fetch(`${API_URL}/orders`)
            .then((data) => data.json())
            .then(setOrdersData)
            .finally(() => setLoading(false));
    }, [ordersData, API_URL]);

    const handleInputChange = (field: keyof Order, value: string | number) => {
        setNewOrder((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCreateOrder = async () => {
        setLoading(true);

        console.log(newOrder.entrydate)

        newOrder.entrydate = newOrder.entrydate?.split("T")[0]
        try {
            const res = await fetch(`${API_URL}/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newOrder),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create order");

            setOrdersData((prev) => (prev ? [data, ...prev] : [data]));
            setShowModal(false);

            // Reset form
            setNewOrder({
                accountlocid: "",
                contracttype: "",
                entrydate: new Date().toISOString(),
                salesrep: "",
                technician: "",
                billto: 0,
                fp: 0,
                travel: 0,
                total: 0,
            });
        } catch (err) {
            console.error(err);
            alert("Failed to create order.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOrder = async (orderid: string | number) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this order?"
        );
        if (!confirmed) return;

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/order/${orderid}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete order");

            setOrdersData((prev) =>
                prev ? prev.filter((order) => order.orderid !== orderid) : null
            );
        } catch (err) {
            console.error(err);
            alert("An error occurred while deleting the order.");
        } finally {
            setLoading(false);
        }
    };


    const fetchAccounts = async () => {
        try {
            const res = await fetch(`${API_URL}/accounts`);
            if (!res.ok) throw new Error("Failed to fetch accounts");
            const data: Account[] = await res.json();
            setAccountList(data);
        } catch (err) {
            console.error(err);
            alert("Error fetching accounts");
        }
    };

    return (
        <div>
            <h1 className="relative text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
                Orders
            </h1>

            <div className="mt-4 flex justify-center">
                <Button onClick={() => setShowModal(true)}>Create New Order</Button>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <ModalHeader>Create New Order</ModalHeader>
                <ModalBody>
                    <div className="space-y-3">
                        {/* Account Selection */}

                        {/* <div>
                            <Label htmlFor="orderid">Order ID</Label>
                            <TextInput
                                id="orderid"
                                value={newOrder.orderid || 0}
                                type="number"
                                onChange={(e) =>
                                    handleInputChange("orderid", e.target.value)
                                }
                            />
                        </div> */}

                        <div>
                            <Label htmlFor="accountlocid">Account</Label>
                            <Button
                                size="sm"
                                onClick={() => {
                                    fetchAccounts();
                                    setShowAccountModal(true)
                                }}
                            >
                                {newOrder.accountlocid
                                    ? `Selected: ${newOrder.accountlocid}`
                                    : "Select Account"}
                            </Button>
                        </div>

                        <div>
                            <Label htmlFor="contracttype">Contract Type</Label>
                            <TextInput
                                id="contracttype"
                                value={newOrder.contracttype || ""}
                                onChange={(e) =>
                                    handleInputChange("contracttype", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <Label htmlFor="entrydate">Entry Date</Label>
                            <TextInput
                                id="entrydate"
                                type="date"
                                value={
                                    newOrder.entrydate
                                        ? new Date(newOrder.entrydate)
                                            .toISOString()
                                            .split("T")[0]
                                        : ""
                                }
                                onChange={(e) =>
                                    handleInputChange(
                                        "entrydate",
                                        new Date(e.target.value).toISOString()
                                    )
                                }
                            />
                        </div>

                        <div>
                            <Label htmlFor="salesrep">Sales Rep</Label>
                            <TextInput
                                id="salesrep"
                                value={newOrder.salesrep || ""}
                                onChange={(e) =>
                                    handleInputChange("salesrep", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <Label htmlFor="technician">Technician</Label>
                            <TextInput
                                id="technician"
                                value={newOrder.technician || ""}
                                onChange={(e) =>
                                    handleInputChange("technician", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <Label htmlFor="fp">FP ($)</Label>
                            <TextInput
                                id="fp"
                                type="number"
                                value={newOrder.fp || 0}
                                onChange={(e) =>
                                    handleInputChange("fp", Number(e.target.value))
                                }
                            />
                        </div>

                        <div>
                            <Label htmlFor="travel">Travel ($)</Label>
                            <TextInput
                                id="travel"
                                type="number"
                                value={newOrder.travel || 0}
                                onChange={(e) =>
                                    handleInputChange("travel", Number(e.target.value))
                                }
                            />
                        </div>

                        <div>
                            <Label htmlFor="total">Total ($)</Label>
                            <TextInput
                                id="total"
                                type="number"
                                value={newOrder.total || 0}
                                onChange={(e) =>
                                    handleInputChange("total", Number(e.target.value))
                                }
                            />
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button onClick={handleCreateOrder}>Create</Button>
                    <Button color="gray" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Account Selection Modal */}
            <AccountSelectionModal
                show={showAccountModal}
                onClose={() => setShowAccountModal(false)}
                onSelect={(account) => {
                    console.log("Selected account:", account);
                    setNewOrder((prev) => ({
                        ...prev,
                        accountlocid: account.accountid
                    }));
                    setShowAccountModal(false);
                }}
                accounts={accountList}
            />


            {loading && (
                <div className="mt-6 flex justify-center">
                    <Spinner size="xl" />
                </div>
            )}

            {!loading && ordersData && (
                <div className="mt-6">
                    <Table hoverable>
                        <TableHead>
                            <TableHeadCell>Options</TableHeadCell>
                            <TableHeadCell>Order ID</TableHeadCell>
                            <TableHeadCell>Account Location ID</TableHeadCell>
                            <TableHeadCell>Contract Type</TableHeadCell>
                            <TableHeadCell>Entry Date</TableHeadCell>
                            <TableHeadCell>Sales Rep</TableHeadCell>
                            <TableHeadCell>Technician</TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y">
                            {ordersData.map((order) => (
                                <TableRow
                                    key={order.orderid}
                                    className="bg-white dark:bg-gray-800 cursor-pointer"
                                    onClick={() =>
                                        navigate(`/psliveorder?orderid=${order.orderid}`)
                                    }
                                >
                                    <TableCell>
                                        <Button
                                            color="failure"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteOrder(order.orderid);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>

                                    <TableCell>{order.orderid}</TableCell>
                                    <TableCell>{order.accountlocid}</TableCell>
                                    <TableCell>{order.contracttype}</TableCell>
                                    <TableCell>
                                        {order.entrydate
                                            ? new Date(order.entrydate).toLocaleDateString()
                                            : "-"}
                                    </TableCell>
                                    <TableCell>{order.salesrep}</TableCell>
                                    <TableCell>{order.technician}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}



        </div>
    );
}
