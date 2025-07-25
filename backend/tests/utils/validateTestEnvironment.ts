export const validateTestEnvironment = (): void | Error => {
  const requiredEnvVars = ['NODE_ENV']
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    )
  }
}
