# Sidebar Navigation - Testing Guide

## Quick Start

### 1. Verify Sidebar Displays
- [ ] Sidebar appears on left side of dashboard
- [ ] Sidebar shows "PC Doctor" branding when expanded
- [ ] Sidebar width is 256px when expanded
- [ ] Sidebar width is 80px when collapsed

### 2. Test Navigation
- [ ] Click "Dashboard" → navigates to `/dashboard`
- [ ] Click "History" → navigates to `/dashboard/history`
- [ ] Click "Settings" → navigates to `/dashboard/settings`
- [ ] Active page is highlighted with primary color
- [ ] Active page shows border and shadow effect

### 3. Test Collapse/Expand
- [ ] Click chevron button to collapse sidebar
- [ ] Sidebar smoothly animates to collapsed state
- [ ] Only icons visible when collapsed
- [ ] Click chevron again to expand
- [ ] Sidebar smoothly animates back to expanded state
- [ ] Text labels reappear when expanded

### 4. Test Mobile Responsiveness
- [ ] Resize browser to < 1024px width
- [ ] Sidebar auto-collapses to icon-only view
- [ ] Resize back to > 1024px
- [ ] Sidebar remains in current state (manual control)
- [ ] Navigation still works on mobile

### 5. Test History Page
- [ ] Navigate to History page
- [ ] Past diagnoses load and display
- [ ] Search bar filters diagnoses by:
  - [ ] Problem description
  - [ ] Diagnosis text
  - [ ] CPU info
  - [ ] GPU info
  - [ ] OS info
- [ ] Results counter updates correctly
- [ ] "Load" button loads diagnosis to dashboard
- [ ] Delete button removes diagnosis
- [ ] Empty state shows when no diagnoses exist

### 6. Test Loading Diagnosis from History
- [ ] Go to History page
- [ ] Click "Load" on a diagnosis
- [ ] Redirected to Dashboard
- [ ] Problem description is pre-filled
- [ ] System specs are pre-filled
- [ ] Diagnosis results display
- [ ] Can modify and re-diagnose

### 7. Test Settings Page
- [ ] Navigate to Settings page
- [ ] Email address displays
- [ ] Account status shows "Active"
- [ ] Logout button works
- [ ] After logout, redirected to home page

### 8. Test Authentication
- [ ] Logout from any dashboard page
- [ ] Try accessing `/dashboard` directly
- [ ] Redirected to `/login`
- [ ] Try accessing `/dashboard/history` directly
- [ ] Redirected to `/login`
- [ ] Try accessing `/dashboard/settings` directly
- [ ] Redirected to `/login`

### 9. Test Styling Consistency
- [ ] Sidebar uses glass morphism (backdrop blur)
- [ ] Navigation items have hover effects
- [ ] Active route has primary color highlighting
- [ ] Animations are smooth (300ms)
- [ ] Icons render correctly
- [ ] Text is readable in both light and dark modes

### 10. Test Existing Dashboard Functionality
- [ ] Auto-detect specs button works
- [ ] System specs form accepts input
- [ ] Problem description textarea works
- [ ] Diagnose button triggers analysis
- [ ] Progress indicator shows during analysis
- [ ] Results display on right side
- [ ] Solution steps expand/collapse
- [ ] Commands copy to clipboard
- [ ] Download PDF works
- [ ] Download script works

## Responsive Breakpoints

### Desktop (≥ 1024px)
- Sidebar visible and expandable
- Main content has left margin
- Full navigation labels visible

### Tablet (768px - 1023px)
- Sidebar auto-collapses
- Icon-only view
- Main content adjusts

### Mobile (< 768px)
- Sidebar auto-collapses
- Icon-only view
- Full responsive layout

## Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance Checks
- [ ] No console errors
- [ ] Sidebar animations are smooth
- [ ] Page transitions are smooth
- [ ] Search filters respond quickly
- [ ] No layout shifts when loading

## Accessibility Checks
- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Links have proper focus states
- [ ] Icons have alt text/titles
- [ ] Color contrast is sufficient

## Known Limitations
- Settings page is placeholder (future expansion)
- History limited to 50 most recent diagnoses
- No bulk operations on history

## Troubleshooting

### Sidebar not showing
- Check if user is authenticated
- Verify sidebar.tsx is in components folder
- Check browser console for errors

### Navigation not working
- Verify routes exist
- Check usePathname is working
- Verify Link components have correct href

### History not loading
- Check Supabase connection
- Verify user has diagnoses in database
- Check browser console for API errors

### Mobile not collapsing
- Check window resize listener is active
- Verify media query breakpoint (1024px)
- Test in actual mobile device or DevTools

## Performance Optimization
- Sidebar uses fixed positioning (no reflow)
- Navigation items use CSS transitions
- Mobile detection uses resize listener with debounce
- History page uses pagination (50 items limit)
