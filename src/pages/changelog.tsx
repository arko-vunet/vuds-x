import { MarkdownContentPage } from "@/components/markdown-content-page"
import changelog from "@/content/changelog.md?raw"

export default function ChangelogPage() {
  return <MarkdownContentPage content={changelog} documentTitle="Changelog | vuDS-x" />
}
