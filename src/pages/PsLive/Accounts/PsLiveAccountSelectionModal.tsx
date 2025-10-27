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
import { Account } from "../../../types/pslive.type";

interface AccountSelectionModalProps {
    show: boolean;
    onClose: () => void;
    onSelect: (account: Account) => void;
    accounts: Account[];
}

export default function AccountSelectionModal({
    show,
    onClose,
    onSelect,
    accounts,
}: AccountSelectionModalProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [filteredAccounts, setFilteredAccounts] = useState<Account[]>(accounts);
    const [isSearching, setIsSearching] = useState(false);

    // Inline worker for filtering
    const worker = useMemo(() => {
        const workerCode = `
            self.onmessage = function(e) {
                const { query, accounts } = e.data;

                if (!query.trim()) {
                    self.postMessage({ results: accounts });
                    return;
                }

                const term = query.toLowerCase();
                const results = accounts.filter((acct) =>
                    acct.accountid?.toLowerCase().includes(term) ||
                    acct.miscnotes?.toLowerCase().includes(term) ||
                    acct.chemicalinfo?.toLowerCase().includes(term) ||
                    acct.waterinfo?.toLowerCase().includes(term) ||
                    acct.date?.toLowerCase().includes(term) ||
                    acct.locations?.some(loc =>
                        loc.name?.toLowerCase().includes(term) ||
                        loc.id?.toString().includes(term)
                    )
                );

                self.postMessage({ results });
            };
        `;
        const blob = new Blob([workerCode], { type: "application/javascript" });
        const url = URL.createObjectURL(blob);
        return new Worker(url);
    }, []);

    // Reset when modal opens
    useEffect(() => {
        if (show) {
            setSearchTerm("");
            setDebouncedSearchTerm("");
            setFilteredAccounts(accounts);
            setIsSearching(false);
        }
    }, [show, accounts]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        if (!debouncedSearchTerm.trim()) {
            setFilteredAccounts(accounts);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        console.log("here")
        console.log(debouncedSearchTerm)

        if (debouncedSearchTerm.startsWith("/f")) {
            import("fitl-js").then(({ fitlFilter }) => {
                fitlFilter(
                    debouncedSearchTerm.substring(2),
                    accounts,
                    { tableFormat: "JSARRAY" }
                ).then((results: Account[]) => {
                    // results = results.sort((a, b) => a.accountid.localeCompare(b.accountid));
                    setFilteredAccounts(results);
                    setIsSearching(false);
                }).catch((err) => {
                    console.error(err);
                    setFilteredAccounts(accounts);
                    setIsSearching(false);
                });
            });
            return;
        }

        // Standard search
        worker.postMessage({
            query: debouncedSearchTerm,
            accounts,
        });

        const handleMessage = (e: MessageEvent) => {
            setFilteredAccounts(e.data.results);
            setIsSearching(false);
        };

        worker.addEventListener("message", handleMessage);
        return () => {
            worker.removeEventListener("message", handleMessage);
        };
    }, [debouncedSearchTerm, accounts, worker]);

    // Cleanup worker
    useEffect(() => {
        return () => {
            worker.terminate();
        };
    }, [worker]);

    return (
        <Modal show={show} size="5xl" onClose={onClose}>
            <ModalHeader>
                <div className="flex items-center justify-between w-full gap-4">
                    <span>Select Account</span>
                    <div className="flex items-center gap-2">
                        <TextInput
                            type="text"
                            placeholder="Filter accounts"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64"
                        />
                        {isSearching && <Spinner size="sm" />}
                        {!isSearching && debouncedSearchTerm.length > 0 && (
                            <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                {filteredAccounts.length} results
                            </span>
                        )}
                    </div>
                </div>
            </ModalHeader>

            <ModalBody>
                {filteredAccounts.length > 0 && (
                    <Table hoverable>
                        <TableHead>
                            <TableHeadCell>Account ID</TableHeadCell>
                            <TableHeadCell>Date</TableHeadCell>
                            {/* <TableHeadCell>Notes</TableHeadCell> */}
                            {/* <TableHeadCell>Chemical Info</TableHeadCell> */}
                            {/* <TableHeadCell>Water Info</TableHeadCell> */}
                            <TableHeadCell>Select</TableHeadCell>
                        </TableHead>
                        <TableBody>
                            {filteredAccounts.sort((a, b) => a.accountid.localeCompare(b.accountid)).map((acct) => (
                                <tr key={acct.accountid}>
                                    <TableCell>{acct.accountid}</TableCell>
                                    <TableCell>{acct.date}</TableCell>
                                    {/* <TableCell>{acct.miscnotes || "-"}</TableCell> */}
                                    {/* <TableCell>{acct.chemicalinfo || "-"}</TableCell> */}
                                    {/* <TableCell>{acct.waterinfo || "-"}</TableCell> */}
                                    <TableCell>
                                        <Button size="xs" onClick={() => onSelect(acct)}>
                                            Choose
                                        </Button>
                                    </TableCell>
                                </tr>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {filteredAccounts.length < 1 && (
                    <Spinner></Spinner>
                )}

                {filteredAccounts.length === 0 && debouncedSearchTerm.length > 0 && !isSearching && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No accounts found matching "{debouncedSearchTerm}"
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
