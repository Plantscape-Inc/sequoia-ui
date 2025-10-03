import { Label, TextInput, Button } from "flowbite-react";
import { Address } from "../../../types/pslive.type";
import { useState, useEffect } from "react";

export default function AddressDisplay() {
    const API_URL = import.meta.env.VITE_PSLIVE_URL;
    const [loading, setLoading] = useState<boolean>(true);
    const [address, setAddress] = useState<Address | null>(null);
    const [localAddress, setLocalAddress] = useState<Address | null>(null);

    const params = new URLSearchParams(window.location.search);
    const addressid = Number(params.get("addressid"));

    async function fetchAddress() {
        try {
            const response = await fetch(`${API_URL}/address/${addressid}`, {
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch address");
            }

            const data: Address = await response.json();
            setAddress(data);
            setLocalAddress({ ...data });
        } catch (err) {
            console.error((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!addressid || addressid === -1) {
            setLoading(false);
            return;
        }

        fetchAddress();
    }, [API_URL, addressid]);

    async function updateAddress() {
        if (!localAddress) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/address/${addressid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(localAddress),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update address");
            }
            setAddress(data.address);
            setLocalAddress({ ...data.address });
        } catch (err) {
            console.error((err as Error));
        } finally {
            setLoading(false);
        }
    }

    if (!address || !localAddress) return null; // safety

    const handleChange = (
        field: keyof Address,
        value: string | number | null,
    ) => {
        setLocalAddress((prev) => (prev ? { ...prev, [field]: value } : null));
    };

    return (
        <div>
            <h3 className="relative m-2 text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
                Address
            </h3>

            {loading && (
                <div className="mt-4 text-center">Loading...</div>
            )}

            {!loading && address && (
                <div className="mt-8 ml-30 max-w-[1000px]">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name1">Name 1</Label>
                            <TextInput
                                id="name1"
                                value={localAddress.name1}
                                onChange={(e) => handleChange("name1", e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name2">Name 2</Label>
                            <TextInput
                                id="name2"
                                value={localAddress.name2 || ""}
                                onChange={(e) => handleChange("name2", e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="address1">Address 1</Label>
                            <TextInput
                                id="address1"
                                value={localAddress.address1}
                                onChange={(e) => handleChange("address1", e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="address2">Address 2</Label>
                            <TextInput
                                id="address2"
                                value={localAddress.address2 || ""}
                                onChange={(e) => handleChange("address2", e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="address3">Address 3</Label>
                            <TextInput
                                id="address3"
                                value={localAddress.address3 || ""}
                                onChange={(e) => handleChange("address3", e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="city">City</Label>
                            <TextInput
                                id="city"
                                value={localAddress.city}
                                onChange={(e) => handleChange("city", e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="state">State</Label>
                            <TextInput
                                id="state"
                                value={localAddress.state}
                                onChange={(e) => handleChange("state", e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="zip">ZIP</Label>
                            <TextInput
                                id="zip"
                                type="number"
                                value={localAddress.zip}
                                onChange={(e) => handleChange("zip", Number(e.target.value))}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="contact">Contact</Label>
                            <TextInput
                                id="contact"
                                value={localAddress.contact}
                                onChange={(e) => handleChange("contact", e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <TextInput
                                id="phone"
                                value={localAddress.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="fax">Fax</Label>
                            <TextInput
                                id="fax"
                                value={localAddress.fax || ""}
                                onChange={(e) => handleChange("fax", e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="extension">Extension</Label>
                            <TextInput
                                id="extension"
                                value={localAddress.extension || ""}
                                onChange={(e) => handleChange("extension", e.target.value)}
                            />
                        </div>
                    </div>

                    <Button
                        className="mt-6"
                        onClick={() => {
                            updateAddress()
                        }}
                    >
                        Update Address
                    </Button>
                </div>

            )}


        </div>
    );
}
