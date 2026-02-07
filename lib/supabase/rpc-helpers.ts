// lib/supabase/rpc-helpers.ts
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'

type TableName = keyof Database['public']['Tables']

/**
 * Insert a record using dynamic RPC
 * 
 * @param supabase - Supabase client instance
 * @param tableName - Name of the table to insert into
 * @param data - Data to insert (must match table's Insert type)
 * @returns Object with data (new record ID) or error
 * 
 * @example
 * ```typescript
 * const { data: employeeId, error } = await insertRecord(
 *   supabase,
 *   'employees',
 *   {
 *     employee_number: 'EMP001',
 *     first_name: 'John',
 *     last_name: 'Doe',
 *     email: 'john@example.com',
 *     hire_date: '2024-01-01',
 *   }
 * )
 * ```
 */
export async function insertRecord<T extends TableName>(
  supabase: SupabaseClient<Database>,
  tableName: T,
  data: Database['public']['Tables'][T]['Insert']
): Promise<{ data: string | null; error: any }> {
  try {
    if (!data || Object.keys(data).length === 0) {
      console.warn(`[RPC] Skipping insert for ${tableName}: no data provided`)
      return { data: null, error: new Error('No data provided for insertion') }
    }

    // Terminal Logging Proxy in Development
    if (process.env.NODE_ENV === 'development') {
      // Just log directly
      console.log(`[RPC Debug] Insert ${tableName}:`, data)
    }

    const { data: recordId, error } = await supabase.rpc('insert_record', {
      p_table_name: tableName,
      p_data: data as any,
    } as any)

    if (error) {
      console.error(`[RPC] Error inserting into ${tableName}:`, error)
      return { data: null, error }
    }

    console.log(`[RPC] Successfully inserted into ${tableName}, ID:`, recordId)
    return { data: recordId, error: null }
  } catch (error) {
    console.error(`Exception inserting into ${tableName}:`, error)
    return { data: null, error }
  }
}

/**
 * Update a record using dynamic RPC
 * 
 * @param supabase - Supabase client instance
 * @param tableName - Name of the table to update
 * @param recordId - ID of the record to update
 * @param updates - Partial data to update
 * @returns Object with data (updated record ID) or error
 * 
 * @example
 * ```typescript
 * const { data, error } = await updateRecord(
 *   supabase,
 *   'employees',
 *   'uuid-here',
 *   {
 *     employment_status: 'on_leave',
 *     notes: 'Medical leave'
 *   }
 * )
 * ```
 */
export async function updateRecord<T extends TableName>(
  supabase: SupabaseClient<Database>,
  tableName: T,
  recordId: string,
  updates: Partial<Database['public']['Tables'][T]['Update']>
): Promise<{ data: string | null; error: any }> {
  try {
    if (!updates || Object.keys(updates).length === 0) {
      console.warn(`[RPC] Skipping update for ${tableName}: no data provided`)
      return { data: recordId, error: null }
    }

    // Terminal Logging Proxy in Development
    if (process.env.NODE_ENV === 'development') {
      // Just log directly
      console.log(`[RPC Debug] Update ${tableName} (${recordId}):`, updates)
    }

    const { data, error } = await supabase.rpc('update_record', {
      p_table_name: tableName,
      p_record_id: recordId,
      p_updates: updates as any,
    } as any)

    if (error) {
      console.error(`Error updating ${tableName} (${recordId}):`, error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error(`Exception updating ${tableName} (${recordId}):`, error)
    return { data: null, error }
  }
}

/**
 * Delete a record using dynamic RPC
 * 
 * @param supabase - Supabase client instance
 * @param tableName - Name of the table to delete from
 * @param recordId - ID of the record to delete
 * @returns Object with error (null if successful)
 * 
 * @example
 * ```typescript
 * const { error } = await deleteRecord(
 *   supabase,
 *   'employees',
 *   'uuid-here'
 * )
 * ```
 */
export async function deleteRecord(
  supabase: SupabaseClient<Database>,
  tableName: TableName,
  recordId: string
): Promise<{ error: any }> {
  try {
    // Terminal Logging Proxy in Development
    if (process.env.NODE_ENV === 'development') {
        // Just log directly
        console.log(`[RPC Debug] Delete ${tableName} (${recordId})`)
    }

    const { error } = await supabase.rpc('delete_record', {
      p_table_name: tableName,
      p_id: recordId,
    } as any)

    if (error) {
      console.error(`Error deleting from ${tableName} (${recordId}):`, error)
      return { error }
    }

    return { error: null }
  } catch (error) {
    console.error(`Exception deleting from ${tableName} (${recordId}):`, error)
    return { error }
  }
}

/**
 * Fetch multiple records with filtering, ordering, and pagination
 * 
 * @param supabase - Supabase client instance
 * @param tableName - Name of the table to fetch from
 * @param options - Query options (filters, ordering, pagination)
 * @returns Object with data array, error, and optional count
 * 
 * @example
 * ```typescript
 * const { data, error, count } = await fetchRecords(
 *   supabase,
 *   'employees',
 *   {
 *     filters: { employment_status: 'active' },
 *     orderBy: { column: 'created_at', ascending: false },
 *     limit: 20,
 *     offset: 0
 *   }
 * )
 * ```
 */
export async function fetchRecords<T extends TableName>(
  supabase: SupabaseClient<Database>,
  tableName: T,
  options?: {
    select?: string
    filters?: Record<string, any>
    orderBy?: { column: string; ascending?: boolean }
    limit?: number
    offset?: number
  }
): Promise<{
  data: Database['public']['Tables'][T]['Row'][] | null
  error: any
  count?: number
}> {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n\x1b[35m[DEBUG FETCH]\x1b[0m ${tableName}`)
      if (options) console.dir(options, { depth: null })
    }

    let query = supabase
      .from(tableName)
      .select(options?.select || '*', { count: 'exact' })

    // Apply filters
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value)
        }
      })
    }

    // Apply ordering
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true,
      })
    }

    // Apply pagination
    if (options?.limit !== undefined) {
      const from = options.offset || 0
      const to = from + options.limit - 1
      query = query.range(from, to)
    }

    const { data, error, count } = await query

    if (error) {
      console.error(`Error fetching from ${tableName}:`, error)
      return { data: null, error, count: 0 }
    }

    return {
      data: data as unknown as Database['public']['Tables'][T]['Row'][],
      error: null,
      count: count ?? undefined,
    }
  } catch (error) {
    console.error(`Exception fetching from ${tableName}:`, error)
    return { data: null, error, count: 0 }
  }
}

/**
 * Fetch a single record by ID
 * 
 * @param supabase - Supabase client instance
 * @param tableName - Name of the table to fetch from
 * @param recordId - ID of the record to fetch
 * @returns Object with data (single record) or error
 * 
 * @example
 * ```typescript
 * const { data: employee, error } = await fetchRecord(
 *   supabase,
 *   'employees',
 *   'uuid-here'
 * )
 * ```
 */
export async function fetchRecord<T extends TableName>(
  supabase: SupabaseClient<Database>,
  tableName: T,
  recordId: string
): Promise<{
  data: Database['public']['Tables'][T]['Row'] | null
  error: any
}> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', recordId as any)
      .single()

    if (error) {
      console.error(`Error fetching from ${tableName} (${recordId}):`, error)
      return { data: null, error }
    }

    return {
      data: data as unknown as Database['public']['Tables'][T]['Row'],
      error: null,
    }
  } catch (error) {
    console.error(`Exception fetching from ${tableName} (${recordId}):`, error)
    return { data: null, error }
  }
}

/**
 * Execute a custom query with joins
 * Use this for complex queries that need to join multiple tables
 * 
 * @param supabase - Supabase client instance
 * @param tableName - Base table name
 * @param selectQuery - Custom select query with joins
 * @param filters - Optional filters to apply
 * @returns Object with data array or error
 * 
 * @example
 * ```typescript
 * const { data, error } = await fetchWithJoins(
 *   supabase,
 *   'attendance',
 *   '*, employees(first_name, last_name, email)',
 *   { date: '2024-01-01' }
 * )
 * ```
 */
export async function fetchWithJoins<T extends TableName>(
  supabase: SupabaseClient<Database>,
  tableName: T,
  selectQuery: string,
  filters?: Record<string, any>
): Promise<{ data: any[] | null; error: any }> {
  try {
    let query = supabase.from(tableName).select(selectQuery)

    // Apply filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value)
        }
      })
    }

    const { data, error } = await query

    if (error) {
      console.error(`Error fetching from ${tableName} with joins:`, error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error(`Exception fetching from ${tableName} with joins:`, error)
    return { data: null, error }
  }
}

/**
 * Batch insert multiple records at once
 * 
 * @param supabase - Supabase client instance
 * @param tableName - Name of the table to insert into
 * @param records - Array of records to insert
 * @returns Object with data (array of IDs) or error
 * 
 * @example
 * ```typescript
 * const { data, error } = await batchInsert(
 *   supabase,
 *   'attendance',
 *   [
 *     { employee_id: 'uuid1', date: '2024-01-01', status: 'present' },
 *     { employee_id: 'uuid2', date: '2024-01-01', status: 'present' },
 *   ]
 * )
 * ```
 */
export async function batchInsert<T extends TableName>(
  supabase: SupabaseClient<Database>,
  tableName: T,
  records: Database['public']['Tables'][T]['Insert'][]
): Promise<{ data: string[] | null; error: any }> {
  try {
    const results: string[] = []
    const errors: any[] = []

    for (const record of records) {
      const { data: recordId, error } = await insertRecord(
        supabase,
        tableName,
        record
      )

      if (error) {
        errors.push({ record, error })
      } else if (recordId) {
        results.push(recordId)
      }
    }

    if (errors.length > 0) {
      console.error(`Batch insert had ${errors.length} errors:`, errors)
      return { data: results, error: errors }
    }

    return { data: results, error: null }
  } catch (error) {
    console.error(`Exception in batch insert to ${tableName}:`, error)
    return { data: null, error }
  }
}

/**
 * Count records matching filters
 * 
 * @param supabase - Supabase client instance
 * @param tableName - Name of the table to count from
 * @param filters - Optional filters to apply
 * @returns Object with count or error
 * 
 * @example
 * ```typescript
 * const { count, error } = await countRecords(
 *   supabase,
 *   'employees',
 *   { employment_status: 'active' }
 * )
 * ```
 */
export async function countRecords(
  supabase: SupabaseClient<Database>,
  tableName: TableName,
  filters?: Record<string, any>
): Promise<{ count: number | null; error: any }> {
  try {
    let query = supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })

    // Apply filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value)
        }
      })
    }

    const { count, error } = await query

    if (error) {
      console.error(`Error counting records in ${tableName}:`, error)
      return { count: null, error }
    }

    return { count, error: null }
  } catch (error) {
    console.error(`Exception counting records in ${tableName}:`, error)
    return { count: null, error }
  }
}

/**
 * Check if a record exists
 * 
 * @param supabase - Supabase client instance
 * @param tableName - Name of the table to check
 * @param filters - Filters to identify the record
 * @returns Object with exists boolean or error
 * 
 * @example
 * ```typescript
 * const { exists, error } = await recordExists(
 *   supabase,
 *   'employees',
 *   { employee_number: 'EMP001' }
 * )
 * ```
 */
export async function recordExists(
  supabase: SupabaseClient<Database>,
  tableName: TableName,
  filters: Record<string, any>
): Promise<{ exists: boolean; error: any }> {
  try {
    const { count, error } = await countRecords(supabase, tableName, filters)

    if (error) {
      return { exists: false, error }
    }

    return { exists: (count || 0) > 0, error: null }
  } catch (error) {
    console.error(`Exception checking record existence in ${tableName}:`, error)
    return { exists: false, error }
  }
}

/**
 * Upsert a record (insert if not exists, update if exists)
 * Note: This uses the standard Supabase upsert, not RPC
 * 
 * @param supabase - Supabase client instance
 * @param tableName - Name of the table
 * @param data - Data to upsert
 * @param onConflict - Column(s) to check for conflicts
 * @returns Object with data or error
 * 
 * @example
 * ```typescript
 * const { data, error } = await upsertRecord(
 *   supabase,
 *   'employees',
 *   { employee_number: 'EMP001', first_name: 'John' },
 *   'employee_number'
 * )
 * ```
 */
export async function upsertRecord<T extends TableName>(
  supabase: SupabaseClient<Database>,
  tableName: T,
  data: Database['public']['Tables'][T]['Insert'],
  onConflict: string
): Promise<{ data: any | null; error: any }> {
  try {
    const { data: result, error } = await supabase
      .from(tableName)
      .upsert(data as any, { onConflict })
      .select()
      .single()

    if (error) {
      console.error(`Error upserting into ${tableName}:`, error)
      return { data: null, error }
    }

    return { data: result, error: null }
  } catch (error) {
    console.error(`Exception upserting into ${tableName}:`, error)
    return { data: null, error }
  }
}