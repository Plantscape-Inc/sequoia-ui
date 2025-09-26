import { useEffect, useState } from "react";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

import { useNavigate } from "react-router-dom";
import { Address } from "../../../types/psliveorders.type";

export default function Addresses() {
  const API_URL = import.meta.env.VITE_PSLIVE_URL;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [addressesData, setAddressesData] = useState<Address[] | null>(null);

  useEffect(() => {
    if (addressesData) return;

    setLoading(true);

    fetch(`${API_URL}/addresses`)
      .then((data) => data.json())
      .then((data) => {
        setAddressesData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div>
        <h1 className="relative text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
          Addresses
        </h1>

        {loading && (
          <div className="mt-6 flex justify-center">
            <Spinner size="xl" />
          </div>
        )}

        {!loading && addressesData && (
          <div>
            <Table hoverable>
              <TableHead>
                <TableHeadCell>ID</TableHeadCell>
                <TableHeadCell>Name 1</TableHeadCell>
                <TableHeadCell>Name 2</TableHeadCell>
                <TableHeadCell>Address 1</TableHeadCell>
                <TableHeadCell>City</TableHeadCell>
                <TableHeadCell>State</TableHeadCell>
                <TableHeadCell>ZIP</TableHeadCell>
                <TableHeadCell>Contact</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                {addressesData.map((address) => (
                  <TableRow
                    key={address.id}
                    className="cursor-pointer bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                    onClick={() =>
                      navigate(`/psliveaddress?addressid=${address.id}`)
                    }
                  >
                    <TableCell>{address.id}</TableCell>
                    <TableCell>{address.name1}</TableCell>
                    <TableCell>{address.name2 || "-"}</TableCell>
                    <TableCell>{address.address1}</TableCell>
                    <TableCell>{address.city}</TableCell>
                    <TableCell>{address.state}</TableCell>
                    <TableCell>{address.zip}</TableCell>
                    <TableCell>{address.contact}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
