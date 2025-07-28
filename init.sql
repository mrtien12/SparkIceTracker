-- Initialize database tables for VietinBank Data Management Platform

-- Create spark_jobs table
CREATE TABLE IF NOT EXISTS spark_jobs (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_email TEXT NOT NULL,
    application_name TEXT NOT NULL UNIQUE,
    chat_id TEXT NOT NULL,
    job_ram INTEGER NOT NULL,
    job_core INTEGER NOT NULL,
    job_executor INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create iceberg_tables table
CREATE TABLE IF NOT EXISTS iceberg_tables (
    id SERIAL PRIMARY KEY,
    table_name TEXT NOT NULL UNIQUE,
    table_job_type TEXT NOT NULL,
    table_location TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table (for authentication/authorization)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for demonstration
-- INSERT INTO spark_jobs (user_email, application_name, chat_id, job_ram, job_core, job_executor, is_active) VALUES
-- ('admin@vietinbank.vn', 'ETL-Customer-Data', '12345678', 8, 4, 2, true),
-- ('analyst@vietinbank.vn', 'Risk-Assessment', '87654321', 16, 8, 4, true),
-- ('dev@vietinbank.vn', 'Transaction-Processing', '11223344', 4, 2, 1, false)
-- ON CONFLICT (application_name) DO NOTHING;

-- INSERT INTO iceberg_tables (table_name, table_job_type, table_location, is_active) VALUES
-- ('customer_transactions', 'STREAMING', 's3://vietin-data-lake/tables/customer_transactions', true),
-- ('risk_metrics', 'BATCH', 's3://vietin-daa-lake/tables/risk_metrics', true),
-- ('account_balances', 'INCREMENTAL', 's3://vietin-data-lake/tables/account_balances', false)
-- ON CONFLICT (table_name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_spark_jobs_email ON spark_jobs(user_email);
CREATE INDEX IF NOT EXISTS idx_spark_jobs_active ON spark_jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_iceberg_tables_type ON iceberg_tables(table_job_type);
CREATE INDEX IF NOT EXISTS idx_iceberg_tables_active ON iceberg_tables(is_active);