# Node.js 최신 버전으로 설정
FROM node:18

# 작업 디렉토리 생성 및 설정
WORKDIR /app

# 패키지 매니저 캐시를 줄이기 위해 package.json과 package-lock.json만 복사
COPY package.json package-lock.json ./

# 의존성 설치
RUN npm install

# 전체 소스 코드 복사
COPY . .

# 개발 서버 시작
CMD ["npm", "run", "dev"]


# FROM node:18-alpine as builder
# WORKDIR /app
#
# COPY package.json package-lock.json ./
# RUN npm ci
# COPY . .
# RUN npm run build
#
# FROM node:18-alpine as runner
# WORKDIR /app
# COPY --from=builder /app/package.json .
# COPY --from=builder /app/package-lock.json .
# COPY --from=builder /app/next.config.mjs ./
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next ./
# EXPOSE 3000
# ENTRYPOINT ["npm","run", "start"]
