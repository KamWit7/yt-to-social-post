export function saveStateToSessionStorage<T>(key: string, state: T): void {
  // Sprawdzenie, czy kod jest wykonywany w przeglądarce, gdzie 'window' istnieje.
  if (typeof window === 'undefined') {
    console.warn(
      'sessionStorage is not available on the server. State was not saved.'
    )
    return
  }

  try {
    const serializedState = JSON.stringify(state)
    window.sessionStorage.setItem(key, serializedState)
  } catch (error) {
    console.error(
      `Error saving state to sessionStorage with key "${key}":`,
      error
    )
  }
}

export function clearStateFromSessionStorage(key: string): void {
  try {
    if (typeof window === 'undefined') {
      console.warn(
        'sessionStorage is not available on the server. State was not cleared.'
      )
      return
    }
    window.sessionStorage.removeItem(key)
  } catch (error) {
    console.error(
      `Error clearing state from sessionStorage with key "${key}":`,
      error
    )
  }
}

export function getStateFromSessionStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    console.warn(
      'sessionStorage is not available on the server. State was not retrieved.'
    )
    return null
  }

  try {
    const serializedState = window.sessionStorage.getItem(key)
    if (serializedState === null) {
      return null
    }

    const parsedState = JSON.parse(serializedState) as T

    return parsedState
  } catch (error) {
    console.error(
      `Error retrieving state from sessionStorage with key "${key}":`,
      error
    )
    return null
  }
}
