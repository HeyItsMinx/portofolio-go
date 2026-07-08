FROM node:22-alpine
WORKDIR /app
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
COPY package.json package-lock.json ./
RUN rm -f package-lock.json && npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]