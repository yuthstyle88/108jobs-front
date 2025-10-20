# ---------- Build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

# ป้องกัน npm ci ช้า: copy package files แยกเลเยอร์
COPY package.json package-lock.json* ./
RUN npm ci

# copy ซอร์สทั้งหมดแล้ว build
COPY . .
# ถ้ามี env ฝั่ง public ให้ตั้งผ่าน ARG/ENV ตอน build ได้
# ARG NEXT_PUBLIC_API_BASE
# ENV NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE}

RUN npm run build

# ---------- Runtime stage ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# ใช้ Next.js output แบบ .next/standalone (เร็ว เบา)
# ถ้าโปรเจกต์คุณไม่ได้ตั้ง output=standalone ให้ใช้วิธี copy node_modules + .next แทน
# — เลือก "อย่างใดอย่างหนึ่ง" ระหว่าง A หรือ B —

# (A) ถ้าใช้ output: 'standalone'
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static
# COPY --from=builder /app/public ./public

# (B) ถ้าไม่ได้ใช้ standalone (เวิร์กแน่นอน)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Healthcheck ง่าย ๆ
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["npm", "run", "start"]