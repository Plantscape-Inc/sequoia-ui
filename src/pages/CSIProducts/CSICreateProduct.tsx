import { Button, Select, Textarea, TextInput } from "flowbite-react";
import type { CSIProduct } from "../../types/products.type";
import { useState, useRef } from "react";

const API_URL = import.meta.env.VITE_PRODUCT_API_URL;

const subcategories: Record<string, string[]> = {
  BFL: ["SGL", "CRV", "STK", "FLD", "SGP", "FCT", "DRP"],
  CLD: [
    "CON",
    "WFL",
    "WSL",
    "WFD",
    "PFL",
    "PFP",
    "FRM",
    "STK",
    "FCT",
    "NCH",
    "BLD",
    "EXP",
    "LAT",
    "FAB",
    "FMD",
  ],
  GRD: ["FLD", "FPG", "SEC", "BLD", "WFL", "TLE", "PFL", "PLG", "NCH"],
  SUR: [
    "BLD",
    "PLG",
    "FPG",
    "PFL",
    "PNL",
    "PFP",
    "PNP",
    "FLD",
    "TXD",
    "STK",
    "OLP",
    "LNE",
    "CRV",
    "CRK",
    "CRL",
    "COV",
    "EXD",
    "ECH",
  ],
  DVD: ["SGL", "STK", "CRV", "DRP", "SEC", "DRS"],
};

const sources = ["manufactured", "purchased"];

interface ProductCardProps {
  product?: CSIProduct;
}

export default function CSICreateProduct({ product }: ProductCardProps) {
  const [editableProduct, setEditableProduct] = useState<CSIProduct>(
    product
      ? { ...product }
      : {
          id: "",
          baseproductid: "",
          name: "",
          source: sources[0],
          categoryid: Object.keys(subcategories)[3], // default category
          subcategoryid: subcategories[Object.keys(subcategories)[0]][0], // default subcategory
          productid: "",
          materialcode: "",
          sku: "",
          description: "",
          length: 0,
          width: 0,
          height: 0,
          thickness: 0,
          color: "",
          spacing: "",
          edge: "",
          designoption: "",
          formoption: "",
          unitofmeasure: "",
          competitor: "",
          acoustics: 0,
          flammability: "",
        },
  );
  const [productId, setProductId] = useState<string>();
  const [baseProductId, setBaseProductId] = useState<string>();

  const inputRefs = useRef<{ [K in keyof CSIProduct]?: string | number }>({});
  const debounceRef = useRef<number | null>(null);

  const [requestStatus, setRequestStatus] = useState<
    "success" | "warning" | "error" | null
  >(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChangeDebounced = (
    field: keyof CSIProduct,
    value: string | number,
  ) => {
    inputRefs.current[field] = value;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setEditableProduct((prev) => {
        setProductId(
          `CSI-${inputRefs.current["categoryid"] ?? prev.categoryid}-${
            inputRefs.current["subcategoryid"] ?? prev.subcategoryid
          }-${inputRefs.current["productid"] ?? prev.productid}-${
            inputRefs.current["materialcode"] ?? prev.materialcode
          }-${inputRefs.current["sku"] ?? prev.sku}`,
        );
        setBaseProductId(
          `CSI-${inputRefs.current["categoryid"] ?? prev.categoryid}-${
            inputRefs.current["subcategoryid"] ?? prev.subcategoryid
          }`,
        );

        return { ...prev, [field]: inputRefs.current[field] as unknown };
      });
    }, 500);
  };

  const getInputValue = (field: keyof CSIProduct) => {
    return inputRefs.current[field] ?? editableProduct[field];
  };

  const submitNewCsiProduct = (product: CSIProduct) => {
    fetch(`${API_URL}/csi/createProduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product: product }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        setRequestStatus("success");
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setRequestStatus("error");
        setErrorMessage(JSON.stringify(error));
        alert(error);
      });
  };

  return (
    <div className="mx-auto mt-6 max-w-4xl min-w-[800px] bg-gray-800 p-4 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
        Create Product: {editableProduct.name} ({editableProduct.sku})
      </h2>
      <div className="grid grid-cols-1 gap-4 text-gray-700 md:grid-cols-2 dark:text-gray-200">
        {/* Left column */}
        <div className="space-y-2">
          {(
            [
              ["ID", "id"],
              ["Base Product ID", "baseproductid"],
              ["Name", "name"],
              ["Source", "source"],
              ["Category ID", "categoryid"],
              ["Subcategory ID", "subcategoryid"],
              ["Product Number", "productid"],
              ["Material Code", "materialcode"],
              // ["SKU", "sku"],
            ] as [string, keyof CSIProduct][]
          ).map(([label, field]) => {
            if (field === "id") {
              return (
                <div key={field} className="flex items-start justify-between">
                  <span className="font-semibold">{label}:</span>
                  <TextInput
                    defaultValue={productId}
                    onChange={(e) =>
                      handleChangeDebounced(field, e.target.value)
                    }
                    disabled
                    className={`w-64 rounded-md border text-right ${
                      editableProduct[field] === editableProduct[field]
                        ? "border-white"
                        : "border-red-500"
                    }`}
                  />
                </div>
              );
            }

            if (field === "baseproductid") {
              return (
                <div key={field} className="flex items-start justify-between">
                  <span className="font-semibold">{label}:</span>
                  <TextInput
                    defaultValue={baseProductId}
                    onChange={(e) =>
                      handleChangeDebounced(field, e.target.value)
                    }
                    disabled
                    className={`w-64 rounded-md border text-right ${
                      editableProduct[field] === editableProduct[field]
                        ? "border-white"
                        : "border-red-500"
                    }`}
                  />
                </div>
              );
            }

            if (field === "sku") {
              return (
                <div key={field} className="flex items-start justify-between">
                  <span className="font-semibold">{label}:</span>
                  <TextInput
                    defaultValue={getInputValue(field) as string}
                    onChange={(e) =>
                      handleChangeDebounced(field, e.target.value)
                    }
                    disabled
                    className={`w-64 rounded-md border text-right ${
                      editableProduct[field] === editableProduct[field]
                        ? "border-white"
                        : "border-red-500"
                    }`}
                  />
                </div>
              );
            }

            if (field === "source") {
              return (
                <div key={field} className="flex items-center justify-between">
                  <span className="font-semibold">{label}:</span>
                  <Select
                    value={editableProduct.source}
                    onChange={(e) =>
                      handleChangeDebounced(field, e.target.value)
                    }
                    className={`w-64 text-right ${
                      editableProduct[field] === editableProduct[field]
                        ? "border-white"
                        : "border-red-500"
                    }`}
                  >
                    {sources.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Select>
                  {/* <TextInput
                                        defaultValue={getInputValue(field) as string}
                                        onChange={e => handleChangeDebounced(field, e.target.value)}
                                        disabled
                                        className={`w-64 text-right border rounded-md ${editableProduct[field] === editableProduct[field]
                                            ? "border-white"
                                            : "border-red-500"
                                            }`}
                                    /> */}
                </div>
              );
            }

            if (field === "categoryid") {
              return (
                <div key={field} className="flex items-center justify-between">
                  <span className="font-semibold">{label}:</span>
                  <Select
                    value={editableProduct.categoryid}
                    onChange={(e) =>
                      handleChangeDebounced(field, e.target.value)
                    }
                    className={`w-64 text-right ${
                      editableProduct[field] === editableProduct[field]
                        ? "border-white"
                        : "border-red-500"
                    }`}
                  >
                    {Object.keys(subcategories).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Select>
                </div>
              );
            }

            if (field === "subcategoryid") {
              const selectedCategory =
                editableProduct.categoryid || Object.keys(subcategories)[0];
              return (
                <div key={field} className="flex items-center justify-between">
                  <span className="font-semibold">{label}:</span>
                  <Select
                    value={editableProduct.subcategoryid}
                    onChange={(e) =>
                      handleChangeDebounced(field, e.target.value)
                    }
                    className={`w-64 text-right ${editableProduct[field] === editableProduct[field] ? "border-white" : "border-red-500"}`}
                  >
                    {subcategories[selectedCategory].map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </Select>
                </div>
              );
            }

            return (
              <div key={field} className="flex items-center justify-between">
                <span className="font-semibold">{label}:</span>
                <TextInput
                  type="text"
                  defaultValue={getInputValue(field) as string}
                  onChange={(e) => handleChangeDebounced(field, e.target.value)}
                  className={`w-64 rounded-md border text-right ${
                    editableProduct[field] === editableProduct[field]
                      ? "border-white"
                      : "border-red-500"
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Right column */}
        <div className="space-y-2">
          {(
            [
              ["Description", "description"],
              ["Dimensions (L×W×H×T)", "length"],
              ["Color", "color"],
              ["Spacing", "spacing"],
              ["Edge", "edge"],
              ["Design Option", "designoption"],
              ["Form Option", "formoption"],
              ["Unit of Measure", "unitofmeasure"],
              ["Competitor", "competitor"],
              ["Acoustics", "acoustics"],
              ["Flammability", "flammability"],
            ] as [string, keyof CSIProduct][]
          ).map(([label, field]) => {
            if (field === "description") {
              return (
                <div key={field} className="flex items-start justify-between">
                  <span className="font-semibold">{label}:</span>
                  <Textarea
                    defaultValue={getInputValue(field) as string}
                    onChange={(e) =>
                      handleChangeDebounced(field, e.target.value)
                    }
                    rows={3}
                    className={`w-64 rounded-md border text-right ${
                      editableProduct[field] === editableProduct[field]
                        ? "border-white"
                        : "border-red-500"
                    }`}
                  />
                </div>
              );
            }

            if (field === "length") {
              return (
                <div
                  key="dimensions"
                  className="flex items-center justify-between space-x-2"
                >
                  <span className="font-semibold">{label}:</span>
                  {(
                    [
                      "length",
                      "width",
                      "height",
                      "thickness",
                    ] as (keyof CSIProduct)[]
                  ).map((dim) => (
                    <TextInput
                      key={dim}
                      type="number"
                      defaultValue={getInputValue(dim) as number}
                      onChange={(e) =>
                        handleChangeDebounced(dim, Number(e.target.value))
                      }
                      placeholder={dim.charAt(0).toUpperCase()}
                      className={`w-64 rounded-md border text-right ${
                        editableProduct[field] === editableProduct[field]
                          ? "border-white"
                          : "border-red-500"
                      }`}
                    />
                  ))}
                </div>
              );
            }

            return (
              <div key={field} className="flex items-center justify-between">
                <span className="font-semibold">{label}:</span>
                <TextInput
                  type={field === "acoustics" ? "number" : "text"}
                  defaultValue={getInputValue(field) as string | number}
                  onChange={(e) =>
                    handleChangeDebounced(
                      field,
                      field === "acoustics"
                        ? Number(e.target.value)
                        : e.target.value,
                    )
                  }
                  className={`w-64 rounded-md border text-right ${
                    editableProduct[field] === editableProduct[field]
                      ? "border-white"
                      : "border-red-500"
                  }`}
                />
              </div>
            );
          })}
          <div key="submit" className="flex items-center justify-between">
            <span className="font-semibold">Create Product:</span>
            <Button
              onClick={() => {
                submitNewCsiProduct(editableProduct);
              }}
              className="w-48 text-right"
            >
              Create Product
            </Button>
          </div>
        </div>
      </div>

      {(() => {
        switch (requestStatus) {
          case "success":
            return (
              <div className="rounded-4x1 m-2 w-[100%] bg-green-600 p-4">
                <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Product Made
                </h4>
              </div>
            );
          case "warning":
            return <div className="m-2h-10 m-0 w-[100%] bg-yellow-600"></div>;
          case "error":
            return (
              <div className="m-2 w-[100%] bg-red-600">
                <h4>{errorMessage}</h4>
              </div>
            );
          default:
            return <div className="m-2 h-10 w-[100%] bg-gray-500"></div>;
        }
      })()}
    </div>
  );
}
