-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS campaign;
USE campaign;

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INT NOT NULL,
    action_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_values JSON,
    new_values JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id VARCHAR(50) NOT NULL UNIQUE,
    campaign_name VARCHAR(255) NOT NULL,
    channel VARCHAR(100) NOT NULL,
    campaign_type VARCHAR(100),
    target_audience VARCHAR(255),
    budget DECIMAL(10, 2) DEFAULT 0.00,
    spend DECIMAL(10, 2) DEFAULT 0.00,
    revenue DECIMAL(10, 2) DEFAULT 0.00,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    start_date DATE,
    end_date DATE,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create campaign metrics history table
CREATE TABLE IF NOT EXISTS campaign_metrics_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT NOT NULL,
    metrics_date DATE NOT NULL,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0,
    spend DECIMAL(10, 2) DEFAULT 0.00,
    revenue DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for campaign metrics history
DELIMITER //
CREATE TRIGGER campaign_metrics_daily_trigger
AFTER UPDATE ON Campaign
FOR EACH ROW
BEGIN
    INSERT INTO campaign_metrics_history (
        campaign_id,
        metrics_date,
        impressions,
        clicks,
        conversions,
        spend,
        revenue
    )
    VALUES (
        NEW.id,
        CURDATE(),
        NEW.impressions - OLD.impressions,
        NEW.clicks - OLD.clicks,
        NEW.conversions - OLD.conversions,
        NEW.spend - OLD.spend,
        NEW.revenue - OLD.revenue
    );
END;
//
DELIMITER ;

-- Create trigger for campaign audit log
DELIMITER //
CREATE TRIGGER campaign_audit_log_trigger
AFTER UPDATE ON Campaign
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (
        table_name,
        record_id,
        action_type,
        old_values,
        new_values
    )
    VALUES (
        'Campaign',
        NEW.id,
        'UPDATE',
        JSON_OBJECT(
            'impressions', OLD.impressions,
            'clicks', OLD.clicks,
            'conversions', OLD.conversions,
            'spend', OLD.spend,
            'revenue', OLD.revenue
        ),
        JSON_OBJECT(
            'impressions', NEW.impressions,
            'clicks', NEW.clicks,
            'conversions', NEW.conversions,
            'spend', NEW.spend,
            'revenue', NEW.revenue
        )
    );
END;
//
DELIMITER ;