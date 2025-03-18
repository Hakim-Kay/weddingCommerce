# TwicPics and Supabase Integration Guide

This document explains how to use TwicPics for image optimization with Supabase Storage in our wedding photography e-commerce platform.

## Overview

Our platform uses:
- **Supabase Storage** for storing high-quality wedding photos
- **TwicPics** for optimizing and transforming these images on-the-fly

## Configuration

### TwicPics Setup

Our TwicPics account is configured with:
- **Domain**: `https://elisa-makini.twic.pics/`
- **Source URL**: `https://pidimnoauortugjylfhw.supabase.co/storage/v1/object/public/Wedding%20Images/`

### Nuxt Configuration

The TwicPics module is configured in `nuxt.config.ts`:

```javascript
// TwicPics configuration
twicpics: {
    domain: 'https://elisa-makini.twic.pics',
    anticipation: 0.5,
    step: 100,
    maxDPR: 2,
},

// Add router rules for redirects
routeRules: {
  '/gallery-test': { redirect: '/gallery' }
}
```

## Utility Functions

We've created utility functions in `utils/twicpics.js` to handle image paths:

### 1. `formatTwicPicsPath(imagePath)`

Formats image paths for TwicPics:
- Prioritizes relative paths (e.g., `Bachelors/DSC01526.jpg`)
- Falls back to extracting paths from full Supabase URLs

```javascript
// Example usage
import { formatTwicPicsPath } from '~/utils/twicpics';

// With relative path (recommended)
formatTwicPicsPath('Bachelors/DSC01526.jpg');
// Returns: 'Bachelors/DSC01526.jpg'

// With full URL (fallback)
formatTwicPicsPath('https://pidimnoauortugjylfhw.supabase.co/storage/v1/object/public/Wedding%20Images/Bachelors/DSC01526.jpg');
// Returns: 'Bachelors/DSC01526.jpg'
```

### 2. `getTwicPicsSrc(imagePath)`

Creates a path for use in TwicImg components:

```javascript
import { getTwicPicsSrc } from '~/utils/twicpics';

const src = getTwicPicsSrc('Bachelors/DSC01526.jpg');
// Use in TwicImg: <TwicImg :src="src" />
```

### 3. `getTwicPicsUrl(imagePath, options)`

Generates a complete TwicPics URL with optional transformations:

```javascript
import { getTwicPicsUrl } from '~/utils/twicpics';

const url = getTwicPicsUrl('Bachelors/DSC01526.jpg', { 
  zoom: 1.2,
  focus: 'auto'
});
// Returns: 'https://elisa-makini.twic.pics/Bachelors/DSC01526.jpg?zoom=1.2&focus=auto'
```

## TwicPicsImage Component

We've created a reusable component in `components/TwicPicsImage.vue` that:
- Automatically formats image paths
- Supports all TwicPics transformation options
- Provides a slot for additional content (like captions)

### Usage

```vue
<template>
  <!-- Basic usage with relative path (recommended) -->
  <TwicPicsImage 
    src="Bachelors/DSC01526.jpg"
    ratio="4:3"
    transition="zoom"
  />
  
  <!-- With full Supabase URL (alternative) -->
  <TwicPicsImage 
    src="https://pidimnoauortugjylfhw.supabase.co/storage/v1/object/public/Wedding%20Images/Bachelors/DSC01526.jpg"
    ratio="4:3"
    transition="zoom"
  />
  
  <!-- With caption -->
  <TwicPicsImage src="Bachelors/DSC01526.jpg" ratio="4:3">
    <div class="caption">Wedding ceremony photo</div>
  </TwicPicsImage>
</template>

<script setup>
import TwicPicsImage from '~/components/TwicPicsImage.vue';
</script>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | String | (required) | Image path (relative or full URL) |
| `focus` | String | 'auto' | Focus point |
| `transition` | String | 'fade' | Transition effect |
| `placeholder` | String | 'preview' | Placeholder type |
| `ratio` | String/Number | undefined | Aspect ratio |
| `mode` | String | 'cover' | Fit mode |
| `position` | String | 'center' | Position |
| `background` | String | undefined | Background color |
| `modifiers` | Object | {} | Additional TwicPics transformations |

## Image Transformations

TwicPics supports various transformations:

### Basic Transformations

```vue
<!-- Zoom -->
<TwicPicsImage 
  src="Bachelors/DSC01526.jpg"
  :modifiers="{ zoom: 1.2 }"
/>

<!-- Focus point -->
<TwicPicsImage 
  src="Bachelors/DSC01526.jpg"
  focus="auto"
/>
```

### Advanced Transformations

```vue
<!-- Flip horizontally -->
<TwicPicsImage 
  src="Bachelors/DSC01526.jpg"
  :modifiers="{ flip: 'x' }"
/>

<!-- Rotate -->
<TwicPicsImage 
  src="Bachelors/DSC01526.jpg"
  :modifiers="{ turn: 'right' }"
/>

<!-- True color -->
<TwicPicsImage 
  src="Bachelors/DSC01526.jpg"
  :modifiers="{ truecolor: true }"
/>
```

### Display Modes

```vue
<!-- Cover mode (default) -->
<TwicPicsImage 
  src="Bachelors/DSC01526.jpg"
  mode="cover"
/>

<!-- Contain mode with background -->
<TwicPicsImage 
  src="Bachelors/DSC01526.jpg"
  mode="contain"
  background="#f0f0f0"
/>
```

## Best Practices

1. **Use Relative Paths**: Whenever possible, use relative paths like `Bachelors/DSC01526.jpg` instead of full Supabase URLs.

2. **Specify Aspect Ratios**: Always specify the `ratio` prop to prevent layout shifts during loading.

3. **Use Appropriate Transitions**: The `transition` prop helps create a smooth loading experience.

4. **Enable Placeholders**: The `placeholder="preview"` prop shows a low-quality preview while the image loads.

5. **Optimize for Mobile**: Use responsive ratios or different components for mobile and desktop.

## Folder Structure

Our Supabase Storage is organized into folders:
- `Bachelors/` - Bachelor party photos
- `Nikah/` - Wedding ceremony photos
- `Reception/` - Reception photos
- `Studio/` - Studio portrait photos
- `Miscellaneous/` - Other wedding-related photos

## Demo Page

Visit `/twicpics-demo` to see examples of the integration in action.

## Troubleshooting

### Images Not Loading

1. Check that the path is correct
2. Verify the image exists in Supabase Storage
3. Ensure the bucket is set to public
4. Check browser console for errors

### Incorrect Transformations

1. Verify the syntax of modifiers
2. Check TwicPics documentation for supported values
3. Try using the TwicPics URL directly to test

## Resources

- [TwicPics Documentation](https://www.twicpics.com/docs/)
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [TwicPics Nuxt Module](https://www.twicpics.com/docs/components/nuxt3) 