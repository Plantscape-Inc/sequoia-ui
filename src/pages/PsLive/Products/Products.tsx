import { useEffect, useState } from "react";
import {
    Spinner,
    Table,
    TableBody,
    TableHead,
    TableHeadCell,
    Button,
} from "flowbite-react";

import { Product } from "../../../types/psliveorders.type";
import { ProductRow } from "./ProductRow";

export default function Products() {
    const API_URL = import.meta.env.VITE_PSLIVE_URL;

    const [loading, setLoading] = useState(false);
    const [productsData, setProductsData] = useState<Product[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [draftProduct, setDraftProduct] = useState<Product | null>(null);

    // --- Fetch all products on mount ---
    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/products`)
            .then((res) => res.json())
            .then((data) => setProductsData(data))
            .finally(() => setLoading(false));
    }, []);

    // --- API Calls ---
    const createProduct = async (product: Product) => {
        const res = await fetch(`${API_URL}/product`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
        });
        if (!res.ok) throw new Error("Failed to create product");
        return res.json();
    };

    const updateProduct = async (id: number, product: Product) => {
        const res = await fetch(`${API_URL}/product/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
        });
        if (!res.ok) throw new Error("Failed to update product");
        return res.json();
    };

    const deleteProduct = async (id: number) => {
        const res = await fetch(`${API_URL}/product/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete product");
        return res.json();
    };

    // --- Handlers ---
    const handleDelete = async (id: number) => {
        try {
            await deleteProduct(id);
            setProductsData((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingId(product.id);
        setDraftProduct({ ...product }); // make a copy to edit
    };

    const handleSave = async () => {
        if (!draftProduct) return;
        try {
            if (editingId === -1) {
                // Save new product
                const saved = await createProduct(draftProduct);
                setProductsData((prev) => [saved, ...prev]);
            } else {
                // Update existing product
                const updated = await updateProduct(draftProduct.id, draftProduct);
                setProductsData((prev) =>
                    prev.map((p) => (p.id === draftProduct.id ? updated : p))
                );
            }
        } catch (err) {
            console.error(err);
        } finally {
            setEditingId(null);
            setDraftProduct(null);
        }
    };

    const handleFieldChange = (field: keyof Product, value: string | number) => {
        if (!draftProduct) return;
        setDraftProduct({
            ...draftProduct,
            [field]: field === "price" ? Number(value) : value,
        });
    };

    const handleAdd = () => {
        setEditingId(-1);
        setDraftProduct({
            id: 0,
            productid: "",
            name: "",
            height: "",
            price: 0,
        });
    };

    // --- Render ---
    return (
        <div>
            <h1 className="relative text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
                Products
            </h1>

            {loading && (
                <div className="mt-6 flex justify-center">
                    <Spinner size="xl" />
                </div>
            )}

            {!loading && (
                <div className="mt-8 flex justify-center">
                    <div className="w-full max-w-[900px]">
                        <div className="mb-4 flex justify-end">
                            <Button onClick={handleAdd}>Add Product</Button>
                        </div>
                        <Table hoverable>
                            <TableHead>
                                <TableHeadCell>Edit</TableHeadCell>
                                <TableHeadCell>Delete</TableHeadCell>
                                <TableHeadCell>Product Code</TableHeadCell>
                                <TableHeadCell>Name</TableHeadCell>
                                <TableHeadCell>Height</TableHeadCell>
                                <TableHeadCell>Price</TableHeadCell>
                            </TableHead>
                            <TableBody className="divide-y">
                                {productsData.map((product) => {
                                    const isEditing = editingId === product.id;
                                    return (
                                        <ProductRow
                                            key={product.id}
                                            product={product}
                                            isEditing={isEditing}
                                            draftProduct={draftProduct}
                                            setDraftProduct={setDraftProduct}
                                            setEditingId={setEditingId} // <-- ADD THIS
                                            onSave={handleSave}
                                            onDelete={() => handleDelete(product.id)}
                                        />
                                    );
                                })}

                                {editingId === -1 && draftProduct && (
                                    <ProductRow
                                        key="-1"
                                        product={draftProduct}
                                        isEditing={true}
                                        draftProduct={draftProduct}
                                        setDraftProduct={setDraftProduct}
                                        setEditingId={setEditingId} // <-- ADD THIS
                                        onSave={handleSave}
                                        onDelete={() => setDraftProduct(null)}
                                    />
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
        </div>
    );
}


