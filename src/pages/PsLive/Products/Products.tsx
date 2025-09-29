// import { lazy, Suspense, useMemo, useState } from 'react';
// import {
//     MaterialReactTable,
//     type MRT_ColumnDef,
//     useMaterialReactTable,
// } from 'material-react-table';
// import {
//     Box,
//     Button,
//     CircularProgress,
//     createTheme,
//     IconButton,
//     ThemeProvider,
//     Tooltip,
// } from '@mui/material';
// import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import DeleteIcon from '@mui/icons-material/Delete';

// // --- PRODUCT TYPE ---
// export interface Product {
//     id: number;
//     productid: string;
//     name: string;
//     height: string;
//     price: number;
// }


// const Example = () => {

//     const API_URL = import.meta.env.VITE_PSLIVE_URL;
//     const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
//     const [editedProducts, setEditedProducts] = useState<Record<string, Product>>({});
//     const queryClient = useQueryClient();


//     const columns = useMemo<MRT_ColumnDef<Product>[]>(() => [
//         { accessorKey: 'id', header: 'ID', enableEditing: false, size: 50 },

//         {
//             accessorKey: 'productid',
//             header: 'Product Code',
//             muiEditTextFieldProps: ({ cell, row }) => ({
//                 error: !!validationErrors[cell.id],
//                 helperText: validationErrors[cell.id],
//                 onBlur: (event) => {
//                     const value = event.currentTarget.value;
//                     setValidationErrors({
//                         ...validationErrors,
//                         [cell.id]: value ? undefined : 'Product ID is required',
//                     });
//                     setEditedProducts({
//                         ...editedProducts,
//                         [row.id]: {
//                             ...row.original,
//                             ...editedProducts[row.id],
//                             productid: value,
//                         },
//                     });
//                 },
//             }),
//         },

//         {
//             accessorKey: 'name',
//             header: 'Name',
//             muiEditTextFieldProps: ({ cell, row }) => ({
//                 error: !!validationErrors[cell.id],
//                 helperText: validationErrors[cell.id],
//                 onBlur: (event) => {
//                     const value = event.currentTarget.value;
//                     setValidationErrors({
//                         ...validationErrors,
//                         [cell.id]: value ? undefined : 'Name is required',
//                     });
//                     setEditedProducts({
//                         ...editedProducts,
//                         [row.id]: {
//                             ...row.original,
//                             ...editedProducts[row.id],
//                             name: value,
//                         },
//                     });
//                 },
//             }),
//         },

//         {
//             accessorKey: 'height',
//             header: 'Height',
//             muiEditTextFieldProps: ({ cell, row }) => ({
//                 error: !!validationErrors[cell.id],
//                 helperText: validationErrors[cell.id],
//                 onBlur: (event) => {
//                     const value = event.currentTarget.value;
//                     setValidationErrors({
//                         ...validationErrors,
//                         [cell.id]: value ? undefined : 'Height is required',
//                     });
//                     setEditedProducts({
//                         ...editedProducts,
//                         [row.id]: {
//                             ...row.original,
//                             ...editedProducts[row.id],
//                             height: value,
//                         },
//                     });
//                 },
//             }),
//         },

//         {
//             accessorKey: 'price',
//             header: 'Price',
//             muiEditTextFieldProps: ({ cell, row }) => ({
//                 type: 'number',
//                 error: !!validationErrors[cell.id],
//                 helperText: validationErrors[cell.id],
//                 onBlur: (event) => {
//                     const value = parseFloat(event.currentTarget.value);
//                     setValidationErrors({
//                         ...validationErrors,
//                         [cell.id]: isNaN(value) ? 'Price must be a number' : undefined,
//                     });
//                     setEditedProducts({
//                         ...editedProducts,
//                         [row.id]: {
//                             ...row.original,
//                             ...editedProducts[row.id],
//                             price: isNaN(value) ? 0 : value,
//                         },
//                     });
//                 },
//             }),
//         },
//     ], [editedProducts, validationErrors]);


//     // --- QUERY: READ ---
//     const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
//         queryKey: ['products'],
//         queryFn: async () => {
//             const products = await (await fetch(`${API_URL}/products`)).json()
//             if (!products) {
//                 console.error("aspoidfjpaosidjf")
//             }
//             return products;
//         },
//         refetchOnWindowFocus: false,
//     });

//     // --- MUTATIONS ---
//     const createProduct = useMutation({
//         mutationFn: async (product: Product) => {
//             await new Promise((resolve) => setTimeout(resolve, 500));
//             return product;
//         },
//         onMutate: async (newProduct: Product) => {
//             await queryClient.cancelQueries({ queryKey: ['products'] });
//             const previous = queryClient.getQueryData<Product[]>(['products']);
//             queryClient.setQueryData(['products'], (old: Product[]) => [newProduct, ...old]);
//             return { previous };
//         },
//         onError: (_err, _newProduct, context) => {
//             queryClient.setQueryData(['products'], context?.previous);
//         },
//         onSettled: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
//     });

//     const updateProducts = useMutation({
//         mutationFn: async (products: Product[]) => {
//             // Loop through each product and send API request


//             const responses = await Promise.all(
//                 products.map(async (product) => {
//                     product.id = Math.floor(Math.random() * 10000) + 1
//                     console.log(product)
//                     const res = await fetch(`${API_URL}/product/${product.id}`, {
//                         method: 'PUT',
//                         headers: { 'Content-Type': 'application/json' },
//                         body: JSON.stringify(product),
//                     });
//                     if (!res.ok) throw new Error(`Failed to update product ${product.id}`);
//                     return res.json();
//                 })
//             );
//             return responses;
//         },
//         onMutate: async (updatedProducts: Product[]) => {
//             await queryClient.cancelQueries({ queryKey: ['products'] });
//             const previous = queryClient.getQueryData<Product[]>(['products']);
//             queryClient.setQueryData(['products'], (old: Product[]) =>
//                 old.map((p: Product) => updatedProducts.find((u) => u.id === p.id) ?? p)
//             );
//             return { previous };
//         },
//         onError: (_err, _products, context) => {
//             queryClient.setQueryData(['products'], context?.previous);
//         },
//         onSettled: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
//     });


//     const deleteProduct = useMutation({
//         mutationFn: async (id: number) => {
//             await new Promise((resolve) => setTimeout(resolve, 500));
//             return id;
//         },
//         onMutate: async (id: number) => {
//             await queryClient.cancelQueries({ queryKey: ['products'] });
//             const previous = queryClient.getQueryData<Product[]>(['products']);
//             queryClient.setQueryData(['products'], (old: Product[]) => old.filter((p: Product) => p.id !== id));
//             return { previous };
//         },
//         onError: (_err, _id, context) => {
//             queryClient.setQueryData(['products'], context?.previous);
//         },
//         onSettled: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
//     });

//     // --- CREATE / EDIT HANDLERS ---
//     // const handleCreate: MRT_TableOptions<Product>['onCreatingRowSave'] = async ({ values, table }) => {
//     //     createProduct.mutate(values);
//     //     table.setCreatingRow(null);
//     // };

//     const handleSave = () => {
//         if (Object.values(validationErrors).some((error) => !!error)) return;
//         updateProducts.mutate(Object.values(editedProducts));
//         setEditedProducts({});
//     };

//     const handleDelete = (rowId: number) => {
//         if (window.confirm('Are you sure you want to delete this product?')) {
//             deleteProduct.mutate(rowId);
//         }
//     };

//     // --- TABLE SETUP ---
//     const table = useMaterialReactTable({
//         columns,
//         data: products ?? [],
//         enableEditing: true,
//         enableRowActions: true,
//         positionActionsColumn: 'last',
//         createDisplayMode: 'row',
//         editDisplayMode: 'table',
//         getRowId: (row) => row.id,
//         muiToolbarAlertBannerProps: undefined,
//         renderRowActions: ({ row }) => (
//             <Box sx={{ display: 'flex', gap: '0.5rem' }}>
//                 <Tooltip title="Delete">
//                     <IconButton color="error" onClick={() => handleDelete(row.original.id)}>
//                         <DeleteIcon />
//                     </IconButton>
//                 </Tooltip>
//             </Box>
//         ),
//         renderTopToolbarCustomActions: ({ table }) => (
//             <Button variant="contained" onClick={() => table.setCreatingRow(true)}>
//                 Create New Product
//             </Button>
//         ),
//         renderBottomToolbarCustomActions: () => (
//             <Button
//                 variant="contained"
//                 color="success"
//                 onClick={handleSave}
//                 disabled={Object.keys(editedProducts).length === 0}
//             >
//                 {updateProducts.isPending ? <CircularProgress size={25} /> : 'Save'}
//             </Button>
//         ),
//         state: {
//             isLoading: isLoadingProducts,
//             isSaving: createProduct.isPending || updateProducts.isPending || deleteProduct.isPending,
//         },
//     });

//     return (<MaterialReactTable table={table} />);
// };

// // --- REACT QUERY SETUP ---
// const queryClient = new QueryClient();

// export default function PsLiveProducts() {

//     const darkTheme = createTheme({
//         palette: {
//             mode: 'dark',
//             primary: {
//                 main: '#90caf9',
//             },
//             secondary: {
//                 main: '#f48fb1',
//             },
//             background: {
//                 default: '#121212',
//                 paper: '#1d1d1d',
//             },
//         },
//     });

//     return (
//         <div>
//             <h1 className="text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
//                 Plantscape Live Products
//             </h1>
//             <QueryClientProvider client={queryClient}>
//                 <ThemeProvider theme={darkTheme}>
//                     <Example />

//                 </ThemeProvider>

//                 <Suspense fallback={null}>
//                     <ReactQueryDevtoolsProduction />
//                 </Suspense>
//             </QueryClientProvider>
//         </div>

//     );
// }

// // --- REACT QUERY DEVTOOLS ---
// const ReactQueryDevtoolsProduction = lazy(() =>
//     import('@tanstack/react-query-devtools/build/modern/production.js').then((d) => ({ default: d.ReactQueryDevtools }))
// );


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

export interface Product {
    id: number;
    productid: string;
    name: string;
    height: string;
    price: number;
}

export default function Products() {
    const API_URL = import.meta.env.VITE_PSLIVE_URL;

    const [loading, setLoading] = useState(false);
    const [productsData, setProductsData] = useState<Product[] | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const blankProduct: Product = {
        id: Math.floor(Math.random() * 10000) + 1,
        productid: "",
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
            .then(setProductsData)
            .finally(() => setLoading(false));
    }, [productsData, API_URL]);

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
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-200">
                    Products
                </h1>
                <Button onClick={handleOpenCreateModal} color="blue">
                    Create Product
                </Button>
            </div>

            {loading && (
                <div className="mt-6 flex justify-center">
                    <Spinner size="xl" />
                </div>
            )}

            {!loading && productsData && (
                <Table hoverable>
                    <TableHead>
                        <TableHeadCell>ID</TableHeadCell>
                        <TableHeadCell>Product ID</TableHeadCell>
                        <TableHeadCell>Name</TableHeadCell>
                        <TableHeadCell>Height</TableHeadCell>
                        <TableHeadCell>Price</TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y">
                        {productsData.map((product) => (
                            <TableRow
                                key={product.id}
                                className="cursor-pointer bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                                onClick={() => handleRowClick(product)}
                            >
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.productid}</TableCell>
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
                            <Label htmlFor="productid">Product ID</Label>
                            <TextInput
                                id="productid"
                                name="productid"
                                value={formData?.productid || ""}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter product ID"
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
