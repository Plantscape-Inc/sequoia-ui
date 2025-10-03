import {
    DarkThemeToggle,
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
} from "flowbite-react";
import { useState } from "react";

type NavItems = {
    [key: string]: string | NavItems;
};

const sideNavOptions: NavItems = {
    Home: "/",
    // Account: "/account",
    "Product Analysis": "/productAnalysis",
    //   Epicor: {
    //     Orders: "/orders",
    //     "Invoice Automation": "/invoiceauto",
    //   },
    PsLive: {
        Home: "/pslive",
        Accounts: "/psliveaccounts",
        Orders: "/psliveorders",
        Addresses: "/psliveaddresses",
        Products: "/psliveproducts",
        Technicians: "/pslivetechnicians",
        "Single Order": "/psliveorder",
    },
};

export default function Nav() {
    const [isOpen, setIsOpen] = useState(false);
    const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({});

    const toggleDropdown = (key: string): void => {
        setOpenKeys((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const renderNav = (items: object) => {
        return Object.entries(items).map(([key, value]) => {
            if (typeof value === "string") {
                return (
                    <li key={key}>
                        <a
                            href={value}
                            className="flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                        >
                            {key}
                        </a>
                    </li>
                );
            } else {
                return (
                    <li key={key}>
                        <button
                            type="button"
                            className="flex w-full items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                            onClick={() => toggleDropdown(key)}
                        >
                            <span className="flex-1 text-left">{key}</span>
                            <svg
                                className={`h-3 w-3 transition-transform ${openKeys[key] ? "rotate-180" : ""
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 10 6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 4 4 4-4"
                                />
                            </svg>
                        </button>
                        {openKeys[key] && (
                            <ul className="mt-1 space-y-1 pl-4">{renderNav(value)}</ul>
                        )}
                    </li>
                );
            }
        });
    };

    return (
        <>
            <Navbar className="sticky top-0 z-50 bg-white shadow-md dark:bg-gray-900">
                <button
                    onClick={() => setIsOpen(true)}
                    className="mr-2 p-2 text-gray-700 focus:outline-none dark:text-gray-200"
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
                <NavbarBrand href="/">
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                        Sequoia
                    </span>
                </NavbarBrand>
                <NavbarCollapse>
                    {/* <NavbarLink href="/">
                        Home
                    </NavbarLink> */}
                    <NavbarLink href="/pslive">Plantscape Live Home</NavbarLink>
                    <NavbarLink href="/account">Account</NavbarLink>
                </NavbarCollapse>
                <DarkThemeToggle />
            </Navbar>
            <div
                className={`bg-opacity-50 fixed inset-0 z-50 bg-black transition-opacity ${isOpen
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none opacity-0"
                    }`}
                onClick={() => setIsOpen(false)}
            >
                <div
                    className={`fixed top-0 left-0 h-full w-64 transform bg-white shadow-md transition-transform dark:bg-gray-900 ${isOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <aside className="h-screen w-64 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-800">
                        <ul className="space-y-2 font-medium">
                            {renderNav(sideNavOptions)}
                        </ul>
                    </aside>
                    {/* <nav className="flex flex-col mt-10 space-y-2 p-4">
                        <a href="/" className="text-gray-800 dark:text-gray-100 font-medium">
                            Home
                        </a>
                        <a href="/orders" className="text-gray-800 dark:text-gray-100 font-medium">
                            Orders
                        </a>
                        <a href="/account" className="text-gray-800 dark:text-gray-100 font-medium">
                            Account
                        </a>
                    </nav> */}
                </div>
            </div>
        </>
    );
}
