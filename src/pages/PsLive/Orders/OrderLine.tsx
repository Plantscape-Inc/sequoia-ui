import {
  TableRow,
  TableCell,
  Button,
  Dropdown,
  DropdownItem,
  Modal,
  Spinner,
  ModalHeader,
  ModalBody,
  TableHead,
  Table,
  TableHeadCell,
  TableBody,
  TextInput,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import type { OrderLine, Product } from "../../../types/pslive.type";

import { fitlFilter } from "fitl-js";

interface EditableOrderLineRowProps {
  line: OrderLine;
}

export default function OrderLine({ line }: EditableOrderLineRowProps) {
  const API_URL = import.meta.env.VITE_PSLIVE_URL;
  const [localLine, setLocalLine] = useState<OrderLine>(line);

  // Modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function doSearch() {
      const results = await searchProducts(searchTerm, products);
      setFilteredProducts(results);
    }
    doSearch();
  }, [searchTerm, products]);

  async function searchProducts(
    query: string,
    products: Product[],
  ): Promise<Product[]> {
    if (query.startsWith("/f")) {
      if (query.length < 3) {
        return products;
      }
      try {
        const result = await fitlFilter(
          query.substring(2, query.length),
          products,
          { tableFormat: "JSARRAY" },
        );
        return result;
      } catch (error) {
        console.error(error);
        return products;
      }
    }
    return products;
  }

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
    } catch (error) {
      alert(`Error updating order line: ${error}`);
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
    } catch (error) {
      alert(`Error deleting order line: ${error}`);
    } finally {
      window.location.reload();
    }
  };

  // Fetch products when modal opens
  useEffect(() => {
    if (showProductModal) {
      setLoadingProducts(true);
      fetch(`${API_URL}/products`)
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((err) => console.error("Failed to load products", err))
        .finally(() => setLoadingProducts(false));
    }
  }, [showProductModal, API_URL]);

  return (
    <>
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
            <DropdownItem onClick={() => deleteOrderline()}>
              Delete
            </DropdownItem>
          </Dropdown>
        </TableCell>

        <TableCell>{localLine.orderid}</TableCell>
        <TableCell>
          <Button
            size="xs"
            color="light"
            onClick={() => setShowProductModal(true)}
          >
            {localLine.productcode}
          </Button>
        </TableCell>
      </TableRow>

      {/* Product Picker Modal */}
      <Modal show={showProductModal} onClose={() => setShowProductModal(false)}>
        <ModalHeader>
          <div className="flex w-full items-center justify-between">
            <span className="text-lg font-semibold">Select a Product</span>
            <TextInput
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-1/3"
            />
          </div>
        </ModalHeader>
        <ModalBody>
          {loadingProducts ? (
            <div className="flex justify-center p-4">
              <Spinner size="lg" />
            </div>
          ) : (
            <Table hoverable={true}>
              <TableHead>
                <TableHeadCell>Product Code</TableHeadCell>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Height</TableHeadCell>
                <TableHeadCell>Price</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                {filteredProducts.map((p: Product) => (
                  <TableRow
                    key={p.id}
                    onClick={() => {
                      handleFieldChange("productcode", p.productcode);
                      setShowProductModal(false);
                    }}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <TableCell className="font-medium">
                      {p.productcode}
                    </TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.height}</TableCell>
                    <TableCell>${p.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ModalBody>
      </Modal>
    </>
  );
}
