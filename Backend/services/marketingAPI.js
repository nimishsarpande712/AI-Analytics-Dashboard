const { BusinessSDK } = require('facebook-nodejs-business-sdk');
const { GoogleAdsApi } = require('google-ads-api');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

class MarketingAPI {
    constructor() {
        this.fbSDK = new BusinessSDK();
        this.googleAds = new GoogleAdsApi({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            developer_token: process.env.GOOGLE_DEVELOPER_TOKEN
        });
        this.analyticsClient = new BetaAnalyticsDataClient();
    }

    async getFacebookInsights(accountId) {
        const cacheKey = `fb_insights_${accountId}`;
        const cachedData = cache.get(cacheKey);
        
        if (cachedData) return cachedData;

        // Implement Facebook Insights API call
        const insights = await this.fbSDK.getInsights(accountId);
        cache.set(cacheKey, insights);
        return insights;
    }

    async getGoogleAdsData(customerId) {
        const cacheKey = `google_ads_${customerId}`;
        const cachedData = cache.get(cacheKey);
        
        if (cachedData) return cachedData;

        // Implement Google Ads API call
        const campaigns = await this.googleAds.getCampaigns(customerId);
        cache.set(cacheKey, campaigns);
        return campaigns;
    }

    async getAnalyticsData(propertyId) {
        const cacheKey = `analytics_${propertyId}`;
        const cachedData = cache.get(cacheKey);
        
        if (cachedData) return cachedData;

        // Implement Google Analytics API call
        const [response] = await this.analyticsClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            metrics: [
                { name: 'sessions' },
                { name: 'conversions' },
                { name: 'totalRevenue' }
            ]
        });

        cache.set(cacheKey, response);
        return response;
    }
}

module.exports = new MarketingAPI();
