# ��️ Backend Scripts

Helper tools for testing and debugging the API.

## 📁 Contents

### `transcript-tester.js`

Script for load testing the `/api/transcript` endpoint - checks if `title`, `description`, and `transcript` are properly returned.

#### 🚀 Quick usage:

```bash
# In backend/ directory
npm run test:load         # 5 tests for each default URL
npm run test:load:heavy   # 10 tests for each default URL
```

#### 📖 Direct usage:

```bash
# Basic tests
node scripts/transcript-tester.js

# More tests
node scripts/transcript-tester.js --runs 10

# Test specific URL
node scripts/transcript-tester.js --url "https://youtube.com/watch?v=abc123" --runs 3

# Different backend URL
node scripts/transcript-tester.js --api-url "http://localhost:4000"

# Help
node scripts/transcript-tester.js --help
```

#### 📊 What it checks:

- ✅ **API Health** - if backend is available
- 📄 **Title** - if it was properly extracted
- 📝 **Description** - if it was properly extracted
- 📜 **Transcript** - if it's available
- ⏱️ **Performance** - response times
- 📈 **Success Rate** - success statistics

#### 🎯 Example output:

```
🧪 TRANSCRIPT API LOAD TESTER
==============================
✅ API is available
📊 TEST SUMMARY
📈 Total tests: 10
✅ Successful tests: 10 (100.0%)
📄 Tests with title: 8 (80.0%)
📝 Tests with description: 4 (40.0%)
📜 Tests with transcript: 10 (100.0%)
⏱️  Average response time: 4002ms
```

#### 🚨 Troubleshooting:

**`❌ API is not available`**

- Check if backend is running: `npm run dev`
- Check port (default: 3001)

**`Long response times (>10s)`**

- Normal for web scraping
- Check internet connection

**`Low description rate (< 50%)`**

- Problem with YouTube UI changes
- Check if URLs are current
- Debug puppeteer script

## 🔧 Requirements

- Node.js 18+ (for built-in `fetch`)
- Backend API running on `localhost:3001`
