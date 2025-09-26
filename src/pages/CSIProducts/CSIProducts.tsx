import { useEffect, useState } from "react";

// import { Label, Tabs, TabItem } from "flowbite-react";

import type { CSIProduct } from "../../types/products.type";
import { Button, Dropdown, DropdownItem } from "flowbite-react";
import CSIProductModal from "./CSIProductModal";

export default function CSIProducts() {
  const API_URL = import.meta.env.VITE_PRODUCT_API_URL;

  const [products, setProducts] = useState<CSIProduct[] | null>(null);
  const [openCreateProductModal, setOpenCreateProductModal] = useState(false);
  const [openCreateProductModalTemplate, setOpenCreateProductModalTemplate] =
    useState(false);

  const [templateProduct, setTemplateProduct] = useState<CSIProduct | null>(
    null,
  );

  async function fetchProducts() {
    return await (await fetch(`${API_URL}/csi/getProducts`)).json();
  }

  useEffect(() => {
    if (products && products.length > 0) return;

    try {
      fetchProducts().then((data) => {
        const products: CSIProduct[] = data;
        setProducts(products);
      });
    } catch {
      console.error("Could not fetch products");
    }
  }, []);

  return (
    <div className="items-center p-6">
      {/* Left-aligned button */}
      <Button
        color="blue"
        onClick={() => setOpenCreateProductModal(true)}
        className="absolute left-50"
      >
        + Add Product
      </Button>

      {/* Centered heading */}
      <h1 className="text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
        CSI Products
      </h1>

      {products && products.length > 0 ? (
        <div>
          <div className="mt-6 w-full overflow-x-auto rounded-lg border shadow-sm">
            <table className="min-w-full table-auto border-collapse">
              <thead className="sticky top-0 z-10 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                <tr>
                  <th className="border-b border-gray-200 px-4 py-2 text-left font-medium dark:border-gray-700">
                    Actions
                  </th>
                  {[
                    "ID",
                    "Base Product ID",
                    "Name",
                    "Source",
                    "Category ID",
                    "Subcategory ID",
                    "Product Number",
                    "Material Code",
                    "SKU",
                    "Length",
                    "Width",
                    "Height",
                    "Thickness",
                    "Color",
                    "Spacing",
                    "Edge",
                    "Design Option",
                    "Form Option",
                    "Unit of Measure",
                    "Competitor",
                    "Acoustics",
                    "Flammability",
                  ].map((header) => (
                    <th
                      key={header}
                      className="border-b border-gray-200 px-4 py-2 text-left font-medium dark:border-gray-700"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr
                    key={product.id}
                    className={`${
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-900"
                        : "bg-gray-50 dark:bg-gray-800"
                    } text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700`}
                  >
                    {/* Actions column */}
                    <td className="px-4 py-2 whitespace-nowrap">
                      <Dropdown
                        label="Options"
                        inline={true}
                        color="gray"
                        size="sm"
                        arrowIcon={true}
                      >
                        <DropdownItem
                          onClick={() => {
                            setTemplateProduct(product);
                            setOpenCreateProductModalTemplate(true);
                          }}
                        >
                          Create New Product With Product As Template
                        </DropdownItem>
                        {/* <DropdownItem onClick={() => console.log("Delete", product.id)}>
                                                    Delete
                                                </DropdownItem> */}
                      </Dropdown>
                    </td>

                    {/* Existing columns */}
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.id}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.baseproductid}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.source}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.categoryid}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.subcategoryid}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.productid}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.materialcode}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.sku}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.length}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.width}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.height}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.thickness}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.color}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.spacing}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.edge}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.designoption}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.formoption}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.unitofmeasure}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.competitor || "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.acoustics}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.flammability}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-center text-gray-500 dark:text-gray-400">
          No products found.
        </p>
      )}

      <CSIProductModal
        openCreateProductModal={openCreateProductModal}
        setOpenCreateProductModal={(open: boolean) => {
          setOpenCreateProductModal(open);
        }}
      />

      <CSIProductModal
        inputtedProduct={templateProduct!}
        openCreateProductModal={openCreateProductModalTemplate}
        setOpenCreateProductModal={(open: boolean) => {
          setOpenCreateProductModalTemplate(open);
        }}
      />
    </div>
  );
}
