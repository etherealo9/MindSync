# Supabase Database Migrations

This directory contains database migrations for the MindSync application. Follow these steps to deploy the migrations to your Supabase project.

## Prerequisites

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install supabase --save-dev
   ```

2. Log in to Supabase CLI:
   ```bash
   npx supabase login
   ```

## Deploying Migrations

### Option 1: Using Supabase CLI

1. Link your project to your Supabase instance:
   ```bash
   npx supabase link --project-ref YOUR_PROJECT_REF
   ```
   Replace `YOUR_PROJECT_REF` with your Supabase project reference ID.

2. Deploy the migrations:
   ```bash
   npx supabase db push
   ```

### Option 2: Manual SQL Execution

1. Log in to your Supabase Dashboard
2. Go to the SQL Editor
3. Copy the contents of the migration files (`schema.sql` and `20250323_add_notifications.sql`)
4. Paste and execute the SQL commands in the SQL Editor

## Migration Files

- `schema.sql` - Initial schema with tasks, journal entries, and user settings tables
- `20250323_add_notifications.sql` - Adds notifications table and related indexes for all entities

## Notifications System

The notifications system includes:

1. A `notifications` table with proper indexes
2. Row-level security policies for secure access
3. A PostgreSQL function for creating notifications
4. Additional indexes for existing tables to improve performance

After deploying these migrations, the notifications system will be fully functional with the frontend components. 