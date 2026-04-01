import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function LoginPage() {
  const { signInWithGoogle } = useAuth()
  const { dark, toggle } = useTheme()

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-warm-100 to-warm-200 dark:from-warm-950 dark:to-warm-900">
      <div className="text-center max-w-sm w-full animate-fade-up">
        {/* Logo */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-terra-500 to-terra-600 flex items-center justify-center mx-auto mb-7 text-4xl shadow-lg shadow-terra-500/25">
          🎯
        </div>

        <h1 className="font-display text-4xl font-bold text-warm-900 dark:text-warm-100 mb-2 tracking-tight">
          Vanespor
        </h1>
        <p className="text-warm-600 dark:text-warm-500 text-base mb-10 leading-relaxed">
          Bygg gode vaner, én dag om gangen
        </p>

        {/* Google login button */}
        <button
          onClick={signInWithGoogle}
          className="flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-2xl border-[1.5px] border-warm-300 dark:border-warm-700 bg-white dark:bg-warm-800 text-warm-900 dark:text-warm-100 text-[15px] font-semibold shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          <GoogleLogo />
          Logg inn med Google
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="mt-6 p-2 text-warm-500 hover:text-warm-700 dark:hover:text-warm-300 transition-colors"
        >
          {dark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}
