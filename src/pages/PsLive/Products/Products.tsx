import { useEffect, useState } from "react";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

import { Product } from "../../../types/psliveorders.type";

export default function Products() {
  const API_URL = import.meta.env.VITE_PSLIVE_URL;

  const [loading, setLoading] = useState(false);

  const [productsData, setProductsData] = useState<Product[] | null>(null);

  useEffect(() => {
    if (productsData) return;

    setLoading(true);

    fetch(`${API_URL}/products`)
      .then((data) => data.json())
      .then((data) => {
        setProductsData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div>
        <h1 className="relative text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
          Products
        </h1>

        {loading && (
          <div className="mt-6 flex justify-center">
            <Spinner size="xl" />
          </div>
        )}

        {!loading && productsData && (
          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-[800px]">
              <Table hoverable>
                <TableHead>
                  <TableHeadCell>ID</TableHeadCell>
                  <TableHeadCell>Name</TableHeadCell>
                  <TableHeadCell>Height</TableHeadCell>
                  <TableHeadCell>Price</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                  {productsData.map((product) => (
                    <TableRow
                      key={product.productid}
                      className="cursor-pointer bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      <TableCell>{product.productid}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.height}</TableCell>
                      <TableCell>{product.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
