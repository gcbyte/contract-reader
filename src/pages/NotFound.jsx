import { Link } from "react-router-dom"

function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-container">
        <p className="not-found-label">404</p>
        <h1>Page not found.</h1>
        <p>
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link to="/" className="analyze-button">
          Back to Home
        </Link>
      </div>
    </main>
  )
}

export default NotFound