import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import * as pdfjsLib from "pdfjs-dist"
import { apiRequest } from "../api"
import mammoth from "mammoth"


pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString()


function Dashboard() {

  const navigate = useNavigate()

  const [firstName, setFirstName] = useState("")

  useEffect(() => {
    apiRequest("/users/me")
      .then((user) => setFirstName(user.first_name))
      .catch(() => setFirstName(""))
  }, [])

  const [selectedType, setSelectedType] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [documentText, setDocumentText] = useState("")
  const [fileText, setFileText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")


  const handleFileChange = async (event) => {

    const file = event.target.files[0]

    if (!file) {
      return
    }

    setError("")
    setSelectedFile(file)
    setFileText("")

    if (file.type === "text/plain") {

      const reader = new FileReader()

      reader.onload = (event) => {
        setFileText(event.target.result)
      }

      reader.onerror = () => {
        setError("We could not read this file. Please try another.")
      }

      reader.readAsText(file)

      return
    }


    if (file.type === "application/pdf") {

      try {

        const arrayBuffer = await file.arrayBuffer()

        const pdf = await pdfjsLib.getDocument({
          data: arrayBuffer
        }).promise

        let extractedText = ""

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {

          const page = await pdf.getPage(pageNumber)

          const textContent = await page.getTextContent()

          const pageText = textContent.items
            .map((item) => item.str)
            .join(" ")

          extractedText += pageText + "\n"
        }

        setFileText(extractedText)

      } catch (error) {

        setError("We could not read this PDF. Please try another file.")
        setFileText("")

      }

      return
    }


    // Word documents (.doc/.docx) are accepted by the file input but we
    // don't have a client-side parser for them yet — tell the user instead
    // of silently doing nothing.
    if (
  file.type ===
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
) {

  try {

    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    setFileText(result.value)

  } catch (error) {

    setError("We could not read this Word document. Please try another file.")
    setFileText("")

  }

  return
}

 setError(
  "Old-format .doc files aren't supported. Please save it as .docx, upload a PDF or .txt file, or paste the text below."
)
  }


  const handleAnalyze = async () => {

    if (!selectedType) {
      alert("Please select a document type.")
      return
    }

    if (!selectedFile && !documentText.trim()) {
      alert("Please upload a document or paste your document text.")
      return
    }

    let textToAnalyze = ""

    if (fileText.trim()) {
      textToAnalyze = fileText
    } else if (documentText.trim()) {
      textToAnalyze = documentText
    }

    if (!textToAnalyze.trim()) {
      alert("We could not read any text from this document.")
      return
    }

    setIsAnalyzing(true)
    setError("")

    try {

      const savedDocument = await apiRequest("/documents", {
        method: "POST",
        body: JSON.stringify({
          type: selectedType,
          text: textToAnalyze,
          name: selectedFile ? selectedFile.name : "Pasted Document",
        }),
      })

      navigate("/analysis", {
        state: {
          documentId: savedDocument.id,
        },
      })

    } catch (err) {

      setError(err.message)
      setIsAnalyzing(false)

    }
  }


  return (

    <main className="dashboard-page">

      <div className="dashboard-container">

        <div className="dashboard-header">

          <p className="dashboard-label">DASHBOARD</p>

          <h1>
            {firstName
              ? `Welcome back, ${firstName}.`
              : "Welcome back."}
          </h1>

          <p>
            Choose a document type to begin your analysis.
          </p>

        </div>


        <section className="document-section">

          <h2>What would you like to analyze?</h2>


          <div className="document-types">

            <button
              className={`document-type ${
                selectedType === "contract" ? "selected" : ""
              }`}
              onClick={() => setSelectedType("contract")}
            >
              <strong>Contract</strong>

              <span>
                Employment, service, rental, or other agreements.
              </span>

            </button>


            <button
              className={`document-type ${
                selectedType === "terms" ? "selected" : ""
              }`}
              onClick={() => setSelectedType("terms")}
            >
              <strong>Terms & Conditions</strong>

              <span>
                Rules and conditions for using a product or service.
              </span>

            </button>


            <button
              className={`document-type ${
                selectedType === "privacy" ? "selected" : ""
              }`}
              onClick={() => setSelectedType("privacy")}
            >
              <strong>Privacy Policy</strong>

              <span>
                How an organization collects and uses personal data.
              </span>

            </button>


            <button
              className={`document-type ${
                selectedType === "other" ? "selected" : ""
              }`}
              onClick={() => setSelectedType("other")}
            >
              <strong>Other Legal Document</strong>

              <span>
                Any other legal document you want to review.
              </span>

            </button>

          </div>


          <div className="document-input">

            <h2>Provide your document</h2>


            <div className="input-options">

              <div className="upload-box">

                <h3>Upload a document</h3>

                <p>
                  Upload a PDF, docx or text file.
                </p>


                <input
                  type="file"
                  className="file-input"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                />


                {selectedFile && (
                  <p className="selected-file">
                    Selected file: {selectedFile.name}
                  </p>
                )}


                {fileText && (
                  <p className="selected-file">
                    File content loaded successfully.
                  </p>
                )}


                {error && (
                  <p className="file-error">
                    {error}
                  </p>
                )}

              </div>


              <div className="paste-box">

                <h3>Paste your text</h3>

                <p>
                  Copy and paste your contract or legal document below.
                </p>


                <textarea
                  placeholder="Paste your document text here..."
                  rows="8"
                  value={documentText}
                  onChange={(event) => setDocumentText(event.target.value)}
                ></textarea>

              </div>

            </div>


            <button
              className="analyze-button"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing
                ? "Analyzing..."
                : "Analyze Document"}
            </button>

          </div>

        </section>

      </div>

    </main>
  )
}

export default Dashboard