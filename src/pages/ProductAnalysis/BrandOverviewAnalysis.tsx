import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { type BrandOverview } from "../../types/productAnalysis.type";

import Plot from "react-plotly.js";
import { formatLargeNumber } from "../../utils";

interface ProductAnalysisProps {
  startDate: string;
  endDate: string;
}

export default function BrandOverviewAnalysis({
  startDate,
  endDate,
}: ProductAnalysisProps) {
  const API_URL = import.meta.env.VITE_PRODUCT_ANALYSIS_API_URL;

  const [loading, setLoading] = useState<boolean>(false);
  const [overviewData, setOverview] = useState<BrandOverview | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const params = {
      startDate,
      endDate,
      includeRaw: "false",
    };
    const queryString = new URLSearchParams(params).toString();

    try {
      const response = await (
        await fetch(`${API_URL}/brandsOverview?${queryString}`)
      ).json();
      const brandOverview: BrandOverview = response;

      console.log(brandOverview);

      setOverview(brandOverview);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        className="mt-6 ml-32 flex max-w-2xl flex-wrap items-end gap-4"
        onSubmit={handleSubmit}
      >
        <Button type="submit">Reload</Button>
      </form>

      {loading && (
        <div className="mt-6 flex justify-center">
          <Spinner size="xl" />
        </div>
      )}

      {!loading && overviewData && (
        <div className="mx-auto mt-8 max-w-6xl">
          <Accordion alwaysOpen={true}>
            <AccordionPanel>
              <AccordionTitle>Brands Overview</AccordionTitle>
              <AccordionContent>
                <div className="mx-auto mt-8 mb-8 max-w-4xl">
                  <Table hoverable={true}>
                    <TableHead>
                      <TableHeadCell>Metric</TableHeadCell>
                      <TableHeadCell>CSilk</TableHeadCell>
                      <TableHeadCell>CSI</TableHeadCell>
                      <TableHeadCell>Total</TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y">
                      <TableRow>
                        <TableCell>Line Item Count</TableCell>
                        <TableCell>
                          {overviewData.brandLineItemsCount.csilk}
                        </TableCell>
                        <TableCell>
                          {overviewData.brandLineItemsCount.csi}
                        </TableCell>
                        <TableCell>
                          {overviewData.brandLineItemsCount.total}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Overall Revenue</TableCell>
                        <TableCell>
                          $
                          {overviewData.brandOverallRevenue.csilk.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          $
                          {overviewData.brandOverallRevenue.csi.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          $
                          {overviewData.brandOverallRevenue.total.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="mb-8 flex flex-col items-start justify-center gap-6 md:flex-row">
                  <div className="max-w-lg min-w-[250px] flex-1 bg-white dark:bg-gray-900">
                    <Plot
                      data={[
                        {
                          values: [
                            overviewData.brandLineItemsCount.csilk,
                            overviewData.brandLineItemsCount.csi,
                          ],
                          labels: ["CSilk", "CSI"],
                          type: "pie" as const,
                          textinfo: "label+percent",
                          texttemplate:
                            "%{label}<br>%{value:.0f}<br>(%{percent})",
                          textposition: "inside",
                          marker: { colors: ["#4B7D43", "#ffc200"] },
                        },
                      ]}
                      layout={{
                        autosize: true,
                        title: { text: "Brand Order Count Totals" },
                        margin: { t: 50, l: 20, r: 20, b: 20 },
                        paper_bgcolor: "transparent",
                        plot_bgcolor: "transparent",
                        font: {
                          color: "#888888",
                        },
                      }}
                      useResizeHandler={true}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>

                  <div className="max-w-lg min-w-[250px] flex-1 bg-white dark:bg-gray-900">
                    <Plot
                      data={[
                        {
                          values: [
                            overviewData.brandOverallRevenue.csilk,
                            overviewData.brandOverallRevenue.csi,
                          ],
                          labels: ["CSilk", "CSI"],
                          type: "pie" as const,
                          textinfo: "label+text+percent",
                          texttemplate: "%{label}<br>%{text}<br>(%{percent})",
                          text: [
                            overviewData.brandOverallRevenue.csilk,
                            overviewData.brandOverallRevenue.csi,
                          ].map(formatLargeNumber),
                          textposition: "inside",
                          marker: { colors: ["#4B7D43", "#ffc200"] },
                        },
                      ]}
                      layout={{
                        autosize: true,
                        title: { text: "Brand Revenue Total" },
                        margin: { t: 50, l: 20, r: 20, b: 20 },
                        paper_bgcolor: "transparent",
                        plot_bgcolor: "transparent",
                        font: {
                          color: "#888888",
                        },
                      }}
                      useResizeHandler={true}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
                <div className="h-[500px] w-full rounded-lg bg-white p-2 dark:bg-gray-900">
                  <Plot
                    data={[
                      {
                        x: overviewData.monthlyCountsTimeseries.csi?.map(
                          (item) => item.yearMonth,
                        ),
                        y: overviewData.monthlyCountsTimeseries.csi?.map(
                          (item) => item.count,
                        ),
                        name: "CSI",
                        type: "bar" as const,
                        marker: { color: "#ffc200" },
                        text: overviewData.monthlyCountsTimeseries.csi?.map(
                          (item) => String(item.count),
                        ), // convert to string[]
                        textposition: "outside",
                        texttemplate: "%{text}",
                      },
                      {
                        x: overviewData.monthlyCountsTimeseries.csilk?.map(
                          (item) => item.yearMonth,
                        ),
                        y: overviewData.monthlyCountsTimeseries.csilk?.map(
                          (item) => item.count,
                        ),
                        name: "CSilk",
                        type: "bar" as const,
                        marker: { color: "#4B7D43" },
                        text: overviewData.monthlyCountsTimeseries.csilk?.map(
                          (item) => String(item.count),
                        ),
                        textposition: "outside",
                        texttemplate: "%{text}",
                      },
                    ]}
                    layout={{
                      barmode: "group",
                      autosize: true,
                      title: { text: "Monthly Order Line Counts by Brand" },
                      xaxis: { title: { text: "Month" } },
                      yaxis: { title: { text: "Order Count" } },
                      margin: { t: 50, l: 50, r: 20, b: 50 },
                      paper_bgcolor: "transparent",
                      plot_bgcolor: "transparent",
                      font: {
                        color: "#888888",
                      },
                    }}
                    config={{ displayModeBar: false }}
                    useResizeHandler={true}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>

                <div className="h-[500px] w-full rounded-lg bg-white p-2 dark:bg-gray-900">
                  <Plot
                    data={[
                      {
                        x: overviewData.monthlyRevenueTimeseries.csi?.map(
                          (item) => item.yearMonth,
                        ),
                        y: overviewData.monthlyRevenueTimeseries.csi?.map(
                          (item) => item.totalRevenue,
                        ),
                        name: "CSI",
                        type: "bar" as const,
                        marker: { color: "#ffc200" },
                      },
                      {
                        x: overviewData.monthlyRevenueTimeseries.csilk?.map(
                          (item) => item.yearMonth,
                        ),
                        y: overviewData.monthlyRevenueTimeseries.csilk?.map(
                          (item) => item.totalRevenue,
                        ),
                        name: "CSilk",
                        type: "bar" as const,
                        marker: { color: "#4B7D43" },
                      },
                    ]}
                    layout={{
                      barmode: "group",
                      autosize: true,
                      title: { text: "Monthly Revenue by Brand" },
                      xaxis: { title: { text: "Month" } },
                      yaxis: { title: { text: "Order Count" } },
                      margin: { t: 50, l: 50, r: 20, b: 50 },
                      paper_bgcolor: "transparent",
                      plot_bgcolor: "transparent",
                      font: {
                        color: "#888888",
                      },
                    }}
                    useResizeHandler={true}
                    style={{ width: "100%", height: "500px" }}
                  />
                </div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>
      )}
    </div>
  );
}
