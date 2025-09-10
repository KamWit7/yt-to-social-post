import crypto from 'node:crypto'
import { decrypt, encrypt } from './encryption'

/**
 * Simple script to demonstrate the encrypt function
 */
function main() {
  // Generate a random 32-byte (256-bit) key for AES-256
  const apiKeySecret = crypto.randomBytes(32).toString('hex')

  // Example API key to encrypt
  const apiKey = 'your-api-key-here-example-123456789'

  console.log('Original API Key:', apiKey)
  console.log('Secret Key (hex):', apiKeySecret)
  console.log('---')

  try {
    // Encrypt the API key
    const encryptedValue = encrypt(apiKey, apiKeySecret)
    const decryptedValue = decrypt(encryptedValue, apiKeySecret)

    console.log('Encrypted value:', encryptedValue)
    console.log('Decrypted value:', decryptedValue)

    console.log(
      'Is decrypted value equal to original API key?',
      decryptedValue === apiKey
    )
  } catch (error) {
    console.error('Encryption failed:', error)
  }
}

// Run the script
main()
