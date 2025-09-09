import { useEffect, useState } from "react";

import { Button, Spinner, Tabs, TextInput, TabItem } from "flowbite-react";

import { OrderData } from "../../types/epicor.type";
import OrderDisplayTrimmed from "./OrderDisplayTrimmed";
import OrderDisplayRaw from "./OrderDisplayRaw";



export default function Orders() {

    const [orderId, setOrderId] = useState("");
    const [orderData, setOrderData] = useState<OrderData | null>(null)
    const [status, setStatus] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);


    const fetchOrders = (orderId: string) => {
        setLoading(true);

        const storedToken = localStorage.getItem("auth_token");
        fetch(`${import.meta.env.VITE_EPICOR_FETCH_URL}/order/${orderId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${storedToken}`,
                "Content-Type": "application/json",
            },
        }).then(response => {
            if (response.ok) {
                setStatus(true)
                return response.json()
            }
        }).then((data) => {
            console.log(data)
            setOrderData(data)
        }).finally(() => setLoading(false));

    }


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (orderId.trim()) {
            fetchOrders(orderId);
        }
    };


    useEffect(() => {
        fetch(`${import.meta.env.VITE_EPICOR_FETCH_URL}/status`, {
            method: "GET",
            credentials: "include",
        }).then(response => {
            if (response.ok) {
                setStatus(true)
            } else {
                setStatus(false)
            }
        })
    }, [])


    return (
        <div>
            <div>
                <div className="flex items-center justify-center gap-2">
                    <h1 className="text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
                        Epicor Order Fetching
                    </h1>
                    {status !== null && (
                        <span
                            className={`h-4 w-4 rounded-full ${status ? "bg-green-500" : "bg-red-500"
                                }`}
                        />
                    )}
                </div>

                <form
                    className="flex flex-col md:flex-row items-center gap-4 max-w-md mt-6 mx-auto"
                    onSubmit={handleSubmit}
                >
                    <div className="flex-1 w-full">
                        <TextInput
                            id="orderID"
                            type="text"
                            placeholder="Enter Order ID"
                            required
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="w-full md:w-auto">
                        Submit
                    </Button>
                </form>
            </div>

            {loading && (
                <div className="flex justify-center mt-6">
                    <Spinner size="xl" />
                </div>
            )}


            {!loading && orderData &&
                <div>
                    <Tabs aria-label="Order Views">
                        <TabItem active title="Raw">
                            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                                <div>
                                    <OrderDisplayRaw orderData={orderData} />
                                </div>
                            </div>
                        </TabItem>

                        <TabItem title="Trimmed">
                            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">

                                <div>
                                    <OrderDisplayTrimmed orderData={orderData} />
                                </div>
                            </div>
                        </TabItem>

                        <TabItem title="EP">
                            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                                <p className="text-gray-700 dark:text-gray-200">
                                    Epicor view
                                </p>
                            </div>
                        </TabItem>
                    </Tabs>

                </div>}

        </div >
    );
}

