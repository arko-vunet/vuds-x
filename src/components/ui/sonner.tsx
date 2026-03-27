import { Toaster as Sonner, type ToasterProps } from "sonner"
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react"

import { Spinner } from "@/components/ui/spinner"

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      icons={{
        success: <CheckCircle2 className="size-4" />,
        info: <Info className="size-4" />,
        warning: <AlertTriangle className="size-4" />,
        error: <AlertCircle className="size-4" />,
        loading: <Spinner />,
      }}
      toastOptions={{
        actionButtonStyle: {
          background: "var(--primary)",
          color: "var(--primary-foreground)",
          border: "1px solid var(--primary)",
          borderRadius: "var(--radius-sm)",
          height: "24px",
          paddingInline: "10px",
          fontSize: "12px",
          fontWeight: 500,
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
