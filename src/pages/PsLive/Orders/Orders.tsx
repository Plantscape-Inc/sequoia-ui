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
import { Order } from "../../../types/psliveorders.type";
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
      .then((data) => {
        setOrdersData(data);
      })
      .finally(() => setLoading(false));
  }, []);

  interface Result {
    result: Order;
  }

  const addBlankOrder = () => {
    fetch(`${API_URL}/newBlankOrder`, {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create order");
        }
        return res.json();
      })
      .then((createdOrder: Result) => {
        setOrdersData((prev) =>
          prev ? [createdOrder.result, ...prev] : [createdOrder.result],
        );

      })
      .catch((err) => {
        console.error(err);
        // optionally show an error message to user
      })
      .finally(() => setLoading(false));
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
                  <TableCell>{order.orderid}</TableCell>
                  <TableCell>{order.orderid}</TableCell>
                  <TableCell>{order.accoutlocid}</TableCell>
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
