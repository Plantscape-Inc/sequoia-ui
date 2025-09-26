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
import type { OrderLine } from "../../../types/psliveorders.type";

// Single row editable component
interface EditableOrderLineRowProps {
  line: OrderLine;
  // onChange: (updatedLine: OrderLine) => void;
}

export default function OrderLine({ line }: EditableOrderLineRowProps) {
  const API_URL = import.meta.env.VITE_PSLIVE_URL;
  const [localLine, setLocalLine] = useState<OrderLine>(line);

  const handleFieldChange = (
    field: keyof OrderLine,
    value: string | number,
  ) => {
    const updated = { ...localLine, [field]: value };
    setLocalLine(updated);
  };

  async function updateLine(newLine: OrderLine) {
    try {
      const response = await fetch(`${API_URL}/orderline/${newLine.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLine),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update order line");
      }

      alert(`Updated line ${newLine.id} successfully`);

      return;
    } catch (error) {
      alert(`Error updating order line: ${error}`);
      return { success: false, message: (error as Error).message };
    }
  }

  const deleteOrderline = async () => {
    try {
      const response = await fetch(`${API_URL}/orderline/${line.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      // await updateOrder(orderId)
      return;
    } catch (error) {
      alert(`Error updating order line: ${error}`);
      return { success: false, message: (error as Error).message };
    } finally {
      window.location.reload();
    }
  };

  return (
    <TableRow className="bg-white dark:bg-gray-800">
      <TableCell>
        {localLine !== line && (
          <div className="flex justify-center">
            <Button
              onClick={() => updateLine(localLine)}
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
        <Dropdown
          label="Options"
          inline={true}
          color="gray"
          size="sm"
          arrowIcon={true}
        >
          <DropdownItem
            onClick={() => {
              deleteOrderline();
            }}
          >
            Delete
          </DropdownItem>
        </Dropdown>
      </TableCell>
      <TableCell>{localLine.id}</TableCell>
      <TableCell>{localLine.orderid}</TableCell>
      <TableCell>
        <TextInput
          value={localLine.size}
          onChange={(e) => handleFieldChange("size", e.target.value)}
        />
      </TableCell>
      <TableCell>
        <TextInput
          type="number"
          value={localLine.cost}
          onChange={(e) =>
            handleFieldChange("cost", parseFloat(e.target.value))
          }
        />
      </TableCell>
      <TableCell>
        <TextInput
          type="number"
          value={localLine.extension}
          onChange={(e) =>
            handleFieldChange("extension", parseFloat(e.target.value))
          }
        />
      </TableCell>
      <TableCell>
        <TextInput
          value={localLine.productdescription}
          onChange={(e) =>
            handleFieldChange("productdescription", e.target.value)
          }
        />
      </TableCell>
      <TableCell>
        <TextInput
          value={localLine.plpot}
          onChange={(e) => handleFieldChange("plpot", e.target.value)}
        />
      </TableCell>
    </TableRow>
  );
}
