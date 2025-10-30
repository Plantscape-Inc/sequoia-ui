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
  type Address,
} from "../../../types/pslive.type";
import AccountSelectionModal from "../Accounts/PsLiveAccountSelectionModal";
import AddressSelectionModal from "../Address/AddressSelectionModal";

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
    total: 0,
  });

  // Account modal state
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accountList, setAccountList] = useState<Account[]>([]);

  // Address modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressList, setAddressList] = useState<Address[]>([]);
  const [addressFieldTarget, setAddressFieldTarget] = useState<
    "billing" | "shipping" | null
  >(null);
  const [billingAddress, setBillingAddress] = useState<Address | null>(null);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);

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

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${apiUrl}/addresses`);
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const data: Address[] = await res.json();
      setAddressList(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching addresses");
    }
  };

  const handleCreateOrder = async () => {
    setLoading(true);
    newOrder.entrydate = newOrder.entrydate?.split("T")[0];

    const payload = {
      ...newOrder,
      billing_address: billingAddress ? billingAddress.id : null,
      shipping_address: shippingAddress ? shippingAddress.id : null,
    };

    try {
      const res = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        total: 0,
      });
      setBillingAddress(null);
      setShippingAddress(null);
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

            {/* Address Selection */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Billing Address</Label>
                <Button
                  size="sm"
                  onClick={() => {
                    setAddressFieldTarget("billing");
                    fetchAddresses();
                    setShowAddressModal(true);
                  }}
                >
                  {billingAddress
                    ? billingAddress.name1
                    : "Select Billing Address"}
                </Button>
              </div>

              <div className="flex-1">
                <Label>Physical Address</Label>
                <Button
                  size="sm"
                  onClick={() => {
                    setAddressFieldTarget("shipping");
                    fetchAddresses();
                    setShowAddressModal(true);
                  }}
                >
                  {shippingAddress
                    ? shippingAddress.name1
                    : "Select Physical Address"}
                </Button>
              </div>
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

            {/* Sales Rep */}
            <div>
              <Label htmlFor="salesrep">Sales Rep</Label>
              <TextInput
                id="salesrep"
                value={newOrder.salesrep || ""}
                onChange={(e) => handleInputChange("salesrep", e.target.value)}
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

            {/* Total */}
            <div>
              <Label htmlFor="total">Total Minutes</Label>
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
            disabled={
              !newOrder.accountlocid || !billingAddress || !shippingAddress
            }
          >
            Create
          </Button>
          <Button color="gray" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Address Modal */}
      <AddressSelectionModal
        show={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSelect={(addr) => {
          if (addressFieldTarget === "billing") {
            setBillingAddress(addr);
          } else if (addressFieldTarget === "shipping") {
            setShippingAddress(addr);
          }
          setAddressFieldTarget(null);
          setShowAddressModal(false);
        }}
        addresses={addressList}
      />

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
    </>
  );
}
