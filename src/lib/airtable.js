const BASE_ID  = import.meta.env.VITE_AIRTABLE_BASE_ID
const TABLE_ID = import.meta.env.VITE_AIRTABLE_TABLE_ID
const TOKEN    = import.meta.env.VITE_AIRTABLE_TOKEN

const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
}

/**
 * Fetch all records from the table.
 * Airtable paginates at 100 records — this handles multiple pages automatically.
 */
export async function fetchAllRecords() {
  const records = []
  let offset = undefined

  do {
    const url = new URL(BASE_URL)
    if (offset) url.searchParams.set('offset', offset)

    const res = await fetch(url.toString(), { headers })
    if (!res.ok) throw new Error(`Airtable error: ${res.status} ${res.statusText}`)

    const data = await res.json()
    records.push(...data.records)
    offset = data.offset
  } while (offset)

  return records
}

/**
 * Fetch a single record by exact Name match.
 */
export async function fetchRecordByName(name) {
  const url = new URL(BASE_URL)
  url.searchParams.set('filterByFormula', `{Name}="${name.replace(/"/g, '\\"')}"`)
  url.searchParams.set('maxRecords', '1')
  const res = await fetch(url.toString(), { headers })
  if (!res.ok) throw new Error(`Airtable error: ${res.status} ${res.statusText}`)
  const data = await res.json()
  if (!data.records.length) throw new Error(`Character "${name}" not found`)
  return data.records[0]
}

/**
 * Fetch a single record by its Airtable record ID.
 */
export async function fetchRecord(recordId) {
  const res = await fetch(`${BASE_URL}/${recordId}`, { headers })
  if (!res.ok) throw new Error(`Airtable error: ${res.status} ${res.statusText}`)
  return res.json()
}

/**
 * Create a new record. Pass a plain object of field values.
 * Example: createRecord({ Name: 'Hero', Type: 'Warrior' })
 */
export async function createRecord(fields) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ fields }),
  })
  if (!res.ok) throw new Error(`Airtable error: ${res.status} ${res.statusText}`)
  return res.json()
}

/**
 * Update an existing record (PATCH — only provided fields are changed).
 */
export async function updateRecord(recordId, fields) {
  const res = await fetch(`${BASE_URL}/${recordId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ fields }),
  })
  if (!res.ok) throw new Error(`Airtable error: ${res.status} ${res.statusText}`)
  return res.json()
}

/**
 * Delete a record by its Airtable record ID.
 */
export async function deleteRecord(recordId) {
  const res = await fetch(`${BASE_URL}/${recordId}`, {
    method: 'DELETE',
    headers,
  })
  if (!res.ok) throw new Error(`Airtable error: ${res.status} ${res.statusText}`)
  return res.json()
}
