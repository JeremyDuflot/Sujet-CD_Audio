FROM node:lts
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY server.js ./
COPY Routes ./Routes
COPY Controllers ./Controllers
COPY configs ./configs
RUN chown -R node:node /app
USER node
EXPOSE 5000
CMD ["node", "server.js"]