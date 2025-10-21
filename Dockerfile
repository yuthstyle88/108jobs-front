# .github/workflows/docker-next.yml
name: Build & Push Next.js to GHCR

on:
  push:
    branches: [ "prod", "dev" ]
  workflow_dispatch: {}

permissions:
  contents: read
  packages: write

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    env:
      IMAGE: ghcr.io/yuthstyle88/108jobs-front
      BRANCH: ${{ github.ref_name }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      # ---------- PREBUILD: ให้เห็น error ชัดๆ ----------
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install deps
        run: npm ci

      - name: Next.js build (show real errors)
        env:
          # ใส่ env ที่ Next ต้องใช้ตอน build-time ที่นี่ให้ครบ
          NEXT_TELEMETRY_DISABLED: "1"
          NEXT_PUBLIC_API_BASE: "https://api-staging.108jobs.com"  # <-- แก้ให้ตรงโปรเจกต์
          # เพิ่มตัวอื่นๆ ตามที่แอปใช้ เช่น NEXT_PUBLIC_xxx
        run: |
          set -eux
          npm run build

      # (ถ้าถึงตรงนี้ แปลว่าบิลด์ผ่าน จึงค่อยทำ Docker)
      - name: Compute short SHA
        run: echo "SHA_SHORT=${GITHUB_SHA::7}" >> $GITHUB_ENV

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      - name: Set up Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GHCR_TOKEN }}  # PAT ที่มี write:packages

      - name: Build & Push (Docker)
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: |
            ${{ env.IMAGE }}:${{ env.BRANCH }}
            ${{ env.IMAGE }}:${{ env.BRANCH }}-${{ env.SHA_SHORT }}
          build-args: |
            NEXT_PUBLIC_API_BASE=https://api-staging.108jobs.com
          cache-from: type=gha
          cache-to: type=gha,mode=max