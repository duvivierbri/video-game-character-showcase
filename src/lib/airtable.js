const BASE_ID  = import.meta.env.VITE_AIRTABLE_BASE_ID
const TABLE_ID = import.meta.env.VITE_AIRTABLE_TABLE_ID
const TOKEN    = import.meta.env.VITE_AIRTABLE_TOKEN

const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
}

// In-memory caches — live for the lifetime of the browser session
const _allRecordsCache = { value: null }
const _byNameCache = new Map()   // character name  -> full record
const _recordCache = new Map()   // airtable record ID -> full record

export async function fetchAllRecords() {
  if (_allRecordsCache.value) return _allRecordsCache.value

  const records = []
  let offset = undefined

  do {
    const url = new URL(BASE_URL)
    url.searchParams.set('view', 'Grid view')
    if (offset) url.searchParams.set('offset', offset)

    const res = await fetch(url.toString(), { headers })
    if (!res.ok) throw new Error(`Airtable error: ${res.status} ${res.statusText}`)

    const data = await res.json()
    records.push(...data.records)
    offset = data.offset
  } while (offset)

  _allRecordsCache.value = records
  records.forEach(r => {
    if (r.fields.Name) _byNameCache.set(r.fields.Name, r)
    _recordCache.set(r.id, r)
  })

  return records
}

export async function fetchRecordByName(name) {
  if (_byNameCache.has(name)) return _byNameCache.get(name)

  const url = new URL(BASE_URL)
  url.searchParams.set('filterByFormula', `{Name}="${name.replace(/"/g, '\\"')}"`)
  url.searchParams.set('maxRecords', '1')
  const res = await fetch(url.toString(), { headers })
  if (!res.ok) throw new Error(`Airtable error: ${res.status} ${res.statusText}`)
  const data = await res.json()
  if (!data.records.length) throw new Error(`Character "${name}" not found`)

  const record = data.records[0]
  _byNameCache.set(name, record)
  _recordCache.set(record.id, record)
  return record
}

export async function fetchRecord(recordId) {
  if (_recordCache.has(recordId)) return _recordCache.get(recordId)

  const res = await fetch(`${BASE_URL}/${recordId}`, { headers })
  if (!res.ok) throw new Error(`Airtable error: ${res.status} ${res.statusText}`)
  const record = await res.json()
  _recordCache.set(record.id, record)
  return record
}

/**
 * Fetch multiple records by ID in a single API call.
 * Null/undefined entries in ids are preserved as null in the output.
 * Already-cached records are returned from cache with no API call.
 */
export async function fetchRecordsByIds(ids) {
  const nonNullIds = ids.filter(Boolean)
  if (nonNullIds.length === 0) return ids.map(() => null)

  const uncachedIds = nonNullIds.filter(id => !_recordCache.has(id))

  if (uncachedIds.length > 0) {
    const formula = `OR(${uncachedIds.map(id => `RECORD_ID()='${id}'`).join(',')})`
    const url = new URL(BASE_URL)
    url.searchParams.set('filterByFormula', formula)
    const res = await fetch(url.toString(), { headers })
    if (!res.ok) throw new Error(`Airtable error: ${res.status} ${res.statusText}`)
    const data = await res.json()
    data.records.forEach(r => _recordCache.set(r.id, r))
  }

  return ids.map(id => (id ? (_recordCache.get(id) ?? null) : null))
}

export async function createRecord(fields) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ fields }),
  })
  if (!res.ok) throw new Error(`Airtable error: ${res.status} ${res.statusText}`)
  return res.json()
}

export async function updateRecord(recordId, fields) {
  const res = await fetch(`${BASE_URL}/${recordId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ fields }),
  })
  if (!res.ok) throw new Error(`Airtable error: ${res.status} ${res.statusText}`)
  return res.json()
}

export async function deleteRecord(recordId) {
  const res = await fetch(`${BASE_URL}/${recordId}`, {
    method: 'DELETE',
    headers,
  })
  if (!res.ok) throw new Error(`Airtable error: ${res.status} ${res.statusText}`)
  return res.json()
}
