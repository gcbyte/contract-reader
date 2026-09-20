import { useState } from "react"
import { Link } from "react-router-dom"

function ForgotPassword() {

  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Please enter your email address.")
      return
    }

    setIsSubmitting(true)

    // TODO: replace with a real request once a backend exists, e.g.:
    //   await fetch("/api/forgot-password", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email })
    //   })
    // The backend should generate a real, single-use, expiring token and
    // email a link like /reset-password?token=<token> — it should NOT
    // reveal whether the email is registered (see the message below).
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSent(true)
    }, 600)
  }

  return (

    <main className="forgot-password-page">

      <div className="forgot-password-container">

        <div className="forgot-password-header">

          <p className="forgot-password-label">
            RESET YOUR PASSWORD
          </p>

          <h1>
            Forgot your password?
          </h1>

          <p>
            Enter your email address and we'll send you
            instructions to reset your password.
          </p>

        </div>

        {isSent ? (

          <p className="selected-file">
            If an account exists for {email}, we've sent password reset
            instructions to that address.
          </p>

        ) : (

          <form className="forgot-password-form" onSubmit={handleSubmit}>

            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

            </div>

            {error && <p className="file-error">{error}</p>}

            <button
              type="submit"
              className="forgot-password-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Instructions"}
            </button>

          </form>

        )}

        <p className="back-to-signin">
          Remember your password?{" "}
          <Link to="/signin">
            Sign in
          </Link>
        </p>

      </div>

    </main>

  )
}

export default ForgotPassword