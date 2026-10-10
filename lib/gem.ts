// lib/gem.ts
// Imports Ministry of Defence bids from GeM (bidplus.gem.gov.in) — the same
// public, anonymous JSON calls the GeM "Advance Search" page makes: load the
// page for a session + CSRF cookie, then POST /search-bids page by page.
//
// The endpoint is undocumented and can change. GeM also blocks most traffic
// from outside India and many cloud IP ranges; failures are reported, never
// papered over.

const BASE = 'https://bidplus.gem.gov.in';
const ADVANCE_SEARCH = `${BASE}/advance-search`;
const SEARCH_BIDS = `${BASE}/search-bids`;
const CSRF_COOKIE = 'csrf_gem_cookie';
const CSRF_FIELD = 'csrf_bd_gem_nk';

export const GEM_MINISTRY = process.env.GEM_MINISTRY || 'Ministry of Defence';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';

export interface GemBid {
  bidNumber: string;
  bidId: string;
  category: string;
  ministry: string;
  department: string;
  quantity: string;
  startDate: string | null;
  endDate: string | null;
  url: string;
}

export class GemError extends Error {}

const first = (doc: Record<string, any>, key: string) => {
  const v = doc[key];
  return Array.isArray(v) ? v[0] : v;
};

/** GeM uses ISO UTC timestamps; "-0001-…" means no end date. */
function gemDate(v: unknown): string | null {
  if (typeof v !== 'string' || v.startsWith('-')) return null;
  return /^\d{4}-\d{2}-\d{2}/.test(v) ? v.slice(0, 10) : null;
}

function normalize(doc: Record<string, any>): GemBid | null {
  const bidNumber = String(first(doc, 'b_bid_number') ?? '').trim();
  if (!bidNumber) return null;
  const bidId = String(first(doc, 'b_id') ?? '').trim();
  const bidType = Number(first(doc, 'b_bid_type'));
  const docPath = bidType === 5 ? 'showdirectradocumentPdf' : bidType === 2 ? 'showradocumentPdf' : 'showbidDocument';
  const department = String(first(doc, 'ba_official_details_deptName') ?? '').trim();
  return {
    bidNumber,
    bidId,
    category: String(first(doc, 'b_category_name') ?? '').trim() || 'GeM bid',
    ministry: String(first(doc, 'ba_official_details_minName') ?? '').trim(),
    department: department === 'NA' ? '' : department,
    quantity: String(first(doc, 'b_total_quantity') ?? '').trim(),
    startDate: gemDate(first(doc, 'final_start_date_sort')),
    endDate: gemDate(first(doc, 'final_end_date_sort')),
    url: bidId ? `${BASE}/${docPath}/${bidId}` : `${BASE}/all-bids`,
  };
}

async function openSession(): Promise<{ cookie: string; token: string }> {
  let res: Response;
  try {
    res = await fetch(ADVANCE_SEARCH, { headers: { 'User-Agent': UA }, cache: 'no-store', signal: AbortSignal.timeout(20_000) });
  } catch (e: any) {
    throw new GemError(
      `Could not connect to GeM (${e?.cause?.code || e?.name || 'network error'}). GeM blocks most traffic from outside India and many cloud servers.`
    );
  }
  if (!res.ok) throw new GemError(`GeM returned HTTP ${res.status} when opening a session.`);

  const setCookies: string[] = (res.headers as any).getSetCookie?.() ?? [res.headers.get('set-cookie') ?? ''];
  const pairs = setCookies.map((c) => c.split(';')[0]).filter((c) => c.includes('='));
  const token = pairs.find((p) => p.startsWith(`${CSRF_COOKIE}=`))?.split('=')[1];
  if (!token) throw new GemError(`GeM did not return the ${CSRF_COOKIE} security cookie — its page format may have changed.`);
  return { cookie: pairs.join('; '), token };
}

async function searchPage(session: { cookie: string; token: string }, page: number) {
  const payload = {
    searchType: 'ministry-search',
    ministry: GEM_MINISTRY,
    buyerState: '',
    organization: '',
    department: '',
    bidEndFromMin: '',
    bidEndToMin: '',
    page,
  };
  const res = await fetch(SEARCH_BIDS, {
    method: 'POST',
    headers: {
      'User-Agent': UA,
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest',
      Referer: ADVANCE_SEARCH,
      Origin: BASE,
      Cookie: session.cookie,
    },
    body: new URLSearchParams({ payload: JSON.stringify(payload), [CSRF_FIELD]: session.token }),
    cache: 'no-store',
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new GemError(`GeM search returned HTTP ${res.status} on page ${page}.`);
  const json = await res.json().catch(() => null);
  const block = json?.response?.response;
  if (!block) throw new GemError(`GeM search returned an unexpected response on page ${page}.`);
  return { numFound: Number(block.numFound) || 0, docs: (block.docs ?? []) as Record<string, any>[] };
}

/**
 * Fetches matching bids until all are read, `maxPages` is hit, or the time
 * budget runs out. Only bids whose ministry field matches GEM_MINISTRY are
 * kept, so a change in GeM's filter can never import other ministries' bids.
 */
export async function fetchGemDefenceBids({ maxPages = 40, budgetMs = 45_000 } = {}) {
  const started = Date.now();
  const session = await openSession();
  const want = GEM_MINISTRY.toLowerCase();

  const bids = new Map<string, GemBid>();
  let numFound = 0;
  let pagesRead = 0;
  let skippedOtherMinistry = 0;

  for (let page = 1; page <= maxPages; page++) {
    if (Date.now() - started > budgetMs) break;
    const { numFound: n, docs } = await searchPage(session, page);
    numFound = n;
    pagesRead = page;
    if (!docs.length) break;
    for (const doc of docs) {
      const bid = normalize(doc);
      if (!bid) continue;
      if (bid.ministry.toLowerCase() !== want) {
        skippedOtherMinistry++;
        continue;
      }
      bids.set(bid.bidNumber, bid);
    }
    if (page * docs.length >= numFound) break;
  }

  return { bids: Array.from(bids.values()), numFound, pagesRead, skippedOtherMinistry };
}

/** Rough process tags from the GeM item category, for the opportunities filters. */
export function inferProcesses(text: string): string[] {
  const t = text.toLowerCase();
  const tags: [RegExp, string][] = [
    [/\bcnc\b|machin|turn(ed|ing)\b|milling|lathe/, 'CNC'],
    [/sheet\s*metal|laser\s*cut|bending|enclosure|cabinet/, 'Sheet Metal'],
    [/fabricat|welding|structur/, 'Fabrication'],
    [/electronic|pcb|circuit|cable\s*harness|wiring/, 'Electronics'],
    [/assembl|kit\b|spare/, 'Assembly'],
    [/mould|mold|plastic|rubber|injection/, 'Moulding'],
  ];
  return tags.filter(([re]) => re.test(t)).map(([, tag]) => tag);
}
