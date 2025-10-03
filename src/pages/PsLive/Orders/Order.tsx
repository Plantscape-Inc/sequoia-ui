import { useEffect, useState } from "react";
import {
    Button,
    Label,
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
import { Order, OrderLine, Address } from "../../../types/pslive.type";
import OrderLineDisplay from "./OrderLine";

export default function OrderEditor() {
    const API_URL = import.meta.env.VITE_PSLIVE_URL;

    const [orderId, setOrderId] = useState<number>(-1);
    const [loading, setLoading] = useState(false);

    const [order, setOrder] = useState<Order | null>(null);
    const [tempOrder, setTempOrder] = useState<Order | null>(null);

    const [billingAddress, setBillingAddress] = useState<Address | null>(null);
    const [shippingAddress, setShippingAddress] = useState<Address | null>(null);

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

    // const handleChange = (field: keyof Order, value: unknown) => {
    //     if (!tempOrder) return;
    //     const updated = { ...tempOrder, [field]: value } as Order;
    //     updated.total = updated.fp + updated.travel;
    //     setTempOrder(updated);
    // };

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
            <h1 className="text-center text-4xl font-bold text-gray-900 dark:text-gray-200">Order</h1>

            <div className="mx-auto mt-6 max-w-md flex flex-col gap-4">
                <Label htmlFor="orderid">Enter Order ID</Label>
                <TextInput
                    id="orderid"
                    type="number"
                    value={orderId}
                    onChange={(e) => updateOrder(Number(e.target.value))}
                />
                <Button onClick={() => updateOrder(orderId)} disabled={loading}>
                    {loading ? "Loading..." : "Load Order"}
                </Button>
            </div>

            {
        order && tempOrder && (
            <div className="mx-auto mt-8 max-w-4xl">
                {/* Addresses */}
                <div className="flex gap-8">
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
                        <Label>Shipping Address</Label>
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
                </div>

                {/* Update Order */}
                <div className="mt-4">
                    <Button onClick={handleUpdate} disabled={loading}>
                        {loading ? "Updating..." : "Update Order"}
                    </Button>
                    <Button className="ml-2" onClick={addOrderLine}>
                        Add Order Line
                    </Button>
                </div>

                {/* Order Lines Table */}
                <Table hoverable className="mt-6">
                    <TableHead>
                        <TableHeadCell>ID</TableHeadCell>
                        <TableHeadCell>Order ID</TableHeadCell>
                        <TableHeadCell>Product</TableHeadCell>
                        <TableHeadCell>Delete</TableHeadCell>
                    </TableHead>
                    <TableBody>
                        {order.lines.map((line) => (
                            <OrderLineDisplay key={line.id} line={line} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }

    {/* Address Modal */ }
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
        </div >
    );
}
