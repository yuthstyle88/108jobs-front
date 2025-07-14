import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Đăng nhập bằng UI và lưu session', async ({ page, context }) => {
  await page.goto('/sign-in');

  await page.getByLabel('อีเมล').fill('giang.cat.luongg@gmail.com');
  await page.getByLabel('รหัสผ่าน').fill('giang4520022');

  await page.getByRole('button', { name: /ดำเนินการต่อ/i }).click();

  await page.waitForURL('**/chat/message/**', { timeout: 10000 });

  expect(page.url()).toContain('/chat/message/');

  const storage = await context.storageState();
  const dir = path.resolve('storage');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'auth.json'), JSON.stringify(storage, null, 2));
  console.log('✅ Session đã lưu vào storage/auth.json');
});
