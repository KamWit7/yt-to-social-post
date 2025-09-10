import crypto from 'node:crypto'

const algorithm = 'aes-256-gcm'

// hex -> buffor binarny

export function encrypt(apiKey: string, apiKeySeccret: string): string {
  const bufferapiKeySeccret = Buffer.from(apiKeySeccret, 'hex')
  // iv -> wektro incujący aby ten sam tekst nie był taki sam
  // ma 16 bajtów dla GCM
  const iv = crypto.randomBytes(16)

  // tworzenie obiektu "szyfratora" z algorytmem kluczem api oraz IV

  const cipher = crypto.createCipheriv(algorithm, bufferapiKeySeccret, iv)

  // szyfrowanie tekstu, łączać zaszyfrowany teskt w jeden buffor
  const encrypted = Buffer.concat([
    cipher.update(apiKey, 'utf-8'),
    cipher.final(),
  ])

  const authTag = cipher.getAuthTag()

  // Łączymy wszystko w jeden string, oddzielając części dwukropkiem.
  // Przechowujemy IV i AuthTag razem z zaszyfrowanymi danymi,
  // ponieważ będą one potrzebne do deszyfrowania.
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString(
    'hex'
  )}`
}

export function decrypt(encrypted: string, apiKeySeccret: string): string {
  try {
    const bufferapiKeySeccret = Buffer.from(apiKeySeccret, 'hex')
    const [viHex, authTagHex, encryptedTextHex] = encrypted.split(':')

    if (!viHex || !authTagHex || !encryptedTextHex) {
      throw new Error('Invalid encrypted text')
    }

    const iv = Buffer.from(viHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')
    const encryptedText = Buffer.from(encryptedTextHex, 'hex')

    // Tworzymy obiekt "deszyfratora" z tymi samymi parametrami.
    const decipher = crypto.createDecipheriv(algorithm, bufferapiKeySeccret, iv)

    // ustawiamy tag autentyczności, jeżli dane zostały zmienione to wywali błąd
    decipher.setAuthTag(authTag)

    // deszyfrowanie tekstu
    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ])

    return decrypted.toString('utf-8')
  } catch (error) {
    console.error('Error decrypting text:', error)
    throw new Error('Error decrypting text')
  }
}
