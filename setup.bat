@echo off
echo 🚀 Setting up DhronaVaradhi for production...

REM Copy environment file
if not exist .env.local (
    echo 📝 Creating environment file...
    copy .env.example .env.local
    echo ⚠️  Please update .env.local with your actual credentials
) else (
    echo ✅ Environment file already exists
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the project
echo 🔨 Building the project...
npm run build

echo 🎉 Setup complete!
echo.
echo 📋 Next steps:
echo 1. Update .env.local with your API keys and credentials
echo 2. Configure MongoDB connection string
echo 3. Set up SMTP for email notifications
echo 4. Add external API keys for enhanced job fetching
echo.
echo 🏃‍♂️ To start development:
echo npm run dev
echo.
echo 🌐 To deploy:
echo 1. Push to GitHub
echo 2. Connect to Vercel
echo 3. Add environment variables in Vercel dashboard
echo 4. Deploy!

pause
