
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { vendorService, machineService, supabase, supabaseAdmin } from '@/lib/supabase';

type MachineSpecIn = {
  machineCategory?: string | null;
  machineCode?: string | null;
  mappedSubtype?: string | null;
  sizeChoice?: 'diameter' | 'xy' | null;
  diameterValue?: string | null;
  sizeXAxis?: string | null;
  sizeYAxis?: string | null;
  sizeZAxis?: string | null;
  accuracySelection?: string | null;
  powerSelection?: string | null;
  advanceSoftwareSelection?: string | null;
  specs?: any | null;
  purchaseDate?: string | null;
  status?: string | null;
  machine_type?: string | null;
  machine_category?: string | null;
};

type VendorDataIn = {
  companyName: string;
  ownerName: string;
  phoneNumber: string;
  pancardNumber: string;
  gstNo: string;
  address: string;
  email?: string | null;
  state?: string | null;
  city?: string | null;
  pincode?: string | null;

  numberOfMachines?: number;
  numberOfSkill?: number;
  numberOfProgrammer?: number;
  numberOfQualityTools?: number;
  machines?: MachineSpecIn[];
  programmingType?: 'design' | 'programming' | '';
  programmingMode?: 'manual' | 'cam' | '';
  programmingManual?: string | null;
  programmingCam?: string | null;

  // NEW: industries (multiple)
  industries?: string[] | null;

  // NEW: Tools & Fixtures inputs from frontend
  vice?: string | null;
  anglePlates?: string | null;
  specialFixture?: string | null;

  boringBar?: string | null;
  antiVibrationTool?: string | null;
  highFeedTool?: string | null;
  advanceTooling?: string | null;
};

const ALLOWED_STATUSES = ['Operational', 'Under Maintenance', 'Retired'] as const;
type AllowedStatus = typeof ALLOWED_STATUSES[number];
function isAllowedStatus(s: any): s is AllowedStatus {
  return typeof s === 'string' && (ALLOWED_STATUSES as readonly string[]).includes(s);
}

function normalizePan(pan: string | undefined | null) { return pan ? String(pan).trim().toUpperCase() : ''; }
function normalizeGst(gst: string | undefined | null) { return gst ? String(gst).trim().toUpperCase() : ''; }
function validatePAN(panRaw: string | undefined | null) { const pan = normalizePan(panRaw); const re = /^[A-Z]{5}[0-9]{4}[A-Z]$/; return re.test(pan); }
function validateGST(gstRaw: string | undefined | null) { const gst = normalizeGst(gstRaw); const re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]$/; return re.test(gst); }
function gstContainsPan(gstRaw: string | undefined | null, panRaw: string | undefined | null) { const gst = normalizeGst(gstRaw); const pan = normalizePan(panRaw); if (gst.length < 15 || pan.length !== 10) return false; return gst.substr(2, 10) === pan; }
function validatePhone(phone: string | undefined | null) { const p = phone ? String(phone).trim() : ''; return /^\d{10}$/.test(p); }
function validateEmail(email: string | undefined | null) {
  if (!email) return false;
  const e = String(email).trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function inferMachineTypeFromSubtype(sub?: string | null): string | null {
  if (!sub) return null;
  const s = sub.toLowerCase();
  if (/vmc|hmc|mill|millturn|vertical|horizontal/.test(s)) return 'Milling';
  if (/turn|turnmill|cliche/.test(s)) return 'Turn';
  if (/grind|grinding|surface|spline|gear/.test(s)) return 'Grinding';
  if (/hobb|shap|bevel|spline/.test(s)) return 'Gear Cutting';
  if (/5-?axis|5axis/.test(s)) return '5-Axis';
  if (/wire|edm/.test(s)) return 'Wire Cutting';
  if (/print|3-?d|3d/.test(s)) return '3-D Printing';
  return null;
}

if (!supabaseAdmin) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY not set — server admin operations will fail due to RLS.');
}

async function getOrCreateStateId(stateName?: string | null) {
  if (!stateName) return null;
  const trimmed = String(stateName).trim();
  if (!trimmed) return null;
  const client = supabaseAdmin ?? supabase;
  const { data: existingStates, error: selectErr } = await client
    .from('states')
    .select('id, name')
    .eq('name', trimmed)
    .limit(1);

  if (selectErr) {
    const { data: retry, error: retryErr } = await client
      .from('states')
      .select('id, name')
      .ilike('name', `%${trimmed}%`)
      .limit(1);
    if (retryErr) {
      console.error('Error selecting state (retry):', retryErr);
    }
    if (retry && retry.length > 0) return retry[0].id;
  }
  if (existingStates && existingStates.length > 0) return existingStates[0].id;

  const { data: inserted, error: insertErr } = await client
    .from('states')
    .insert({ name: trimmed })
    .select('id')
    .limit(1)
    .maybeSingle();

  if (insertErr) {
    console.warn('State insert error (trying to recover):', insertErr);
    const { data: retry, error: retryErr } = await client
      .from('states')
      .select('id, name')
      .ilike('name', `%${trimmed}%`)
      .limit(1);
    if (retryErr) {
      console.error('State retry select failed:', retryErr);
      return null;
    }
    if (retry && retry.length > 0) return retry[0].id;
    return null;
  }
  if (inserted && (inserted as any).id) return (inserted as any).id;
  return null;
}

async function getOrCreateCityId(cityName?: string | null, stateId?: string | null) {
  if (!cityName) return null;
  const trimmed = String(cityName).trim();
  if (!trimmed) return null;
  const client = supabaseAdmin ?? supabase;
  const baseQuery = client.from('cities').select('id, name, state_id');

  if (stateId) {
    const { data: existing, error: selErr } = await baseQuery.eq('state_id', stateId).ilike('name', trimmed).limit(1);
    if (selErr) console.error('Error selecting city:', selErr);
    if (existing && existing.length > 0) return existing[0].id;
  }

  const { data: existingAny, error: selErr2 } = await client.from('cities').select('id, name, state_id').ilike('name', trimmed).limit(1);
  if (selErr2) console.error('Error selecting city fallback:', selErr2);
  if (existingAny && existingAny.length > 0) return existingAny[0].id;

  const { data: inserted, error: insertErr } = await client
    .from('cities')
    .insert({ name: trimmed, state_id: stateId ?? null })
    .select('id')
    .limit(1)
    .maybeSingle();

  if (insertErr) {
    console.warn('City insert error (trying to recover):', insertErr);
    const { data: retry, error: retryErr } = await client.from('cities').select('id, name, state_id').ilike('name', trimmed).limit(1);
    if (retryErr) {
      console.error('City retry select failed:', retryErr);
      return null;
    }
    if (retry && retry.length > 0) return retry[0].id;
    return null;
  }
  if (inserted && (inserted as any).id) return (inserted as any).id;
  return null;
}

function toNullIfEmpty(v: any): any {
  if (v === undefined || v === null) return null;
  if (typeof v === 'string') {
    const t = v.trim();
    return t === '' ? null : t;
  }
  return v;
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const vendorData = raw as VendorDataIn;

    const requiredFields = ['companyName', 'ownerName', 'phoneNumber', 'pancardNumber', 'gstNo', 'address', 'email'];
    for (const field of requiredFields) {
      const val = (vendorData as any)[field];
      if (!val || String(val).trim() === '') {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    if (!validatePhone(vendorData.phoneNumber)) {
      return NextResponse.json({ error: 'Invalid phone number (expect 10 digits)' }, { status: 400 });
    }
    if (!validatePAN(vendorData.pancardNumber)) {
      return NextResponse.json({ error: 'Invalid PAN format (expected AAAAA9999A)' }, { status: 400 });
    }
    if (!validateGST(vendorData.gstNo)) {
      return NextResponse.json({ error: 'Invalid GST format (expected 15-char GSTIN)' }, { status: 400 });
    }
    if (!gstContainsPan(vendorData.gstNo, vendorData.pancardNumber)) {
      return NextResponse.json({ error: 'GST number does not contain provided PAN' }, { status: 400 });
    }
    if (!validateEmail(String(vendorData.email))) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const headerUser = request.headers.get('x-user-id') ?? request.headers.get('x-auth-uid') ?? undefined;
    const userIdText = headerUser ?? 'service';

    // const stateId = await getOrCreateStateId(vendorData.state ?? null);
    // const cityId = await getOrCreateCityId(vendorData.city ?? null, stateId ?? null);

    const vendorPayload: any = {
      company_name: vendorData.companyName,
      owner_name: vendorData.ownerName,
      phone_number: vendorData.phoneNumber,
      pancard_number: vendorData.pancardNumber,
      gst_no: vendorData.gstNo,
      address: vendorData.address,
      number_of_machines: vendorData.numberOfMachines ?? 0,
      number_of_skill: vendorData.numberOfSkill ?? 0,
      number_of_programmer: vendorData.numberOfProgrammer ?? 0,
      number_of_quality_tools: vendorData.numberOfQualityTools ?? 0,
      // state_id: stateId ?? null,
      // city_id: cityId ?? null,
      state: toNullIfEmpty(vendorData.state),
city: toNullIfEmpty(vendorData.city),
pincode: toNullIfEmpty(vendorData.pincode),

      created_by: userIdText,

      industries: Array.isArray(vendorData.industries)
        ? vendorData.industries
        : (vendorData.industries ? [vendorData.industries] : []),

      vice: toNullIfEmpty((vendorData as any).vice),
      angle_plates: toNullIfEmpty((vendorData as any).anglePlates),
      special_fixture: toNullIfEmpty((vendorData as any).specialFixture),

      boring_bar: toNullIfEmpty((vendorData as any).boringBar),
      anti_vibration_tool: toNullIfEmpty((vendorData as any).antiVibrationTool),
      high_feed_tool: toNullIfEmpty((vendorData as any).highFeedTool),
      advance_tooling: toNullIfEmpty((vendorData as any).advanceTooling),
    };

    const adminClient = supabaseAdmin ?? supabase;
    const newVendor = await vendorService.createVendor(vendorPayload as any, adminClient);

    if (!newVendor || !newVendor.id) {
      console.error('vendorService.createVendor returned unexpected:', newVendor);
      return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 });
    }

    try {
      const recipient = vendorData.email ? String(vendorData.email).trim() : '';
      if (recipient) {
        const sendgridKey = process.env.SENDGRID_API_KEY;
        const fromEmail = process.env.FROM_EMAIL || 'no-reply@yourdomain.com';
        const fromName = process.env.FROM_NAME || 'OpenManufacturing';
        const supportEmail = process.env.SUPPORT_EMAIL || fromEmail; 

       
        const keyLooksOk = typeof sendgridKey === 'string' && sendgridKey.startsWith('SG.') && !/[*]/.test(sendgridKey) && sendgridKey.length > 40;

        if (!sendgridKey || !keyLooksOk) {
          console.warn('SENDGRID_API_KEY not set correctly or masked — skipping email send.');
        } else {
          const sgBody = {
            personalizations: [
              {
                to: [{ email: recipient }],
                subject: 'Vendor registration received — ReadnRevise'
              }
            ],
            from: { email: fromEmail, name: fromName },
            reply_to: { email: supportEmail, name: `${fromName} Support` },
            content: [
              {
                type: 'text/plain',
                value: `Hello ${vendorData.ownerName || vendorData.companyName || 'Vendor'},\n\nThanks — we received your registration. Your vendor id: ${newVendor.id}\n\nWe will contact you soon.\n\nRegards,\n${fromName}`
              },
              {
                type: 'text/html',
                value: `<p>Hello ${vendorData.ownerName || vendorData.companyName || 'Vendor'},</p>
                        <p>Thanks — we received your registration. <strong>Vendor ID:</strong> ${newVendor.id}</p>
                        <p>We will contact you soon.</p>
                        <p>Regards,<br/>${fromName}</p>`
              }
            ]
          };

          const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sendgridKey}`
            },
            body: JSON.stringify(sgBody)
          });

          const text = await res.text().catch(() => '');
          if (res.status === 202) {
            console.log('Confirmation email accepted by SendGrid for', recipient);
          } else {
            console.warn('SendGrid send failed:', res.status, text);
          }
        }
      } else {
        console.log('No recipient email provided — skipping confirmation email.');
      }
    } catch (e) {
      console.warn('Error sending confirmation email (non-fatal):', e);
    }

    const progTypeNormalized = vendorData.programmingType ? String(vendorData.programmingType).trim() : null;
    const progModeNormalized = vendorData.programmingMode ? String(vendorData.programmingMode).trim() : null;

    const vssPayload: any = {
      vendor_id: newVendor.id,
      technical_staff_count: vendorData.numberOfSkill ?? 0,
      programmer_count: vendorData.numberOfProgrammer ?? 0,
      programming_type: progTypeNormalized ?? null,
      programming_mode: progTypeNormalized === 'programming' ? (progModeNormalized || null) : null,
      programming_manual: progTypeNormalized === 'programming' && progModeNormalized === 'manual' ? (vendorData.programmingManual || null) : null,
      programming_cam: progTypeNormalized === 'programming' && progModeNormalized === 'cam' ? (vendorData.programmingCam ?? null) : null,
      notes: null,
      created_by: userIdText,
    };

    try {
      const { data: vssData, error: vssErr } = await adminClient
        .from('vendor_staff_summary')
        .insert(vssPayload)
        .select('id')
        .maybeSingle();

      if (vssErr) {
        console.error('Failed to insert vendor_staff_summary:', vssErr);
      } else {
        console.log('Inserted vendor_staff_summary id=', vssData?.id ?? '(no id returned)');
      }
    } catch (e) {
      console.error('Unexpected error inserting vendor_staff_summary:', e);
    }

    try {
      const tscPayload = {
        vendor_id: newVendor.id,
        technical_staff_count: vendorData.numberOfSkill ?? 0,
        created_by: userIdText,
      };
      await adminClient.from('technical_staff_counts').upsert(tscPayload, { onConflict: 'vendor_id' });

      const pcPayload = {
        vendor_id: newVendor.id,
        programmer_count: vendorData.numberOfProgrammer ?? 0,
        created_by: userIdText,
      };
      await adminClient.from('programmer_counts').upsert(pcPayload, { onConflict: 'vendor_id' });
    } catch (e) {
      console.warn('Failed to upsert staff/programmer counts (non-fatal):', e);
    }

    try {
      if (progTypeNormalized) {
        const subtypeName = progTypeNormalized.toLowerCase().trim();
        let programmingSubtypeId: string | null = null;

        const { data: found, error: findErr } = await adminClient
          .from('programming_subtypes')
          .select('id, name')
          .ilike('name', subtypeName)
          .limit(1);

        if (findErr) {
          console.warn('Error finding programming_subtypes:', findErr);
        } else if (found && found.length > 0) {
          programmingSubtypeId = (found[0] as any).id;
        }

        if (!programmingSubtypeId) {
          const { data: inserted, error: insertErr } = await adminClient
            .from('programming_subtypes')
            .insert({ name: progTypeNormalized })
            .select('id')
            .limit(1)
            .maybeSingle();

          if (insertErr) {
            console.warn('Insert programming_subtypes error (attempting select):', insertErr);
            const { data: retry, error: retryErr } = await adminClient
              .from('programming_subtypes')
              .select('id, name')
              .ilike('name', subtypeName)
              .limit(1);
            if (retryErr) {
              console.error('Retry select programming_subtypes failed:', retryErr);
            } else if (retry && retry.length > 0) {
              programmingSubtypeId = (retry[0] as any).id;
            }
          } else if (inserted && (inserted as any).id) {
            programmingSubtypeId = (inserted as any).id;
          }
        }

        const programmingDetail =
          progTypeNormalized === 'programming'
            ? (progModeNormalized === 'manual' ? (vendorData.programmingManual ?? null) : (vendorData.programmingCam ?? null))
            : (vendorData.programmingManual ?? vendorData.programmingCam ?? 'design');

        const vpPayload: any = {
          vendor_id: newVendor.id,
          programming_subtype_id: programmingSubtypeId ?? null,
          programming_mode: progTypeNormalized === 'programming' ? (progModeNormalized || null) : null,
          programming_detail: programmingDetail ?? null,
          notes: null,
          created_by: userIdText,
        };

        const { data: vpData, error: vpErr } = await adminClient
          .from('vendor_programmings')
          .upsert(vpPayload, { onConflict: 'vendor_id' })
          .select('id')
          .maybeSingle();

        if (vpErr) {
          console.error('Failed to upsert vendor_programmings:', vpErr);
        } else {
          console.log('Upserted vendor_programmings id=', vpData?.id ?? '(no id returned)');
        }
      } else {
        console.log('No programmingType provided; skipped vendor_programmings upsert.');
      }
    } catch (e) {
      console.warn('Failed to record vendor programming/subtype (non-fatal):', e);
    }

    if (vendorData.machines && Array.isArray(vendorData.machines) && vendorData.machines.length > 0) {
      const { data: categoriesData, error: categoriesError } = await adminClient.from('machine_categories').select('id, name');
      const { data: machineTypesData, error: typesError } = await adminClient.from('machine_types').select('id, name');

      if (categoriesError) {
        console.error('Failed to load machine_categories:', categoriesError);
      }
      if (typesError) {
        console.error('Failed to load machine_types:', typesError);
      }

      const nameToCategoryId = (categoriesData || []).reduce<Record<string, string>>((acc: Record<string, string>, row: any) => {
        if (row && row.name && row.id) acc[String(row.name).toLowerCase()] = row.id;
        return acc;
      }, {});

      const nameToTypeId = (machineTypesData || []).reduce<Record<string, string>>((acc: Record<string, string>, row: any) => {
        if (row && row.name && row.id) acc[String(row.name).toLowerCase()] = row.id;
        return acc;
      }, {});

      const codeToTypeName: Record<string, string> = {
        '20.1': 'Turn',
        '20.2': 'Milling',
        '20.3': '5-Axis',
        '20.4': 'Gear Cutting',
        '20.5': 'Grinding',
        '20.6': 'Wire Cutting',
        '20.7': '3-D Printing'
      };

      const machinesData = vendorData.machines.map((m: MachineSpecIn) => {
        const explicitCategory = (m as any).machineCategory ?? null;
        let machineCategoryId: string | null = null;

        if (explicitCategory) {
          const k = String(explicitCategory).toLowerCase();
          machineCategoryId = nameToCategoryId[k] ?? null;
        }

        if (!machineCategoryId && m.machineCode) {
          const typeName = codeToTypeName[String(m.machineCode).trim()] ?? null;
          if (typeName) {
            const k = String(typeName).toLowerCase();
            machineCategoryId = nameToCategoryId[k] ?? null;
          }
        }

        if (!machineCategoryId && m.mappedSubtype) {
          const ms = String(m.mappedSubtype).toLowerCase();
          if (/vmc|hmc|mill|millturn|vertical|horizontal/.test(ms)) {
            machineCategoryId = nameToCategoryId['milling'] ?? null;
          } else if (/turn|turnmill|cliche/.test(ms)) {
            machineCategoryId = nameToCategoryId['turn'] ?? null;
          } else if (/grind|grinding|surface|spline|gear/.test(ms)) {
            machineCategoryId = nameToCategoryId['grinding'] ?? null;
          }
        }

        let machineTypeLabel: string | null = null;
        if ((m as any).machine_type && typeof (m as any).machine_type === 'string' && (m as any).machine_type.trim() !== '') {
          machineTypeLabel = String((m as any).machine_type).trim();
        } else if (m.machineCode) {
          machineTypeLabel = codeToTypeName[String(m.machineCode).trim()] ?? null;
        } else {
          machineTypeLabel = inferMachineTypeFromSubtype(m.mappedSubtype) ?? (m.mappedSubtype ?? null);
        }

        let machineTypeId: string | null = null;
        if (machineTypeLabel) {
          machineTypeId = nameToTypeId[String(machineTypeLabel).toLowerCase()] ?? null;
        }

        const statusValue: AllowedStatus | null = isAllowedStatus(m.status) ? m.status : 'Operational';

        const machineNameFinal = toNullIfEmpty(m.mappedSubtype) ?? toNullIfEmpty(machineTypeLabel) ?? toNullIfEmpty(m.machineCode) ?? 'Unknown';

        return {
          vendor_id: newVendor.id,
          machine_name: machineNameFinal,
          machine_type: toNullIfEmpty(machineTypeLabel),
          machine_type_id: machineTypeId,
          machine_code: toNullIfEmpty(m.machineCode),
          mapped_subtype: toNullIfEmpty(m.mappedSubtype),
          size_choice: toNullIfEmpty(m.sizeChoice),
          diameter_value: toNullIfEmpty(m.diameterValue),
          diameter: toNullIfEmpty(m.diameterValue),
          size_x: toNullIfEmpty(m.sizeXAxis),
          size_y: toNullIfEmpty(m.sizeYAxis),
          size_z: toNullIfEmpty(m.sizeZAxis),
          accuracy: toNullIfEmpty(m.accuracySelection),
          power: toNullIfEmpty(m.powerSelection),
          advance_software: toNullIfEmpty(m.advanceSoftwareSelection),
          specs: m.specs ?? null,
          purchase_date: m.purchaseDate ?? null,
          status: statusValue,
          created_by: userIdText,
          machine_category_id: machineCategoryId
        } as const;
      });

      console.log('machinesData prepared for insert:', JSON.stringify(machinesData, null, 2));

      try {
        await machineService.createMachines(machinesData as any, adminClient);
      } catch (mErr) {
        console.error('Failed to insert machines, attempting rollback vendor:', mErr);
        try {
          await vendorService.deleteVendor(newVendor.id, adminClient);
        } catch (rbErr) {
          console.error('Rollback vendor delete failed:', rbErr);
        }
        return NextResponse.json({ error: 'Failed to insert machines; vendor rolled back' }, { status: 500 });
      }
    }

    return NextResponse.json({ message: 'Vendor registered successfully', vendorId: newVendor.id, vendor: newVendor }, { status: 201 });
  } catch (error) {
    console.error('Error processing vendor registration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Require the same admin password used by the export endpoint.
  // Accept it via Authorization header: "Bearer <password>"
  const envPassword = (process.env.ADMIN_PASSWORD || '').trim();
  const authHeader = request.headers.get('authorization') || '';
  const provided = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!envPassword || provided !== envPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const vendors = await vendorService.getVendors();
    return NextResponse.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
