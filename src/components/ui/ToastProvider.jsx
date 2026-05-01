import { useCallback, useMemo, useState } from 'react'
import { FiCheckCircle, FiInfo, FiX } from 'react-icons/fi'
import { ToastContext } from './toastContext'

const TOAST_LIMIT = 4

let nextToastId = 0

function ToastIcon({ type }) {
  if (type === 'success') {
    return <FiCheckCircle className="h-5 w-5 text-emerald-300" aria-hidden="true" />
  }

  return <FiInfo className="h-5 w-5 text-zinc-200" aria-hidden="true" />
}

function ToastItem({ toast, onDismiss }) {
  return (
    <div
      className="motion-toast pointer-events-auto flex w-full items-start gap-3 rounded-2xl border border-white/10 bg-zinc-950/95 p-4 text-white shadow-2xl shadow-black/40 backdrop-blur"
      role="status"
    >
      <ToastIcon type={toast.type} />
      <div className="min-w-0 flex-1">
        <p className="m-0 text-[0.95rem] font-semibold leading-tight">{toast.title}</p>
        {toast.message ? (
          <p className="mt-1 text-[0.86rem] leading-relaxed text-zinc-400">{toast.message}</p>
        ) : null}
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
        className="motion-icon-button -mr-1 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white"
      >
        <FiX className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismissToast = useCallback((id) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    ({ title, message = '', type = 'info', duration = 3200 }) => {
      const id = String((nextToastId += 1))
      const nextToast = {
        id,
        title,
        message,
        type,
      }

      setToasts((currentToasts) => [nextToast, ...currentToasts].slice(0, TOAST_LIMIT))

      if (duration > 0) {
        window.setTimeout(() => {
          dismissToast(id)
        }, duration)
      }
    },
    [dismissToast],
  )

  const contextValue = useMemo(
    () => ({
      showToast,
      dismissToast,
    }),
    [dismissToast, showToast],
  )

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div
        className="fixed bottom-4 left-4 right-4 z-[80] flex flex-col gap-3 sm:left-auto sm:w-[24rem]"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
