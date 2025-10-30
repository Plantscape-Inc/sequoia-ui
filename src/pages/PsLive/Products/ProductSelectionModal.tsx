import {
  Modal,
  ModalHeader,
  ModalBody,
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  TextInput,
} from "flowbite-react";
import { useState, useEffect } from "react";
import type { Product } from "../../../types/pslive.type";
import { fitlFilter } from "fitl-js";

interface ProductSelectModalProps {
  show: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
  apiUrl: string;
}

export default function ProductSelectModal({
  show,
  onClose,
  onSelect,
  apiUrl,
}: ProductSelectModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (show) {
      setLoading(true);
      fetch(`${apiUrl}/products`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          setFilteredProducts(data);
        })
        .catch((err) => console.error("Failed to load products", err))
        .finally(() => setLoading(false));
    }
  }, [show, apiUrl]);

  useEffect(() => {
    async function doSearch() {
      if (!searchTerm) {
        setFilteredProducts(products);
        return;
      }

      if (searchTerm.startsWith("/f")) {
        if (searchTerm.length < 3) {
          setFilteredProducts(products);
          return;
        }
        try {
          const result = await fitlFilter(searchTerm.substring(2), products, {
            tableFormat: "JSARRAY",
          });
          setFilteredProducts(result);
          return;
        } catch (error) {
          console.error(error);
        }
      }

      // fallback: simple name/code filtering
      const lower = searchTerm.toLowerCase();
      setFilteredProducts(
        products.filter(
          (p) =>
            p.name.toLowerCase().includes(lower) ||
            p.productcode.toLowerCase().includes(lower),
        ),
      );
    }

    doSearch();
  }, [searchTerm, products]);

  return (
    <Modal show={show} onClose={onClose}>
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
        {loading ? (
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
              {filteredProducts.map((p) => (
                <TableRow
                  key={p.id}
                  onClick={() => {
                    onSelect(p);
                    onClose();
                  }}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <TableCell className="font-medium">{p.productcode}</TableCell>
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
  );
}
