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
import CreateOrderModal from "./OrderCreateNewModal";

export default function Orders() {
    const API_URL = import.meta.env.VITE_PSLIVE_URL;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [ordersData, setOrdersData] = useState<Order[] | null>(null);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (ordersData) return;
        setLoading(true);
        fetch(`${API_URL}/orders`)
            .then(res => res.json())
            .then(setOrdersData)
            .finally(() => setLoading(false));
    }, [ordersData, API_URL]);

    const handleDeleteOrder = async (orderid: string | number) => {
        const confirmed = window.confirm("Are you sure you want to delete this order?");
        if (!confirmed) return;

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/order/${orderid}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete order");

            setOrdersData(prev => prev ? prev.filter(order => order.orderid !== orderid) : null);
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
                <Button onClick={() => setShowModal(true)}>Create New Order</Button>
            </div>

            <CreateOrderModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onCreate={(newOrder: Order) => {
                    console.log(newOrder)
                    setOrdersData(prev => prev ? [newOrder, ...prev] : [newOrder])
                }}
                apiUrl={API_URL}
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
                            {ordersData.map(order => (
                                <TableRow
                                    key={order.orderid}
                                    className="bg-white dark:bg-gray-800 cursor-pointer"
                                    onClick={() => navigate(`/psliveorder?orderid=${order.orderid}`)}
                                >
                                    <TableCell>
                                        <Button
                                            color="failure"
                                            size="sm"
                                            onClick={e => {
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
                                        {order.entrydate ? new Date(order.entrydate).toLocaleDateString() : "-"}
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
