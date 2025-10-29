import { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  TextInput,
  Button,
} from "flowbite-react";
import {
  type Order,
  type Account,
  type Technician,
} from "../../../types/pslive.type";
import AccountSelectionModal from "../Accounts/PsLiveAccountSelectionModal";
import TechnicianModal from "../Technicians/TechniciansSelectModal";

interface CreateOrderModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: (order: Order) => void;
  apiUrl: string;
}

export default function CreateOrderModal({
  show,
  onClose,
  onCreate,
  apiUrl,
}: CreateOrderModalProps) {
  const [, setLoading] = useState(false);
  const [newOrder, setNewOrder] = useState<Partial<Order>>({
    orderid: 0,
    accountlocid: "",
    contracttype: "",
    entrydate: new Date().toISOString(),
    salesrep: "",
    billto: 0,
    fp: 0,
    travel: 0,
    total: 0,
  });

  // Account Modal
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accountList, setAccountList] = useState<Account[]>([]);

  // Technician Modal
  const [showTechModal, setShowTechModal] = useState(false);

  const handleInputChange = (field: keyof Order, value: string | number) => {
    setNewOrder((prev) => ({ ...prev, [field]: value }));
  };

  const fetchAccounts = async () => {
    try {
      const res = await fetch(`${apiUrl}/accounts`);
      if (!res.ok) throw new Error("Failed to fetch accounts");
      const data: Account[] = await res.json();
      setAccountList(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching accounts");
    }
  };

  const selectTechnician = (tech: Technician) => {
    setNewOrder((prev) => ({ ...prev, technician: tech.techid }));
    setShowTechModal(false);
  };

  const handleCreateOrder = async () => {
    setLoading(true);
    newOrder.entrydate = newOrder.entrydate?.split("T")[0];

    try {
      const res = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create order");

      onCreate(data);
      onClose();

      // Reset form
      setNewOrder({
        accountlocid: "",
        contracttype: "",
        entrydate: new Date().toISOString(),
        salesrep: "",
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

  return (
    <>
      <Modal show={show} onClose={onClose}>
        <ModalHeader>Create New Order</ModalHeader>
        <ModalBody>
          <div className="space-y-3">
            {/* Account Selection */}
            <div>
              <Label htmlFor="accountlocid">Account</Label>
              <Button
                size="sm"
                onClick={() => {
                  fetchAccounts();
                  setShowAccountModal(true);
                }}
              >
                {newOrder.accountlocid
                  ? `Selected: ${newOrder.accountlocid}`
                  : "Select Account"}
              </Button>
            </div>

            {/* Contract Type */}
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

            {/* Entry Date */}
            <div>
              <Label htmlFor="entrydate">Entry Date</Label>
              <TextInput
                id="entrydate"
                type="date"
                value={
                  newOrder.entrydate
                    ? new Date(newOrder.entrydate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleInputChange(
                    "entrydate",
                    new Date(e.target.value).toISOString(),
                  )
                }
              />
            </div>

            {/* Sales Rep */}
            <div>
              <Label htmlFor="salesrep">Sales Rep</Label>
              <TextInput
                id="salesrep"
                value={newOrder.salesrep || ""}
                onChange={(e) => handleInputChange("salesrep", e.target.value)}
              />
            </div>

            {/* FP */}
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

            {/* Travel */}
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

            {/* Total */}
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
          <Button
            onClick={handleCreateOrder}
            disabled={newOrder.accountlocid === ""}
          >
            Create
          </Button>
          <Button color="gray" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Account Modal */}
      <AccountSelectionModal
        show={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onSelect={(account) => {
          setNewOrder((prev) => ({ ...prev, accountlocid: account.accountid }));
          setShowAccountModal(false);
        }}
        accounts={accountList}
      />

      {/* Technician Modal */}
      <TechnicianModal
        show={showTechModal}
        onClose={() => setShowTechModal(false)}
        onSelect={selectTechnician}
        apiUrl={apiUrl}
      />
    </>
  );
}
