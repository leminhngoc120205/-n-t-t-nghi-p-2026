import { NextResponse } from 'next/server'

const COUNTS: Record<string, number> = {
  waiting_edit:    3,
  waiting_publish: 1,
  processing:      0,
  published:       1732,
  deleted:         24,
  removed:         40,
}

export async function GET() {
  return NextResponse.json({ counts: COUNTS })
}
