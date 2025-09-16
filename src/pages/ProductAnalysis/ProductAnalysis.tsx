import { useState } from "react";

import BrandOverviewAnalysis from "./BrandOverviewAnalysis";
import { Label, Tabs, TabItem } from "flowbite-react";
import CSICategoryAnalysis from "./CSICategoryAnalysis";

export default function ProductAnalysis() {
  const [startDate, setStartDate] = useState<string>("2025-01-01");
  const [endDate, setEndDate] = useState<string>("2025-07-30");

  return (
    <div>
      <div>
        <h1 className="relative text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
          Product Analysis
        </h1>

        <form className="mx-auto mt-6 flex max-w-4xl flex-wrap items-end justify-center gap-4">
          <div className="flex flex-col">
            <Label htmlFor="startDate">Start Date</Label>
            <input
              type="date"
              id="startDate"
              className="rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="endDate">End Date</Label>
            <input
              type="date"
              id="endDate"
              className="rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </form>
      </div>

      <Tabs aria-label="Product Analysis Tabs">
        <TabItem title="Brand Overview">
          <BrandOverviewAnalysis startDate={startDate} endDate={endDate} />
        </TabItem>
        <TabItem title="CSI Category Analysis">
          <CSICategoryAnalysis startDate={startDate} endDate={endDate} />
        </TabItem>
      </Tabs>
    </div>
  );
}
