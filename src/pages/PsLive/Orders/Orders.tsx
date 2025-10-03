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
import { Order } from "../../../types/pslive.type";
import { useNavigate } from "react-router-dom";

export default function Orders() {
    const API_URL = import.meta.env.VITE_PSLIVE_URL;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [ordersData, setOrdersData] = useState<Order[] | null>(null);

    useEffect(() => {
        if (ordersData) return;

        setLoading(true);

        fetch(`${API_URL}/orders`)
            .then((data) => data.json())
            .then(setOrdersData)
            .finally(() => setLoading(false));
    }, [ordersData, API_URL]);

    interface Result {
        result: Order;
    }

    const addBlankOrder = () => {
        setLoading(true);
        fetch(`${API_URL}/newBlankOrder`, { method: "GET" })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to create order");
                return res.json();
            })
            .then((createdOrder: Result) => {
                setOrdersData((prev) =>
                    prev ? [createdOrder.result, ...prev] : [createdOrder.result]
                );
            })
            .catch(console.error)
            .finally(() => setLoading(false));
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

            // Remove deleted order from state
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

    return (
        <div>
            <h1 className="relative text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
                Orders
            </h1>

            <div className="mt-4 flex justify-center">
                <Button onClick={addBlankOrder}>Add New Order</Button>
            </div>

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
                                    className="bg-white dark:bg-gray-800"
                                    onClick={() =>
                                        navigate(`/psliveorder?orderid=${order.orderid}`)
                                    }
                                >
                                    {/* Delete button */}
                                    <TableCell>
                                        <Button
                                            color="failure"
                                            size="sm"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleDeleteOrder(order.orderid)
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>

                                    <TableCell
                                        className="cursor-pointer"

                                    >
                                        {order.orderid}
                                    </TableCell>
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
