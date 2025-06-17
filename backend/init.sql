-- Create database if not exists
SELECT 'CREATE DATABASE hr_management'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'hr_management')\gexec

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
