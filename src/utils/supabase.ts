import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Environment variables schema validation
const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
});

// Validate environment variables
const env = envSchema.safeParse({
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
});

if (!env.success) {
  throw new Error(`Environment variables validation failed: ${env.error.message}`);
}

// Create Supabase client
export const supabase = createClient(
  env.data.VITE_SUPABASE_URL,
  env.data.VITE_SUPABASE_ANON_KEY
);

// Type definitions for database inspection results
interface TableInfo {
  table_schema: string;
  table_name: string;
  table_type: string;
  table_owner: string;
  table_size: string;
  row_estimate: number;
}

interface ColumnInfo {
  table_name: string;
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
}

interface IndexInfo {
  table_name: string;
  index_name: string;
  index_type: string;
  is_unique: boolean;
  columns: string[];
}

interface ForeignKeyInfo {
  table_name: string;
  column_name: string;
  foreign_table_name: string;
  foreign_column_name: string;
  constraint_name: string;
}

interface DatabaseStats {
  database_size: string;
  total_relations: number;
  total_indexes: number;
  active_connections: number;
}

// Database inspection functions
export const DatabaseInspector = {
  /**
   * Get information about all tables in the database
   */
  async getTables(): Promise<TableInfo[]> {
    try {
      const { data, error } = await supabase.rpc('get_all_tables');
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching table information:', error);
      throw error;
    }
  },

  /**
   * Get detailed column information for a specific table
   */
  async getTableColumns(tableName: string): Promise<ColumnInfo[]> {
    try {
      const { data, error } = await supabase
        .from('information_schema.columns')
        .select('*')
        .eq('table_name', tableName);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(`Error fetching column information for table ${tableName}:`, error);
      throw error;
    }
  },

  /**
   * Get index information for a specific table
   */
  async getTableIndexes(tableName: string): Promise<IndexInfo[]> {
    try {
      const { data, error } = await supabase.rpc('get_table_indexes', {
        p_table_name: tableName
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(`Error fetching index information for table ${tableName}:`, error);
      throw error;
    }
  },

  /**
   * Get foreign key constraints for a specific table
   */
  async getForeignKeys(tableName: string): Promise<ForeignKeyInfo[]> {
    try {
      const { data, error } = await supabase.rpc('get_foreign_keys', {
        p_table_name: tableName
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(`Error fetching foreign key information for table ${tableName}:`, error);
      throw error;
    }
  },

  /**
   * Get database statistics including size and connection info
   */
  async getDatabaseStats(): Promise<DatabaseStats> {
    try {
      const { data, error } = await supabase.rpc('get_database_stats');

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching database statistics:', error);
      throw error;
    }
  },

  /**
   * Monitor active database connections
   */
  async getActiveConnections(): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('get_active_connections');

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching active connections:', error);
      throw error;
    }
  },

  /**
   * Get user permissions for a specific table
   */
  async getTablePermissions(tableName: string): Promise<Record<string, string[]>> {
    try {
      const { data, error } = await supabase.rpc('get_table_permissions', {
        p_table_name: tableName
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(`Error fetching permissions for table ${tableName}:`, error);
      throw error;
    }
  }
};

// SQL functions to create in Supabase
export const sqlFunctions = `
-- Function to get all tables with their information
CREATE OR REPLACE FUNCTION get_all_tables()
RETURNS TABLE (
  table_schema text,
  table_name text,
  table_type text,
  table_owner text,
  table_size text,
  row_estimate bigint
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    n.nspname as table_schema,
    c.relname as table_name,
    CASE c.relkind WHEN 'r' THEN 'table' WHEN 'v' THEN 'view' END as table_type,
    pg_get_userbyid(c.relowner)::text as table_owner,
    pg_size_pretty(pg_total_relation_size(c.oid))::text as table_size,
    c.reltuples::bigint as row_estimate
  FROM pg_class c
  LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE c.relkind IN ('r','v')
    AND n.nspname NOT IN ('pg_catalog', 'information_schema')
  ORDER BY c.relname;
END;
$$;

-- Function to get table indexes
CREATE OR REPLACE FUNCTION get_table_indexes(p_table_name text)
RETURNS TABLE (
  table_name text,
  index_name text,
  index_type text,
  is_unique boolean,
  columns text[]
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.relname as table_name,
    i.relname as index_name,
    am.amname as index_type,
    ix.indisunique as is_unique,
    array_agg(a.attname ORDER BY k.i) as columns
  FROM
    pg_class t,
    pg_class i,
    pg_index ix,
    pg_attribute a,
    pg_am am,
    generate_subscripts(ix.indkey, 1) k(i)
  WHERE
    t.oid = ix.indrelid
    AND i.oid = ix.indexrelid
    AND a.attrelid = t.oid
    AND a.attnum = ix.indkey[k.i]
    AND i.relam = am.oid
    AND t.relname = p_table_name
  GROUP BY t.relname, i.relname, am.amname, ix.indisunique;
END;
$$;

-- Function to get foreign keys
CREATE OR REPLACE FUNCTION get_foreign_keys(p_table_name text)
RETURNS TABLE (
  table_name text,
  column_name text,
  foreign_table_name text,
  foreign_column_name text,
  constraint_name text
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
  FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
  WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = p_table_name;
END;
$$;

-- Function to get database statistics
CREATE OR REPLACE FUNCTION get_database_stats()
RETURNS TABLE (
  database_size text,
  total_relations bigint,
  total_indexes bigint,
  active_connections bigint
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    pg_size_pretty(pg_database_size(current_database()))::text,
    (SELECT count(*) FROM pg_class WHERE relkind = 'r'),
    (SELECT count(*) FROM pg_class WHERE relkind = 'i'),
    (SELECT count(*) FROM pg_stat_activity);
END;
$$;

-- Function to get active connections
CREATE OR REPLACE FUNCTION get_active_connections()
RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN (SELECT count(*) FROM pg_stat_activity);
END;
$$;

-- Function to get table permissions
CREATE OR REPLACE FUNCTION get_table_permissions(p_table_name text)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  result json;
BEGIN
  WITH permissions AS (
    SELECT
      grantee::text as role,
      string_agg(privilege_type, ', ') as privileges
    FROM information_schema.role_table_grants
    WHERE table_name = p_table_name
    GROUP BY grantee
  )
  SELECT json_object_agg(role, privileges)
  INTO result
  FROM permissions;
  
  RETURN result;
END;
$$;
`;

// Example usage
export const DatabaseInspectorExample = {
  async inspectDatabase() {
    try {
      // Get all tables
      const tables = await DatabaseInspector.getTables();
      console.log('Database Tables:', tables);

      // For each table, get detailed information
      for (const table of tables) {
        const tableName = table.table_name;

        // Get column information
        const columns = await DatabaseInspector.getTableColumns(tableName);
        console.log(`Columns for ${tableName}:`, columns);

        // Get indexes
        const indexes = await DatabaseInspector.getTableIndexes(tableName);
        console.log(`Indexes for ${tableName}:`, indexes);

        // Get foreign keys
        const foreignKeys = await DatabaseInspector.getForeignKeys(tableName);
        console.log(`Foreign Keys for ${tableName}:`, foreignKeys);

        // Get permissions
        const permissions = await DatabaseInspector.getTablePermissions(tableName);
        console.log(`Permissions for ${tableName}:`, permissions);
      }

      // Get database statistics
      const stats = await DatabaseInspector.getDatabaseStats();
      console.log('Database Statistics:', stats);

      // Monitor active connections
      const connections = await DatabaseInspector.getActiveConnections();
      console.log('Active Connections:', connections);

    } catch (error) {
      console.error('Error during database inspection:', error);
      throw error;
    }
  }
};