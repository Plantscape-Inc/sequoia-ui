import { Label, Textarea } from "flowbite-react";
import { Address } from "../../../types/pslive.type";

import { useNavigate } from "react-router-dom";

export default function AddressDisplay({
    address,
}: {
    address: Address | null;
}) {
    const navigate = useNavigate();

    if (!address) {
        return (
            <h1 className="relative text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
                {" "}
                Invalid address {address}{" "}
            </h1>
        );
    }

    const formatted = `
        ${address.name1}${address.name2 ? " " + address.name2 : ""}
        ${address.address1}${address.address2 ? "\n" + address.address2 : ""}${address.address3 ? "\n" + address.address3 : ""
        }
        ${address.city}, ${address.state} ${address.zip}
        Contact: ${address.contact}
        Phone: ${address.phone}
        ${address.fax ? `Fax: ${address.fax}` : ""}
    `;

    return (
        <div
            className="mx-auto flex max-w-lg flex-col gap-2"
            onClick={() => {
                navigate(`/psliveaddress?addressid=${address.id}`);
            }}
        >
            <Label htmlFor="address" />
            <Textarea
                id="address"
                value={formatted.trim()}
                readOnly
                rows={6}
                className="resize-none"
            />
        </div>
    );
}
