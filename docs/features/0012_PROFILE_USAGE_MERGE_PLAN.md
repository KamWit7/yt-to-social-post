# Profile and Usage Page Merge Plan

## Description

This feature merges the standalone usage page (`/usage`) into the profile page (`/profile`) to consolidate user account information and usage statistics in a single location. The user wants to combine these two pages so that usage information is displayed as part of the profile page rather than being a separate route.

## Files and Functions to be Changed

### Pages and Routing

- **`src/app/(user)/profile/page.tsx`** - Update to include usage statistics alongside user profile information
- **`src/app/(user)/usage/page.tsx`** - Remove this file as usage will be integrated into profile
- **`src/app/(user)/layout.tsx`** - Update `getPageConfig()` function to remove usage-specific configuration and update `isProfileOrUsage` logic

### Components to Modify

- **`src/components/auth/UserProfile/UserProfile.tsx`** - Extend to include usage statistics display alongside existing user information
- **`src/components/usage/UsageStats.tsx`** - Modify to be embeddable within profile page (remove standalone card wrapper if needed)
- **`src/components/usage/index.ts`** - Update exports if needed for new integration

### Navigation and Constants

- **`src/utils/constants.ts`** - Remove `/usage` route from ROUTES constant or mark as deprecated
- **`src/components/common/header/constants.ts`** - Update `USER_MENU_ITEMS` to remove usage menu item
- **`src/components/common/header/UsageCounter/UsageCounter.tsx`** - Update pathname check logic since usage page will no longer exist

### Metadata and SEO

- Update profile page metadata to reflect that it now includes usage information

## Implementation Algorithm

### Step 1: Component Integration

1. Modify `UserProfile.tsx` to accept an optional `showUsage` prop (default true)
2. Import and integrate `UsageStats` component within the profile card structure
3. Adjust layout to accommodate both user info and usage stats in a cohesive design
4. Ensure proper loading states and error handling for both user profile and usage data

### Step 2: Usage Component Adaptation

1. Create a variant of `UsageStats` that works within the profile context
2. Remove or modify the standalone card wrapper to fit within profile layout
3. Maintain all existing functionality (progress bars, status indicators, etc.)

### Step 3: Routing and Navigation Updates

1. Remove usage page file and route
2. Update navigation menu to remove usage link
3. Update layout logic to handle only profile page (remove usage-specific styling)
4. Update any internal links that point to `/usage` to point to `/profile` instead

### Step 4: Counter Component Updates

1. Modify `UsageCounter.tsx` to remove the pathname check for `/usage` since that route will no longer exist
2. Ensure the usage counter still functions properly on all other pages

### Step 5: Metadata and Configuration

1. Update profile page metadata to include usage-related keywords
2. Update layout configuration to reflect the merged functionality
3. Test that all existing usage functionality works within the profile context

## Technical Considerations

- Maintain backward compatibility for any existing bookmarks to `/usage` by potentially adding a redirect
- Ensure that usage statistics loading doesn't block profile information display
- Preserve all existing usage functionality including real-time updates and warning levels
- Keep the same responsive design principles for the combined interface
- Maintain proper TypeScript types for the integrated components
