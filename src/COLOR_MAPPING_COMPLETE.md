# Website Color Scheme Update - Complete Mapping Guide

## New Color Palette
- **Primary (Blue)**: #007BFF → Headers, Navigation, Main CTAs
- **Secondary (Teal)**: #20C997 → Highlights, Badges, Icons
- **Accent (Orange)**: #FF6600 → Offers, Promotions, Urgent CTAs
- **Neutral**: White (#FFFFFF) & Dark Gray (#343A40) → Backgrounds, Text, Cards

---

## Tailwind Color Class Replacements

### Navigation & Headers (Use Primary Blue)
```
❌ OLD                              ✅ NEW
from-blue-600 to-cyan-600   →   from-blue-600 to-teal-500
bg-blue-500                 →   bg-blue-600
hover:bg-blue-700           →   hover:bg-blue-700 (keep)
text-blue-600               →   text-blue-600 (keep)
```

### Highlights & Badges (Use Secondary Teal)
```
❌ OLD                              ✅ NEW
bg-cyan-100                 →   bg-teal-100
text-cyan-600               →   text-teal-500
border-cyan-200             →   border-teal-200
from-cyan-50 to-cyan-50     →   from-teal-50 to-teal-50
hover:bg-cyan-100           →   hover:bg-teal-100
hover:text-cyan-600         →   hover:text-teal-500
```

### CTA Buttons & Promotions (Use Accent Orange)
```
❌ OLD                              ✅ NEW
bg-red-500                  →   bg-orange-600
hover:bg-red-600            →   hover:bg-orange-700
text-red-600                →   text-orange-600
border-red-500              →   border-orange-600
from-red-500 to-pink-500    →   from-orange-600 to-orange-700
bg-red-50                   →   bg-orange-50
```

### Green to Teal (Success States - Use Secondary)
```
❌ OLD                              ✅ NEW
bg-green-50                 →   bg-teal-50
text-green-600              →   text-teal-500
border-green-200            →   border-teal-200
bg-green-100                →   bg-teal-100
from-green-50 to-green-50   →   from-teal-50 to-teal-50
hover:bg-green-100          →   hover:bg-teal-100
```

### Purple/Gradient Buttons (Use Primary to Secondary)
```
❌ OLD                                  ✅ NEW
from-purple-600 to-pink-600    →   from-blue-600 to-teal-500
from-purple-100 to-pink-100    →   from-blue-50 to-teal-50
bg-purple-600                  →   bg-blue-600
text-purple-700                →   text-blue-600
```

### Text & Dark Variants (Keep Dark Gray)
```
❌ Keep As-Is (No Change Needed)
text-gray-900               ✓ Use for primary text
text-gray-700               ✓ Use for secondary text
text-gray-600               ✓ Use for tertiary text
bg-gray-50                  ✓ Light background
```

---

## Gradient Combinations for UI Elements

### Primary Actions
```css
/* Headers, navigation */
from-blue-600 to-teal-500

/* Hover states for buttons */
hover:from-blue-700 hover:to-teal-600

/* Light background sections */
from-blue-50 to-teal-50
```

### Promotional/Urgent CTAs
```css
/* Orange accent buttons */
from-orange-600 to-orange-700

/* Light orange background */
from-orange-50 to-orange-100
```

### Mixed (Primary + Accent)
```css
/* For special emphasis */
from-blue-600 to-orange-600
```

---

## Component-by-Component Guide

### 1. Navbar (Navigation Bar)
**Current**: Blue and Cyan gradient
**Update to**: Blue and Teal gradient
- Replace all `cyan-600` → `teal-500`
- Replace all `cyan-50` → `teal-50`
- Update hover states to teal

### 2. Buttons - Primary CTAs
**Update to**: Blue (#007BFF)
- Sign In: `from-gray-900 to-black` → `from-blue-600 to-blue-700`
- Main Actions: Use `bg-blue-600 hover:bg-blue-700`

### 3. Buttons - WhatsApp & Success
**Update to**: Teal (#20C997)
- WhatsApp: `from-green-500 to-emerald-500` → `from-teal-500 to-teal-600`
- Success badges: Use `bg-teal-100 text-teal-700`

### 4. Buttons - Promotional/Urgent
**Update to**: Orange (#FF6600)
- Special offers: Use `from-orange-600 to-orange-700`
- Warning alerts: Use `bg-orange-100 text-orange-700`

### 5. Icons & Highlights
**Update to**: Teal (#20C997)
- Icon colors: `text-cyan-600` → `text-teal-500`
- Badge backgrounds: `bg-cyan-100` → `bg-teal-100`

### 6. Cards & Sections
**Header cards**: Use `border-blue-200 bg-blue-50`
**Highlight sections**: Use `border-teal-200 bg-teal-50`
**Alert sections**: Use `border-orange-200 bg-orange-50`

### 7. Links & Hover States
**Links**: Keep `text-blue-600` (but can adjust to `text-blue-600`)
**Hover**: `hover:text-blue-700` or `hover:text-teal-600` depending on context

---

## Files to Update (Priority Order)

1. ✅ **src/components/Layout/Navbar.jsx** - Main navigation
2. ✅ **src/components/Layout/Footer.jsx** - Footer links
3. ✅ **src/components/Layout/Sidebar.jsx** - Mobile menu
4. ✅ **src/pages/Public/Home.jsx** - Home page
5. ✅ **src/pages/Public/ServiceDetail.jsx** - Service pages
6. ✅ **src/pages/admin/AdminDashboard.jsx** - Admin pages
7. **All button components** - Throughout the app

---

## Search & Replace Commands (Use in IDE)

### For Navbar & Navigation
```
Find: from-blue-600 to-cyan-600
Replace: from-blue-600 to-teal-500

Find: hover:bg-cyan-100
Replace: hover:bg-teal-100

Find: text-cyan-600
Replace: text-teal-500
```

### For Badges & Icons
```
Find: bg-cyan-100 text-cyan-600
Replace: bg-teal-100 text-teal-600

Find: border-cyan-200
Replace: border-teal-200
```

### For Success/Green Elements
```
Find: bg-green-50
Replace: bg-teal-50

Find: bg-green-100
Replace: bg-teal-100

Find: text-green-600
Replace: text-teal-500

Find: border-green-200
Replace: border-teal-200
```

### For Red/Error Elements to Orange
```
Find: bg-red-50
Replace: bg-orange-50

Find: bg-red-500
Replace: bg-orange-600

Find: hover:bg-red-
Replace: hover:bg-orange-
```

---

## Quick Visual Reference

| Element | Old Color | New Color | Hex |
|---------|-----------|-----------|-----|
| Primary Button | Blue-500 | Blue-600 | #007BFF |
| Navigation | Cyan | Teal | #20C997 |
| Badges | Cyan | Teal | #20C997 |
| Promotions | Red | Orange | #FF6600 |
| Success | Green | Teal | #20C997 |
| Text | Gray-900 | Gray-900 | #343A40 |
| Background | White | White | #FFFFFF |

---

## CSS Variables Available

Already added to `src/index.css`:
```css
--color-primary: #007BFF;
--color-primary-light: #E3F2FD;
--color-secondary: #20C997;
--color-secondary-light: #E0F2F1;
--color-accent: #FF6600;
--color-accent-light: #FFF3E0;
```

Use in CSS: `color: var(--color-primary);`

---

## Implementation Strategy

1. Start with Navbar component (most visible)
2. Update buttons throughout the app
3. Update cards and sections
4. Update icons and badges
5. Test all pages for color consistency
6. Update remaining components

**Estimated time**: 2-3 hours for complete update
