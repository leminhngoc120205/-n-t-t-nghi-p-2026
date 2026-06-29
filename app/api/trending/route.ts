import { NextResponse } from 'next/server'

export const revalidate = 1800  // cache 30 phút

export async function GET() {
  try {
    const res = await fetch('https://trends.google.com/trending/rss?geo=VN', {
      headers: { 'User-Agent': 'Mozilla/5.0 IMS-RSS-Reader/1.0' },
      next: { revalidate: 1800 },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const xml = await res.text()

    // Parse <item> blocks
    const itemRegex = /<item[\s>][\s\S]*?<\/item>/gi
    const keywords: { keyword: string; traffic: string }[] = []
    let m: RegExpExecArray | null = null

    while ((m = itemRegex.exec(xml)) !== null) {
      const chunk = m[0]

      const titleMatch = chunk.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>|<title>([\s\S]*?)<\/title>/i)
      const keyword = (titleMatch?.[1] ?? titleMatch?.[2] ?? '').trim()
      if (!keyword) continue

      const trafficMatch = chunk.match(/<ht:approx_traffic>([\s\S]*?)<\/ht:approx_traffic>/i)
      const traffic = (trafficMatch?.[1] ?? '').trim()

      keywords.push({ keyword, traffic })
    }

    return NextResponse.json({ ok: true, data: keywords.slice(0, 20) })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
