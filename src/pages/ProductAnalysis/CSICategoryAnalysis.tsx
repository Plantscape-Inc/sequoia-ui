import { useState } from "react";
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle, Button, Label, Spinner } from "flowbite-react";
import { type CSICategoryAnalysisOverview } from "../../types/productAnalysis.type";

import Plot from 'react-plotly.js';

export default function ProductAnalysis() {
    const API_URL = import.meta.env.VITE_PRODUCT_ANALYSIS_API_URL;

    const [loading, setLoading] = useState<boolean>(false);

    const [startDate, setStartDate] = useState<string>("2025-01-01");
    const [endDate, setEndDate] = useState<string>("2025-07-30");

    const [overviewData, setOverview] =
        useState<CSICategoryAnalysisOverview | null>(null);


    // const formatLargeNumber = (num: number) => {
    //     if (num >= 1_000_000) return (num / 1_000_000).toFixed(3) + 'M';
    //     if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    //     return num.toString();
    // };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true)

        const params = {
            startDate,
            endDate,
            includeRaw: "false"
        };
        const queryString = new URLSearchParams(params).toString();

        try {

            const response = await (await fetch(`${API_URL}/csiCategoriesOverview?${queryString}`)).json()
            const categoriesAnalysis: CSICategoryAnalysisOverview = response;

            console.log(categoriesAnalysis)
            setOverview(categoriesAnalysis);

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }

    }


    return (
        <div>
            <div>
                <h1 className="relative text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
                    CSI Product Category Analysis
                </h1>

                <form
                    className="flex flex-wrap items-end justify-center gap-4 mt-6 mx-auto max-w-4xl"
                    onSubmit={handleSubmit}
                >
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


                    <Button type="submit">Submit</Button>
                </form>
            </div>

            {loading && (
                <div className="flex justify-center mt-6">
                    <Spinner size="xl" />
                </div>
            )}

            {!loading && overviewData && (
                <div className="mt-8 max-w-6xl mx-auto">
                    <Accordion alwaysOpen={true}>
                        <AccordionPanel>
                            <AccordionTitle>CSI Categories Overview</AccordionTitle>
                            <AccordionContent>
                                <div className="w-full h-[500px] bg-white dark:bg-gray-900 rounded-lg p-2">
                                    <Plot
                                        data={
                                            Object.keys(overviewData.overview.categoryMonthlyCountsCategory).map(categoryId => {
                                                return {
                                                    x: overviewData.overview.categoryMonthlyCountsCategory[categoryId].map(i => i.yearMonth),
                                                    y: overviewData.overview.categoryMonthlyCountsCategory[categoryId].map(i => i.totalCount),
                                                    name: categoryId,
                                                    type: 'bar' as const,
                                                    // marker: { color: '#ffc200' },
                                                }
                                            })
                                        }
                                        layout={{
                                            barmode: 'group',
                                            autosize: true,
                                            title: { text: 'Categories Monthly Order Count' },
                                            xaxis: { title: { text: 'Month' } },
                                            yaxis: { title: { text: 'Order Count' } },
                                            margin: { t: 50, l: 50, r: 20, b: 50 },
                                            paper_bgcolor: 'transparent',
                                            plot_bgcolor: 'transparent',
                                            font: {
                                                color: '#888888',
                                            },
                                        }}

                                        useResizeHandler={true}
                                        style={{ width: '100%', height: '500px' }}
                                    />
                                </div>

                                <div className="w-full h-[500px] bg-white dark:bg-gray-900 rounded-lg p-2">
                                    <Plot
                                        data={
                                            Object.keys(overviewData.overview.categoryMonthlyRevenuesCategory).map(categoryId => {
                                                return {
                                                    x: overviewData.overview.categoryMonthlyRevenuesCategory[categoryId].map(i => i.yearMonth),
                                                    y: overviewData.overview.categoryMonthlyRevenuesCategory[categoryId].map(i => i.totalRevenue),
                                                    name: categoryId,
                                                    type: 'bar' as const,
                                                    // marker: { color: '#ffc200' },
                                                }
                                            })
                                        }
                                        layout={{
                                            barmode: 'group',
                                            autosize: true,
                                            title: { text: 'Categories Monthly Order Revenue' },
                                            xaxis: { title: { text: 'Month' } },
                                            yaxis: { title: { text: 'Order Count' } },
                                            margin: { t: 50, l: 50, r: 20, b: 50 },
                                            paper_bgcolor: 'transparent',
                                            plot_bgcolor: 'transparent',
                                            font: {
                                                color: '#888888',
                                            },
                                        }}

                                        useResizeHandler={true}
                                        style={{ width: '100%', height: '500px' }}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                    {Object.keys(overviewData.overview.categoryMonthlyCountsMonth).map(month => {
                                        const dataValues: number[] =
                                            overviewData.overview.categoryMonthlyCountsMonth[month].map(c => c.totalCount)
                                        const dataLabels: string[] =
                                            overviewData.overview.categoryMonthlyCountsMonth[month].map(c => c.categoryid)

                                        return (
                                            <div
                                                key={month}
                                                className="bg-white dark:bg-gray-900 rounded-xl shadow p-2"
                                            >
                                                <Plot
                                                    data={[
                                                        {
                                                            values: dataValues,
                                                            labels: dataLabels,
                                                            type: 'pie' as const,
                                                            textinfo: 'label+percent',
                                                            texttemplate: '%{label}<br>%{value:.0f}<br>(%{percent})',
                                                            textposition: 'inside',
                                                        },
                                                    ]}
                                                    layout={{
                                                        autosize: true,
                                                        title: { text: `${month} - Brand Order Count Totals` },
                                                        margin: { t: 50, l: 20, r: 20, b: 20 },
                                                        paper_bgcolor: 'transparent',
                                                        plot_bgcolor: 'transparent',
                                                        font: {
                                                            color: '#888888',
                                                        },
                                                    }}
                                                    useResizeHandler={true}
                                                    style={{ width: '100%', height: '100%' }}
                                                />
                                            </div>
                                        )
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
