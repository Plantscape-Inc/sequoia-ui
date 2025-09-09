npm run build --mode production
docker build -t sequoia-ui .
docker run -p 3000:3000 -t sequoia-ui
