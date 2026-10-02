import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let anonClient: SupabaseClient | null = null;

// Created on first use so a missing env var fails the request, not `next build`.
function getAnonClient(): SupabaseClient {
  if (!anonClient) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
      );
    }
    anonClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return anonClient;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getAnonClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

export const supabaseAdmin: SupabaseClient | null =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, { auth: { persistSession: false } })
    : null;

export interface Vendor {
  id: string;
  company_name: string;
  owner_name: string;
  aadhar_number: string;
  pancard_number: string;
  gst_no: string;
  address: string;
  number_of_skill: number;
  number_of_programmer: number;
  number_of_quality_tools: number;
  number_of_machines?: number | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Machine {
  id: string;
  vendor_id?: string | null;
  machine_name?: string | null;
  machine_type?: string | null;
  machine_code?: string | null;
  mapped_subtype?: string | null;
  size_choice?: string | null;
  diameter_value?: string | null;
  size_x?: string | null;
  size_y?: string | null;
  accuracy?: string | null;
  power?: string | null;
  advance_software?: string | null;
  specs?: any | null;
  purchase_date?: string | null;
  status?: 'Operational' | 'Under Maintenance' | 'Retired' | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}



function clientOrDefault(client?: SupabaseClient | null) {
  return client ?? supabase;
}

export const vendorService = {
  async createVendor(vendorData: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>, client?: SupabaseClient | null) {
    const c = clientOrDefault(client);
    const { data, error } = await c
      .from('vendors')
      .insert([vendorData])
      .select()
      .single();

    if (error) throw error;
    return data as Vendor;
  },

  async getVendors(client?: SupabaseClient | null) {
    const c = clientOrDefault(client);
    const { data, error } = await c
      .from('vendors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Vendor[];
  },

  async getVendorById(id: string, client?: SupabaseClient | null) {
    const c = clientOrDefault(client);
    const { data, error } = await c
      .from('vendors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Vendor;
  },

  async deleteVendor(id: string, client?: SupabaseClient | null) {
    const c = clientOrDefault(client);
    const { data, error } = await c
      .from('vendors')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return data;
  }
};

export const machineService = {
  async createMachine(machineData: Omit<Machine, 'id' | 'created_at' | 'updated_at'>, client?: SupabaseClient | null) {
    const c = clientOrDefault(client);
    const { data, error } = await c
      .from('machines')
      .insert([machineData])
      .select()
      .single();

    if (error) throw error;
    return data as Machine;
  },

  async createMachines(machinesData: Omit<Machine, 'id' | 'created_at' | 'updated_at'>[], client?: SupabaseClient | null) {
    const c = clientOrDefault(client);
    const { data, error } = await c
      .from('machines')
      .insert(machinesData)
      .select();

    if (error) throw error;
    return data as Machine[];
  },

  async getMachinesByVendorId(vendorId: string, client?: SupabaseClient | null) {
    const c = clientOrDefault(client);
    const { data, error } = await c
      .from('machines')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Machine[];
  },

  async getAllMachines(client?: SupabaseClient | null) {
    const c = clientOrDefault(client);
    const { data, error } = await c
      .from('machines')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Machine[];
  }
};

export interface MachineServerStats {
  vendorsCount: number;
  machinesCount: number;
  technicalStaffCount: number;
  programmersCount: number;
  industryData: Array<{ name: string; count: number }>;
  machineTypeData: Array<{ name: string; count: number }>;
  stateData: Array<{ name: string; count: number }>;
  vendorDetails: Array<{
    id: string;
    name: string;
    location?: string;
    machines: number;
    staff: number;
    programmers: number;
    industries: string[];
  }>;
}

export async function getMachineServerStats(client?: SupabaseClient | null): Promise<MachineServerStats> {
  const c = clientOrDefault(client);

  try {
    // vendors and machines are the core tables guaranteed to exist
    // Note: state, number_of_machines, industries are extended columns added
    // after the initial migration. If they don't exist yet the query will error,
    // so we select only the guaranteed base columns plus the extended ones and
    // handle missing-column errors below.
    const [vendorsRes, machinesRes] = await Promise.all([
      c.from('vendors').select('id, company_name, address, number_of_skill, number_of_programmer, state, number_of_machines, industries'),
      c.from('machines').select('machine_type, vendor_id'),
    ]);

    // If the extended columns don't exist Supabase returns an error — retry
    // with only the guaranteed base columns so the page still loads.
    let vendors: any[] = [];
    if (vendorsRes.error) {
      console.warn('Extended vendor columns missing, retrying with base columns:', vendorsRes.error.message);
      const fallbackRes = await c.from('vendors').select('id, company_name, address, number_of_skill, number_of_programmer');
      if (fallbackRes.error) {
        console.error('Error fetching vendors (base):', fallbackRes.error);
        throw fallbackRes.error;
      }
      vendors = fallbackRes.data || [];
    } else {
      vendors = vendorsRes.data || [];
    }

    if (machinesRes.error) {
      console.error('Error fetching machines:', machinesRes.error);
    }
    const machines = machinesRes.data || [];

    // ── Staff count: prefer vendor_staff_summary, fall back to vendors.number_of_skill ──
    let totalStaff = 0;
    const staffRes = await c.from('vendor_staff_summary').select('technical_staff_count');
    if (staffRes.error || !staffRes.data || staffRes.data.length === 0) {
      // fallback: sum directly from vendors table
      totalStaff = vendors.reduce((sum, v) => sum + (v.number_of_skill || 0), 0);
    } else {
      totalStaff = staffRes.data.reduce((sum, item) => sum + (item.technical_staff_count || 0), 0);
    }

    // ── Programmer count: prefer vendor_programmings, fall back to vendors.number_of_programmer ──
    let uniqueProgrammers = 0;
    const programmersRes = await c.from('vendor_programmings').select('vendor_id');
    if (programmersRes.error || !programmersRes.data || programmersRes.data.length === 0) {
      // fallback: sum directly from vendors table
      uniqueProgrammers = vendors.reduce((sum, v) => sum + (v.number_of_programmer || 0), 0);
    } else {
      uniqueProgrammers = new Set(programmersRes.data.map(p => p.vendor_id)).size;
    }

    // ── Industry distribution ──
    const industryMap = new Map<string, number>();
    vendors.forEach(vendor => {
      if (vendor.industries && Array.isArray(vendor.industries)) {
        vendor.industries.forEach((industry: string) => {
          if (industry) industryMap.set(industry, (industryMap.get(industry) || 0) + 1);
        });
      }
    });

    // ── Machine type distribution ──
    const machineTypeMap = new Map<string, number>();
    machines.forEach(machine => {
      if (machine.machine_type) {
        machineTypeMap.set(machine.machine_type, (machineTypeMap.get(machine.machine_type) || 0) + 1);
      }
    });

    // ── Geographic distribution ──
    const stateMap = new Map<string, number>();
    vendors.forEach(vendor => {
      const state = (vendor.state || '').trim() || 'Unknown';
      stateMap.set(state, (stateMap.get(state) || 0) + 1);
    });

    const vendorDetails = vendors.map(vendor => ({
      id: vendor.id,
      name: vendor.company_name,
      location: vendor.address,
      machines: vendor.number_of_machines || 0,
      staff: vendor.number_of_skill || 0,
      programmers: vendor.number_of_programmer || 0,
      industries: vendor.industries || [],
    }));

    return {
      vendorsCount: vendors.length,
      machinesCount: machines.length,
      technicalStaffCount: totalStaff,
      programmersCount: uniqueProgrammers,
      industryData: Array.from(industryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      machineTypeData: Array.from(machineTypeMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      stateData: Array.from(stateMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      vendorDetails,
    };
  } catch (error) {
    console.error('Error fetching machine server stats:', error);
    throw error;
  }
}
