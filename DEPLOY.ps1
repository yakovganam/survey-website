# Automated Render.com & MongoDB Atlas Deployment
# Israeli 2026 Elections Survey
# For Windows PowerShell

Write-Host "🚀 Israeli 2026 Elections Survey - Deployment Guide" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$GITHUB_USER = "yakovganam"
$REPO_NAME = "israeli-2026-elections-survey"
$GITHUB_REPO_URL = "https://github.com/$GITHUB_USER/$REPO_NAME"
$RENDER_APP_NAME = "israeli-2026-elections"

Write-Host "📋 Pre-flight Checks" -ForegroundColor Yellow
Write-Host "  ✅ GitHub Repository: $GITHUB_REPO_URL" -ForegroundColor Green
Write-Host "  ✅ Code Branch: master" -ForegroundColor Green
Write-Host "  ✅ Render App Name: $RENDER_APP_NAME" -ForegroundColor Green
Write-Host ""

Write-Host "⚠️  MANUAL DEPLOYMENT STEPS" -ForegroundColor Yellow
Write-Host ""

Write-Host "1️⃣  SET UP MONGODB ATLAS (FREE TIER)" -ForegroundColor Cyan
Write-Host "   A. Go to https://www.mongodb.com/cloud/atlas" -ForegroundColor White
Write-Host "   B. Sign up or log in" -ForegroundColor White
Write-Host "   C. Create new project: 'Israeli Elections Survey'" -ForegroundColor White
Write-Host "   D. Create free cluster (M0):" -ForegroundColor White
Write-Host "      - Cluster name: cluster0" -ForegroundColor Gray
Write-Host "      - Select region: Choose one close to you" -ForegroundColor Gray
Write-Host "   E. Go to 'Database Access' tab:" -ForegroundColor White
Write-Host "      - Click 'Add Database User'" -ForegroundColor Gray
Write-Host "      - Username: survey_user" -ForegroundColor Gray
Write-Host "      - Password: (generate strong password, save it)" -ForegroundColor Gray
Write-Host "      - Role: Atlas Admin" -ForegroundColor Gray
Write-Host "   F. Go to 'Network Access' tab:" -ForegroundColor White
Write-Host "      - Click 'Add IP Address'" -ForegroundColor Gray
Write-Host "      - IP: 0.0.0.0/0" -ForegroundColor Gray
Write-Host "   G. Go to 'Clusters' → Click 'Connect'" -ForegroundColor White
Write-Host "      - Choose 'Connect your application'" -ForegroundColor Gray
Write-Host "      - Select Node.js driver" -ForegroundColor Gray
Write-Host "      - Copy connection string" -ForegroundColor Gray
Write-Host ""
Write-Host "   📌 SAVE THIS STRING:" -ForegroundColor Yellow
Write-Host "   mongodb+srv://survey_user:PASSWORD@cluster0.mongodb.net/surveydb?retryWrites=true&w=majority" -ForegroundColor Magenta
Write-Host "   (Replace PASSWORD with your actual password)" -ForegroundColor Magenta
Write-Host ""

Write-Host "2️⃣  CREATE RENDER WEB SERVICE" -ForegroundColor Cyan
Write-Host "   A. Go to https://render.com" -ForegroundColor White
Write-Host "   B. Sign up or log in (GitHub login recommended)" -ForegroundColor White
Write-Host "   C. Click 'New +' → 'Web Service'" -ForegroundColor White
Write-Host "   D. Select GitHub repository:" -ForegroundColor White
Write-Host "      - Repo: $GITHUB_REPO_URL" -ForegroundColor Gray
Write-Host "      - Branch: master" -ForegroundColor Gray
Write-Host "   E. Configure web service:" -ForegroundColor White
Write-Host "      - Name: $RENDER_APP_NAME" -ForegroundColor Gray
Write-Host "      - Environment: Node" -ForegroundColor Gray
Write-Host "      - Region: Auto or your preference" -ForegroundColor Gray
Write-Host "      - Build Command: npm install" -ForegroundColor Gray
Write-Host "      - Start Command: npm start" -ForegroundColor Gray
Write-Host "      - Plan: Free" -ForegroundColor Gray
Write-Host ""

Write-Host "3️⃣  SET ENVIRONMENT VARIABLES" -ForegroundColor Cyan
Write-Host "   In Render Dashboard → Your Service → Environment:" -ForegroundColor White
Write-Host "   Add these three variables:" -ForegroundColor White
Write-Host ""
Write-Host "   Variable 1:" -ForegroundColor White
Write-Host "   Key: NODE_ENV" -ForegroundColor Gray
Write-Host "   Value: production" -ForegroundColor Gray
Write-Host ""
Write-Host "   Variable 2:" -ForegroundColor White
Write-Host "   Key: PORT" -ForegroundColor Gray
Write-Host "   Value: 3000" -ForegroundColor Gray
Write-Host ""
Write-Host "   Variable 3:" -ForegroundColor White
Write-Host "   Key: MONGODB_URI" -ForegroundColor Gray
Write-Host "   Value: mongodb+srv://survey_user:YOUR_PASSWORD@cluster0.mongodb.net/surveydb?retryWrites=true&w=majority" -ForegroundColor Magenta
Write-Host ""

Write-Host "4️⃣  DEPLOY" -ForegroundColor Cyan
Write-Host "   A. Click 'Create Web Service' button" -ForegroundColor White
Write-Host "   B. Wait for build to complete (typically 3-5 minutes)" -ForegroundColor White
Write-Host "   C. Your live URL will be:" -ForegroundColor White
Write-Host "      https://$RENDER_APP_NAME.onrender.com" -ForegroundColor Magenta
Write-Host ""

Write-Host "5️⃣  TEST & VERIFY" -ForegroundColor Cyan
Write-Host "   A. Health Check Endpoint:" -ForegroundColor White
Write-Host "      https://$RENDER_APP_NAME.onrender.com/api/health" -ForegroundColor Gray
Write-Host "      (Should show: 'status': 'ok')" -ForegroundColor Gray
Write-Host ""
Write-Host "   B. Survey Page:" -ForegroundColor White
Write-Host "      https://$RENDER_APP_NAME.onrender.com/" -ForegroundColor Gray
Write-Host "      (Should show voting interface)" -ForegroundColor Gray
Write-Host ""
Write-Host "   C. Functional Tests:" -ForegroundColor White
Write-Host "      ✓ Can select a political party" -ForegroundColor Gray
Write-Host "      ✓ Can submit vote" -ForegroundColor Gray
Write-Host "      ✓ Results page displays correctly" -ForegroundColor Gray
Write-Host "      ✓ Hebrew text renders properly" -ForegroundColor Gray
Write-Host "      ✓ Cannot vote twice in 24 hours" -ForegroundColor Gray
Write-Host ""

Write-Host "✅ DEPLOYMENT VERIFICATION CHECKLIST" -ForegroundColor Green
Write-Host "   [ ] MongoDB Atlas cluster running" -ForegroundColor White
Write-Host "   [ ] Database user created (survey_user)" -ForegroundColor White
Write-Host "   [ ] Connection string saved and verified" -ForegroundColor White
Write-Host "   [ ] Network access configured (0.0.0.0/0)" -ForegroundColor White
Write-Host "   [ ] Render.com account created" -ForegroundColor White
Write-Host "   [ ] GitHub repo connected to Render" -ForegroundColor White
Write-Host "   [ ] Environment variables set correctly" -ForegroundColor White
Write-Host "   [ ] Web service created and deployed" -ForegroundColor White
Write-Host "   [ ] Build completed successfully" -ForegroundColor White
Write-Host "   [ ] Homepage loads without errors" -ForegroundColor White
Write-Host "   [ ] Can vote for a party" -ForegroundColor White
Write-Host "   [ ] Results display votes" -ForegroundColor White
Write-Host "   [ ] Vote cooldown prevents duplicate votes" -ForegroundColor White
Write-Host ""

Write-Host "🔗 IMPORTANT LINKS" -ForegroundColor Yellow
Write-Host "   GitHub Repository: $GITHUB_REPO_URL" -ForegroundColor Cyan
Write-Host "   Live Survey URL: https://$RENDER_APP_NAME.onrender.com" -ForegroundColor Cyan
Write-Host "   Render Dashboard: https://dashboard.render.com" -ForegroundColor Cyan
Write-Host "   MongoDB Atlas: https://cloud.mongodb.com" -ForegroundColor Cyan
Write-Host ""

Write-Host "🛠️  TROUBLESHOOTING" -ForegroundColor Yellow
Write-Host ""
Write-Host "Problem: Build fails on Render" -ForegroundColor Red
Write-Host "Solution: Check build logs for errors, verify package.json exists" -ForegroundColor Green
Write-Host ""
Write-Host "Problem: MongoDB connection error" -ForegroundColor Red
Write-Host "Solution:" -ForegroundColor Green
Write-Host "  1. Verify MONGODB_URI env variable syntax" -ForegroundColor Gray
Write-Host "  2. Confirm username/password are correct" -ForegroundColor Gray
Write-Host "  3. Check MongoDB cluster is deployed" -ForegroundColor Gray
Write-Host "  4. Ensure network access allows 0.0.0.0/0" -ForegroundColor Gray
Write-Host ""
Write-Host "Problem: Voting functionality doesn't work" -ForegroundColor Red
Write-Host "Solution:" -ForegroundColor Green
Write-Host "  1. Check /api/health endpoint" -ForegroundColor Gray
Write-Host "  2. Verify MongoDB is connected" -ForegroundColor Gray
Write-Host "  3. Check Render service logs for errors" -ForegroundColor Gray
Write-Host ""
Write-Host "Problem: Free tier spins down after 15 min inactivity" -ForegroundColor Red
Write-Host "Solution: This is normal - service wakes up in ~1 min when accessed" -ForegroundColor Green
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✅ READY FOR PRODUCTION DEPLOYMENT" -ForegroundColor Green
Write-Host "Created: 2026-01-30" -ForegroundColor Gray
Write-Host "================================================" -ForegroundColor Cyan
