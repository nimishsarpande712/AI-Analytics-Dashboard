// Mock data for ADmyBRAND Analytics Dashboard

// Metric Cards Data
const metricCards = [
  {
    id: 'total_campaigns',
    title: 'Total Campaigns',
    value: '24',
    change: '+12%',
    changeType: 'positive',
    icon: 'campaign',
    color: 'blue'
  },
  {
    id: 'total_spend',
    title: 'Total Spend',
    value: '$48,235',
    change: '+8.2%',
    changeType: 'positive',
    icon: 'dollar',
    color: 'green'
  },
  {
    id: 'total_revenue',
    title: 'Total Revenue',
    value: '$142,850',
    change: '+15.4%',
    changeType: 'positive',
    icon: 'revenue',
    color: 'purple'
  },
  {
    id: 'roas',
    title: 'Return on Ad Spend',
    value: '3.96x',
    change: '+0.24',
    changeType: 'positive',
    icon: 'trending',
    color: 'orange'
  },
  {
    id: 'active_campaigns',
    title: 'Active Campaigns',
    value: '18',
    change: '+3',
    changeType: 'positive',
    icon: 'active',
    color: 'cyan'
  },
  {
    id: 'avg_ctr',
    title: 'Average CTR',
    value: '2.84%',
    change: '-0.12%',
    changeType: 'negative',
    icon: 'click',
    color: 'red'
  }
];

// Chart Data - Revenue vs Spend over time
const chartData = [
  { month: 'Jan', revenue: 12450, spend: 4200, roas: 2.96 },
  { month: 'Feb', revenue: 13800, spend: 4650, roas: 2.97 },
  { month: 'Mar', revenue: 15200, spend: 5100, roas: 2.98 },
  { month: 'Apr', revenue: 14850, spend: 4950, roas: 3.00 },
  { month: 'May', revenue: 16900, spend: 5400, roas: 3.13 },
  { month: 'Jun', revenue: 18750, spend: 5850, roas: 3.21 },
  { month: 'Jul', revenue: 20150, spend: 6200, roas: 3.25 },
  { month: 'Aug', revenue: 19850, spend: 6050, roas: 3.28 },
  { month: 'Sep', revenue: 21450, spend: 6400, roas: 3.35 },
  { month: 'Oct', revenue: 22800, spend: 6750, roas: 3.38 },
  { month: 'Nov', revenue: 24200, spend: 7100, roas: 3.41 },
  { month: 'Dec', revenue: 25650, spend: 7350, roas: 3.49 }
];

// Campaign Performance Data
const campaigns = [
  {
    id: 'camp_001',
    name: 'Summer Fashion Collection 2025',
    channel: 'Facebook Ads',
    spend: 5240,
    revenue: 18650,
    roas: 3.56,
    status: 'active',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    impressions: 125000,
    clicks: 3250,
    conversions: 185,
    ctr: 2.6,
    cpc: 1.61,
    conversionRate: 5.69
  },
  {
    id: 'camp_002',
    name: 'Back to School Electronics',
    channel: 'Google Ads',
    spend: 3850,
    revenue: 15420,
    roas: 4.01,
    status: 'active',
    startDate: '2025-07-15',
    endDate: '2025-09-15',
    impressions: 89000,
    clicks: 2180,
    conversions: 142,
    ctr: 2.45,
    cpc: 1.77,
    conversionRate: 6.51
  },
  {
    id: 'camp_003',
    name: 'Holiday Gift Guide',
    channel: 'Instagram Ads',
    spend: 2940,
    revenue: 8850,
    roas: 3.01,
    status: 'paused',
    startDate: '2025-11-01',
    endDate: '2025-12-31',
    impressions: 156000,
    clicks: 4680,
    conversions: 98,
    ctr: 3.0,
    cpc: 0.63,
    conversionRate: 2.09
  },
  {
    id: 'camp_004',
    name: 'Fitness Equipment Sale',
    channel: 'TikTok Ads',
    spend: 1850,
    revenue: 7240,
    roas: 3.91,
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    impressions: 95000,
    clicks: 1900,
    conversions: 89,
    ctr: 2.0,
    cpc: 0.97,
    conversionRate: 4.68
  },
  {
    id: 'camp_005',
    name: 'Luxury Watch Collection',
    channel: 'LinkedIn Ads',
    spend: 4200,
    revenue: 16800,
    roas: 4.0,
    status: 'active',
    startDate: '2025-05-01',
    endDate: '2025-07-31',
    impressions: 45000,
    clicks: 1350,
    conversions: 95,
    ctr: 3.0,
    cpc: 3.11,
    conversionRate: 7.04
  },
  {
    id: 'camp_006',
    name: 'Home Decor Spring Sale',
    channel: 'Pinterest Ads',
    spend: 2150,
    revenue: 6450,
    roas: 3.0,
    status: 'completed',
    startDate: '2025-03-01',
    endDate: '2025-05-31',
    impressions: 78000,
    clicks: 2340,
    conversions: 78,
    ctr: 3.0,
    cpc: 0.92,
    conversionRate: 3.33
  },
  {
    id: 'camp_007',
    name: 'Tech Gadgets Flash Sale',
    channel: 'Google Ads',
    spend: 3650,
    revenue: 12775,
    roas: 3.5,
    status: 'active',
    startDate: '2025-07-01',
    endDate: '2025-07-31',
    impressions: 112000,
    clicks: 2800,
    conversions: 125,
    ctr: 2.5,
    cpc: 1.30,
    conversionRate: 4.46
  },
  {
    id: 'camp_008',
    name: 'Beauty Products Launch',
    channel: 'Facebook Ads',
    spend: 2850,
    revenue: 9975,
    roas: 3.5,
    status: 'active',
    startDate: '2025-06-15',
    endDate: '2025-08-15',
    impressions: 145000,
    clicks: 4350,
    conversions: 115,
    ctr: 3.0,
    cpc: 0.66,
    conversionRate: 2.64
  },
  {
    id: 'camp_009',
    name: 'Outdoor Adventure Gear',
    channel: 'YouTube Ads',
    spend: 1950,
    revenue: 5850,
    roas: 3.0,
    status: 'active',
    startDate: '2025-04-01',
    endDate: '2025-09-30',
    impressions: 287000,
    clicks: 5740,
    conversions: 68,
    ctr: 2.0,
    cpc: 0.34,
    conversionRate: 1.18
  },
  {
    id: 'camp_010',
    name: 'Kitchen Appliances Deal',
    channel: 'Amazon Ads',
    spend: 3250,
    revenue: 11375,
    roas: 3.5,
    status: 'active',
    startDate: '2025-05-15',
    endDate: '2025-08-15',
    impressions: 98000,
    clicks: 1960,
    conversions: 105,
    ctr: 2.0,
    cpc: 1.66,
    conversionRate: 5.36
  },
  {
    id: 'camp_011',
    name: 'Pet Supplies Subscription',
    channel: 'Snapchat Ads',
    spend: 1450,
    revenue: 4350,
    roas: 3.0,
    status: 'paused',
    startDate: '2025-02-01',
    endDate: '2025-12-31',
    impressions: 156000,
    clicks: 3120,
    conversions: 52,
    ctr: 2.0,
    cpc: 0.46,
    conversionRate: 1.67
  },
  {
    id: 'camp_012',
    name: 'Mens Casual Wear',
    channel: 'Facebook Ads',
    spend: 2750,
    revenue: 9625,
    roas: 3.5,
    status: 'active',
    startDate: '2025-03-15',
    endDate: '2025-09-15',
    impressions: 134000,
    clicks: 4020,
    conversions: 98,
    ctr: 3.0,
    cpc: 0.68,
    conversionRate: 2.44
  },
  {
    id: 'camp_013',
    name: 'Smart Home Security',
    channel: 'Google Ads',
    spend: 4150,
    revenue: 14525,
    roas: 3.5,
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    impressions: 78000,
    clicks: 1560,
    conversions: 135,
    ctr: 2.0,
    cpc: 2.66,
    conversionRate: 8.65
  },
  {
    id: 'camp_014',
    name: 'Organic Food Delivery',
    channel: 'Instagram Ads',
    spend: 1850,
    revenue: 5550,
    roas: 3.0,
    status: 'active',
    startDate: '2025-04-01',
    endDate: '2025-10-31',
    impressions: 189000,
    clicks: 5670,
    conversions: 68,
    ctr: 3.0,
    cpc: 0.33,
    conversionRate: 1.20
  },
  {
    id: 'camp_015',
    name: 'Premium Coffee Subscription',
    channel: 'Twitter Ads',
    spend: 2250,
    revenue: 6750,
    roas: 3.0,
    status: 'completed',
    startDate: '2025-01-01',
    endDate: '2025-06-30',
    impressions: 134000,
    clicks: 2680,
    conversions: 78,
    ctr: 2.0,
    cpc: 0.84,
    conversionRate: 2.91
  },
  {
    id: 'camp_016',
    name: 'Gaming Accessories Bundle',
    channel: 'Twitch Ads',
    spend: 1650,
    revenue: 5775,
    roas: 3.5,
    status: 'active',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    impressions: 87000,
    clicks: 1740,
    conversions: 68,
    ctr: 2.0,
    cpc: 0.95,
    conversionRate: 3.91
  },
  {
    id: 'camp_017',
    name: 'Sustainable Fashion Line',
    channel: 'Pinterest Ads',
    spend: 2950,
    revenue: 8850,
    roas: 3.0,
    status: 'active',
    startDate: '2025-05-01',
    endDate: '2025-11-30',
    impressions: 167000,
    clicks: 5010,
    conversions: 95,
    ctr: 3.0,
    cpc: 0.59,
    conversionRate: 1.90
  },
  {
    id: 'camp_018',
    name: 'Automotive Parts Sale',
    channel: 'Google Ads',
    spend: 3450,
    revenue: 13800,
    roas: 4.0,
    status: 'active',
    startDate: '2025-02-01',
    endDate: '2025-12-31',
    impressions: 156000,
    clicks: 3120,
    conversions: 145,
    ctr: 2.0,
    cpc: 1.11,
    conversionRate: 4.65
  }
];

// Channel Performance Summary
const channelPerformance = [
  {
    channel: 'Facebook Ads',
    campaigns: 4,
    totalSpend: 11580,
    totalRevenue: 42100,
    avgRoas: 3.64,
    status: 'performing'
  },
  {
    channel: 'Google Ads',
    campaigns: 4,
    totalSpend: 15100,
    totalRevenue: 56520,
    avgRoas: 3.74,
    status: 'performing'
  },
  {
    channel: 'Instagram Ads',
    campaigns: 2,
    totalSpend: 4790,
    totalRevenue: 14400,
    avgRoas: 3.01,
    status: 'needs_attention'
  },
  {
    channel: 'TikTok Ads',
    campaigns: 1,
    totalSpend: 1850,
    totalRevenue: 7240,
    avgRoas: 3.91,
    status: 'performing'
  },
  {
    channel: 'YouTube Ads',
    campaigns: 1,
    totalSpend: 1950,
    totalRevenue: 5850,
    avgRoas: 3.0,
    status: 'stable'
  }
];

// Export all mock data
module.exports = {
  metricCards,
  chartData,
  campaigns,
  channelPerformance
};
