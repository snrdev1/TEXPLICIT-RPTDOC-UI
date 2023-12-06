FROM node:18-alpine3.18 as build-stage
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY nginx.conf .

RUN npm install --force
RUN npm install -g @angular/cli

COPY . .

RUN ng build --configuration production --aot --base-href /

FROM nginx:alpine
COPY --from=build-stage /usr/src/app/dist/texplicit2/ ./usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
