import { reactive } from 'vue'

interface DialogState {
  isOpen: boolean
  title: string
  message: string
  resolve: (value: boolean) => void
}

// Shared reactive state — used by both the component and the confirm() function
export const dialogState = reactive<DialogState>({
  isOpen: false,
  title: '',
  message: '',
  resolve: () => {}
})

/**
 * Drop-in replacement for window.confirm() that returns a Promise<boolean>.
 * Usage: if (await confirm('Title', 'Are you sure?')) { ... }
 */
export function confirm(title: string, message: string): Promise<boolean> {
  dialogState.isOpen = true
  dialogState.title = title
  dialogState.message = message

  return new Promise<boolean>((resolve) => {
    dialogState.resolve = resolve
  })
}
