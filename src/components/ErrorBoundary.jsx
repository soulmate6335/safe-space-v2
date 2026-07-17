import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              textAlign: "center",
              backgroundColor: "white",
              padding: "40px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                marginBottom: "20px",
              }}
            >
              ⚠️
            </div>

            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "12px",
              }}
            >
              Oops! Something went wrong
            </h1>

            <p
              style={{
                fontSize: "16px",
                color: "#6b7280",
                marginBottom: "24px",
                lineHeight: "1.6",
              }}
            >
              We're sorry for the inconvenience. An unexpected error occurred
              while rendering the page.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details
                style={{
                  marginBottom: "24px",
                  textAlign: "left",
                  backgroundColor: "#f3f4f6",
                  padding: "12px",
                  borderRadius: "8px",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Error Details (Development Only)
                </summary>
                <pre
                  style={{
                    marginTop: "12px",
                    fontSize: "12px",
                    color: "#dc2626",
                    overflow: "auto",
                    maxHeight: "200px",
                  }}
                >
                  {this.state.error.toString()}
                  {"\n\n"}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: "10px 24px",
                  backgroundColor: "#7c3aed",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "500",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#6d28d9")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#7c3aed")
                }
              >
                Try Again
              </button>

              <button
                onClick={() => (window.location.href = "/")}
                style={{
                  padding: "10px 24px",
                  backgroundColor: "#e5e7eb",
                  color: "#374151",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "500",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#d1d5db")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#e5e7eb")
                }
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
