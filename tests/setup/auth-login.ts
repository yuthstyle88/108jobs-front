import { request } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const credentials = {
   email: "giang.cat.luongg@gmail.com",
  password: "giang4520022",
};

(async () => {
  const context = await request.newContext();

  const res = await context.post(`${BASE_URL}/api/auth/callback/credentials`, {
    form: credentials,
  });

  if (!res.ok()) {
    console.error('❌ Login failed:', res.status());
    console.error(await res.text());
    process.exit(1);
  }

  // Lấy accessToken từ JWT
  const body = await res.text();
  const jwtMatch = body.match(/"accessToken"\s*:\s*"([^"]+)"/);

  if (!jwtMatch) {
    console.error('❌ Không tìm thấy accessToken trong phản hồi!');
    process.exit(1);
  }

  const accessToken = jwtMatch[1];
  console.log('✅ AccessToken:', accessToken.slice(0, 20) + '...');

  const sessionStorage = {
    cookies: [],
    origins: [
      {
        origin: BASE_URL,
        localStorage: [
          {
            name: 'nextauth.token',
            value: JSON.stringify({
              accessToken,
              email: credentials.email,
              roles: ['freelancer'], // hoặc ['employer']
              exp: Math.floor(Date.now() / 1000) + 3600,
            }),
          },
        ],
      },
    ],
  };

  const dir = path.resolve('storage');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  fs.writeFileSync(path.join(dir, 'auth.json'), JSON.stringify(sessionStorage, null, 2));
  console.log('✅ Session đã lưu vào storage/auth.json');
})();
