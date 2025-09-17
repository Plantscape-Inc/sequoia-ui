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

import { CSICategoryColors } from "../../colors";

import { formatLargeNumber } from "../../utils";

import Plot from "react-plotly.js";

interface ProductAnalysisProps {
    startDate: string;
    endDate: string;
}

const miscColors: Record<string, string> = {
    sys: "#008800",
    ship: "#880088",
    x1ship: "#880088",
    x1shipcsi: "#ffc200",
    x1shipmisc: "#BBBBBB",
    hdw: "#000088",
};

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
                                <h1 className="relative mt-10 text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
                                    Totals Charts
                                </h1>
                                {/* Totals Charts */}
                                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                                    <div
                                        key="Total"
                                        className="rounded-xl bg-white p-2 shadow dark:bg-gray-900"
                                    >
                                        <Plot
                                            data={[
                                                {
                                                    values: Object.keys(
                                                        overviewData.overview.categoryTotalCounts,
                                                    ).map(
                                                        (category) =>
                                                            overviewData.overview.categoryTotalCounts[
                                                                category
                                                            ][0].totalCount,
                                                    ),
                                                    labels: Object.keys(
                                                        overviewData.overview.categoryTotalCounts,
                                                    ),
                                                    type: "pie" as const,
                                                    text: Object.keys(
                                                        overviewData.overview.categoryTotalCounts,
                                                    ).map((category) =>
                                                        formatLargeNumber(
                                                            overviewData.overview.categoryTotalCounts[
                                                                category
                                                            ][0].totalCount,
                                                        ),
                                                    ),
                                                    textposition: "inside",
                                                    marker: {
                                                        colors: Object.keys(
                                                            overviewData.overview.categoryTotalCounts,
                                                        ).map(
                                                            (category) =>
                                                                CSICategoryColors[
                                                                category as keyof typeof CSICategoryColors
                                                                ],
                                                        ),
                                                    },
                                                },
                                            ]}
                                            layout={{
                                                autosize: true,
                                                title: {
                                                    text: `Order Count Totals`,
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
                                    <div
                                        key="TotalRevenue"
                                        className="rounded-xl bg-white p-2 shadow dark:bg-gray-900"
                                    >
                                        <Plot
                                            data={[
                                                {
                                                    values: Object.keys(
                                                        overviewData.overview.categoryTotalRevenues,
                                                    ).map(
                                                        (category) =>
                                                            overviewData.overview.categoryTotalRevenues[
                                                                category
                                                            ][0].totalRevenue,
                                                    ),
                                                    labels: Object.keys(
                                                        overviewData.overview.categoryTotalRevenues,
                                                    ),
                                                    type: "pie" as const,
                                                    // texttemplate: "%{label}+%{percent}+%{value:.0f}", // add our formatted text
                                                    text: Object.keys(
                                                        overviewData.overview.categoryTotalRevenues,
                                                    ).map(
                                                        (category) =>
                                                            "$" +
                                                            formatLargeNumber(
                                                                overviewData.overview.categoryTotalRevenues[
                                                                    category
                                                                ][0].totalRevenue,
                                                            ),
                                                    ),
                                                    textposition: "inside",
                                                    marker: {
                                                        colors: Object.keys(
                                                            overviewData.overview.categoryTotalRevenues,
                                                        ).map(
                                                            (category) =>
                                                                CSICategoryColors[
                                                                category as keyof typeof CSICategoryColors
                                                                ],
                                                        ),
                                                    },
                                                },
                                            ]}
                                            layout={{
                                                autosize: true,
                                                title: {
                                                    text: `Total Revenue by Category`,
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

                                    <div
                                        key="Total Misc Count"
                                        className="rounded-xl bg-white p-2 shadow dark:bg-gray-900"
                                    >
                                        <Plot
                                            data={[
                                                {
                                                    values: overviewData.overview.misc.map(
                                                        (category) => category.count,
                                                    ),
                                                    labels: overviewData.overview.misc.map(
                                                        (category) => category.category,
                                                    ),
                                                    type: "pie" as const,
                                                    text: overviewData.overview.misc.map((category) =>
                                                        formatLargeNumber(category.count),
                                                    ),
                                                    textposition: "inside",
                                                    marker: {
                                                        colors: overviewData.overview.misc.map(
                                                            (item) => miscColors[item.category],
                                                        ),
                                                    },
                                                },
                                            ]}
                                            layout={{
                                                autosize: true,
                                                title: {
                                                    text: `Misc Totals Count`,
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

                                    <div
                                        key="Total Misc Revenue"
                                        className="rounded-xl bg-white p-2 shadow dark:bg-gray-900"
                                    >
                                        <Plot
                                            data={[
                                                {
                                                    values: overviewData.overview.misc.map(
                                                        (category) => category.revenue,
                                                    ),
                                                    labels: overviewData.overview.misc.map(
                                                        (category) => category.category,
                                                    ),
                                                    type: "pie" as const,
                                                    text: overviewData.overview.misc.map((category) =>
                                                        formatLargeNumber(category.revenue),
                                                    ),
                                                    textposition: "inside",
                                                    marker: {
                                                        colors: overviewData.overview.misc.map(
                                                            (item) => miscColors[item.category],
                                                        ),
                                                    },
                                                },
                                            ]}
                                            layout={{
                                                autosize: true,
                                                title: {
                                                    text: `Misc Totals Revenue`,
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
                                </div>

                                {/* Yearly Charts */}
                                <h1 className="relative text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
                                    Yearly Charts
                                </h1>
                                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                                    {/* Left column: Counts */}
                                    <div className="flex flex-col gap-4">
                                        {Object.keys(
                                            overviewData.overview.categoryYearlyCounts,
                                        ).map((year) => {
                                            const dataValues: number[] =
                                                overviewData.overview.categoryYearlyCounts[year].map(
                                                    (c) => c.totalCount,
                                                );
                                            const dataLabels: string[] =
                                                overviewData.overview.categoryYearlyCounts[year].map(
                                                    (c) => c.categoryid,
                                                );

                                            const colors: string[] = dataLabels.map(
                                                (label) => CSICategoryColors[label] || "#FFFF00",
                                            );

                                            return (
                                                <div
                                                    key={`count-${year}`}
                                                    className="rounded-xl bg-white p-2 shadow dark:bg-gray-900"
                                                >
                                                    <Plot
                                                        data={[
                                                            {
                                                                values: dataValues,
                                                                labels: dataLabels,
                                                                type: "pie" as const,
                                                                text: Object.keys(
                                                                    overviewData.overview.categoryTotalRevenues,
                                                                ).map(
                                                                    (category) =>
                                                                        "$" +
                                                                        formatLargeNumber(
                                                                            overviewData.overview
                                                                                .categoryTotalRevenues[category][0]
                                                                                .totalRevenue,
                                                                        ),
                                                                ),
                                                                textposition: "inside",
                                                                marker: { colors },
                                                            },
                                                        ]}
                                                        layout={{
                                                            autosize: true,
                                                            title: {
                                                                text: `${year} - Brand Yearly Order Count Totals`,
                                                            },
                                                            margin: { t: 50, l: 20, r: 20, b: 20 },
                                                            paper_bgcolor: "transparent",
                                                            plot_bgcolor: "transparent",
                                                            font: { color: "#888888" },
                                                        }}
                                                        useResizeHandler={true}
                                                        style={{ width: "100%", height: "100%" }}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Right column: Revenues */}
                                    <div className="flex flex-col gap-4">
                                        {Object.keys(
                                            overviewData.overview.categoryYearlyRevenues,
                                        ).map((year) => {
                                            const dataValues: number[] =
                                                overviewData.overview.categoryYearlyRevenues[year].map(
                                                    (c) => c.totalRevenue,
                                                );
                                            const dataLabels: string[] =
                                                overviewData.overview.categoryYearlyRevenues[year].map(
                                                    (c) => c.categoryid,
                                                );

                                            const colors: string[] = dataLabels.map(
                                                (label) => CSICategoryColors[label] || "#FFFF00",
                                            );

                                            return (
                                                <div
                                                    key={`revenue-${year}`}
                                                    className="rounded-xl bg-white p-2 shadow dark:bg-gray-900"
                                                >
                                                    <Plot
                                                        data={[
                                                            {
                                                                values: dataValues,
                                                                labels: dataLabels,
                                                                type: "pie" as const,
                                                                text: Object.keys(
                                                                    overviewData.overview.categoryTotalRevenues,
                                                                ).map(
                                                                    (category) =>
                                                                        "$" +
                                                                        formatLargeNumber(
                                                                            overviewData.overview
                                                                                .categoryTotalRevenues[category][0]
                                                                                .totalRevenue,
                                                                        ),
                                                                ),
                                                                textposition: "inside",
                                                                marker: { colors },
                                                            },
                                                        ]}
                                                        layout={{
                                                            autosize: true,
                                                            title: {
                                                                text: `${year} - Brand Yearly Order Revenue Totals`,
                                                            },
                                                            margin: { t: 50, l: 20, r: 20, b: 20 },
                                                            paper_bgcolor: "transparent",
                                                            plot_bgcolor: "transparent",
                                                            font: { color: "#888888" },
                                                        }}
                                                        useResizeHandler={true}
                                                        style={{ width: "100%", height: "100%" }}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <Accordion alwaysOpen={true}>
                                    <AccordionPanel>
                                        <AccordionTitle>Monthly Charts</AccordionTitle>
                                        <AccordionContent>
                                            {/* Monthly Charts */}
                                            <h1 className="relative text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
                                                Monthly
                                            </h1>

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
                                                        overviewData.overview
                                                            .categoryMonthlyRevenuesCategory,
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

                                                    const colors: string[] = dataLabels.map(
                                                        (label) => CSICategoryColors[label] || "#FFFF00",
                                                    );

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
                                                                        marker: { colors },
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
                                                {Object.keys(
                                                    overviewData.overview.categoryMonthlyCountsMonth,
                                                ).map((month) => {
                                                    const dataValues: number[] =
                                                        overviewData.overview.categoryMonthlyRevenuesMonth[
                                                            month
                                                        ].map((c) => c.totalRevenue);
                                                    const dataLabels: string[] =
                                                        overviewData.overview.categoryMonthlyCountsMonth[
                                                            month
                                                        ].map((c) => c.categoryid);

                                                    const colors: string[] = dataLabels.map(
                                                        (label) => CSICategoryColors[label] || "#FFFF00",
                                                    );

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
                                                                        marker: { colors },
                                                                    },
                                                                ]}
                                                                layout={{
                                                                    autosize: true,
                                                                    title: {
                                                                        text: `${month} - Brand Order Revenue Totals`,
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
                            </AccordionContent>
                        </AccordionPanel>
                    </Accordion>
                </div>
            )}
        </div>
    );
}
