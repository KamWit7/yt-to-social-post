#!/usr/bin/env node

// Konfiguracja
const API_BASE_URL = 'http://localhost:3001'
const DEFAULT_RUNS = 5

// URL-e do testowania
const TEST_URLS = [
  'https://www.youtube.com/watch?v=dh6BCSzaF6g&ab_channel=ThePrimeTime', // z transkryptem
  'https://www.youtube.com/watch?v=GhVVi2R-K5k&ab_channel=Przeprogramowani', // bez transkryptu
]

class TranscriptTester {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl
    this.results = []
  }

  async testTranscriptEndpoint(url, runNumber) {
    const startTime = Date.now()

    try {
      console.log(`\n🚀 Próba ${runNumber}: Testowanie ${url}`)

      const response = await fetch(
        `${this.baseUrl}/api/transcript?url=${encodeURIComponent(url)}`
      )
      const endTime = Date.now()
      const duration = endTime - startTime

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Sprawdzenie czy response ma poprawną strukturę
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

      // Sprawdzenie czy description została zwrócona
      const hasDescription = this.validateDescription(data.data?.description)

      const result = {
        runNumber,
        url,
        success: true,
        hasDescription,
        description:
          data.data?.description?.substring(0, 100) + '...' || 'BRAK',
        title: data.data?.title?.substring(0, 50) + '...' || 'BRAK',
        hasTranscript: this.validateTranscript(data.data?.transcript),
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

    console.log(`${icon} Próba ${result.runNumber}:`)
    console.log(
      `   Description: ${descIcon} ${
        result.hasDescription ? 'ZNALEZIONA' : 'BRAK'
      }`
    )
    if (result.success) {
      console.log(`   Title: ${result.title}`)
      console.log(`   Description: ${result.description}`)
      console.log(
        `   Transcript: ${result.hasTranscript ? 'Dostępny' : 'Niedostępny'}`
      )
    } else {
      console.log(`   Error: ${result.error}`)
    }
    console.log(`   Czas: ${result.duration}ms`)
  }

  async runTests(urls, numberOfRuns) {
    console.log(
      `🎯 Rozpoczynanie ${numberOfRuns} testów endpointu /api/transcript`
    )
    console.log(`🌐 API URL: ${this.baseUrl}`)
    console.log(`📋 Testowane URL-e: ${urls.length}`)

    let totalTests = 0
    let successfulTests = 0
    let testsWithDescription = 0

    for (let i = 1; i <= numberOfRuns; i++) {
      for (const url of urls) {
        const result = await this.testTranscriptEndpoint(url, i)
        this.results.push(result)

        totalTests++
        if (result.success) successfulTests++
        if (result.hasDescription) testsWithDescription++

        // Krótka pauza między requestami
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    this.printSummary(totalTests, successfulTests, testsWithDescription)

    // Zwróć wyniki dla potencjalnego użycia programowego
    return {
      totalTests,
      successfulTests,
      testsWithDescription,
      successRate: (successfulTests / totalTests) * 100,
      descriptionRate: (testsWithDescription / totalTests) * 100,
      results: this.results,
    }
  }

  printSummary(total, successful, withDescription) {
    console.log('\n' + '='.repeat(50))
    console.log('📊 PODSUMOWANIE TESTÓW')
    console.log('='.repeat(50))
    console.log(`📈 Łączna liczba testów: ${total}`)
    console.log(
      `✅ Udane testy: ${successful} (${((successful / total) * 100).toFixed(
        1
      )}%)`
    )
    console.log(
      `📝 Testy z description: ${withDescription} (${(
        (withDescription / total) *
        100
      ).toFixed(1)}%)`
    )
    console.log(
      `❌ Nieudane testy: ${total - successful} (${(
        ((total - successful) / total) *
        100
      ).toFixed(1)}%)`
    )

    // Średni czas odpowiedzi
    const avgTime =
      this.results.reduce((sum, r) => sum + r.duration, 0) / this.results.length
    console.log(`⏱️  Średni czas odpowiedzi: ${avgTime.toFixed(0)}ms`)

    // Grupa wyników według URL-i
    console.log('\n📋 WYNIKI WEDŁUG URL-I:')
    const urlGroups = {}
    this.results.forEach((result) => {
      if (!urlGroups[result.url]) {
        urlGroups[result.url] = { total: 0, withDescription: 0, successful: 0 }
      }
      urlGroups[result.url].total++
      if (result.success) urlGroups[result.url].successful++
      if (result.hasDescription) urlGroups[result.url].withDescription++
    })

    Object.entries(urlGroups).forEach(([url, stats]) => {
      console.log(`\n🔗 ${url}`)
      console.log(
        `   Udane: ${stats.successful}/${stats.total} (${(
          (stats.successful / stats.total) *
          100
        ).toFixed(1)}%)`
      )
      console.log(
        `   Z description: ${stats.withDescription}/${stats.total} (${(
          (stats.withDescription / stats.total) *
          100
        ).toFixed(1)}%)`
      )
    })
  }

  // Metoda do sprawdzania czy API jest dostępne
  async checkApiHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`)
      return response.ok
    } catch {
      return false
    }
  }
}

// Główna funkcja
async function main() {
  const args = process.argv.slice(2)
  let numberOfRuns = DEFAULT_RUNS
  let customUrl = null
  let baseUrl = API_BASE_URL

  // Parsowanie argumentów
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

Użycie:
  node transcript-tester.js [opcje]

Opcje:
  -r, --runs <liczba>     Liczba uruchomień dla każdego URL (domyślnie: ${DEFAULT_RUNS})
  -u, --url <url>         Testuj konkretny URL zamiast domyślnych
  -a, --api-url <url>     URL backendu (domyślnie: ${API_BASE_URL})
  -h, --help              Pokaż tę pomoc

Przykłady:
  node transcript-tester.js                          # ${DEFAULT_RUNS} testów dla każdego domyślnego URL
  node transcript-tester.js --runs 10                # 10 testów dla każdego domyślnego URL
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

  // Sprawdź czy API jest dostępne
  console.log(`🔍 Sprawdzanie dostępności API na ${baseUrl}...`)
  const isHealthy = await tester.checkApiHealth()

  if (!isHealthy) {
    console.error(`❌ API nie jest dostępne na ${baseUrl}`)
    console.error(
      '💡 Sprawdź czy backend działa: npm run dev (w katalogu backend/)'
    )
    process.exit(1)
  }

  console.log('✅ API jest dostępne')

  const results = await tester.runTests(testUrls, numberOfRuns)

  // Exit code bazowany na wynikach
  if (results.successRate < 80) {
    console.log('\n⚠️  Mniej niż 80% testów się powiodło')
    process.exit(1)
  }

  console.log('\n🎉 Testy zakończone pomyślnie!')
}

// Uruchomienie skryptu
if (require.main === module) {
  main().catch((error) => {
    console.error('💥 Błąd podczas wykonywania testów:', error.message)
    process.exit(1)
  })
}

module.exports = TranscriptTester
