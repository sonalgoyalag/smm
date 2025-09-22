# Componentized Website Structure

## Overview
The website has been refactored to use a component-based architecture for better maintainability and reusability.

## New Structure

### Components Directory (`components/`)
- **`header.html`** - Main navigation header with logo, menu, and social links
- **`footer.html`** - Footer with contact info, quick links, and recent events
- **`mobile-nav.html`** - Mobile navigation menu
- **`sidebar.html`** - Sidebar component with organization info
- **`common-elements.html`** - Search popup and scroll-to-top functionality
- **`page-template.html`** - Template for creating new pages

### Component Loader (`assets/js/components.js`)
- Automatically loads components into designated containers
- Handles navigation highlighting based on current page
- Initializes mobile navigation
- Updates dynamic content (year in footer)

## How to Use

### For Existing Pages
Each HTML page now uses component placeholders:

```html
<!-- Header Component -->
<div id="header-component"></div>

<!-- Your page content goes here -->

<!-- Footer Component -->
<div id="footer-component"></div>

<!-- Mobile Navigation Component -->
<div id="mobile-nav-component"></div>

<!-- Common Elements Component -->
<div id="common-elements-component"></div>

<!-- Sidebar Component -->
<div id="sidebar-component"></div>
```

### For New Pages
1. Copy `components/page-template.html`
2. Replace the `<!-- PAGE CONTENT GOES HERE -->` section with your content
3. Update the page title in the `<head>` section
4. Save in the root directory

### Component Loading
Components are loaded automatically when the page loads via the `components.js` script.

## Benefits

### ✅ Maintainability
- Update header/footer in one place, changes reflect across all pages
- Consistent navigation and branding
- Easier to manage contact information and links

### ✅ Development Efficiency
- No more copying/pasting header and footer code
- Template-based page creation
- Centralized component management

### ✅ Consistency
- Ensures all pages have the same header/footer structure
- Automatic navigation highlighting
- Consistent styling and behavior

## Files Updated

### Completed
- ✅ `index.html` - Converted to use components
- ✅ `about-new.html` - Example of new componentized page

### Remaining (Optional)
- `about.html`
- `contact.html`
- `donate.html`
- `gallery.html`
- `what-we-do.html`

## Script Helper
Use `scripts/update-pages.js` to help convert remaining pages (requires Node.js):

```bash
node scripts/update-pages.js
```

## Testing
1. Start the development server: `python3 -m http.server 8000`
2. Visit `http://localhost:8000`
3. Test navigation between pages
4. Verify header/footer appear correctly
5. Check mobile navigation functionality

## Browser Compatibility
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers
- ✅ Uses standard fetch API (IE11+ support)

## Notes
- Components are loaded asynchronously but appear quickly due to local file access
- Navigation highlighting automatically detects current page
- All original functionality preserved
- No external dependencies required
