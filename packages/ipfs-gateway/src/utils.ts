const IS_SERVICE_WORKER_REGISTERED_KEY = 'IS_SERVICE_WORKER_REGISTERED_KEY'

export const isBrowser = typeof window === 'object'

export function markServiceWorkerAsRegistered() {
  localStorage.setItem(IS_SERVICE_WORKER_REGISTERED_KEY, 'true')
}

export function checkIfServiceWorkerRegistered() {
  if (isBrowser) {
    return localStorage.getItem(IS_SERVICE_WORKER_REGISTERED_KEY) === 'true'
  } else {
    return false
  }
}
