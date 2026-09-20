import { useNavigate } from "react-router-dom"

function LandingPage() {
   const navigate = useNavigate()
  return (
    <main id="home" className="landing-page">

      {/* Hero Section */}
      <section className="hero">
        <p className="hero-label">AI-POWERED DOCUMENT ANALYSIS</p>

        <h1>
          Understand what
          <br />
          you're signing.
        </h1>

        <p className="hero-description">
          Analyze contracts and legal documents to identify
          possible risks, obligations, and clauses that deserve
          a closer look.
        </p>

        <button className="hero-button"
         onClick={() => navigate("/dashboard")}
        >
          
          Analyze a Document
        </button>
        
      </section>


      {/* Features Section */}
      <section id="features" className="features">

        <div className="feature-card">
          <span className="feature-number">01</span>

          <h3>Upload or Paste</h3>

          <p>
            Upload a document or paste your contract text
            directly into Contract Reader.
          </p>
        </div>


        <div className="feature-card">
          <span className="feature-number">02</span>

          <h3>AI Analysis</h3>

          <p>
            The system examines your document and highlights
            important clauses, obligations, and areas that
            deserve attention.
          </p>
        </div>


        <div className="feature-card">
          <span className="feature-number">03</span>

          <h3>Risk Assessment</h3>

          <p>
            Get a clear overview of possible
            <strong> High, Medium, and Low </strong>
            risks found in your document.
          </p>
        </div>

      </section>


      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">

        <div className="section-heading">
          <p className="section-label">HOW IT WORKS</p>

          <h2>
            From document to
            <br />
            understanding.
          </h2>

          <p>
            Contract Reader simplifies the process of reviewing
            complex legal documents.
          </p>
        </div>


        <div className="steps">

          <div className="step">
            <span className="step-number">01</span>

            <h3>Select a document type</h3>

            <p>
              Choose whether you're reviewing a contract,
              terms and conditions, privacy policy, or another
              legal document.
            </p>
          </div>


          <div className="step">
            <span className="step-number">02</span>

            <h3>Provide your document</h3>

            <p>
              Upload your document or paste the text directly
              into the application.
            </p>
          </div>


          <div className="step">
            <span className="step-number">03</span>

            <h3>Review the results</h3>

            <p>
              Our AI analyzes the document and presents possible
              risks, important clauses, and explanations in
              plain language.
            </p>
          </div>

        </div>

      </section>


      <section id="about" className="about-section">

  <div className="section-heading">
    <p className="section-label">ABOUT CONTRACT READER</p>

    <h2>
      Understand before
      <br />
      you sign.
    </h2>

    <p>
      Contract Reader is designed to make complex legal
      documents easier to understand by highlighting
      possible risks, important obligations, and clauses
      that deserve your attention and a closer look.
    </p>
  </div>

</section>

            {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div>
            <h3>Contract Reader</h3>
            <p>
              Understand your contracts before you sign them.
            </p>
          </div>

          <div className="footer-links">
            <a href="#how-it-works">How It Works</a>
            <a href="#features">Features</a>
            <a href="#about">About</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Contract Reader. All rights reserved.</p>
          <p>Contract Reader provides information for review and is not legal advice.</p>
        </div>
      </footer>

    </main>
  )
}

export default LandingPage