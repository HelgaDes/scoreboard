export class HttpError extends Error {
  status: number
  body: unknown
  constructor(message: string, status: number, body: unknown){ super(message); this.status = status; this.body = body }
}
export async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json', ...(init?.headers||{}) }, ...init })
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if(!res.ok) throw new HttpError(`HTTP ${res.status}`, res.status, data)
  return data as T
}
