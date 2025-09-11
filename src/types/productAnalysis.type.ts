export interface ProductCategorySummary {
    category: string;
    percentage: number;
    price: string;
    revenue: number;
}

export type ProductCategorySummaryList = ProductCategorySummary[];

export interface ProductMaterialSummary {
    material: string;
    percentage: number;
    price: string;
    revenue: number;
}

export type ProductMaterialSummaryList = ProductMaterialSummary[];


export interface CompetitoryProductSummary {
    competitor: string;
    competitorId: number;
    quoteCount: number;
    totalRevenuePrice: string;
    percentage: number
}

export type CompetitoryProductSummaryList = CompetitoryProductSummary[];
