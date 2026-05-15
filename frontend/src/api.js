import axios from 'axios'

const NGROK_API_URL = 'https://uncontaminative-comparingly-karly.ngrok-free.dev'
const LOCAL_API_URL = 'http://127.0.0.1:8000'

function getApiBase() {
  const envUrl = import.meta.env.VITE_API_URL?.trim()

  const isLocalhost =
    envUrl &&
    (envUrl.includes('127.0.0.1') || envUrl.includes('localhost'))

  // Production must not use localhost (e.g. mis-set Vercel env var).
  if (envUrl && !(import.meta.env.PROD && isLocalhost)) {
    return envUrl.replace(/\/$/, '')
  }

  return import.meta.env.PROD ? NGROK_API_URL : LOCAL_API_URL
}

export const API_BASE = getApiBase()

const isNgrok = API_BASE.includes('ngrok')

export const api = axios.create({
  baseURL: API_BASE,
  headers: isNgrok
    ? { 'ngrok-skip-browser-warning': 'true' }
    : undefined,
})
