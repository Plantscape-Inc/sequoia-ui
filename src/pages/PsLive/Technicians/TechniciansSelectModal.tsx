import { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableHead, TableHeadCell } from "flowbite-react";
import { Technician } from "../../../types/pslive.type";

interface TechnicianModalProps {
    show: boolean;
    onClose: () => void;
    onSelect: (tech: Technician) => void;
    apiUrl: string;
}

export default function TechnicianModal({ show, onClose, onSelect, apiUrl }: TechnicianModalProps) {
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTechnicians = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/technicians`);
            if (!response.ok) throw new Error("Failed to fetch technicians");
            const data: Technician[] = await response.json();
            setTechnicians(data);
        } catch (err) {
            console.error(err);
            alert("Error fetching technicians");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (show) fetchTechnicians();
    }, [show]);

    return (
        <Modal show={show} size="4xl" onClose={onClose}>
            <ModalHeader>Select Technician</ModalHeader>
            <ModalBody>
                {loading ? (
                    <p>Loading technicians...</p>
                ) : (
                    <Table hoverable>
                        <TableHead>
                            <TableHeadCell>First Name</TableHeadCell>
                            <TableHeadCell>Last Name</TableHeadCell>
                            <TableHeadCell>Tech ID</TableHeadCell>
                            <TableHeadCell>Select</TableHeadCell>
                        </TableHead>
                        <TableBody>
                            {technicians.map((tech) => (
                                <tr key={tech.id}>
                                    <TableCell>{tech.firstname}</TableCell>
                                    <TableCell>{tech.lastname}</TableCell>
                                    <TableCell>{tech.techid}</TableCell>
                                    <TableCell>
                                        <Button size="xs" onClick={() => onSelect(tech)}>
                                            Choose
                                        </Button>
                                    </TableCell>
                                </tr>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </ModalBody>
            <ModalFooter>
                <Button color="gray" onClick={onClose}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}
