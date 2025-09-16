import { useState } from "react";
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle, Button, Label, Spinner, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { type BrandOverview } from "../../types/productAnalysis.type";

import Plot from 'react-plotly.js';

export default function ProductAnalysis() {
    const API_URL = import.meta.env.VITE_PRODUCT_ANALYSIS_API_URL;

    const [loading, setLoading] = useState<boolean>(false);

    const [startDate, setStartDate] = useState<string>("2025-07-01");
    const [endDate, setEndDate] = useState<string>("2025-07-30");

    const [overviewData, setOverview] =
        useState<BrandOverview | null>(null);


    const formatLargeNumber = (num: number) => {
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(3) + 'M';
        if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
        return num.toString();
    };

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

            const response = await (await fetch(`${API_URL}/brandsOverview?${queryString}`)).json()
            const brandOverview: BrandOverview = response;

            console.log(brandOverview)

            setOverview(brandOverview);

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
                    Product Analysis
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
                            <AccordionTitle>Brands Overview</AccordionTitle>
                            <AccordionContent>

                                <div className="mt-8 mb-8 max-w-4xl mx-auto">
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
                                                <TableCell>{overviewData.brandLineItemsCount.csilk}</TableCell>
                                                <TableCell>{overviewData.brandLineItemsCount.csi}</TableCell>
                                                <TableCell>{overviewData.brandLineItemsCount.total}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Overall Revenue</TableCell>
                                                <TableCell>${overviewData.brandOverallRevenue.csilk.toLocaleString()}</TableCell>
                                                <TableCell>${overviewData.brandOverallRevenue.csi.toLocaleString()}</TableCell>
                                                <TableCell>${overviewData.brandOverallRevenue.total.toLocaleString()}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6 justify-center items-start mb-8">
                                    <div className="flex-1 min-w-[250px] bg-white dark:bg-gray-900 max-w-lg">
                                        <Plot
                                            data={[
                                                {
                                                    values: [
                                                        overviewData.brandLineItemsCount.csilk,
                                                        overviewData.brandLineItemsCount.csi,
                                                    ],
                                                    labels: ['CSilk', 'CSI'],
                                                    type: 'pie' as const,
                                                    textinfo: 'label+percent',
                                                    texttemplate: '%{label}<br>%{value:.0f}<br>(%{percent})',
                                                    textposition: 'inside',
                                                    marker: { colors: ['#4B7D43', '#ffc200'] },
                                                },
                                            ]}
                                            layout={{
                                                autosize: true,
                                                title: { text: 'Brand Order Count Totals' },
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

                                    <div className="flex-1 min-w-[250px] bg-white dark:bg-gray-900 max-w-lg">
                                        <Plot
                                            data={[
                                                {
                                                    values: [
                                                        overviewData.brandOverallRevenue.csilk,
                                                        overviewData.brandOverallRevenue.csi,
                                                    ],
                                                    labels: ['CSilk', 'CSI'],
                                                    type: 'pie' as const,
                                                    textinfo: 'label+text+percent',
                                                    texttemplate: '%{label}<br>%{text}<br>(%{percent})',
                                                    text: [
                                                        overviewData.brandOverallRevenue.csilk,
                                                        overviewData.brandOverallRevenue.csi,
                                                    ].map(formatLargeNumber),
                                                    textposition: 'inside',
                                                    marker: { colors: ['#4B7D43', '#ffc200'] },
                                                },
                                            ]}
                                            layout={{
                                                autosize: true,
                                                title: { text: 'Brand Revenue Total' },
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
                                </div>
                                <div className="w-full h-[500px] bg-white dark:bg-gray-900 rounded-lg p-2">
                                    <Plot
                                        data={[
                                            {
                                                x: overviewData.monthlyCountsTimeseries.csi?.map(item => item.yearMonth),
                                                y: overviewData.monthlyCountsTimeseries.csi?.map(item => item.count),
                                                name: 'CSI',
                                                type: 'bar' as const,
                                                marker: { color: '#ffc200' },
                                                text: overviewData.monthlyCountsTimeseries.csi?.map(item => String(item.count)), // convert to string[]
                                                textposition: 'outside',
                                                texttemplate: '%{text}',
                                            },
                                            {
                                                x: overviewData.monthlyCountsTimeseries.csilk?.map(item => item.yearMonth),
                                                y: overviewData.monthlyCountsTimeseries.csilk?.map(item => item.count),
                                                name: 'CSilk',
                                                type: 'bar' as const,
                                                marker: { color: '#4B7D43' },
                                                text: overviewData.monthlyCountsTimeseries.csilk?.map(item => String(item.count)),
                                                textposition: 'outside',
                                                texttemplate: '%{text}',
                                            },
                                        ]}
                                        layout={{
                                            barmode: 'group',
                                            autosize: true,
                                            title: { text: 'Monthly Order Line Counts by Brand' },
                                            xaxis: { title: { text: 'Month' } },
                                            yaxis: { title: { text: 'Order Count' } },
                                            margin: { t: 50, l: 50, r: 20, b: 50 },
                                            paper_bgcolor: 'transparent',
                                            plot_bgcolor: 'transparent',
                                            font: {
                                                color: '#888888',
                                            },
                                        }}
                                        config={{ displayModeBar: false }}
                                        useResizeHandler={true}
                                        style={{ width: '100%', height: '100%' }}
                                    />


                                </div>


                                <div className="w-full h-[500px] bg-white dark:bg-gray-900 rounded-lg p-2">
                                    <Plot
                                        data={[
                                            {
                                                x: overviewData.monthlyRevenueTimeseries.csi?.map(item => item.yearMonth),
                                                y: overviewData.monthlyRevenueTimeseries.csi?.map(item => item.totalRevenue),
                                                name: 'CSI',
                                                type: 'bar' as const,
                                                marker: { color: '#ffc200' },
                                            },
                                            {
                                                x: overviewData.monthlyRevenueTimeseries.csilk?.map(item => item.yearMonth),
                                                y: overviewData.monthlyRevenueTimeseries.csilk?.map(item => item.totalRevenue),
                                                name: 'CSilk',
                                                type: 'bar' as const,
                                                marker: { color: '#4B7D43' },
                                            },
                                        ]}
                                        layout={{
                                            barmode: 'group',
                                            autosize: true,
                                            title: { text: 'Monthly Revenue by Brand' },
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

                            </AccordionContent>
                        </AccordionPanel>
                    </Accordion>
                </div>
            )}

        </div>
    );
}
