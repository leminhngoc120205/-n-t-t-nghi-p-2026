export interface RSSItem {
  title: string
  link: string
  description: string
  content: string
  pubDate: string
  imageUrl: string
}

function getTag(xml: string, tag: string): string {
  const r1 = new RegExp(`<${tag}(?:\\s[^>]*)?><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i')
  const m1 = xml.match(r1)
  if (m1) return m1[1].trim()

  const r2 = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i')
  const m2 = xml.match(r2)
  if (m2) return m2[1].trim()

  return ''
}

function getAttr(fragment: string, attr: string): string {
  const re = new RegExp(`\\b${attr}="([^"]*)"`, 'i')
  const m = fragment.match(re)
  return m ? m[1] : ''
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export async function fetchRSSFeed(url: string): Promise<RSSItem[]> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 IMS-RSS-Reader/1.0' },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} khi tải ${url}`)

  const xml = await res.text()
  const itemRegex = /<item[\s>][\s\S]*?<\/item>/gi
  const items: RSSItem[] = []
  let match: RegExpExecArray | null = null

  while ((match = itemRegex.exec(xml)) !== null) {
    const chunk = match[0]

    const title = getTag(chunk, 'title')
    if (!title) continue

    /* link */
    let link = ''
    const linkTag = chunk.match(/<link>([^<]+)<\/link>/i)
    if (linkTag) link = linkTag[1].trim()
    if (!link) {
      const guidPerma = chunk.match(/<guid[^>]*isPermaLink="true"[^>]*>([^<]+)<\/guid>/i)
      if (guidPerma) link = guidPerma[1].trim()
    }
    if (!link) {
      const guidAny = chunk.match(/<guid[^>]*>([^<]+)<\/guid>/i)
      if (guidAny && guidAny[1].trim().startsWith('http')) link = guidAny[1].trim()
    }
    if (!link) continue

    /* description → sapo */
    const rawDesc = getTag(chunk, 'description')
    const description = stripHtml(rawDesc).slice(0, 600)

    /* full content */
    const content = getTag(chunk, 'content:encoded') || rawDesc

    /* date */
    const pubDate = getTag(chunk, 'pubDate') || getTag(chunk, 'dc:date') || getTag(chunk, 'updated') || ''

    /* image */
    let imageUrl = ''
    const encEl = chunk.match(/<enclosure([^>]*)>/i)
    if (encEl) {
      const encType = getAttr(encEl[1], 'type')
      if (!encType || encType.startsWith('image')) imageUrl = getAttr(encEl[1], 'url')
    }
    if (!imageUrl) {
      const mediaEl = chunk.match(/<media:(?:content|thumbnail)([^>]*)>/i)
      if (mediaEl) imageUrl = getAttr(mediaEl[1], 'url')
    }
    if (!imageUrl) {
      const imgInDesc = rawDesc.match(/<img[^>]*\bsrc="([^"]+)"/i)
      if (imgInDesc) imageUrl = imgInDesc[1]
    }

    items.push({ title, link, description, content, pubDate, imageUrl })
  }

  return items
}
