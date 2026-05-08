'use client'

import { Component, ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  handleReset = () => this.setState({ hasError: false, message: '' })

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="px-4 sm:px-6 py-10 sm:py-16 mx-auto max-w-2xl text-center">
          <div className="neon-card p-8 sm:p-12 border-red-500/30">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold text-white mb-2">Algo salió mal</h2>
            <p className="text-white/60 text-sm mb-6 font-mono break-all">{this.state.message}</p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neon-pink text-black font-bold hover:bg-neon-pink/80 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
