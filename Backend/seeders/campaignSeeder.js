const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { sequelize, syncDatabase } = require('../config/db');
const Campaign = require('../models/Campaign');
require('dotenv').config();

class CampaignSeeder {
  constructor() {
    this.CSV_FILE_PATH = path.join(__dirname, '../marketing_campaign.csv');
    this.processedCount = 0;
    this.errorCount = 0;
    this.errors = [];
  }

  // Parse date string to proper format
  parseDate(dateString) {
    if (!dateString || dateString.trim() === '') return null;
    
    try {
      // Handle different date formats
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return null;
      }
      return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
    } catch (error) {
      return null;
    }
  }

  // Parse numeric values safely
  parseNumber(value, defaultValue = 0) {
    if (!value || value.toString().trim() === '') return defaultValue;
    
    const parsed = parseFloat(value.toString().replace(/[,$]/g, ''));
    return isNaN(parsed) ? defaultValue : parsed;
  }

  // Parse integer values safely
  parseInt(value, defaultValue = 0) {
    if (!value || value.toString().trim() === '') return defaultValue;
    
    const parsed = parseInt(value.toString().replace(/[,$]/g, ''));
    return isNaN(parsed) ? defaultValue : parsed;
  }

  // Transform CSV row to Campaign model format
  transformRow(row) {
    try {
      const totalSpend = this.parseNumber(row.MntWines) + 
                        this.parseNumber(row.MntFruits) + 
                        this.parseNumber(row.MntMeatProducts) + 
                        this.parseNumber(row.MntFishProducts) + 
                        this.parseNumber(row.MntSweetProducts) + 
                        this.parseNumber(row.MntGoldProds);

      const totalPurchases = this.parseInt(row.NumWebPurchases) + 
                           this.parseInt(row.NumCatalogPurchases) + 
                           this.parseInt(row.NumStorePurchases);

      const campaignData = {
        campaign_id: `CUST_${row.ID}`,
        campaign_name: `Customer ${row.ID} Campaign`,
        channel: row.Education || 'Unknown',
        campaign_type: 'Customer Marketing',
        target_audience: row.Marital_Status || 'Unknown',
        budget: this.parseNumber(row.Income),
        spend: totalSpend,
        revenue: this.parseNumber(row.Z_Revenue) * totalSpend,
        impressions: this.parseInt(row.NumWebVisitsMonth) * 100,
        clicks: this.parseInt(row.NumWebPurchases) * 10,
        conversions: totalPurchases,
        ctr: null,
        cpc: null,
        cpm: null,
        conversion_rate: null,
        roas: null,
        roi: null,
        start_date: this.parseDate(row.Dt_Customer),
        end_date: null,
        status: this.validateStatus('completed'),
        geo_location: 'Global',
        device_type: 'All',
        age_group: row.Year_Birth ? `${2025 - this.parseInt(row.Year_Birth)}` : 'Unknown',
        gender: 'Unknown',
        interests: `Kids: ${row.Kidhome}, Teens: ${row.Teenhome}`,
        ad_format: 'Mixed',
        landing_page_url: 'https://example.com',
        notes: `Recency: ${row.Recency} days, Campaigns Accepted: ${
          (row.AcceptedCmp1 === '1' ? 'Cmp1 ' : '') +
          (row.AcceptedCmp2 === '1' ? 'Cmp2 ' : '') +
          (row.AcceptedCmp3 === '1' ? 'Cmp3 ' : '') +
          (row.AcceptedCmp4 === '1' ? 'Cmp4 ' : '') +
          (row.AcceptedCmp5 === '1' ? 'Cmp5' : '')
        }`
      };

      // Calculate missing metrics if not provided
      if (!campaignData.roas && campaignData.spend > 0) {
        campaignData.roas = Math.round((campaignData.revenue / campaignData.spend) * 100) / 100;
      }

      if (!campaignData.ctr && campaignData.impressions > 0) {
        campaignData.ctr = Math.round((campaignData.clicks / campaignData.impressions * 100) * 100) / 100;
      }

      if (!campaignData.cpc && campaignData.clicks > 0) {
        campaignData.cpc = Math.round((campaignData.spend / campaignData.clicks) * 100) / 100;
      }

      if (!campaignData.conversion_rate && campaignData.clicks > 0) {
        campaignData.conversion_rate = Math.round((campaignData.conversions / campaignData.clicks * 100) * 100) / 100;
      }

      return campaignData;
    } catch (error) {
      this.errors.push({ row, error: error.message });
      return null;
    }
  }

  // Validate status field
  validateStatus(status) {
    const validStatuses = ['active', 'paused', 'completed', 'draft'];
    if (!status) return 'active';
    
    const normalizedStatus = status.toString().toLowerCase().trim();
    return validStatuses.includes(normalizedStatus) ? normalizedStatus : 'active';
  }

  // Seed campaigns from CSV
  async seedFromCSV() {
    try {
      console.log('🌱 Starting campaign seeder...');
      console.log(`📄 Reading CSV file: ${this.CSV_FILE_PATH}`);

      // Check if CSV file exists
      if (!fs.existsSync(this.CSV_FILE_PATH)) {
        throw new Error(`CSV file not found: ${this.CSV_FILE_PATH}`);
      }

      // Sync database (create tables)
      await syncDatabase(false); // Set to true to drop and recreate tables

      const campaigns = [];

      return new Promise((resolve, reject) => {
        fs.createReadStream(this.CSV_FILE_PATH)
          .pipe(csv({ separator: ';' }))
          .on('data', (row) => {
            const campaignData = this.transformRow(row);
            if (campaignData) {
              campaigns.push(campaignData);
            }
          })
          .on('end', async () => {
            try {
              console.log(`📊 Processed ${campaigns.length} campaigns from CSV`);
              
              if (campaigns.length === 0) {
                console.log('⚠️  No valid campaigns found in CSV');
                return resolve({ success: false, message: 'No valid campaigns found' });
              }

              // Bulk insert campaigns
              console.log('💾 Inserting campaigns into database...');
              
              const insertedCampaigns = await Campaign.bulkCreate(campaigns, {
                validate: true,
                ignoreDuplicates: true
              });

              this.processedCount = insertedCampaigns.length;

              console.log(`✅ Successfully seeded ${this.processedCount} campaigns`);
              
              if (this.errors.length > 0) {
                console.log(`⚠️  ${this.errors.length} rows had errors:`);
                this.errors.forEach((error, index) => {
                  console.log(`   ${index + 1}. ${error.error}`);
                });
              }

              resolve({
                success: true,
                processedCount: this.processedCount,
                errorCount: this.errors.length,
                errors: this.errors
              });

            } catch (error) {
              console.error('❌ Database insertion error:', error.message);
              reject(error);
            }
          })
          .on('error', (error) => {
            console.error('❌ CSV parsing error:', error.message);
            reject(error);
          });
      });

    } catch (error) {
      console.error('❌ Seeder error:', error.message);
      throw error;
    }
  }

  // Clear all campaigns
  async clearCampaigns() {
    try {
      const deletedCount = await Campaign.destroy({ where: {} });
      console.log(`🗑️  Deleted ${deletedCount} campaigns`);
      return deletedCount;
    } catch (error) {
      console.error('❌ Error clearing campaigns:', error.message);
      throw error;
    }
  }

  // Get seeding statistics
  async getStats() {
    try {
      const totalCampaigns = await Campaign.count();
      const activeCampaigns = await Campaign.count({ where: { status: 'active' } });
      const channels = await Campaign.findAll({
        attributes: ['channel'],
        group: ['channel']
      });

      return {
        totalCampaigns,
        activeCampaigns,
        totalChannels: channels.length,
        channels: channels.map(c => c.channel)
      };
    } catch (error) {
      console.error('❌ Error getting stats:', error.message);
      throw error;
    }
  }
}

// CLI interface
async function runSeeder() {
  const seeder = new CampaignSeeder();
  
  try {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case 'seed':
        const result = await seeder.seedFromCSV();
        console.log('📈 Seeding completed:', result);
        break;
        
      case 'clear':
        await seeder.clearCampaigns();
        break;
        
      case 'stats':
        const stats = await seeder.getStats();
        console.log('📊 Database Stats:', stats);
        break;
        
      default:
        console.log(`
🌱 Campaign Seeder Usage:

npm run seed:campaigns seed   - Seed campaigns from CSV
npm run seed:campaigns clear  - Clear all campaigns
npm run seed:campaigns stats  - Show database statistics

Make sure your CSV file is at: ${seeder.csvFilePath}
        `);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runSeeder();
}

module.exports = CampaignSeeder;
