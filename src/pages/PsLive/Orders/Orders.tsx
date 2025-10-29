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
  TextInput,
} from "flowbite-react";
import { Order } from "../../../types/pslive.type";
import { useNavigate } from "react-router-dom";
import CreateOrderModal from "./OrderCreateNewModal";
import { fitlFilter } from "fitl-js";

export default function Orders() {
  const API_URL = import.meta.env.VITE_PSLIVE_URL;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [ordersData, setOrdersData] = useState<Order[] | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const tableCellClass = "max-w-[120px] truncate text-center";

  // Fetch orders
  useEffect(() => {
    if (ordersData) return;
    setLoading(true);
    fetch(`${API_URL}/orders`)
      .then((res) => res.json())
      .then(setOrdersData)
      .finally(() => setLoading(false));
  }, [ordersData, API_URL]);

  // Filter orders
  useEffect(() => {
    if (!ordersData) return;

    if (!searchTerm.trim()) {
      setFilteredOrders(ordersData);
      return;
    }

    const filterOrders = async () => {
      if (searchTerm.startsWith("/f")) {
        try {
          const result = await fitlFilter(searchTerm.substring(2), ordersData, {
            tableFormat: "JSARRAY",
          });
          setFilteredOrders(result);
        } catch (err) {
          console.error(err);
          setFilteredOrders(ordersData);
        }
      } else {
        const term = searchTerm.toLowerCase();
        setFilteredOrders(
          ordersData.filter(
            (o) =>
              o.orderid.toString().includes(term) ||
              o.accountlocid.toLowerCase().includes(term) ||
              o.contracttype.toLowerCase().includes(term) ||
              o.salesrep.toLowerCase().includes(term),
          ),
        );
      }
    };

    filterOrders();
  }, [searchTerm, ordersData]);

  const handleDeleteOrder = async (orderid: string | number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?",
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/order/${orderid}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete order");

      setOrdersData((prev) =>
        prev ? prev.filter((order) => order.orderid !== orderid) : null,
      );
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1000px]">
      <h1 className="mb-6 text-center text-4xl font-bold text-gray-900 dark:text-gray-200">
        Orders
      </h1>

      <div className="mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
        <TextInput
          type="text"
          placeholder="Filter orders"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3"
        />
        <span className="font-bold dark:text-gray-200">
          {searchTerm ? filteredOrders.length : ordersData?.length} Results
        </span>
        <Button onClick={() => setShowModal(true)} color="blue">
          Create New Order
        </Button>
      </div>

      <CreateOrderModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onCreate={(newOrder: Order) => {
          setOrdersData((prev) => (prev ? [newOrder, ...prev] : [newOrder]));
        }}
        apiUrl={API_URL}
      />

      {loading && (
        <div className="mt-6 flex justify-center">
          <Spinner size="xl" />
        </div>
      )}

      {!loading && filteredOrders.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <Table hoverable className="mx-auto min-w-[700px]">
            <TableHead>
              <TableHeadCell>Options</TableHeadCell>
              <TableHeadCell>Order ID</TableHeadCell>
              <TableHeadCell>Account Location ID</TableHeadCell>
              <TableHeadCell>Contract Type</TableHeadCell>
              <TableHeadCell>Entry Date</TableHeadCell>
              <TableHeadCell>Sales Rep</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {filteredOrders.map((order) => (
                <TableRow
                  key={order.orderid}
                  className="cursor-pointer bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                  onClick={() =>
                    navigate(`/psliveorder?orderid=${order.orderid}`)
                  }
                >
                  <TableCell className={tableCellClass}>
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
                  <TableCell className={tableCellClass}>
                    {order.orderid}
                  </TableCell>
                  <TableCell className={tableCellClass}>
                    {order.accountlocid}
                  </TableCell>
                  <TableCell className={tableCellClass}>
                    {order.contracttype}
                  </TableCell>
                  <TableCell className={tableCellClass}>
                    {order.entrydate
                      ? new Date(order.entrydate).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className={tableCellClass}>
                    {order.salesrep}
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
