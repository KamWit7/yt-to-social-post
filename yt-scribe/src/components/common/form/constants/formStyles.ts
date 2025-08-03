export const FORM_STYLES = {
  input: {
    withIcon: 'pl-10',
    withoutIcon: '',
  },

  textarea: {
    base: 'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none',
  },

  label: {
    base: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    required: 'after:content-["*"] after:ml-1 after:text-destructive',
  },

  error: {
    base: 'text-xs font-medium text-destructive',
  },

  container: {
    base: 'space-y-4',
    field: 'space-y-2',
  },
} as const

export const getInputClasses = (hasIcon: boolean = false) => {
  return hasIcon ? FORM_STYLES.input.withIcon : FORM_STYLES.input.withoutIcon
}

export const getTextareaClasses = () => {
  return FORM_STYLES.textarea.base
}
