import { useEffect, useState } from "react";
import {
    Button,
    Label,
    Table,
    TableHead,
    TableHeadCell,
    TableBody,
} from "flowbite-react";
import { Order, OrderLine, Address, Account, type Technician } from "../../../types/pslive.type";
import OrderLineDisplay from "./OrderLine";
import AddressSelectionModal from "../Address/AddressSelectionModal";
import AccountSelectionModal from "../Accounts/PsLiveAccountSelectionModal";
import TechnicianModal from "../Technicians/TechniciansSelectModal";

export default function OrderEditor() {
    const API_URL = import.meta.env.VITE_PSLIVE_URL;

    const [orderId, setOrderId] = useState<number>(-1);
    const [loading, setLoading] = useState(false);

    const [order, setOrder] = useState<Order | null>(null);
    const [tempOrder, setTempOrder] = useState<Order | null>(null);

    const [billingAddress, setBillingAddress] = useState<Address | null>(null);
    const [shippingAddress, setShippingAddress] = useState<Address | null>(null);

    // Account modal state
    const [showAccountModal, setShowAccountModal] = useState<boolean>(false);
    const [accountList, setAccountList] = useState<Account[]>([]);

    const [showTechModal, setShowTechModal] = useState(false);


    // Address modal state
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressList, setAddressList] = useState<Address[]>([]);
    const [addressFieldTarget, setAddressFieldTarget] = useState<"billing" | "shipping" | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const orderParam = params.get("orderid");
        if (orderParam) {
            const id = Number(orderParam);
            setOrderId(id);
            updateOrder(id);
        }
    }, []);

    async function updateOrder(newOrderId: number) {
        if (newOrderId === -1) return;

        setLoading(true);
        try {
            const data: Order = await (await fetch(`${API_URL}/order/${newOrderId}`)).json();

            setOrder(data);
            setTempOrder(data);

            const billingRes = await (await fetch(`${API_URL}/address/${data.billing_address.id}`)).json();
            setBillingAddress(billingRes);

            const shippingRes = await (await fetch(`${API_URL}/address/${data.shipping_address.id}`)).json();
            setShippingAddress(shippingRes);
        } finally {
            setLoading(false);
        }
    }

    const fetchAddresses = async () => {
        try {
            const res = await fetch(`${API_URL}/addresses`);
            if (!res.ok) throw new Error("Failed to fetch addresses");
            const data: Address[] = await res.json();
            setAddressList(data);
        } catch (err) {
            console.error(err);
            alert("Error fetching addresses");
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

    const handleUpdate = async () => {
        if (!tempOrder) return;

        setLoading(true);
        try {
            const payload = {
                ...tempOrder,
                billto: typeof tempOrder.billing_address === "object"
                    ? tempOrder.billing_address.id
                    : tempOrder.billing_address,
                accountlocation: typeof tempOrder.shipping_address === "object"
                    ? tempOrder.shipping_address.id
                    : tempOrder.shipping_address,
            };

            const res = await fetch(`${API_URL}/order/${tempOrder.orderid}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed to update order");
            await updateOrder(tempOrder.orderid);
            alert("Order updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update order");
        } finally {
            setLoading(false);
        }
    };

    const addOrderLine = async () => {
        if (!order) return;
        const emptyOrderLine: OrderLine = {
            id: Math.random() * 1000000,
            orderid: order.orderid,
            productcode: "",
        };

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/orderline`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(emptyOrderLine),
            });
            if (!res.ok) throw new Error("Failed to add order line");
            await updateOrder(orderId);
        } catch (err) {
            console.error(err);
            alert(`Error adding order line: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-center text-4xl font-bold text-gray-900 dark:text-gray-200">
                Order {orderId}
            </h1>

            {order && tempOrder && (
                <div className="mx-auto mt-8 max-w-4xl">
                    {/* Address and Account Fields */}
                    <div className="flex gap-8 items-end">
                        <div className="flex-1">
                            <Label>Billing Address</Label>
                            <Button
                                size="sm"
                                onClick={() => {
                                    setAddressFieldTarget("billing");
                                    setShowAddressModal(true);
                                    fetchAddresses();
                                }}
                            >
                                {billingAddress ? billingAddress.name1 : "Select"}
                            </Button>
                        </div>

                        <div className="flex-1">
                            <Label>Physical Address</Label>
                            <Button
                                size="sm"
                                onClick={() => {
                                    setAddressFieldTarget("shipping");
                                    setShowAddressModal(true);
                                    fetchAddresses();
                                }}
                            >
                                {shippingAddress ? shippingAddress.name1 : "Select"}
                            </Button>
                        </div>

                        <div className="flex-1">
                            <Label htmlFor="accountlocid">Account Location ID</Label>
                            <Button
                                size="sm"
                                onClick={() => {
                                    setShowAccountModal(true);
                                    fetchAccounts();
                                }}
                            >
                                {tempOrder.accountlocid || "Select Account"}
                            </Button>
                        </div>
                        <div className="flex-1">
                            <Label>Technician</Label>
                            <Button
                                size="sm"
                                onClick={() => setShowTechModal(true)}
                            >
                                {tempOrder?.technician || "Select Technician"}
                            </Button>
                        </div>
                    </div>

                    {/* Update Order */}
                    <div className="mt-4 flex justify-between items-center">
                        <Button onClick={addOrderLine}>Add Order Line</Button>
                        <Button
                            className="ml-2 bg-green-600"
                            onClick={handleUpdate}
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Order"}
                        </Button>
                    </div>

                    {/* Order Lines Table */}
                    <Table hoverable className="mt-6">
                        <TableHead>
                            <TableHeadCell></TableHeadCell>
                            <TableHeadCell></TableHeadCell>
                            <TableHeadCell>Order ID</TableHeadCell>
                            <TableHeadCell>Product</TableHeadCell>
                        </TableHead>
                        <TableBody>
                            {order.lines.map((line) => (
                                <OrderLineDisplay key={line.id} line={line} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Address Modal */}
            <AddressSelectionModal
                show={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                onSelect={(addr) => {
                    if (!tempOrder || !addressFieldTarget) return;

                    if (addressFieldTarget === "billing") {
                        tempOrder.billing_address = addr;
                        setBillingAddress(addr);
                    } else {
                        tempOrder.shipping_address = addr;
                        setShippingAddress(addr);
                    }

                    setShowAddressModal(false);
                    setAddressFieldTarget(null);
                }}
                addresses={addressList}
            />

            {/* Account Modal */}
            <AccountSelectionModal
                show={showAccountModal}
                onClose={() => setShowAccountModal(false)}
                onSelect={(account) => {
                    if (!tempOrder) return;

                    const updated = { ...tempOrder, accountlocid: account.accountid };
                    setTempOrder(updated);

                    setShowAccountModal(false);
                }}
                accounts={accountList}
            />

            <TechnicianModal
                show={showTechModal}
                onClose={() => setShowTechModal(false)}
                onSelect={(tech: Technician) => {
                    if (!tempOrder) return;
                    setTempOrder({ ...tempOrder, technician: tech.techid });
                    setShowTechModal(false);
                }}
                apiUrl={API_URL}
            />
        </div>
    );
}
