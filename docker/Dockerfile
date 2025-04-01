FROM node:20
WORKDIR /app
COPY lda-front/package*.json ./
RUN npm install
COPY lda-front/ .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]