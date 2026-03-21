# Lynxis Obsidian Aesthetic & React Theming Guide

This guide outlines the "Obsidian v2" aesthetic and the React components/patterns used in the Lynxis platform. Use these guidelines to maintain a premium, consistent look when creating new pages.

## 🎨 Design System (CSS Tokens)

Most styles are controlled via CSS variables in `src/index.css`.

### Color Palette
- **Backgrounds**: 
  - `--bg-primary`: `#050505` (Deepest black for main background)
  - `--bg-secondary`: `#0A0A0A` (Card background base)
- **Accents**: 
  - `--accent-primary`: `#3B82F6` (Electric Blue)
  - `--accent-secondary`: `#8B5CF6` (Royal Purple)
- **Status**:
  - `--success`: `#10B981` (Emerald)
  - `--danger`: `#EF4444` (Rose)
  - `--warning`: `#F59E0B` (Amber)

### Typography
- **Headings**: `'Space Grotesk', sans-serif` (Bold, geometric)
- **Body**: `'Inter', sans-serif` (Clean, readable)

---

## 🏗️ Core React Components

Import these from `src/components/ui`:

```tsx
import { Card, Button, Input, Badge } from '@/components/ui';
```

### 1. Card
The base container for content. It uses glassmorphism by default.
- **Props**: `glass` (default: true), `onClick` (optional, adds hover effects).
- **Example**:
```tsx
<Card className="p-8">
  <h2 className="text-2xl font-bold">My New Section</h2>
</Card>
```

### 2. Button
High-performance buttons with hover/tap animations.
- **Variants**: `primary` (glow), `secondary`, `outline`, `ghost`, `glass` (shimmer), `danger`.
- **Sizes**: `sm`, `md`, `lg`.

### 3. Input
Styled text input with optional label and error state.
```tsx
<Input label="Repository Name" placeholder="e.g. lynxis-app" />
```

---

## ⚡ Patterns & Utilities

### 1. Entrance Animations
Use these classes to give the page a "premium" entry feel:
- `animate-reveal`: Slide up and fade in.
- `delay-1`, `delay-2`, `delay-3`: Staggering delays for lists.

### 2. Glassmorphism
Apply `.glass` or `.glass-card` classes to any custom element for the frosted-glass effect.

### 3. Text Gradients
Use the `.text-gradient` class on headings to apply the primary Electric Blue to Purple gradient.
```tsx
<h1 className="text-5xl font-extrabold text-gradient">Hello World</h1>
```

### 4. Mesh Glow
For large sections or background highlights, use the background gradients defined in `.mesh-glow`:
```tsx
<div className="mesh-glow" />
```

---

## 🚀 Creating a New Page Template

Copy-paste this to start a new page:

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Badge } from '@/components/ui';
import { Settings, Zap } from 'lucide-react';

const NewPage = () => {
  return (
    <div className="space-y-12 animate-reveal">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tighter text-white">
            New <span className="text-gradient">Feature</span>
          </h1>
          <p className="text-[var(--text-secondary)]">Manage your settings here.</p>
        </div>
        <Button className="gap-2">
          <Zap size={20} />
          Primary Action
        </Button>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="space-y-4">
          <Settings className="text-[var(--accent-primary)]" size={32} />
          <h3 className="text-xl font-bold">Card Title</h3>
          <p className="text-sm text-[var(--text-muted)]">Description goes here.</p>
        </Card>
      </div>
    </div>
  );
};

export default NewPage;
```
