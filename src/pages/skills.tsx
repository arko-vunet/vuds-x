import { MarkdownContentPage } from "@/components/markdown-content-page"
import skills from "@/content/skills.md?raw"

export default function SkillsPage() {
  return <MarkdownContentPage content={skills} documentTitle="Skills | vuDS-x" />
}
