import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
  Button,
  Spinner,
} from "flowbite-react";
import { type CSICategoryAnalysisOverview } from "../../types/productAnalysis.type";

import Plot from "react-plotly.js";

interface ProductAnalysisProps {
  startDate: string;
  endDate: string;
}

export default function CSICategoryAnalysis({
  startDate,
  endDate,
}: ProductAnalysisProps) {
  const API_URL = import.meta.env.VITE_PRODUCT_ANALYSIS_API_URL;

  const [loading, setLoading] = useState<boolean>(false);

  const [overviewData, setOverview] =
    useState<CSICategoryAnalysisOverview | null>(null);

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
        await fetch(`${API_URL}/csiCategoriesOverview?${queryString}`)
      ).json();
      const categoriesAnalysis: CSICategoryAnalysisOverview = response;

      console.log(categoriesAnalysis);
      setOverview(categoriesAnalysis);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <form
          className="mt-6 ml-32 flex max-w-2xl flex-wrap items-end gap-4"
          onSubmit={handleSubmit}
        >
          <Button type="submit">Reload</Button>
        </form>
      </div>

      {loading && (
        <div className="mt-6 flex justify-center">
          <Spinner size="xl" />
        </div>
      )}

      {!loading && overviewData && (
        <div className="mx-auto mt-8 max-w-6xl">
          <Accordion alwaysOpen={true}>
            <AccordionPanel>
              <AccordionTitle>CSI Categories Overview</AccordionTitle>
              <AccordionContent>
                <div className="h-[500px] w-full rounded-lg bg-white p-2 dark:bg-gray-900">
                  <Plot
                    data={Object.keys(
                      overviewData.overview.categoryMonthlyCountsCategory,
                    ).map((categoryId) => {
                      return {
                        x: overviewData.overview.categoryMonthlyCountsCategory[
                          categoryId
                        ].map((i) => i.yearMonth),
                        y: overviewData.overview.categoryMonthlyCountsCategory[
                          categoryId
                        ].map((i) => i.totalCount),
                        name: categoryId,
                        type: "bar" as const,
                        // marker: { color: '#ffc200' },
                      };
                    })}
                    layout={{
                      barmode: "group",
                      autosize: true,
                      title: { text: "Categories Monthly Order Count" },
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

                <div className="h-[500px] w-full rounded-lg bg-white p-2 dark:bg-gray-900">
                  <Plot
                    data={Object.keys(
                      overviewData.overview.categoryMonthlyRevenuesCategory,
                    ).map((categoryId) => {
                      return {
                        x: overviewData.overview.categoryMonthlyRevenuesCategory[
                          categoryId
                        ].map((i) => i.yearMonth),
                        y: overviewData.overview.categoryMonthlyRevenuesCategory[
                          categoryId
                        ].map((i) => i.totalRevenue),
                        name: categoryId,
                        type: "bar" as const,
                        // marker: { color: '#ffc200' },
                      };
                    })}
                    layout={{
                      barmode: "group",
                      autosize: true,
                      title: { text: "Categories Monthly Order Revenue" },
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

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  {Object.keys(
                    overviewData.overview.categoryMonthlyCountsMonth,
                  ).map((month) => {
                    const dataValues: number[] =
                      overviewData.overview.categoryMonthlyCountsMonth[
                        month
                      ].map((c) => c.totalCount);
                    const dataLabels: string[] =
                      overviewData.overview.categoryMonthlyCountsMonth[
                        month
                      ].map((c) => c.categoryid);

                    return (
                      <div
                        key={month}
                        className="rounded-xl bg-white p-2 shadow dark:bg-gray-900"
                      >
                        <Plot
                          data={[
                            {
                              values: dataValues,
                              labels: dataLabels,
                              type: "pie" as const,
                              textinfo: "label+percent",
                              texttemplate:
                                "%{label}<br>%{value:.0f}<br>(%{percent})",
                              textposition: "inside",
                            },
                          ]}
                          layout={{
                            autosize: true,
                            title: {
                              text: `${month} - Brand Order Count Totals`,
                            },
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
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>
      )}
    </div>
  );
}
