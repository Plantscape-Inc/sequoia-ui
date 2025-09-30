import { useEffect, useState } from "react";
import {
    Button,
    Label,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TextInput,
} from "flowbite-react";
import {
    Order,
    OrderLine,
} from "../../../types/pslive.type";
import OrderLineDisplay from "./OrderLine";
import AddressDisplay from "../Address/AddressDisplay";

export default function OrderEditor() {
    const API_URL = import.meta.env.VITE_PSLIVE_URL;

    const [orderId, setOrderId] = useState<number>(-1); // keep as string
    const [loading, setLoading] = useState(false);

    const [order, setOrder] = useState<Order | null>(null);
    const [tempOrder, setTempOrder] = useState<Order | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const orderParam = params.get("orderid");

        if (orderParam || !Number(orderParam)) {
            setOrderId(Number(orderParam));

            if (!order && Number(orderParam) !== -1) {
                updateOrder(Number(orderParam));
                // updateOrder(orderId)
            }
        }
    }, []);

    async function updateOrder(newOrderId: number) {
        if (newOrderId === -1) return;

        setOrderId(newOrderId);

        const params = new URLSearchParams(window.location.search);
        params.set("orderid", String(newOrderId));

        const data = await (await fetch(`${API_URL}/order/${newOrderId}`)).json();
        setOrder(data);
        setTempOrder(data);
    }

    // useEffect(() => {

    //     if (orderId || orderId <= 0 || orderId === order?.orderid)
    //         return


    //     setLoading(true)

    //     updateOrder(orderId)
    //         .finally(() => {
    //             setLoading(false)
    //         })

    // }, [orderId]);

    const handleChange = (field: keyof Order, value: unknown) => {
        if (!tempOrder) return;
        const updated = { ...tempOrder, [field]: value } as Order;
        updated.total = updated.fp + updated.travel;
        console.log(updated)
        setTempOrder(updated);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        await updateOrder(orderId).finally(() => {
            setLoading(false);
        });

        // if (!orderId) {
        //     alert("Please enter an Order ID");
        //     return;
        // }

        // try {
        //     setLoading(true);
        //     const response = await fetch(`${API_URL}/orders`, { // give endpoint a proper path
        //         method: "POST",
        //         body: formData,
        //     });

        //     if (!response.ok) {
        //         throw new Error(`Server error: ${response.status}`);
        //     }

        //     const data = await response.json();
        //     console.log("✅ Order created:", data);

        // } catch (err) {
        //     console.error("❌ Request failed:", err);
        //     alert("Something went wrong. Please try again.");
        // } finally {
        //     setLoading(false);
        // }
    };

    const addOrderLine = async () => {
        const emptyOrderLine: OrderLine = {
            id: Math.random() * 1000000,
            orderid: order!.orderid,
            productcode: "",
        };

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/orderline`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(emptyOrderLine),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            await updateOrder(orderId);

            return;
        } catch (error) {
            alert(`Error updating order line: ${error}`);
            return { success: false, message: (error as Error).message };
        } finally {
            setLoading(false);
        }
    };
    const handleUpdate = async () => {
        if (!tempOrder) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/order/${tempOrder.orderid}`, {
                method: "PUT", // assuming your backend expects PUT
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(tempOrder),
            });

            if (!response.ok) throw new Error("Failed to update order");

            // Reload the order from the server
            await updateOrder(tempOrder.orderid);
            alert("Order updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update order.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div>
                <h1 className="relative text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
                    Order
                </h1>

                <form
                    className="mx-auto mt-6 flex max-w-md flex-col gap-4"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <Label className="mb-2 block" htmlFor="orderid">
                            Enter Order ID
                        </Label>
                        <TextInput
                            id="orderid"
                            type="number"
                            value={orderId}
                            onChange={(e) => updateOrder(Number(e.target.value))}
                            required
                        />
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </Button>
                </form>

                {loading && (
                    <div className="mt-6 flex justify-center">
                        <Spinner size="xl" />
                    </div>
                )}

                {order && tempOrder && (
                    <div>
                        <div className="m-8 mx-auto flex max-w-4xl flex-col justify-center gap-8 md:flex-row">
                            <div className="flex-1">
                                <h3 className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-gray-200">
                                    Billing Address
                                </h3>
                                <AddressDisplay address={order.billing_address} />
                            </div>

                            <div className="flex-1">
                                <h3 className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-gray-200">
                                    Shipping Address
                                </h3>
                                <AddressDisplay address={order.shipping_address} />
                            </div>
                        </div>

                        <form
                            className="mx-auto flex max-w-4xl flex-wrap gap-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                // onSubmit(order);
                                // updateOrder(order);
                                handleUpdate()
                            }}
                        >
                            {/* Submit Button */}
                            <div className="mt-4 w-full">
                                <Button type="submit">Update Order</Button>
                            </div>

                            <div className="flex min-w-[200px] flex-1 flex-col gap-4">
                                <Label htmlFor="accoutlocid">Account Location ID</Label>
                                <TextInput
                                    id="accoutlocid"
                                    value={tempOrder.accoutlocid}
                                    onChange={(e) => handleChange("accoutlocid", e.target.value)}
                                />

                                <Label htmlFor="accountlocation">Account Location</Label>
                                <TextInput
                                    id="accountlocation"
                                    type="number"
                                    value={tempOrder.accountlocation}
                                    onChange={(e) =>
                                        handleChange("accountlocation", Number(e.target.value))
                                    }
                                />

                                <Label htmlFor="contracttype">Contract Type</Label>
                                <TextInput
                                    id="contracttype"
                                    value={tempOrder.contracttype}
                                    onChange={(e) => handleChange("contracttype", e.target.value)}
                                />
                            </div>

                            <div className="flex min-w-[200px] flex-1 flex-col gap-4">
                                <Label htmlFor="entrydate">Entry Date</Label>
                                <TextInput
                                    id="entrydate"
                                    type="date"
                                    value={tempOrder.entrydate || ""}
                                    onChange={(e) => handleChange("entrydate", e.target.value)}
                                />

                                <Label htmlFor="salesrep">Sales Rep</Label>
                                <TextInput
                                    id="salesrep"
                                    value={tempOrder.salesrep}
                                    onChange={(e) => handleChange("salesrep", e.target.value)}
                                />

                                <Label htmlFor="technician">Technician</Label>
                                <TextInput
                                    id="technician"
                                    value={tempOrder.technician}
                                    onChange={(e) => handleChange("technician", e.target.value)}
                                />
                            </div>

                            <div className="m-8">
                                <h3 className="relative m-2 text-center text-2xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
                                    Order Job Times
                                </h3>
                                <Table hoverable>
                                    <TableHead>
                                        <TableHeadCell>FP</TableHeadCell>
                                        <TableHeadCell>Travel</TableHeadCell>
                                        <TableHeadCell>Total</TableHeadCell>
                                    </TableHead>
                                    <TableBody className="divide-y">

                                        <TableCell>
                                            <TextInput
                                                type="number"
                                                value={tempOrder.fp}
                                                onChange={(e) => handleChange("fp", parseFloat(e.target.value))}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextInput
                                                type="number"
                                                value={tempOrder.travel}
                                                onChange={(e) =>
                                                    handleChange("travel", parseFloat(e.target.value))
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextInput
                                                type="number"
                                                value={tempOrder.total}
                                                contentEditable={false}
                                                onChange={(e) =>
                                                    handleChange("total", parseFloat(e.target.value))
                                                }
                                            />
                                        </TableCell>
                                    </TableBody>
                                </Table>
                            </div>
                        </form>


                        <div className="m-8">
                            <h3 className="relative m-2 text-center text-2xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
                                Order Lines
                            </h3>
                            <div className="mt-4 w-full">
                                <Button
                                    type="submit"
                                    onClick={() => {
                                        addOrderLine();
                                    }}
                                >
                                    Add Order Line
                                </Button>
                            </div>
                            <Table hoverable>
                                <TableHead>
                                    <TableHeadCell></TableHeadCell>
                                    <TableHeadCell>Delete</TableHeadCell>
                                    <TableHeadCell>ID</TableHeadCell>
                                    <TableHeadCell>Order ID</TableHeadCell>
                                    <TableHeadCell>Product</TableHeadCell>

                                </TableHead>
                                <TableBody className="divide-y">
                                    {order.lines.map((line) => (
                                        <OrderLineDisplay key={line.id} line={line} />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>


                    </div>
                )}
            </div>
        </div>
    );
}
