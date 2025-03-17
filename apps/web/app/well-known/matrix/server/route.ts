import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    'm.server': 'talk.kalkulacka.one:443',
  });
}
