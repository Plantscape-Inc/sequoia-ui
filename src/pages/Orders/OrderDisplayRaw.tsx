import React from "react";
import { OrderData } from "../../types/epicor.type";

import {
  Accordion,
  AccordionPanel,
  AccordionTitle,
  AccordionContent,
} from "flowbite-react";

interface OrderDisplayProps {
  orderData: OrderData | null;
}

const OrderDisplayRaw: React.FC<OrderDisplayProps> = ({ orderData }) => {
  if (!orderData) return null;

  const { orderhed, orderdtl, orderrel, customerInfo } = orderData;

  return (
    <div className="space-y-6 p-6 text-gray-900 dark:text-gray-200">
      <section className="rounded-lg bg-white p-1 shadow dark:bg-gray-800">
        <Accordion flush={true}>
          <AccordionPanel key={"orderHeader"}>
            <AccordionTitle key={"orderHeader"} className="p-0">
              <span className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-200">
                Order Header
              </span>
            </AccordionTitle>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {Object.entries(orderhed).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b py-1">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {key}
                    </span>
                    <span className="text-gray-900 dark:text-gray-200">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </section>

      <section className="rounded-lg bg-white p-1 shadow dark:bg-gray-800">
        <Accordion flush={true}>
          <AccordionPanel key={"orderDetails"}>
            <AccordionTitle key={"orderDetails"} className="p-1">
              <span className="mb-2 text-2xl font-semibold">Order Details</span>
            </AccordionTitle>
            <AccordionContent>
              {orderdtl.map((detail, idx) => (
                <Accordion flush={true}>
                  <AccordionPanel key={"orderDetails"}>
                    <AccordionTitle key={idx} className="p-1">
                      <span className="mb-2 text-xl font-semibold">
                        Line #{detail.orderline}: {detail.partnum}
                      </span>
                    </AccordionTitle>
                    <AccordionContent>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {Object.entries(detail).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between border-b py-1"
                          >
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {key}
                            </span>
                            <span className="text-gray-900 dark:text-gray-200">
                              {String(value)}
                            </span>
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

      <section className="rounded-lg bg-white p-1 shadow dark:bg-gray-800">
        <Accordion flush={true}>
          <AccordionPanel key={"orderReleases"}>
            <AccordionTitle key={"orderReleases"} className="p-1">
              <span className="mb-2 text-2xl font-semibold">
                Order Releases
              </span>
            </AccordionTitle>
            <AccordionContent>
              <div>
                {orderrel.map((rel, idx) => (
                  <Accordion flush={true}>
                    <AccordionPanel key={"orderDetails"}>
                      <AccordionTitle key={idx} className="p-1">
                        <span className="mb-2 text-xl font-semibold">
                          Release Part#: {rel.partnum}
                        </span>
                      </AccordionTitle>
                      <AccordionContent>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          {Object.entries(rel).map(([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between border-b py-1"
                            >
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                {key}
                              </span>
                              <span className="text-gray-900 dark:text-gray-200">
                                {String(value)}
                              </span>
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

      <section className="rounded-lg bg-white p-1 shadow dark:bg-gray-800">
        <Accordion flush={true}>
          <AccordionPanel key={"customer"}>
            <AccordionTitle key={"customer"} className="p-1">
              <span className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-200">
                Customer Info
              </span>
            </AccordionTitle>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {Object.entries(customerInfo ?? {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b py-1">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {key}
                    </span>
                    <span className="text-gray-900 dark:text-gray-200">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </section>
    </div>
  );
};

export default OrderDisplayRaw;
