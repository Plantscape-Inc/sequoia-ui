import { DarkThemeToggle, Navbar, NavbarBrand, NavbarCollapse, NavbarLink } from "flowbite-react";
import { useState } from "react";

type NavItems = {
    [key: string]: string | NavItems;
};

const sideNavOptions: NavItems = {
    "Home": "/",
    "Account": "/account",
    "Product Analysis": "/productAnalysis",
    Epicor: {
        "Orders": "/orders",
        "Invoice Automation": "/invoiceauto"
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
                            className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
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
                            className="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                            onClick={() => toggleDropdown(key)}
                        >
                            <span className="flex-1 text-left">{key}</span>
                            <svg
                                className={`w-3 h-3 transition-transform ${openKeys[key] ? "rotate-180" : ""
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
                            <ul className="pl-4 mt-1 space-y-1">{renderNav(value)}</ul>
                        )}
                    </li>
                );
            }
        });
    };


    return (
        <>
            <Navbar className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 mr-2 text-gray-700 dark:text-gray-200 focus:outline-none"
                >
                    <svg
                        className="w-6 h-6"
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
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                        Sequoia
                    </span>
                </NavbarBrand>
                <NavbarCollapse>
                    {/* <NavbarLink href="/">
                        Home
                    </NavbarLink> */}
                    <NavbarLink href="/account">
                        Account
                    </NavbarLink>
                </NavbarCollapse>
                <DarkThemeToggle />

            </Navbar>
            <div
                className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsOpen(false)}
            >
                <div
                    className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-md transform transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <aside className="w-64 h-screen bg-gray-50 dark:bg-gray-800 p-4 overflow-y-auto">
                        <ul className="space-y-2 font-medium">{renderNav(sideNavOptions)}</ul>
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
