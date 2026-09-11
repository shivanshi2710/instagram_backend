export function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return decoded
  } catch {
    return null
  }
}

export function isTokenExpired(token) {
  const decoded = decodeToken(token)
  if (!decoded?.exp) return true
  return Date.now() >= decoded.exp * 1000
}

export function getUserIdFromToken(token) {
  const decoded = decodeToken(token)
  return decoded?.sub ? parseInt(decoded.sub, 10) : null
}
