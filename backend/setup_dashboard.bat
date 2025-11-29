@echo off
echo Installing multer dependency...
npm install multer@^1.4.5-lts.1

echo Running database migrations...
npx knex migrate:latest --env development

echo Creating upload directories...
if not exist "uploads" mkdir uploads
if not exist "uploads\documents" mkdir uploads\documents
if not exist "uploads\receipts" mkdir uploads\receipts

echo Setup complete! You can now start the server with: npm start
pause