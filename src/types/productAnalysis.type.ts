export interface CSICategoryAnalysisOverview {
  overview: {
    misc: Array<MiscTotals>;
    categoryTotalCounts: {
      [key: string]: Array<CSICategoryTotalCountCategory>;
    };
    categoryTotalRevenues: {
      [key: string]: Array<CSICategoryTotalRevenueCategory>;
    };
    categoryYearlyCounts: {
      [key: string]: Array<CSICategoryYearlyCountCategory>;
    };
    categoryYearlyRevenues: {
      [key: string]: Array<CSICategoryYearlyRevenueCategory>;
    };
    categoryMonthlyCountsCategory: {
      [key: string]: Array<CSICategoryMonthlyCountCategory>;
    };
    categoryMonthlyRevenuesCategory: {
      [key: string]: Array<CSICategoryMonthlyRevenueCategory>;
    };
    categoryMonthlyCountsMonth: {
      [key: string]: Array<CSICategoryMonthlyCountMonth>;
    };
    categoryMonthlyRevenuesMonth: {
      [key: string]: Array<CSICategoryMonthlyRevenueMonth>;
    };
  };
}

export interface MiscTotals {
  category: string;
  count: number;
  revenue: number;
}

export interface CSICategoryTotalCountCategory {
  categoryid: string;
  totalCount: number;
  percentage: number;
}

export interface CSICategoryTotalRevenueCategory {
  categoryid: string;
  totalRevenue: number;
  percentage: number;
}

export interface CSICategoryYearlyCountCategory {
  categoryid: string;
  totalCount: number;
  percentage: number;
}

export interface CSICategoryYearlyRevenueCategory {
  categoryid: string;
  totalRevenue: number;
  percentage: number;
}

export interface CSICategoryMonthlyCountCategory {
  yearMonth: string;
  totalCount: number;
  percentage: number;
}

export interface CSICategoryMonthlyRevenueCategory {
  yearMonth: string;
  totalRevenue: number;
  percentage: number;
}

export interface CSICategoryMonthlyCountMonth {
  categoryid: string;
  totalCount: number;
  percentage: number;
}

export interface CSICategoryMonthlyRevenueMonth {
  categoryid: string;
  totalRevenue: number;
  percentage: number;
}

export interface BrandTimeseriesItem {
  changedate: Date;
  ordernum: number;
  partnum: string;
  unitprice: number;
}

export interface BrandOverviewMonthtlyCountItem {
  yearMonth: Date;
  count: number;
}
export interface BrandOverviewMonthtlyRevenueItem {
  yearMonth: Date;
  totalRevenue: number;
}

export interface BrandOverview {
  brandLineItemsCount: {
    csi: number;
    csilk: number;
    total: number;
  };
  brandOverallRevenue: {
    csi: number;
    csilk: number;
    total: number;
  };
  csiTimeseries?: Array<BrandTimeseriesItem>;
  csilkTimeseries?: Array<BrandTimeseriesItem>;
  monthlyCountsTimeseries: {
    csi: Array<BrandOverviewMonthtlyCountItem>;
    csilk: Array<BrandOverviewMonthtlyCountItem>;
  };
  monthlyRevenueTimeseries: {
    csi: Array<BrandOverviewMonthtlyRevenueItem>;
    csilk: Array<BrandOverviewMonthtlyRevenueItem>;
  };
}

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
  percentage: number;
}

export type CompetitoryProductSummaryList = CompetitoryProductSummary[];
