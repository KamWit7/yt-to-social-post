export const FORM_STYLES = {
  input: {
    withIcon: 'pl-10',
    withoutIcon: '',
  },

  textarea: {
    base: 'flex min-h-[96px] w-full rounded-lg border border-input bg-transparent px-3.5 py-2.5 text-base shadow-xs transition-all duration-200 outline-none placeholder:text-muted-foreground hover:border-ring/60 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none',
  },

  label: {
    base: 'text-sm font-medium leading-none tracking-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    required: 'after:content-["*"] after:ml-1 after:text-destructive',
  },

  error: {
    base: 'text-xs font-medium text-destructive',
  },

  container: {
    base: 'space-y-5',
    field: 'space-y-2.5',
  },
} as const

export const getInputClasses = (hasIcon: boolean = false) => {
  return hasIcon ? FORM_STYLES.input.withIcon : FORM_STYLES.input.withoutIcon
}

export const getTextareaClasses = () => {
  return FORM_STYLES.textarea.base
}
