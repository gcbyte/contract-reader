import { Component } from "react"

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // TODO: send this to an error-tracking service (e.g. Sentry) once one exists.
    console.error("Uncaught error:", error, errorInfo)
  }

  handleReload = () => {
    window.location.href = "/"
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="not-found-page">
          <div className="not-found-container">
            <p className="not-found-label">SOMETHING WENT WRONG</p>
            <h1>We hit an unexpected error.</h1>
            <p>
              Please try reloading the page. If the problem keeps happening,
              let us know what you were doing when it occurred.
            </p>
            <button className="analyze-button" onClick={this.handleReload}>
              Back to Home
            </button>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary