const Sequencer = require('@jest/test-sequencer').default

class CustomSequencer extends Sequencer {
  sort(tests) {
    const sortedTests = tests.sort((testA, testB) =>
      testA.path.localeCompare(testB.path)
    )

    const rateLimitingTests = []
    const otherTests = []

    sortedTests.forEach((test) => {
      if (test.path.includes('rateLimiting')) {
        rateLimitingTests.push(test)
      } else {
        otherTests.push(test)
      }
    })

    return [...otherTests, ...rateLimitingTests]
  }
}

module.exports = CustomSequencer
