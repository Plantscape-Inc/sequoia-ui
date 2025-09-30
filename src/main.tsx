import { initThemeMode } from "flowbite-react";
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { ThemeInit } from "../.flowbite-react/init";

import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav.tsx";
import type { GoogleUserInfo } from "./types/auth.type.ts";
import InvoiceAuto from "./pages/InvoiceAuto.tsx";
import Home from "./pages/Home.tsx";
import Account from "./pages/Account.tsx";
import Orders from "./pages/Orders/Orders.tsx";
import ProductAnalysis from "./pages/ProductAnalysis/ProductAnalysis.tsx";
import CSIProducts from "./pages/CSIProducts/CSIProducts.tsx";
import PsLiveOrders from "./pages/PsLive/Orders/Orders.tsx";
import PsLiveOrder from "./pages/PsLive/Orders/Order.tsx";
import PsLiveAddressEditor from "./pages/PsLive/Address/AddressEditor.tsx";
import PsLiveAddresses from "./pages/PsLive/Address/Addresses.tsx";
import PsLiveProducts from "./pages/PsLive/Products/Products.tsx";
import PsLiveHome from "./pages/PsLive/PsLiveHome.tsx";
import PsLiveAccounts from "./pages/PsLive/Accounts/PsLiveAccounts.tsx";
import PsLiveAccount from "./pages/PsLive/Accounts/PsLiveAccount.tsx";
// import ProductAnalysis from "./pages/ProductAnalysis/CSICategoryAnalysis.tsx";

function Root() {
    const [user, setUser] = useState<GoogleUserInfo | null>(null);

    // useEffect(() => {
    //     return;
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const token = urlParams.get("token");
    //     console.log("Token", token)
    //     if (token) {
    //         localStorage.setItem("auth_token", token);
    //         window.history.replaceState({}, document.title, "/account");
    //     }
    //     const storedToken = localStorage.getItem("auth_token");
    //     if (storedToken) {
    //         fetch(`${import.meta.env.VITE_AUTH_API_URL}/validate`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ token: storedToken }),
    //         })
    //             .then((res) => (res.ok ? res.json() : null))
    //             .then((data) => {
    //                 if (data?.valid) {
    //                     setUser({
    //                         email: data.payload.sub,
    //                         name: data.payload.name,
    //                     });
    //                 } else {
    //                     setUser(null);
    //                     localStorage.removeItem("auth_token");
    //                 }
    //             })
    //             .catch((err) => console.error("Failed to validate token:", err));
    //     } else {
    //         window.location.href = `${import.meta.env.VITE_AUTH_API_URL}/login`;

    //     }
    // }, [setUser]);

    return (
        <StrictMode>
            <ThemeInit />
            <Nav />
            <main className="flex min-h-screen flex-col bg-white px-4 py-24 dark:bg-gray-900">
                <div className="absolute inset-0 hidden size-full">
                    <div className="relative h-full w-full select-none">
                        <img
                            className="absolute right-0 min-w-dvh dark:hidden"
                            alt="Pattern Light"
                            src="/pattern-light.svg"
                        />
                        <img
                            className="absolute right-0 hidden min-w-dvh dark:block"
                            alt="Pattern Dark"
                            src="/pattern-dark.svg"
                        />
                    </div>
                </div>

                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home user={user} />} />
                        <Route
                            path="/account"
                            element={<Account user={user} setUser={setUser} />}
                        />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/invoiceauto" element={<InvoiceAuto />} />
                        <Route path="/productAnalysis" element={<ProductAnalysis />} />
                        <Route path="/csiProducts" element={<CSIProducts />} />

                        <Route path="/pslive" element={<PsLiveHome />} />
                        <Route path="/psliveorders" element={<PsLiveOrders />} />
                        <Route path="/psliveorder" element={<PsLiveOrder />} />
                        <Route path="/psliveaddress" element={<PsLiveAddressEditor />} />
                        <Route path="/psliveaddresses" element={<PsLiveAddresses />} />
                        <Route path="/psliveproducts" element={<PsLiveProducts />} />
                        <Route path="/psliveaccount" element={<PsLiveAccount />} />
                        <Route path="/psliveaccounts" element={<PsLiveAccounts />} />
                    </Routes>
                </BrowserRouter>
            </main>
        </StrictMode>
    );
}

createRoot(document.getElementById("root")!).render(<Root />);

initThemeMode();
