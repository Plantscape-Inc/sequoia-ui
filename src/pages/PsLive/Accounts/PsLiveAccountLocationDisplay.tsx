import {
    TextInput,
    Button,
    Dropdown,
    DropdownItem,
    Label,
    Card,
    Table,
    TableHead,
    TableHeadCell,
    TableBody,
    TableRow,
    TableCell,
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
    const [localLocation, setLocalLocation] = useState<AccountLocation>(location);

    const [newItem, setNewItem] = useState<AccountLocationItem>({
        id: Math.floor(Math.random() * 10000) + 1,
        accountid: location.accountid,
        locationcode: location.locationcode,
        productcode: "",
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
                `${API_URL}/accountlocation/${newLocation.id}`,
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
                `${API_URL}/accountlocation/${location.id}`,
                { method: "DELETE" },
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
        if (!newItem.productcode) {
            alert("Fill in product code");
            return;
        }

        newItem.id = Math.floor(Math.random() * 10000) + 1

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
        <Card className="my-6">
            <div className="flex justify-between items-center dark:text-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                    Location {localLocation.locationcode}
                </h3>
                <Dropdown label="Options" inline size="sm" color="white" className="dark:text-gray-200">
                    <DropdownItem onClick={deleteLocation}>Delete</DropdownItem>
                </Dropdown>
            </div>

            {/* Editable Location Form */}
            <div className="grid gap-4 mt-4">
                <div>
                    <Label htmlFor="location" >Location</Label>
                    <TextInput
                        id="location"
                        value={localLocation.location}
                        onChange={(e) => handleFieldChange("location", e.target.value)}
                    />
                </div>


                <div>
                    <Label htmlFor="locationcode" >Location Code </Label>
                    <TextInput id="locationcode" value={localLocation.locationcode} onChange={(e) => handleFieldChange("locationcode", e.target.value)} />
                </div>

                {localLocation !== location && (
                    <Button
                        onClick={() => updateLocation(localLocation)}
                        size="sm"
                        color="green"
                        className="w-fit"
                    >
                        <ArrowUp className="h-4 w-4 mr-1" /> Save Changes
                    </Button>
                )}
            </div>

            {/* Items Table */}
            <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2">Location Items</h4>
                <Table hoverable>
                    <TableHead>
                        <TableHeadCell></TableHeadCell>
                        <TableHeadCell>Actions</TableHeadCell>
                        <TableHeadCell>Account ID</TableHeadCell>
                        <TableHeadCell>Location ID</TableHeadCell>
                        <TableHeadCell>Product Code</TableHeadCell>
                        <TableHeadCell>Quantity</TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y">
                        {localLocation.locationitems?.map((item) => (
                            <AccountLocationItemDisplay key={`${item.productcode}${item.id}`} item={item} />
                        ))}

                        <TableRow className="bg-gray-50 dark:bg-gray-700">
                            <TableCell>
                                <Button
                                    size="sm"
                                    color="blue"
                                    onClick={createLocationItem}
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add
                                </Button>
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell>{newItem.accountid}</TableCell>
                            <TableCell>{newItem.locationcode}</TableCell>
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
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
