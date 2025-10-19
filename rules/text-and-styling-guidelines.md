# Text and Styling Guidelines

## Overview

This document outlines the text writing conventions, CSS styling patterns, and sentence construction rules based on the Profile page and its subcomponents.

---

## 1. Text Writing Conventions

### 1.1 Language & Localization

- **Language**: Polish (Polski)
- **Tone**: Professional yet friendly
- **Formality**: Use "Twoje" (your) for addressing users directly

### 1.2 Capitalization Rules

#### **Titles (CardTitle)**

- **Capitalize only the first letter** of the title
- Examples:
  - ✅ `Profil użytkownika`
  - ✅ `Przegląd użycia`
  - ❌ `Profil Użytkownika`

#### **Descriptions (CardDescription)**

- **Always start with lowercase** letter
- Keep descriptions concise and informative
- Examples:
  - ✅ `informacje o Twoim koncie i ustawienia`
  - ✅ `śledź swoje miesięczne generowanie podsumowań`
  - ❌ `Informacje o Twoim koncie i ustawienia`

#### **Labels and Small Text**

- Use lowercase for labels when they are not standalone
- Examples:
  - ✅ `użyte w tym miesiącu`
  - ✅ `miesięczny limit`
  - ✅ `łącznie użyte`

#### **Status Messages**

- Start with lowercase when part of a sentence
- Capitalize when it's a standalone statement

#### **Button Text**

- Capitalize first letter only
- Examples:
  - ✅ `Ustawienia`
  - ✅ `Ulepsz`

---

## 2. CSS Styling Patterns

### 2.1 Layout & Spacing

#### **Page-Level Layout**

```tsx
<div className='flex flex-col lg:flex-row gap-4'>
  {/* Mobile: vertical stack, Desktop (lg): horizontal layout */}
</div>
```

#### **Consistent Spacing Hierarchy**

- `space-y-6`: Primary content sections spacing
- `space-y-4`: Secondary content spacing
- `space-y-3`: Tertiary/detail items spacing
- `space-y-2`: Tight groupings (e.g., label + value)
- `space-y-1`: Very tight (e.g., name + email)
- `gap-4`: For flex/grid containers
- `gap-3`: For smaller flex items
- `gap-2`: For inline items

#### **Padding Patterns**

- Card content: implicit (CardContent component handles it)
- Border sections: `pt-4`, `border-t` for visual separation
- Inner content boxes: `p-4`
- Header spacing: `pb-2` for titles with descriptions

### 2.2 Component Structure

#### **Card Pattern**

```tsx
<Card className={className}>
  <CardHeader>
    <CardTitle>Title text</CardTitle>
    <CardDescription>description text</CardDescription>
  </CardHeader>
  <CardContent>
    <AnimatedSection isVisible>
      <div className='space-y-6'>{/* Content here */}</div>
    </AnimatedSection>
  </CardContent>
</Card>
```

#### **Responsive Card Sizing**

- Use `flex-1` for flexible sizing
- Set `max-w-md` for optimal readability on large screens
- Example: `className='flex-1 max-w-md'`

### 2.3 Text Styling

#### **Hierarchy**

```tsx
// Main titles
className = 'font-semibold text-lg'

// Card titles
className = 'font-semibold text-foreground'

// Labels/descriptions
className = 'text-sm font-medium text-muted-foreground'

// Secondary text
className = 'text-sm text-muted-foreground'

// Values/data
className = 'text-2xl font-bold text-foreground'
```

#### **Color Semantic Usage**

- `text-foreground`: Primary text, important values
- `text-muted-foreground`: Labels, descriptions, secondary info
- `text-green-500`: Success states, positive status
- `text-yellow-500`: Warning states
- `text-red-500`: Danger states, critical alerts
- `text-purple-600/700`: Premium features, BYOK highlights

### 2.4 Interactive Elements

#### **Hover Effects**

```tsx
// Cards with interaction
className = 'hover:shadow-md transition-all duration-300'

// Icons with animation
className = 'transition-transform duration-300 group-hover:rotate-90'
className = 'transition-transform duration-300 group-hover:scale-110'
```

#### **Buttons**

```tsx
// Standard button
<Button variant='outline' size='sm'>
  <Icon className='w-4 h-4 mr-2' />
  Text
</Button>

// Premium button
<Button className='group bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700'>
  <Crown className='w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110' />
  Ulepsz
</Button>
```

### 2.5 Border & Container Styling

#### **Border Patterns**

```tsx
// Separator
className = 'border-t pt-4'

// Container with border
className = 'border rounded-lg'

// Emphasized container
className = 'border-2 rounded-lg'

// Stat cards
className = 'p-4 border rounded-lg hover:shadow-md transition-all duration-300'
```

### 2.6 Responsive Design

#### **Flex Direction**

```tsx
// Mobile-first responsive
className = 'flex flex-col md:flex-row gap-4'
```

#### **Text Alignment**

```tsx
// Centered content cards
className = 'text-center'

// Left-aligned details
className = 'flex justify-between items-center'
```

---

## 3. Sentence Construction Rules

### 3.1 User-Facing Messages

#### **Descriptions**

- Keep them concise (max 1-2 lines)
- Use possessive "Twoje/Twoim" to personalize
- Start with lowercase
- Examples:
  - `informacje o Twoim koncie i ustawienia`
  - `śledź swoje miesięczne generowanie podsumowań`
  - `śledź swoje generowanie podsumowań`

#### **Status Messages**

- Be clear about the state
- Provide actionable context
- Use conditional logic for personalization:

```tsx
{
  isFreeAccount
    ? 'śledź swoje miesięczne generowanie podsumowań'
    : 'śledź swoje generowanie podsumowań'
}
```

### 3.2 Data Labels

#### **Label Patterns**

- Use past participle forms for completed actions
  - `użyte w tym miesiącu`
  - `łącznie użyte`
- Use adjective forms for limits/properties
  - `miesięczny limit`
  - `nieograniczone`

#### **Detail Rows**

```tsx
// Pattern: [Property] | [Value]
'ID konta' | user.id
'Modele AI' | modelInfo
'Typ konta' | tierLabel
```

### 3.3 Conditional Text

#### **Context-Aware Variations**

```tsx
// Free vs Premium accounts
{
  isFreeAccount ? 'użyte w tym miesiącu' : 'łącznie użyte'
}
{
  isFreeAccount ? 'miesięczny limit' : 'nieograniczone'
}

// Display fallbacks
const displayName = user.name || 'Użytkownik'
```

---

## 4. Component-Specific Patterns

### 4.1 Progress Indicators

#### **Structure**

```tsx
<div className='space-y-2'>
  <div className='flex items-center justify-between'>
    <span className='text-sm font-medium text-muted-foreground'>
      {current} z {limit} użyte
    </span>
    <Badge variant={variant}>{percentage}%</Badge>
  </div>
  <Progress value={percentage} className='h-2' />
</div>
```

#### **Text Pattern**

- Format: `[number] z [total] użyte`
- Use "z" (of/out of) as separator

### 4.2 Stats Cards

#### **Structure**

```tsx
<div className='flex-1 text-center p-4 border rounded-lg hover:shadow-md transition-all duration-300'>
  <div className='space-y-2'>
    <p className='text-sm font-medium text-muted-foreground'>{label}</p>
    <p className='text-2xl font-bold text-foreground'>{value}</p>
  </div>
</div>
```

#### **Layout**

- Always use `flex-1` for equal card widths
- Responsive: `flex-col md:flex-row`
- Center-aligned text
- Clear label above value

### 4.3 User Information Display

#### **Structure**

```tsx
<div className='flex flex-col items-center space-y-4'>
  <UserAvatar />
  <div className='text-center space-y-1'>
    <h3 className='font-semibold text-lg'>{name}</h3>
    <div className='flex items-center justify-center space-x-2 text-sm text-muted-foreground'>
      <Icon className='w-4 h-4' />
      <span>{email}</span>
    </div>
  </div>
</div>
```

### 4.4 Account Tier Display

#### **Premium Indicators**

```tsx
// For BYOK/Premium features
<span className='flex items-center gap-1.5 text-sm'>
  <Sparkles className='w-3.5 h-3.5 text-purple-600' />
  <span className='font-medium text-purple-700'>Wszystkie modele dostępne</span>
</span>
```

#### **Standard Features**

```tsx
<span className='text-sm text-gray-600 dark:text-gray-400'>
  gemini 2.5 flash (tylko ten model)
</span>
```

---

## 5. Skeleton Loading States

### 5.1 Skeleton Sizing

#### **Match Content Dimensions**

```tsx
// Title skeletons
<Skeleton className='h-6 w-32' />

// Description skeletons
<Skeleton className='h-4 w-48' />

// Avatar skeletons
<Skeleton className='w-16 h-16 rounded-full' />
```

### 5.2 Structure Mirroring

- Skeleton layouts should **exactly mirror** the actual component structure
- Use same spacing classes: `space-y-6`, `space-y-2`, etc.
- Maintain responsive breakpoints: `flex-col md:flex-row`

---

## 6. Animation & Transitions

### 6.1 Content Animation

```tsx
<AnimatedSection isVisible>
  <div className='space-y-6'>{/* Content */}</div>
</AnimatedSection>
```

### 6.2 Hover Transitions

- Use `transition-all duration-300` for smooth state changes
- Icon rotations: `group-hover:rotate-90`
- Icon scaling: `group-hover:scale-110`
- Shadow effects: `hover:shadow-md`

---

## 7. Accessibility Considerations

### 7.1 Semantic Structure

- Use appropriate heading levels (`h3` for user names)
- Maintain logical tab order
- Include icon + text for better comprehension

### 7.2 Icon Usage

- Icons should be **16px (w-4 h-4)** for inline text
- Icons should be **20px (w-5 h-5)** for larger status indicators
- Always pair icons with text for clarity

---

## 8. Dark Mode Support

### 8.1 Color Classes

- Use semantic color variables:
  - `text-foreground` / `text-muted-foreground`
  - `bg-background` / `bg-card`
- For specific colors, provide dark mode alternatives:
  - `text-gray-600 dark:text-gray-400`

---

## 9. Conditional Rendering Patterns

### 9.1 Account Type Logic

```tsx
const isFreeAccount = accountTier === AccountTier.free
const isByokUser = accountTier === AccountTier.BYOK

// Use throughout component
{
  isFreeAccount && <FreeAccountFeature />
}
{
  !isFreeAccount && <PremiumFeature />
}
```

### 9.2 Optional Content

```tsx
{
  showEmail && user.email && <EmailDisplay />
}
```

---

## 10. Summary Checklist

When creating new components or writing text for this project:

### Text:

- ✅ Use Polish language
- ✅ Capitalize only first letter in titles
- ✅ Use lowercase for descriptions
- ✅ Keep messages concise and user-focused
- ✅ Use "Twoje/Twoim" for personalization

### CSS:

- ✅ Use consistent spacing hierarchy (`space-y-6`, `space-y-4`, etc.)
- ✅ Apply responsive breakpoints (`flex-col lg:flex-row`)
- ✅ Use semantic color classes (`text-foreground`, `text-muted-foreground`)
- ✅ Add hover transitions (`transition-all duration-300`)
- ✅ Center-align stats, left-align details

### Structure:

- ✅ Wrap content in `AnimatedSection`
- ✅ Use `Card` components for major sections
- ✅ Mirror skeleton structure to actual content
- ✅ Maintain `space-y-6` for primary sections
- ✅ Use `flex-1 max-w-md` for responsive cards

### Interactivity:

- ✅ Add hover effects to interactive elements
- ✅ Use icon animations (`group-hover:scale-110`)
- ✅ Provide visual feedback on state changes
- ✅ Include loading states (Suspense + Skeleton)
