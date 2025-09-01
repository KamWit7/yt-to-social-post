export interface MenuItem {
  href: string
  label: string
}

export interface UserMenuProps {
  user: {
    name?: string | null
    email?: string | null
  }
}
