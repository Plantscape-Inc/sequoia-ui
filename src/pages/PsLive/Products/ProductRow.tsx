import { memo } from "react";
import { TableCell, TableRow, Button, TextInput } from "flowbite-react";
import { Product } from "../../../types/pslive.type";

type Props = {
    product: Product;
    isEditing: boolean;
    draftProduct: Product | null;
    setDraftProduct: (p: Product) => void;
    setEditingId: (id: number) => void; // <- added
    onSave: () => void;
    onDelete: () => void;
};

export const ProductRow = memo(function ProductRow({
    product,
    isEditing,
    draftProduct,
    setDraftProduct,
    setEditingId,
    onSave,
    onDelete,
}: Props) {
    if (isEditing && draftProduct) {
        const handleChange = (field: keyof Product, value: string | number) => {
            setDraftProduct({ ...draftProduct, [field]: field === "price" ? Number(value) : value });
        };

        return (
            <TableRow className="cursor-pointer bg-white dark:bg-gray-800">
                <TableCell>
                    <Button size="xs" onClick={onSave}>Save</Button>
                </TableCell>
                <TableCell>
                    <Button color="failure" size="xs" onClick={onDelete}>Delete</Button>
                </TableCell>
                <TableCell>
                    <TextInput value={draftProduct.productid} onChange={(e) => handleChange("productid", e.target.value)} />
                </TableCell>
                <TableCell>
                    <TextInput value={draftProduct.name ?? ""} onChange={(e) => handleChange("name", e.target.value)} />
                </TableCell>
                <TableCell>
                    <TextInput value={draftProduct.height ?? ""} onChange={(e) => handleChange("height", e.target.value)} />
                </TableCell>
                <TableCell>
                    <TextInput value={draftProduct.price?.toString() ?? ""} onChange={(e) => handleChange("price", e.target.value)} />
                </TableCell>
            </TableRow>
        );
    }

    return (
        <TableRow className="cursor-pointer bg-white dark:bg-gray-800">
            <TableCell>
                <Button size="xs" onClick={() => {
                    setDraftProduct({ ...product });
                    setEditingId(product.id); // <- notify parent
                }}>
                    Edit
                </Button>
            </TableCell>
            <TableCell>
                <Button color="failure" size="xs" onClick={onDelete}>Delete</Button>
            </TableCell>
            <TableCell>{product.productid}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.height}</TableCell>
            <TableCell>{product.price}</TableCell>
        </TableRow>
    );
});
