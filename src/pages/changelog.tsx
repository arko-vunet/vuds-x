import { useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import changelog from "@/content/changelog.md?raw"

export default function ChangelogPage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = "Changelog | vuDS-x"

    return () => {
      document.title = previousTitle || "vuDS-x"
    }
  }, [])

  return (
    <main style={{ minHeight: "100vh", padding: "2rem" }}>
      <article
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "1.25rem",
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => <h1 style={{ margin: "0 0 1.1rem" }}>{children}</h1>,
            h2: ({ children }) => (
              <h2
                style={{
                  margin: "1.5rem 0 0.5rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid var(--border)",
                }}
              >
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3
                style={{
                  margin: "1rem 0 0.35rem 2rem",
                  fontSize: "1.15rem",
                  fontWeight: 600,
                }}
              >
                {children}
              </h3>
            ),
            p: ({ children, node }) => {
              const isIntro = node?.position?.start?.line === 3
              const firstTextNode = node?.children?.[0]
              const isScopeLine =
                firstTextNode?.type === "text" && firstTextNode.value.startsWith("Scope:")
              const isSubtleParagraph = isIntro || isScopeLine
              return (
                <p
                  style={{
                    margin: "0.4rem 0",
                    marginLeft: isSubtleParagraph ? 0 : "1rem",
                    color: isSubtleParagraph ? "var(--muted-foreground)" : "var(--foreground)",
                  }}
                >
                  {children}
                </p>
              )
            },
            ul: ({ children }) => (
              <ul
                style={{
                  margin: "0.35rem 0 0.75rem",
                  paddingLeft: "3.5rem",
                  listStyle: "disc",
                }}
              >
                {children}
              </ul>
            ),
            li: ({ children }) => (
              <li
                style={{
                  margin: "0.3rem 0",
                }}
              >
                {children}
              </li>
            ),
            code: ({ children }) => (
              <code
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "0.9em",
                  padding: "0.15rem 0.35rem",
                  borderRadius: "4px",
                  background: "var(--muted)",
                }}
              >
                {children}
              </code>
            ),
          }}
        >
          {changelog}
        </ReactMarkdown>
      </article>
    </main>
  )
}
