import {
    TableRow,
    TableCell,
    TextInput,
    Button,
    Dropdown,
    DropdownItem,
} from "flowbite-react";
import { useState } from "react";
import { ArrowUp, Plus } from "lucide-react";
import type { AccountLocation, AccountLocationItem } from "../../../types/pslive.type";
import AccountLocationItemDisplay from "./PsLiveAccountLocationItemDisplay";

interface EditableAccountLocationRowProps {
    location: AccountLocation;
}

export default function AccountLocationDisplay({
    location,
}: EditableAccountLocationRowProps) {
    const API_URL = import.meta.env.VITE_PSLIVE_URL;
    const [localLocation, setLocalLocation] =
        useState<AccountLocation>(location);

    const [newItem, setNewItem] = useState<AccountLocationItem>({
        accountid: location.accountid,
        locationcode: location.locationcode,
        productcode: "",
        productdescription: "",
        quantity: 0,
    });

    const handleFieldChange = (
        field: keyof AccountLocation,
        value: string,
    ) => {
        const updated = { ...localLocation, [field]: value };
        setLocalLocation(updated);
    };

    async function updateLocation(newLocation: AccountLocation) {
        try {
            const response = await fetch(
                `${API_URL}/accountlocation/${newLocation.locationcode}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newLocation),
                },
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Failed to update account location",
                );
            }

            alert(
                `Updated location ${newLocation.locationcode} successfully`,
            );
        } catch (error) {
            alert(`Error updating location: ${error}`);
        }
    }

    const deleteLocation = async () => {
        try {
            const response = await fetch(
                `${API_URL}/accountlocation/${location.locationcode}`,
                {
                    method: "DELETE",
                },
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
        } catch (error) {
            console.error(`Error deleting location: ${error}`);
        } finally {
            window.location.reload();
        }
    };

    const createLocationItem = async () => {

        if (!newItem.productcode || newItem.productcode === "") {
            console.error("Fill in product code")
            alert("Fill in product ")
            return
        }


        try {
            const response = await fetch(
                `${API_URL}/accountlocation/${location.locationcode}/item`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newItem),
                },
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            alert("Item created successfully");
            window.location.reload();
        } catch (error) {
            console.error(`Error creating item: ${error}`);
            alert(`Error creating item: ${error}`);
        }
    };

    return (
        <>
            <TableRow className="bg-white dark:bg-gray-800">
                <TableCell>
                    {localLocation !== location && (
                        <div className="flex justify-center">
                            <Button
                                onClick={() => updateLocation(localLocation)}
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
                    <Dropdown label="Options" inline={true} size="sm" color="gray">
                        <DropdownItem onClick={deleteLocation}>
                            Delete
                        </DropdownItem>
                    </Dropdown>
                </TableCell>
                <TableCell>
                    <TextInput
                        value={localLocation.location}
                        onChange={(e) =>
                            handleFieldChange("location", e.target.value)
                        }
                    />
                </TableCell>
                <TableCell>{localLocation.accountid}</TableCell>
                <TableCell>{localLocation.locationcode}</TableCell>
            </TableRow>

            <br />
            <h3 className="relative text-center text-2xl font-bold text-gray-900 dark:text-gray-200">
                Account Location Items
            </h3>

            {/* Existing Items */}
            {localLocation.locationitems?.map((item) => (
                <AccountLocationItemDisplay
                    key={item.productcode}
                    item={item}
                />
            ))}

            {/* New Item Creation */}
            <TableRow className="bg-gray-50 dark:bg-gray-700">
                <TableCell>
                    <Button
                        size="sm"
                        color="white"
                        className="rounded border border-gray-400 bg-blue-600 shadow-sm hover:border-gray-600"
                        onClick={createLocationItem}
                    >
                        <Plus className="h-4 w-4 text-white" />
                    </Button>
                </TableCell>
                <TableCell>
                    <Button
                        size="sm"
                        color="white"
                        className="rounded border border-gray-400 bg-blue-600 shadow-sm hover:border-gray-600"

                    >
                        <h1> Cancel</h1>
                    </Button>
                </TableCell>
                <TableCell colSpan={2}></TableCell>
                <TableCell>
                    <TextInput
                        placeholder="Product Code"
                        value={newItem.productcode}
                        onChange={(e) =>
                            setNewItem({ ...newItem, productcode: e.target.value })
                        }
                    />
                </TableCell>
                <TableCell>
                    <TextInput
                        placeholder="Description"
                        value={newItem.productdescription}
                        onChange={(e) =>
                            setNewItem({
                                ...newItem,
                                productdescription: e.target.value,
                            })
                        }
                    />
                </TableCell>
                <TableCell>
                    <TextInput
                        type="number"
                        placeholder="Quantity"
                        value={newItem.quantity}
                        onChange={(e) =>
                            setNewItem({
                                ...newItem,
                                quantity: parseFloat(e.target.value) || 0,
                            })
                        }
                    />
                </TableCell>

            </TableRow>
        </>
    );
}
