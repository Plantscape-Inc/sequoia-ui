import { useState, useEffect, useMemo } from "react";
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
  Spinner,
} from "flowbite-react";
import { Address } from "../../../types/pslive.type";

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
  const [filteredAddresses, setFilteredAddresses] =
    useState<Address[]>(addresses);
  const [isSearching, setIsSearching] = useState(false);

  // Create worker inline using Blob URL
  const worker = useMemo(() => {
    const workerCode = `
            self.onmessage = function(e) {
                const { query, addresses } = e.data;
                
                if (!query.trim()) {
                    self.postMessage({ results: addresses });
                    return;
                }
                
                const term = query.toLowerCase();
                const results = addresses.filter((addr) =>
                    addr.name1?.toLowerCase().includes(term) ||
                    addr.name2?.toLowerCase().includes(term) ||
                    addr.address1?.toLowerCase().includes(term) ||
                    addr.city?.toLowerCase().includes(term) ||
                    addr.state?.toLowerCase().includes(term) ||
                    addr.contact?.toLowerCase().includes(term) ||
                    addr.id.toString().includes(term)
                );
                
                self.postMessage({ results });
            };
        `;

    const blob = new Blob([workerCode], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(blob);
    return new Worker(workerUrl);
  }, []);

  // Reset search when modal opens/closes
  useEffect(() => {
    if (show) {
      setSearchTerm("");
      setDebouncedSearchTerm("");
      setFilteredAddresses(addresses);
      setIsSearching(false);
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
    if (!debouncedSearchTerm.trim()) {
      setFilteredAddresses(addresses);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Handle FITL filter separately (requires external library)
    if (debouncedSearchTerm.startsWith("/f")) {
      // Run FITL on main thread since it requires the library
      import("fitl-js").then(({ fitlFilter }) => {
        if (debouncedSearchTerm.length < 3) {
          setFilteredAddresses(addresses);
          setIsSearching(false);
          return;
        }

        fitlFilter(debouncedSearchTerm.substring(2), addresses, {
          tableFormat: "JSARRAY",
        })
          .then((results) => {
            setFilteredAddresses(results);
            setIsSearching(false);
          })
          .catch((error) => {
            console.error(error);
            setFilteredAddresses(addresses);
            setIsSearching(false);
          });
      });
      return;
    }

    // Post search job to worker
    worker.postMessage({
      query: debouncedSearchTerm,
      addresses: addresses,
    });

    // Handle worker response
    const handleMessage = (e: MessageEvent) => {
      setFilteredAddresses(e.data.results);
      setIsSearching(false);
    };

    worker.addEventListener("message", handleMessage);

    return () => {
      worker.removeEventListener("message", handleMessage);
    };
  }, [debouncedSearchTerm, addresses, worker]);

  // Cleanup worker on unmount
  useEffect(() => {
    return () => {
      worker.terminate();
    };
  }, [worker]);

  return (
    <Modal show={show} size="5xl" onClose={onClose}>
      <ModalHeader>
        <div className="flex w-full items-center justify-between gap-4">
          <span>Select Address</span>
          <div className="flex items-center gap-2">
            <TextInput
              type="text"
              placeholder="Filter addresses"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            {isSearching && <Spinner size="sm" />}
            {!isSearching && debouncedSearchTerm.length > 0 && (
              <span className="text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
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
                  <Button size="xs" onClick={() => onSelect(addr)}>
                    Choose
                  </Button>
                </TableCell>
              </tr>
            ))}
          </TableBody>
        </Table>
        {filteredAddresses.length === 0 &&
          debouncedSearchTerm.length > 0 &&
          !isSearching && (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
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
