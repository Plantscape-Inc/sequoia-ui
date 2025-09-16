import { useState } from "react";
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle, Button, Label, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import type { CompetitoryProductSummaryList, ProductCategorySummaryList, ProductMaterialSummaryList } from "../../types/productAnalysis.type";

export default function ProductAnalysis() {
    const API_URL = import.meta.env.VITE_PRODUCT_ANALYSIS_API_URL;

    const [startDate, setStartDate] = useState<string>("2025-07-01");
    const [endDate, setEndDate] = useState<string>("2025-07-30");

    const [categoryRevenueData, setCategoryRevenueData] =
        useState<ProductCategorySummaryList | null>(null);
    const [materialRevenueData, setMaterialRevenueData] =
        useState<ProductMaterialSummaryList | null>(null);
    const [compProductsRevenueData, setcompProductsRevenueData] =
        useState<CompetitoryProductSummaryList | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("submit", { startDate, endDate });

        const params = {
            startDate,
            endDate,
        };
        const queryString = new URLSearchParams(params).toString();

        fetch(`${API_URL}/categoryRevenue?${queryString}`)
            .then((response) => response.json())
            .then((response) => {
                const temp: ProductCategorySummaryList = response;
                setCategoryRevenueData(temp);
            });

        fetch(`${API_URL}/materialRevenue?${queryString}`)
            .then((response) => response.json())
            .then((response) => {
                const temp: ProductMaterialSummaryList = response;
                setMaterialRevenueData(temp);
            });

        fetch(`${API_URL}/competitorSales?${queryString}`)
            .then((response) => response.json())
            .then((response) => {
                console.log("Competitor")
                console.log(response);
                const temp: CompetitoryProductSummaryList = response;
                setcompProductsRevenueData(temp);
            });
    };

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
                    {/* Start Date */}
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

                    {/* End Date */}
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

                    {/* Submit */}
                    <Button type="submit">Submit</Button>
                </form>
            </div>

            {categoryRevenueData && (
                <div className="mt-8 max-w-4xl mx-auto">
                    <Accordion alwaysOpen={false}>
                        <AccordionPanel>
                            <AccordionTitle>Product Categories</AccordionTitle>
                            <AccordionContent>
                                <Table>
                                    <TableHead>
                                        <TableHeadCell>Category</TableHeadCell>
                                        <TableHeadCell>Percentage (%)</TableHeadCell>
                                        <TableHeadCell>Price</TableHeadCell>
                                        <TableHeadCell>Revenue</TableHeadCell>
                                    </TableHead>
                                    <TableBody className="divide-y">
                                        {categoryRevenueData.map((row, idx) => (
                                            <TableRow
                                                key={idx}
                                                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                            >
                                                <TableCell className="font-medium text-gray-900 dark:text-white">
                                                    {row.category}
                                                </TableCell>
                                                <TableCell>{row.percentage.toFixed(2)}</TableCell>
                                                <TableCell>{row.price}</TableCell>
                                                <TableCell>{row.revenue.toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </AccordionContent>
                        </AccordionPanel>
                    </Accordion>
                </div>
            )}

            {materialRevenueData && (
                <div className="mt-8 max-w-4xl mx-auto">
                    <Accordion alwaysOpen={false}>
                        <AccordionPanel>
                            <AccordionTitle>Matrial Categories</AccordionTitle>
                            <AccordionContent>
                                <Table>
                                    <TableHead>
                                        <TableHeadCell>Material</TableHeadCell>
                                        <TableHeadCell>Percentage (%)</TableHeadCell>
                                        <TableHeadCell>Price</TableHeadCell>
                                        <TableHeadCell>Revenue</TableHeadCell>
                                    </TableHead>
                                    <TableBody className="divide-y">
                                        {materialRevenueData.map((row, idx) => (
                                            <TableRow
                                                key={idx}
                                                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                            >
                                                <TableCell className="font-medium text-gray-900 dark:text-white">
                                                    {row.material}
                                                </TableCell>
                                                <TableCell>{row.percentage.toFixed(2)}</TableCell>
                                                <TableCell>{row.price}</TableCell>
                                                <TableCell>{row.revenue.toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </AccordionContent>
                        </AccordionPanel>
                    </Accordion>
                </div>
            )}


            {compProductsRevenueData && (
                <div className="mt-8 max-w-4xl mx-auto">
                    <Accordion alwaysOpen={false}>
                        <AccordionPanel>
                            <AccordionTitle>Competitor Products</AccordionTitle>
                            <AccordionContent>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableHeadCell>Competitor</TableHeadCell>
                                            <TableHeadCell>Quote Count</TableHeadCell>
                                            <TableHeadCell>Total Revenue</TableHeadCell>
                                            <TableHeadCell>Percentage (%)</TableHeadCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className="divide-y">
                                        {compProductsRevenueData.map((row, idx) => (
                                            <TableRow
                                                key={idx}
                                                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                            >
                                                <TableCell className="font-medium text-gray-900 dark:text-white">
                                                    {row.competitor}
                                                </TableCell>
                                                <TableCell>{row.quoteCount}</TableCell>
                                                <TableCell>{row.totalRevenuePrice}</TableCell>
                                                <TableCell>{row.percentage.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </AccordionContent>
                        </AccordionPanel>
                    </Accordion>
                </div>
            )}


        </div>
    );
}
