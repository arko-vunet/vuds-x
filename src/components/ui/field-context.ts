import { createContext, useContext } from "react"

const FieldContext = createContext<{ required: boolean } | null>(null)

function useFieldContext() {
  return useContext(FieldContext)
}

export { FieldContext, useFieldContext }
