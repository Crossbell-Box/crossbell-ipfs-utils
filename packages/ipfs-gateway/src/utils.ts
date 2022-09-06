const IS_SERVICE_WORKER_REGISTERED_KEY = 'IS_SERVICE_WORKER_REGISTERED_KEY'

export const isBrowser = typeof window === 'object'

export function markServiceWorkerAsRegistered(filename: string) {
  localStorage.setItem(`${IS_SERVICE_WORKER_REGISTERED_KEY}_${filename}`, 'true')
}

export function markServiceWorkerAsUnregistered(filename: string) {
  localStorage.setItem(`${IS_SERVICE_WORKER_REGISTERED_KEY}_${filename}`, 'false')
}

export function checkIfServiceWorkerRegisteredBefore(filename: string) {
  if (isBrowser) {
    return localStorage.getItem(`${IS_SERVICE_WORKER_REGISTERED_KEY}_${filename}`) === 'true'
  } else {
    return false
  }
}
