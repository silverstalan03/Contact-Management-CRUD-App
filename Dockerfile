FROM nginx
COPY frontend/build /usr/share/nginx/html
COPY backend/build /usr/share/nginx/html