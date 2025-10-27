import { useEffect, useState } from "react";
import {
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Label,
    TextInput,
    Alert,
} from "flowbite-react";
import { fitlFilter } from "fitl-js";

export interface Product {
    id: number;
    productcode: string;
    name: string;
    height: string;
    price: number;
}

export default function Products() {
    const API_URL = import.meta.env.VITE_PSLIVE_URL;

    const [loading, setLoading] = useState(false);
    const [productsData, setProductsData] = useState<Product[] | null>(null);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const blankProduct: Product = {
        id: Math.floor(Math.random() * 10000) + 1,
        productcode: "",
        name: "",
        height: "",
        price: 0,
    };

    const [formData, setFormData] = useState<Product>(blankProduct);

    // Fetch products
    useEffect(() => {
        if (productsData) return;
        setLoading(true);
        fetch(`${API_URL}/products`)
            .then((res) => res.json())
            .then((data) => {
                setProductsData(data);
                setFilteredProducts(data);
            })
            .finally(() => setLoading(false));
    }, [productsData, API_URL]);

    // Filter products
    useEffect(() => {
        if (!productsData) return;

        if (!searchTerm.trim()) {
            setFilteredProducts(productsData);
            return;
        }

        const filterProducts = async () => {
            if (searchTerm.startsWith("/f")) {
                try {
                    const result = await fitlFilter(
                        searchTerm.substring(2),
                        productsData,
                        { tableFormat: "JSARRAY" }
                    );
                    setFilteredProducts(result);
                } catch (err) {
                    console.error(err);
                    setFilteredProducts(productsData);
                }
            } else {
                const term = searchTerm.toLowerCase();
                setFilteredProducts(
                    productsData.filter(
                        (p) =>
                            p.productcode.toLowerCase().includes(term) ||
                            p.name.toLowerCase().includes(term) ||
                            p.id.toString().includes(term) ||
                            p.price.toString().includes(term)
                    )
                );
            }
        };

        filterProducts();
    }, [searchTerm, productsData]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle create/update
    const handleSubmit = async () => {
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            const method = editingProduct ? "PUT" : "POST";
            const url = editingProduct
                ? `${API_URL}/product/${editingProduct.id}`
                : `${API_URL}/product`;

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const err = await response.json();
                setError(err.message || "Failed to save product");
                return;
            }

            setSuccess(true);
            setProductsData(null); // refresh list
            setFormData(blankProduct);
            setEditingProduct(null);

            setTimeout(() => {
                setShowModal(false);
                setSuccess(false);
            }, 1500);
        } catch (err) {
            setError(`An error occurred while saving the product: ${err}`);
        } finally {
            setSubmitting(false);
        }
    };

    // Open modal for create
    const handleOpenCreateModal = () => {
        setEditingProduct(null);
        setFormData(blankProduct);
        setShowModal(true);
    };

    // Open modal for editing
    const handleRowClick = (product: Product) => {
        setEditingProduct(product);
        setFormData(product);
        setShowModal(true);
    };

    // Close modal and reset
    const handleCloseModal = () => {
        setShowModal(false);
        setError(null);
        setSuccess(false);
        setEditingProduct(null);
        setFormData(blankProduct);
    };

    // Handle delete
    const handleDelete = async () => {
        if (!editingProduct) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );
        if (!confirmed) return;

        try {
            setSubmitting(true);
            setError(null);

            const response = await fetch(`${API_URL}/product/${editingProduct.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const err = await response.json();
                setError(err.message || "Failed to delete product");
                return;
            }

            setProductsData(null); // refresh list
            setShowModal(false);
        } catch (err) {
            setError(`An error occurred while deleting the product: ${err}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-[1000px] mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-200">
                    Products
                </h1>
                <TextInput
                    type="text"
                    placeholder="Filter products"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3"
                />
                <span className="font-bold dark:text-gray-200">
                    {searchTerm ? filteredProducts.length : productsData?.length} Results
                </span>
                <Button onClick={handleOpenCreateModal} color="blue">
                    Create Product
                </Button>
            </div>

            {loading && (
                <div className="mt-6 flex justify-center">
                    <Spinner size="xl" />
                </div>
            )}

            {!loading && filteredProducts && (
                <Table hoverable className="mx-auto min-w-[700px]">
                    <TableHead>
                        <TableHeadCell>ID</TableHeadCell>
                        <TableHeadCell>Product Code</TableHeadCell>
                        <TableHeadCell>Name</TableHeadCell>
                        <TableHeadCell>Height</TableHeadCell>
                        <TableHeadCell>Price</TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y">
                        {filteredProducts.map((product) => (
                            <TableRow
                                key={product.id}
                                className="cursor-pointer bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                                onClick={() => handleRowClick(product)}
                            >
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.productcode}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.height}</TableCell>
                                <TableCell>{product.price}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Modal show={showModal} onClose={handleCloseModal}>
                <ModalHeader>
                    {editingProduct ? "Update Product" : "Create New Product"}
                </ModalHeader>
                <ModalBody>
                    {error && <Alert color="failure" className="mb-4">{error}</Alert>}
                    {success && <Alert color="success" className="mb-4">Product saved successfully!</Alert>}

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="productid">Product Code</Label>
                            <TextInput
                                id="productid"
                                name="productcode"
                                value={formData?.productcode || ""}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter product code"
                            />
                        </div>
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <TextInput
                                id="name"
                                name="name"
                                value={formData?.name || ""}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter product name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="height">Height</Label>
                            <TextInput
                                id="height"
                                name="height"
                                value={formData?.height || ""}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter product height"
                            />
                        </div>
                        <div>
                            <Label htmlFor="price">Price</Label>
                            <TextInput
                                id="price"
                                name="price"
                                type="number"
                                value={formData?.price || 0}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter product price"
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="flex justify-between items-center">
                    {editingProduct && (
                        <Button color="failure" onClick={handleDelete}>
                            Delete
                        </Button>
                    )}
                    <div className="flex gap-2">
                        <Button onClick={handleSubmit} disabled={submitting} color="blue">
                            {submitting ? <Spinner size="sm" /> : editingProduct ? "Update Product" : "Create Product"}
                        </Button>
                        <Button color="gray" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                    </div>
                </ModalFooter>
            </Modal>
        </div>
    );
}
