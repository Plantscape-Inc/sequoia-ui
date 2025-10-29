import {
  TableRow,
  TableCell,
  TextInput,
  Button,
  Dropdown,
  DropdownItem,
} from "flowbite-react";
import { useState } from "react";
import { ArrowUp } from "lucide-react";
import type { AccountLocationItem } from "../../../types/pslive.type";

interface EditableAccountLocationItemRowProps {
  item: AccountLocationItem;
}

export default function AccountLocationItemDisplay({
  item,
}: EditableAccountLocationItemRowProps) {
  const API_URL = import.meta.env.VITE_PSLIVE_URL;
  const [localItem, setLocalItem] = useState<AccountLocationItem>(item);

  const handleFieldChange = (
    field: keyof AccountLocationItem,
    value: string | number,
  ) => {
    const updated = { ...localItem, [field]: value };
    setLocalItem(updated);
  };

  async function updateItem(newItem: AccountLocationItem) {
    if (!newItem.productcode || newItem.productcode === "") {
      console.error("Fill in product code");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/accountlocation/${newItem.accountid}/${newItem.locationcode}/item/${newItem.productcode}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newItem),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update item");
      }

      alert(`Updated item ${newItem.productcode} successfully`);
    } catch (error) {
      alert(`Error updating item: ${error}`);
    }
  }

  const deleteItem = async () => {
    try {
      const response = await fetch(
        `${API_URL}/accountlocation/${item.id}/${item.locationcode}/item/${item.productcode}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error(error);
      alert(`Error deleting item: ${error}`);
    } finally {
      window.location.reload();
    }
  };

  return (
    <TableRow className="mt-32 bg-gray-50 dark:bg-gray-700">
      <TableCell>
        {localItem !== item && (
          <div className="flex justify-center">
            <Button
              onClick={() => updateItem(localItem)}
              size="sm"
              color="white"
              className="rounded border border-gray-400 bg-green-600 shadow-sm hover:border-gray-600"
            >
              <ArrowUp className="h-4 w-4 text-white" />
            </Button>
          </div>
        )}
      </TableCell>
      <TableCell>
        <Dropdown label="Options" inline={true} size="sm" color="gray">
          <DropdownItem onClick={deleteItem}>Delete</DropdownItem>
        </Dropdown>
      </TableCell>
      <TableCell>{localItem.accountid}</TableCell>
      <TableCell>{localItem.locationcode}</TableCell>
      <TableCell>
        <TextInput
          value={localItem.productcode}
          onChange={(e) => handleFieldChange("productcode", e.target.value)}
        />
      </TableCell>
      <TableCell>
        <TextInput
          type="number"
          value={localItem.quantity}
          onChange={(e) =>
            handleFieldChange("quantity", parseInt(e.target.value))
          }
        />
      </TableCell>
    </TableRow>
  );
}
