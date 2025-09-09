import React from "react";
import { OrderData, } from "../../types/epicor.type";


import { Accordion, AccordionPanel, AccordionTitle, AccordionContent } from 'flowbite-react';


interface OrderDisplayProps {
    orderData: OrderData | null;
}

const OrderDisplay: React.FC<OrderDisplayProps> = ({ orderData }) => {
    if (!orderData) return null;

    const { orderhed, orderdtl, orderrel } = orderData;

    return (
        <div className="p-6 space-y-6 text-gray-900 dark:text-gray-200">

            <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <Accordion flush={true}>
                    <AccordionPanel key={"orderHeader"}>
                        <AccordionTitle key={"orderHeader"} className="p-1">
                            <span className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-200">Order Header</span>
                        </AccordionTitle>
                        <AccordionContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {Object.entries(orderhed).map(([key, value]) => (
                                    <div key={key} className="flex justify-between border-b py-1">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">{key}</span>
                                        <span className="text-gray-900 dark:text-gray-200">{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionPanel>
                </Accordion>
            </section>



            <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <Accordion flush={true}>
                    <AccordionPanel key={"orderDetails"}>
                        <AccordionTitle key={"orderDetails"} className="p-1">
                            <span className="text-2xl font-semibold mb-2">Order Details</span>
                        </AccordionTitle>
                        <AccordionContent>

                            {orderdtl.map((detail, idx) => (

                                <Accordion flush={true}>
                                    <AccordionPanel key={"orderDetails"}>
                                        <AccordionTitle key={idx} className="p-1">
                                            <h3 className="text-xl font-semibold mb-2">
                                                Line #{detail.orderline}: {detail.partnum}
                                            </h3>
                                        </AccordionTitle>
                                        <AccordionContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {Object.entries(detail).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between border-b py-1">
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">{key}</span>
                                                        <span className="text-gray-900 dark:text-gray-200">{String(value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionPanel>
                                </Accordion>

                            ))}
                        </AccordionContent>
                    </AccordionPanel>
                </Accordion>
            </section>


            <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <Accordion flush={true}>
                    <AccordionPanel key={"orderReleases"}>
                        <AccordionTitle key={"orderReleases"} className="p-1">
                            <span className="text-2xl font-semibold mb-2">Order Releases</span>
                        </AccordionTitle>
                        <AccordionContent>
                            <div>
                                {orderrel.map((rel, idx) => (

                                    <Accordion flush={true}>
                                        <AccordionPanel key={"orderDetails"}>
                                            <AccordionTitle key={idx} className="p-1">
                                                <h3 className="text-xl font-semibold mb-2">
                                                    Release Part#: {rel.partnum}
                                                </h3>
                                            </AccordionTitle>
                                            <AccordionContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {Object.entries(rel).map(([key, value]) => (
                                                        <div key={key} className="flex justify-between border-b py-1">
                                                            <span className="font-medium text-gray-700 dark:text-gray-300">{key}</span>
                                                            <span className="text-gray-900 dark:text-gray-200">{String(value)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionPanel>
                                    </Accordion>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionPanel>
                </Accordion>
            </section>
        </div>
    );
};

export default OrderDisplay;
