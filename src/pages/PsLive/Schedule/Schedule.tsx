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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
} from "flowbite-react";
import {
  ScheduleLine,
  Technician,
  type DaysOfWeek,
  type Order,
} from "../../../types/pslive.type";
import TechnicianModal from "../Technicians/TechniciansSelectModal";

const dayOrder: Record<string, number> = {
  SUN: 0,
  MON: 1,
  TUES: 2,
  WED: 3,
  THURS: 4,
  FRI: 5,
  SAT: 6,
};

export default function ScheduleEditor() {
  const API_URL = import.meta.env.VITE_PSLIVE_URL;

  const [techId, setTechId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleLine[]>([]);

  // Technician Modal
  const [showTechModal, setShowTechModal] = useState(false);
  // const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedLineId, setSelectedLineId] = useState<number | null>(null);

  // Order Modal
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderLineId, setSelectedOrderLineId] = useState<number | null>(
    null,
  );

  const params = new URLSearchParams(window.location.search);
  useEffect(() => {
    const techparam = params.get("techid");
    if (techparam) {
      setTechId(techparam);
      fetchSchedule(techparam);
    }
  }, []);

  function sortSchedule(schedule: ScheduleLine[]) {
    return schedule.sort((a, b) => {
      const dayA = dayOrder[a.day as keyof typeof dayOrder] ?? 99;
      const dayB = dayOrder[b.day as keyof typeof dayOrder] ?? 99;
      return dayA - dayB;
    });
  }

  async function fetchSchedule(id: string) {
    if (!id) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/schedule/${id}`);
      if (!response.ok) {
        throw await response.json();
      }
      const data: ScheduleLine[] = await response.json();

      setSchedule(data);
    } catch (err) {
      console.error(err);
      alert(`Error fetching schedule: ${JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  }

  async function fetchOrders() {
    try {
      const response = await fetch(`${API_URL}/orders`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data: Order[] = await response.json();

      setOrders(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching orders");
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchSchedule(techId);
  };

  const handleChange = (
    id: number,
    field: keyof ScheduleLine,
    value: string | number,
  ) => {
    setSchedule((prev) =>
      prev.map((line) => (line.id === id ? { ...line, [field]: value } : line)),
    );
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this schedule line?")) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/schedule/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete schedule");

      alert("Schedule deleted!");
      setSchedule((prev) => prev.filter((line) => line.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const addScheduleLine = async () => {
    const newLine: Omit<ScheduleLine, "account" | "totalmins" | "zipcode"> = {
      id: Math.floor(Math.random() * 10000) + 1,
      technician: techId,
      day: "MON",
      orderid: 0,
    };

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLine),
      });
      if (!response.ok) throw new Error("Failed to add schedule");
      await fetchSchedule(techId);
    } catch (err) {
      console.error(err);
      alert("Add failed");
    } finally {
      setLoading(false);
    }
  };

  // Technician modal handlers
  const openTechModal = (lineId: number) => {
    setSelectedLineId(lineId);
    setShowTechModal(true);
  };

  const selectTechnician = (tech: Technician) => {
    if (selectedLineId) {
      handleChange(selectedLineId, "technician", tech.techid);
    } else {
      setTechId(tech.techid);
      const newParams = new URLSearchParams(window.location.search);
      newParams.set("techid", tech.techid);
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${newParams.toString()}`,
      );
      fetchSchedule(tech.techid);
    }
    setShowTechModal(false);
    setSelectedLineId(null);
  };

  // Order modal handlers
  const openOrderModal = (lineId: number) => {
    setSelectedOrderLineId(lineId);
    setShowOrderModal(true);
    fetchOrders();
  };

  const handleUpdate = async (line: ScheduleLine) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/schedule/${line.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(line),
      });

      console.log(await response.json());
      alert("Schedule updated!");
      fetchSchedule(techId);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const selectOrder = (order: Order) => {
    if (selectedOrderLineId) {
      setSchedule((prev) => {
        const updated = prev.map((line) =>
          line.id === selectedOrderLineId
            ? { ...line, orderid: order.orderid }
            : line,
        );

        const updatedLine = updated.find(
          (line) => line.id === selectedOrderLineId,
        );
        if (updatedLine) {
          handleUpdate(updatedLine);
        }

        return updated;
      });
    }
    setShowOrderModal(false);
    setSelectedOrderLineId(null);
    fetchOrders();
  };

  return (
    <div>
      <h1 className="relative text-center text-4xl font-bold text-gray-900 dark:text-gray-200">
        Technician Schedule
      </h1>

      {/* Fetch Schedule Form */}
      <form
        className="mx-auto mt-6 flex max-w-md flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div>
          <Label className="mb-2 block" htmlFor="techid">
            Enter Technician ID
          </Label>
          <div className="flex gap-2">
            <TextInput
              id="techid"
              type="text"
              value={techId}
              onChange={(e) => {
                setSchedule([]);
                const newParams = new URLSearchParams(window.location.search);
                newParams.set("techid", e.target.value);
                window.history.replaceState(
                  {},
                  "",
                  `${window.location.pathname}?${newParams.toString()}`,
                );
                setTechId(e.target.value);
              }}
              required
              readOnly
              className="flex-1"
            />
            <Button
              type="button"
              onClick={() => {
                setShowTechModal(true);
              }}
            >
              Select Technician
            </Button>

            {techId && (
              <Button
                type="button"
                onClick={() => {
                  window.open(`${API_URL}/schedulepdf/${techId}`, "_blank");
                }}
              >
                Download PDF
              </Button>
            )}
          </div>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Fetch Schedule"}
        </Button>
      </form>

      {loading && (
        <div className="mt-6 flex justify-center">
          <Spinner size="xl" />
        </div>
      )}

      {/* Schedule Table */}
      {schedule && (
        <div className="m-8">
          <div className="flex items-center justify-between">
            <h3 className="m-2 text-2xl font-bold text-gray-900 dark:text-gray-200">
              Schedule for {techId}
            </h3>
            <Button onClick={addScheduleLine}>Add Schedule Line</Button>
          </div>
          <Table hoverable>
            <TableHead>
              <TableHeadCell>ID</TableHeadCell>
              <TableHeadCell>Technician</TableHeadCell>
              <TableHeadCell>Day</TableHeadCell>
              <TableHeadCell>Order</TableHeadCell>
              <TableHeadCell>Account</TableHeadCell>
              <TableHeadCell>Total Minutes</TableHeadCell>
              <TableHeadCell>Zipcode</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {sortSchedule(schedule).map((line) => (
                <tr id={String(line.id)} key={line.id}>
                  <TableCell>{line.id}</TableCell>
                  <TableCell>
                    <Button
                      size="xs"
                      onClick={() => openTechModal(line.id)}
                      className="w-full justify-start"
                    >
                      {line.technician || "Select Technician"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={line.day}
                      onChange={(e) =>
                        handleChange(
                          line.id,
                          "day",
                          e.target.value as DaysOfWeek,
                        )
                      }
                    >
                      {["SUN", "MON", "TUES", "WED", "THURS", "FRI", "SAT"].map(
                        (d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ),
                      )}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="xs"
                      onClick={() => openOrderModal(line.id)}
                      className="w-full justify-start"
                    >
                      {line.orderid || "Select Order"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <TextInput type="string" value={line.account} readOnly />
                  </TableCell>
                  <TableCell>
                    <TextInput type="number" value={line.totalmins} readOnly />
                  </TableCell>
                  <TableCell>
                    <TextInput type="number" value={line.zipcode} readOnly />
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="xs" onClick={() => handleUpdate(line)}>
                      Save
                    </Button>
                    <Button
                      size="xs"
                      color="failure"
                      onClick={() => handleDelete(line.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </tr>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <TechnicianModal
        show={showTechModal}
        onClose={() => setShowTechModal(false)}
        onSelect={selectTechnician}
        apiUrl={API_URL}
      />

      {/* Order Selection Modal */}
      <Modal
        show={showOrderModal}
        size="4xl"
        onClose={() => setShowOrderModal(false)}
      >
        <ModalHeader>Select Order</ModalHeader>
        <ModalBody>
          <Table hoverable>
            <TableHead>
              <TableHeadCell>ID</TableHeadCell>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Select</TableHeadCell>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <tr key={order.orderid}>
                  <TableCell>{order.orderid}</TableCell>
                  <TableCell>{order.accountlocid}</TableCell>
                  <TableCell>
                    <Button size="xs" onClick={() => selectOrder(order)}>
                      Choose
                    </Button>
                  </TableCell>
                </tr>
              ))}
            </TableBody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="gray" onClick={() => setShowOrderModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
