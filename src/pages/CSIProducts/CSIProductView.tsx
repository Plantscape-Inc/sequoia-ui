import { Button, Card, Textarea, TextInput } from "flowbite-react";
import type { CSIProduct } from "../../types/products.type";
// import { useState, useRef } from "react";

interface ProductCardProps {
  product: CSIProduct;
}

// const API_URL = import.meta.env.VITE_PRODUCT_API_URL;

export default function ProductCard({ product }: ProductCardProps) {
  // const [editableProduct, setEditableProduct] = useState<CSIProduct>({ ...product });

  // const inputRefs = useRef<{ [K in keyof CSIProduct]?: string | number }>({});

  // const debounceRef = useRef<number | null>(null);

  // const handleChangeDebounced = (field: keyof CSIProduct, value: string | number) => {
  //     inputRefs.current[field] = value;

  //     if (debounceRef.current) clearTimeout(debounceRef.current);

  //     debounceRef.current = setTimeout(() => {
  //         setEditableProduct(prev => ({ ...prev, [field]: inputRefs.current[field] as unknown }));
  //     }, 500);
  // };

  const getInputValue = (field: keyof CSIProduct) => {
    return product[field];
  };

  // const updateCsiProduct = (product: CSIProduct) => {

  //     console.log(product)
  //     console.log(`${API_URL}/csi/updateProduct`)
  //     fetch(`${API_URL}/csi/updateProduct`, {
  //         method: "POST",
  //         headers: {
  //             "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ "product": product }),
  //     })
  //         .then(response => {
  //             if (!response.ok) {
  //                 throw new Error(`HTTP error! status: ${response.status}`);
  //             }
  //             return response.json();
  //         })
  //         .then(data => {
  //             console.log("Success:", data);
  //         })
  //         .catch(error => {
  //             alert(error)
  //             console.error("Fetch error:", error);
  //         });
  // }

  // return (
  //     <Card className="max-w-4xl mx-auto mt-6 shadow-lg">
  //         <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
  //             Editable: {editableProduct.name} ({editableProduct.sku})
  //         </h2>
  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200">
  //             {/* Left column */}
  //             <div className="space-y-2">
  //                 {([
  //                     ["ID", "id"],
  //                     ["Source", "source"],
  //                     ["Category ID", "categoryid"],
  //                     ["Subcategory ID", "subcategoryid"],
  //                     ["Product Number", "productid"],
  //                     ["Material Code", "materialcode"],
  //                     ["SKU", "sku"],
  //                     ["Name", "name"],
  //                 ] as [string, keyof CSIProduct][]).map(([label, field]) => {

  //                     console.log(product[field], editableProduct[field], (product[field] === editableProduct[field]))

  //                     if (field === "name") {
  //                         return (
  //                             <div key={field} className="flex justify-between items-start">
  //                                 <span className="font-semibold">{label}:</span>
  //                                 <TextInput
  //                                     defaultValue={getInputValue(field) as string}
  //                                     onChange={e => handleChangeDebounced(field, e.target.value)}
  //                                     className={`w-64 text-right border rounded-md ${product[field] === editableProduct[field]
  //                                         ? "border-white"
  //                                         : "border-red-500"
  //                                         }`}
  //                                 />
  //                             </div>
  //                         );
  //                     }

  //                     return (
  //                         <div key={field} className="flex justify-between items-center">
  //                             <span className="font-semibold">{label}:</span>
  //                             <TextInput
  //                                 type="text"
  //                                 defaultValue={getInputValue(field) as string}
  //                                 onChange={e => handleChangeDebounced(field, e.target.value)}
  //                                 className={`w-64 text-right border rounded-md ${product[field] === editableProduct[field]
  //                                     ? "border-white"
  //                                     : "border-red-500"
  //                                     }`}
  //                             />
  //                         </div>
  //                     )
  //                 })}
  //             </div>

  //             {/* Right column */}
  //             <div className="space-y-2">
  //                 {([
  //                     ["Description", "description"],
  //                     ["Dimensions (L×W×H×T)", "length"],
  //                     ["Color", "color"],
  //                     ["Spacing", "spacing"],
  //                     ["Edge", "edge"],
  //                     ["Design Option", "designoption"],
  //                     ["Form Option", "formoption"],
  //                     ["Unit of Measure", "unitofmeasure"],
  //                     ["Competitor", "competitor"],
  //                     ["Acoustics", "acoustics"],
  //                     ["Flammability", "flammability"],
  //                 ] as [string, keyof CSIProduct][]).map(([label, field]) => {
  //                     if (field === "description") {
  //                         return (
  //                             <div key={field} className="flex justify-between items-start">
  //                                 <span className="font-semibold">{label}:</span>
  //                                 <Textarea
  //                                     defaultValue={getInputValue(field) as string}
  //                                     onChange={e => handleChangeDebounced(field, e.target.value)}
  //                                     rows={3}
  //                                     className={`w-64 text-right border rounded-md ${product[field] === editableProduct[field]
  //                                         ? "border-white"
  //                                         : "border-red-500"
  //                                         }`}
  //                                 />
  //                             </div>
  //                         );
  //                     }

  //                     if (field === "length") {
  //                         return (
  //                             <div key="dimensions" className="flex justify-between items-center space-x-2">
  //                                 <span className="font-semibold">{label}:</span>
  //                                 {(["length", "width", "height", "thickness"] as (keyof CSIProduct)[]).map(dim => (
  //                                     <TextInput
  //                                         key={dim}
  //                                         type="number"
  //                                         defaultValue={getInputValue(dim) as number}
  //                                         onChange={e => handleChangeDebounced(dim, Number(e.target.value))}
  //                                         placeholder={dim.charAt(0).toUpperCase()}
  //                                         className={`w-64 text-right border rounded-md ${product[field] === editableProduct[field]
  //                                             ? "border-white"
  //                                             : "border-red-500"
  //                                             }`}
  //                                     />
  //                                 ))}
  //                             </div>
  //                         );
  //                     }

  //                     return (
  //                         <div key={field} className="flex justify-between items-center">
  //                             <span className="font-semibold">{label}:</span>
  //                             <TextInput
  //                                 type={field === "acoustics" ? "number" : "text"}
  //                                 defaultValue={getInputValue(field) as string | number}
  //                                 onChange={e =>
  //                                     handleChangeDebounced(
  //                                         field,
  //                                         field === "acoustics" ? Number(e.target.value) : e.target.value
  //                                     )
  //                                 }
  //                                 className={`w-64 text-right border rounded-md ${product[field] === editableProduct[field]
  //                                     ? "border-white"
  //                                     : "border-red-500"
  //                                     }`}
  //                             />
  //                         </div>
  //                     );
  //                 })}
  //                 <div key="submit" className="flex justify-between items-center">
  //                     <span className="font-semibold">{"Update Card"}:</span>
  //                     <Button
  //                         onClick={() => { updateCsiProduct(editableProduct) }}
  //                         className="text-right w-48"
  //                     >Update</Button>
  //                 </div>
  //             </div>
  //         </div>

  //     </Card>
  // );

  return (
    <Card className="mx-auto mt-6 max-w-4xl shadow-lg">
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
        Editable: {product.name} ({product.sku})
      </h2>
      <div className="grid grid-cols-1 gap-4 text-gray-700 md:grid-cols-2 dark:text-gray-200">
        {/* Left column */}
        <div className="space-y-2">
          {(
            [
              ["ID", "id"],
              ["Source", "source"],
              ["Category ID", "categoryid"],
              ["Subcategory ID", "subcategoryid"],
              ["Product Number", "productid"],
              ["Material Code", "materialcode"],
              ["SKU", "sku"],
              ["Name", "name"],
            ] as [string, keyof CSIProduct][]
          ).map(([label, field]) => (
            <div key={field} className="flex items-center justify-between">
              <span className="font-semibold">{label}:</span>
              <TextInput
                type="text"
                value={getInputValue(field) as string | number}
                disabled
                className="w-64 rounded-md border border-white text-right"
              />
            </div>
          ))}
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
                    value={getInputValue(field) as string}
                    rows={3}
                    disabled
                    className="w-64 rounded-md border border-white text-right"
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
                      value={getInputValue(dim) as number}
                      placeholder={dim.charAt(0).toUpperCase()}
                      disabled
                      className="w-64 rounded-md border border-white text-right"
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
                  value={getInputValue(field) as string | number}
                  disabled
                  className="w-64 rounded-md border border-white text-right"
                />
              </div>
            );
          })}
          <div key="submit" className="flex items-center justify-between">
            <span className="font-semibold">{"Update Card"}:</span>
            <Button disabled className="w-48 text-right">
              Update
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
