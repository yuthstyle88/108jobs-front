import { test, expect } from '@playwright/test';

const CHAT_URL = '/chat/message/697f5642-a6d6-473b-b409-f5e418c02f78'; // 📝 thay ID nếu cần

test.describe('Chat real-time', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CHAT_URL);

    // Chụp hình debug nếu cần xem trạng thái
    await page.screenshot({ path: 'debug-chat-entry.png' });

    // Kiểm tra xem có bị redirect về sign-in không
    const currentUrl = page.url();
    if (currentUrl.includes('/sign-in')) {
      throw new Error('❌ Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.');
    }

    // Kiểm tra xem form chat có hiển thị không
    const formVisible = await page.getByTestId('chat-form').isVisible();
    if (!formVisible) {
      throw new Error('❌ Không hiển thị form chat. Có thể useSession() trả về null.');
    }
  });

  test('Render chat UI', async ({ page }) => {
    await expect(page.getByTestId('chat-form')).toBeVisible();
    await expect(page.getByTestId('chat-input')).toBeVisible();
  });

  test('Send message', async ({ page }) => {
    const input = page.getByTestId('chat-input');
    const message = `Test message ${Date.now()}`;

    await input.fill(message);
    await page.keyboard.press('Enter');

    const lastMessage = page.getByTestId('chat-message').last();
    await expect(lastMessage).toContainText(message);
  });

  test('Auto scroll when receive message', async ({ page }) => {
    await page.evaluate(() => {
      const el = document.querySelector('[data-testid="chat-list"]');
      if (el) el.scrollTop = 0;
    });

    const input = page.getByTestId('chat-input');
    const msg = `Scroll test ${Date.now()}`;
    await input.fill(msg);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    const isAtBottom = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="chat-list"]');
      if (!el) return false;
      return Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 5;
    });

    expect(isAtBottom).toBe(true);
  });
});
