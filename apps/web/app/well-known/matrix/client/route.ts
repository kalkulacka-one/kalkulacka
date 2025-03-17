import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    'm.homeserver': { base_url: 'https://talk.kalkulacka.one' },
    'org.matrix.msc3575.proxy': { url: 'https://talk.kalkulacka.one' },
    'org.matrix.msc2965.authentication': { issuer: 'https://auth.talk.kalkulacka.one/', account: 'https://auth.talk.kalkulacka.one/account' },
  });
}
