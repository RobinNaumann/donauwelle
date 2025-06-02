FROM --platform=linux/amd64 oven/bun:latest

RUN mkdir /app
WORKDIR /app

# Step 2: Copy application code into Docker image
COPY ./dist/ ./

EXPOSE 80
ENTRYPOINT ["bun", "./server/app.server.js"]