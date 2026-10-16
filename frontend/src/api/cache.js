const store = {}

export function getCache(key) {
  const item = store[key]
  if (!item) return null
  if (Date.now() > item.until) {
    delete store[key]
    return null
  }
  return item.data
}

export function setCache(key, data, seconds = 30) {
  store[key] = { data, until: Date.now() + seconds * 1000 }
}

export function clearCache(key) {
  delete store[key]
}
