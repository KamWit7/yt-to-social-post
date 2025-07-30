#!/usr/bin/env node

// Configuration
const API_BASE_URL = 'http://localhost:3001'
const DEFAULT_RUNS = 5

// URLs for testing
const TEST_URLS = [
  'https://www.youtube.com/watch?v=dh6BCSzaF6g&ab_channel=ThePrimeTime', // with transcript
  'https://www.youtube.com/watch?v=GhVVi2R-K5k&ab_channel=Przeprogramowani', // without transcript
]

class TranscriptTester {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl
    this.results = []
  }

  async testTranscriptEndpoint(url, runNumber) {
    const startTime = Date.now()

    try {
      console.log(`\n🚀 Run ${runNumber}: Testing ${url}`)

      const response = await fetch(
        `${this.baseUrl}/api/transcript?url=${encodeURIComponent(url)}`
      )
      const endTime = Date.now()
      const duration = endTime - startTime

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Check if response has correct structure
      if (!data.success) {
        return {
          runNumber,
          url,
          success: false,
          error: data.error || 'Unknown error',
          duration,
          hasDescription: false,
        }
      }

      // Check if description was returned
      const hasDescription = this.validateDescription(data.description)
      const hasTitle = this.validateTitle(data.title)
      const hasTranscript = this.validateTranscript(data.transcript)

      const result = {
        runNumber,
        url,
        success: true,
        hasDescription,
        hasTitle,
        hasTranscript,
        description: data.description?.substring(0, 100) + '...' || 'MISSING',
        title: data.title?.substring(0, 50) + '...' || 'MISSING',
        transcript: data.transcript?.substring(0, 100) + '...' || 'MISSING',
        duration,
      }

      this.logResult(result)
      return result
    } catch (error) {
      const endTime = Date.now()
      const duration = endTime - startTime

      const result = {
        runNumber,
        url,
        success: false,
        error: error.message,
        duration,
        hasDescription: false,
        hasTitle: false,
        hasTranscript: false,
      }

      this.logResult(result)
      return result
    }
  }

  validateDescription(description) {
    if (!description) return false
    if (typeof description !== 'string') return false
    if (description.includes('DESCRIPTION_NOT_FOUND')) return false
    if (description.includes('ERROR')) return false
    if (description.trim().length === 0) return false
    return true
  }

  validateTitle(title) {
    if (!title) return false
    if (typeof title !== 'string') return false
    if (title.includes('TITLE_NOT_FOUND')) return false
    if (title.includes('ERROR')) return false
    if (title.trim().length === 0) return false
    return true
  }

  validateTranscript(transcript) {
    if (!transcript) return false
    if (typeof transcript !== 'string') return false
    if (transcript.includes('TRANSCRIPT_NOT_FOUND')) return false
    if (transcript.includes('TRANSCRIPT_NOT_AVAILABLE')) return false
    if (transcript.includes('ERROR')) return false
    if (transcript.trim().length === 0) return false
    return true
  }

  logResult(result) {
    const icon = result.success ? '✅' : '❌'
    const descIcon = result.hasDescription ? '📝' : '❌'
    const titleIcon = result.hasTitle ? '📄' : '❌'
    const transcriptIcon = result.hasTranscript ? '📜' : '❌'

    console.log(`${icon} Run ${result.runNumber}:`)
    console.log(
      `   Title: ${titleIcon} ${result.hasTitle ? 'FOUND' : 'MISSING'}`
    )
    console.log(
      `   Description: ${descIcon} ${
        result.hasDescription ? 'FOUND' : 'MISSING'
      }`
    )
    console.log(
      `   Transcript: ${transcriptIcon} ${
        result.hasTranscript ? 'AVAILABLE' : 'UNAVAILABLE'
      }`
    )
    if (result.success) {
      console.log(`   Title: ${result.title}`)
      console.log(`   Description: ${result.description}`)
      console.log(`   Transcript: ${result.transcript}`)
    } else {
      console.log(`   Error: ${result.error}`)
    }
    console.log(`   Time: ${result.duration}ms`)
  }

  async runTests(urls, numberOfRuns) {
    console.log(
      `🎯 Starting ${numberOfRuns} tests for /api/transcript endpoint`
    )
    console.log(`🌐 API URL: ${this.baseUrl}`)
    console.log(`📋 Test URLs: ${urls.length}`)

    let totalTests = 0
    let successfulTests = 0
    let testsWithDescription = 0
    let testsWithTitle = 0
    let testsWithTranscript = 0

    for (let i = 1; i <= numberOfRuns; i++) {
      for (const url of urls) {
        const result = await this.testTranscriptEndpoint(url, i)
        this.results.push(result)

        totalTests++
        if (result.success) successfulTests++
        if (result.hasDescription) testsWithDescription++
        if (result.hasTitle) testsWithTitle++
        if (result.hasTranscript) testsWithTranscript++

        // Short pause between requests
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    this.printSummary(
      totalTests,
      successfulTests,
      testsWithDescription,
      testsWithTitle,
      testsWithTranscript
    )

    // Return results for potential programmatic use
    return {
      totalTests,
      successfulTests,
      testsWithDescription,
      testsWithTitle,
      testsWithTranscript,
      successRate: (successfulTests / totalTests) * 100,
      descriptionRate: (testsWithDescription / totalTests) * 100,
      titleRate: (testsWithTitle / totalTests) * 100,
      transcriptRate: (testsWithTranscript / totalTests) * 100,
      results: this.results,
    }
  }

  printSummary(total, successful, withDescription, withTitle, withTranscript) {
    console.log('\n' + '='.repeat(50))
    console.log('📊 TEST SUMMARY')
    console.log('='.repeat(50))
    console.log(`📈 Total tests: ${total}`)
    console.log(
      `✅ Successful tests: ${successful} (${(
        (successful / total) *
        100
      ).toFixed(1)}%)`
    )
    console.log(
      `📄 Tests with title: ${withTitle} (${((withTitle / total) * 100).toFixed(
        1
      )}%)`
    )
    console.log(
      `📝 Tests with description: ${withDescription} (${(
        (withDescription / total) *
        100
      ).toFixed(1)}%)`
    )
    console.log(
      `📜 Tests with transcript: ${withTranscript} (${(
        (withTranscript / total) *
        100
      ).toFixed(1)}%)`
    )
    console.log(
      `❌ Failed tests: ${total - successful} (${(
        ((total - successful) / total) *
        100
      ).toFixed(1)}%)`
    )

    // Average response time
    const avgTime =
      this.results.reduce((sum, r) => sum + r.duration, 0) / this.results.length
    console.log(`⏱️  Average response time: ${avgTime.toFixed(0)}ms`)

    // Group results by URL
    console.log('\n📋 RESULTS BY URL:')
    const urlGroups = {}
    this.results.forEach((result) => {
      if (!urlGroups[result.url]) {
        urlGroups[result.url] = {
          total: 0,
          withDescription: 0,
          withTitle: 0,
          withTranscript: 0,
          successful: 0,
        }
      }
      urlGroups[result.url].total++
      if (result.success) urlGroups[result.url].successful++
      if (result.hasDescription) urlGroups[result.url].withDescription++
      if (result.hasTitle) urlGroups[result.url].withTitle++
      if (result.hasTranscript) urlGroups[result.url].withTranscript++
    })

    Object.entries(urlGroups).forEach(([url, stats]) => {
      console.log(`\n🔗 ${url}`)
      console.log(
        `   Successful: ${stats.successful}/${stats.total} (${(
          (stats.successful / stats.total) *
          100
        ).toFixed(1)}%)`
      )
      console.log(
        `   With title: ${stats.withTitle}/${stats.total} (${(
          (stats.withTitle / stats.total) *
          100
        ).toFixed(1)}%)`
      )
      console.log(
        `   With description: ${stats.withDescription}/${stats.total} (${(
          (stats.withDescription / stats.total) *
          100
        ).toFixed(1)}%)`
      )
      console.log(
        `   With transcript: ${stats.withTranscript}/${stats.total} (${(
          (stats.withTranscript / stats.total) *
          100
        ).toFixed(1)}%)`
      )
    })
  }

  // Method to check if API is available
  async checkApiHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`)
      return response.ok
    } catch {
      return false
    }
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2)
  let numberOfRuns = DEFAULT_RUNS
  let customUrl = null
  let baseUrl = API_BASE_URL

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--runs' || args[i] === '-r') {
      numberOfRuns = parseInt(args[i + 1]) || DEFAULT_RUNS
      i++ // skip next argument
    } else if (args[i] === '--url' || args[i] === '-u') {
      customUrl = args[i + 1]
      i++ // skip next argument
    } else if (args[i] === '--api-url' || args[i] === '-a') {
      baseUrl = args[i + 1]
      i++ // skip next argument
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
🧪 Transcript API Load Tester

Usage:
  node transcript-tester.js [options]

Options:
  -r, --runs <number>     Number of runs for each URL (default: ${DEFAULT_RUNS})
  -u, --url <url>         Test specific URL instead of defaults
  -a, --api-url <url>     Backend URL (default: ${API_BASE_URL})
  -h, --help              Show this help

Examples:
  node transcript-tester.js                          # ${DEFAULT_RUNS} tests for each default URL
  node transcript-tester.js --runs 10                # 10 tests for each default URL
  node transcript-tester.js --url "https://youtube.com/watch?v=abc123" --runs 3
  node transcript-tester.js --api-url "http://localhost:4000" --runs 5
      `)
      return
    }
  }

  const testUrls = customUrl ? [customUrl] : TEST_URLS

  console.log('🧪 TRANSCRIPT API LOAD TESTER')
  console.log('='.repeat(30))

  const tester = new TranscriptTester(baseUrl)

  // Check if API is available
  console.log(`🔍 Checking API availability at ${baseUrl}...`)
  const isHealthy = await tester.checkApiHealth()

  if (!isHealthy) {
    console.error(`❌ API is not available at ${baseUrl}`)
    console.error(
      '💡 Check if backend is running: npm run dev (in backend/ directory)'
    )
    process.exit(1)
  }

  console.log('✅ API is available')

  const results = await tester.runTests(testUrls, numberOfRuns)

  // Exit code based on results
  if (results.successRate < 80) {
    console.log('\n⚠️  Less than 80% of tests succeeded')
    process.exit(1)
  }

  console.log('\n🎉 Tests completed successfully!')
}

// Run script
if (require.main === module) {
  main().catch((error) => {
    console.error('💥 Error during test execution:', error.message)
    process.exit(1)
  })
}

module.exports = TranscriptTester
