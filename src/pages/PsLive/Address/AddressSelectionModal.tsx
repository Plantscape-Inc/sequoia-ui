import { useState, useEffect } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Table,
    TableHead,
    TableHeadCell,
    TableBody,
    TableCell,
    TextInput,
} from "flowbite-react";
import { Address } from "../../../types/pslive.type";
import { fitlFilter } from "fitl-js";

interface AddressSelectionModalProps {
    show: boolean;
    onClose: () => void;
    onSelect: (address: Address) => void;
    addresses: Address[];
}

export default function AddressSelectionModal({
    show,
    onClose,
    onSelect,
    addresses,
}: AddressSelectionModalProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [filteredAddresses, setFilteredAddresses] = useState<Address[]>(addresses);

    // Reset search when modal opens/closes
    useEffect(() => {
        if (show) {
            setSearchTerm("");
            setDebouncedSearchTerm("");
            setFilteredAddresses(addresses);
        }
    }, [show, addresses]);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Filter addresses when debounced search term changes
    useEffect(() => {
        filterAddresses();
    }, [debouncedSearchTerm, addresses]);

    async function filterAddresses() {
        if (!debouncedSearchTerm.trim()) {
            setFilteredAddresses(addresses);
            return;
        }

        const results = await searchAddresses(debouncedSearchTerm, addresses);
        setFilteredAddresses(results);
    }

    async function searchAddresses(query: string, addressList: Address[]): Promise<Address[]> {
        if (query.startsWith("/f")) {
            if (query.length < 3) {
                return addressList;
            }
            try {
                const result = await fitlFilter(
                    query.substring(2, query.length),
                    addressList,
                    { tableFormat: "JSARRAY" }
                );
                return result;
            } catch (error) {
                console.error(error);
                return addressList;
            }
        } else {
            const term = query.toLowerCase();
            return addressList.filter((addr) =>
                addr.name1?.toLowerCase().includes(term) ||
                addr.name2?.toLowerCase().includes(term) ||
                addr.address1?.toLowerCase().includes(term) ||
                addr.city?.toLowerCase().includes(term) ||
                addr.state?.toLowerCase().includes(term) ||
                addr.contact?.toLowerCase().includes(term) ||
                addr.id.toString().includes(term)
            );
        }
    }

    return (
        <Modal show={show} size="5xl" onClose={onClose}>
            <ModalHeader>
                <div className="flex items-center justify-between w-full gap-4">
                    <span>Select Address</span>
                    <div className="flex items-center gap-2">
                        <TextInput
                            type="text"
                            placeholder="Filter addresses"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64"
                        />
                        {debouncedSearchTerm.length > 0 && (
                            <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                {filteredAddresses.length} results
                            </span>
                        )}
                    </div>
                </div>
            </ModalHeader>
            <ModalBody>
                <Table hoverable>
                    <TableHead>
                        <TableHeadCell>ID</TableHeadCell>
                        <TableHeadCell>Name</TableHeadCell>
                        <TableHeadCell>City</TableHeadCell>
                        <TableHeadCell>State</TableHeadCell>
                        <TableHeadCell>Zip</TableHeadCell>
                        <TableHeadCell>Select</TableHeadCell>
                    </TableHead>
                    <TableBody>
                        {filteredAddresses.map((addr) => (
                            <tr key={addr.id}>
                                <TableCell>{addr.id}</TableCell>
                                <TableCell>{addr.name1}</TableCell>
                                <TableCell>{addr.city}</TableCell>
                                <TableCell>{addr.state}</TableCell>
                                <TableCell>{addr.zip}</TableCell>
                                <TableCell>
                                    <Button
                                        size="xs"
                                        onClick={() => onSelect(addr)}
                                    >
                                        Choose
                                    </Button>
                                </TableCell>
                            </tr>
                        ))}
                    </TableBody>
                </Table>
                {filteredAddresses.length === 0 && debouncedSearchTerm.length > 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No addresses found matching "{debouncedSearchTerm}"
                    </div>
                )}
            </ModalBody>
            <ModalFooter>
                <Button color="gray" onClick={onClose}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
}