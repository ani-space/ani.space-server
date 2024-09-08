FROM node:21

WORKDIR /app

# Copy all needed files
COPY . .

# Install dependencies
RUN yarn install --frozen-lockfile

EXPOSE 3000

CMD ["yarn", "dev"]