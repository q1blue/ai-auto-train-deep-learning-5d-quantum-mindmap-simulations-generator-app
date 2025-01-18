import { Toast } from "@/components/ui/toast"

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

export function toast({ title, description, ...props }: {
  title?: string
  description?: string
  duration?: number
} & Omit<ToastProps, "children">) {
  const toastEvent = new CustomEvent("toast", {
    detail: {
      title,
      description,
      ...props,
    },
  })
  document.dispatchEvent(toastEvent)
}