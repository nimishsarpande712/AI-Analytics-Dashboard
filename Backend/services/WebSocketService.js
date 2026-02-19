const { Server } = require('socket.io');
const { Campaign } = require('../models');

class WebSocketService {
    constructor(server) {
        this.io = new Server(server, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        });
        this.updateIntervals = new Map();
        this.initialize();
    }

    initialize() {
        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            socket.on('subscribe', async ({ events, interval }) => {
                console.log(`Client ${socket.id} subscribed to events:`, events);
                
                // Clear any existing interval for this socket
                if (this.updateIntervals.has(socket.id)) {
                    clearInterval(this.updateIntervals.get(socket.id));
                }

                // Set up periodic updates for this socket
                const intervalId = setInterval(async () => {
                    try {
                        const [metrics, campaigns, analytics] = await Promise.all([
                            this.getMetrics(),
                            this.getCampaigns(),
                            this.getAnalytics()
                        ]);

                        if (events.includes('metricsUpdate')) {
                            socket.emit('metricsUpdate', metrics);
                        }
                        if (events.includes('campaignUpdate')) {
                            socket.emit('campaignUpdate', campaigns);
                        }
                        if (events.includes('analyticsUpdate')) {
                            socket.emit('analyticsUpdate', analytics);
                        }
                    } catch (error) {
                        console.error('Error fetching real-time data:', error);
                    }
                }, interval || 60000);

                this.updateIntervals.set(socket.id, intervalId);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
                if (this.updateIntervals.has(socket.id)) {
                    clearInterval(this.updateIntervals.get(socket.id));
                    this.updateIntervals.delete(socket.id);
                }
            });
        });
    }

    async getMetrics() {
        const metrics = await Campaign.findAll({
            attributes: [
                [Campaign.sequelize.fn('SUM', Campaign.sequelize.col('impressions')), 'totalImpressions'],
                [Campaign.sequelize.fn('SUM', Campaign.sequelize.col('clicks')), 'totalClicks'],
                [Campaign.sequelize.fn('SUM', Campaign.sequelize.col('conversions')), 'totalConversions'],
                [Campaign.sequelize.fn('SUM', Campaign.sequelize.col('spend')), 'totalSpend'],
                [Campaign.sequelize.fn('SUM', Campaign.sequelize.col('revenue')), 'totalRevenue']
            ],
            where: { status: 'active' }
        });
        return metrics[0];
    }

    async getCampaigns() {
        return await Campaign.findAll({
            where: { status: 'active' },
            order: [['updatedAt', 'DESC']],
            limit: 10
        });
    }

    async getAnalytics() {
        // Add custom analytics aggregations here
        return {
            conversionRate: await this.calculateConversionRate(),
            roi: await this.calculateROI(),
            performance: await this.getPerformanceMetrics()
        };
    }

    async calculateConversionRate() {
        const metrics = await Campaign.findAll({
            attributes: [
                [Campaign.sequelize.fn('SUM', Campaign.sequelize.col('conversions')), 'totalConversions'],
                [Campaign.sequelize.fn('SUM', Campaign.sequelize.col('clicks')), 'totalClicks']
            ],
            where: { status: 'active' }
        });

        const { totalConversions, totalClicks } = metrics[0];
        return totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    }

    async calculateROI() {
        const metrics = await Campaign.findAll({
            attributes: [
                [Campaign.sequelize.fn('SUM', Campaign.sequelize.col('revenue')), 'totalRevenue'],
                [Campaign.sequelize.fn('SUM', Campaign.sequelize.col('spend')), 'totalSpend']
            ],
            where: { status: 'active' }
        });

        const { totalRevenue, totalSpend } = metrics[0];
        return totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;
    }

    async getPerformanceMetrics() {
        const campaigns = await Campaign.findAll({
            attributes: [
                'id',
                'campaign_name',
                'impressions',
                'clicks',
                'conversions',
                'spend',
                'revenue'
            ],
            where: { status: 'active' },
            order: [['revenue', 'DESC']],
            limit: 5
        });

        return campaigns.map(campaign => ({
            id: campaign.id,
            name: campaign.name,
            ctr: campaign.clicks / campaign.impressions * 100,
            conversionRate: campaign.conversions / campaign.clicks * 100,
            roi: (campaign.revenue - campaign.spend) / campaign.spend * 100
        }));
    }

    broadcast(event, data) {
        if (this.io) {
            console.log(`Broadcasting event: ${event}`, data);
            this.io.emit(event, data);
        } else {
            console.warn('Socket.IO instance not initialized');
        }
    }
}

module.exports = WebSocketService;
