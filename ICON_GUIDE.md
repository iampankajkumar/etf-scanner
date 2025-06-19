# Icon Guide for RSI Tracker App

## Current Icon Setup ✅

Your app already has icons configured in `app.json`:

- **App Icon**: `./src/assets/icon.png` (main app icon)
- **Adaptive Icon**: `./src/assets/adaptive-icon.png` (Android adaptive icon)
- **Splash Screen**: `./src/assets/splash-icon.png` (loading screen)
- **Favicon**: `./src/assets/favicon.png` (web browser tab icon)

## Types of Icons You Can Add

### 1. **App Icons (Already Set Up)**
These appear on the home screen and app stores.

**Current Configuration:**
```json
{
  "expo": {
    "icon": "./src/assets/icon.png",
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./src/assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    }
  }
}
```

### 2. **In-App Icons (Using @expo/vector-icons)**
For buttons, navigation, and UI elements.

**Available Icon Libraries:**
- AntDesign
- Entypo (already used in your app)
- FontAwesome
- Ionicons
- MaterialIcons
- MaterialCommunityIcons

**Example Usage:**
```tsx
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

// In your component
<Ionicons name="refresh" size={24} color="white" />
<MaterialIcons name="trending-up" size={24} color="green" />
<FontAwesome name="line-chart" size={24} color="blue" />
```

### 3. **Custom Icons**
Add your own icon files to the assets folder.

## How to Replace/Update Icons

### Option 1: Replace Existing Icon Files
1. Create your new icon (1024x1024 PNG recommended)
2. Replace the files in `src/assets/`:
   - `icon.png` - Main app icon
   - `adaptive-icon.png` - Android adaptive icon
   - `splash-icon.png` - Splash screen icon

### Option 2: Add New Custom Icons
1. Add your icon files to `src/assets/`
2. Import and use them:

```tsx
// Add to your component
<Image source={require('../assets/my-custom-icon.png')} style={{width: 24, height: 24}} />
```

## Icon Specifications

### App Icons:
- **iOS**: 1024x1024 PNG
- **Android**: 1024x1024 PNG (adaptive icon)
- **Format**: PNG with transparent background

### In-App Icons:
- **Size**: 16px, 24px, 32px, 48px (common sizes)
- **Format**: PNG or SVG
- **Colors**: Match your app theme

## Quick Icon Additions for Your App

Here are some relevant icons you might want to add:

### 1. **Financial/Trading Icons**
```tsx
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

// RSI/Chart icons
<MaterialIcons name="trending-up" size={24} color="green" />
<MaterialIcons name="trending-down" size={24} color="red" />
<FontAwesome5 name="chart-line" size={24} color="blue" />

// Money/Finance icons
<MaterialIcons name="attach-money" size={24} color="green" />
<FontAwesome5 name="coins" size={24} color="gold" />
```

### 2. **Navigation Icons**
```tsx
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Menu and navigation
<Ionicons name="menu" size={24} color="white" />
<Ionicons name="arrow-back" size={24} color="white" />
<MaterialIcons name="refresh" size={24} color="white" />
```

### 3. **Status Icons**
```tsx
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Online/Offline status
<Ionicons name="wifi" size={24} color="green" />
<Ionicons name="wifi-off" size={24} color="red" />
<MaterialCommunityIcons name="database" size={24} color="blue" />
```

## Example: Adding Icons to Your App

Let's add some icons to your existing components:

### 1. **Update Menu Button** (in App.tsx)
```tsx
// Replace the current menu button with a proper icon
<TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
  <MaterialIcons name="more-vert" size={24} color={colors.text} />
</TouchableOpacity>
```

### 2. **Add Status Icons for Cache**
```tsx
// In your cache status indicator
{fromCache && (
  <View style={styles.cacheStatusContainer}>
    <Ionicons name="wifi-off" size={16} color={colors.text} />
    <Text style={styles.cacheStatusText}>
      Offline mode - Data from {cacheAge} hours ago
    </Text>
  </View>
)}
```

### 3. **Add Refresh Icon**
```tsx
// In your menu items
{
  title: 'Refresh Data',
  icon: <MaterialIcons name="refresh" size={20} color={colors.text} />,
  onPress: () => {
    setMenuVisible(false);
    refreshRSI();
  },
}
```

## Tools for Creating Icons

### Free Icon Resources:
- **Icons8**: https://icons8.com/
- **Flaticon**: https://www.flaticon.com/
- **Material Design Icons**: https://materialdesignicons.com/
- **Feather Icons**: https://feathericons.com/

### Icon Generators:
- **App Icon Generator**: https://appicon.co/
- **Adaptive Icon Generator**: https://romannurik.github.io/AndroidAssetStudio/

## Current Icon Usage in Your App

I can see you're already using:
```tsx
// In App.tsx
<Entypo name="dots-three-vertical" size={24} color={colors.text} />

// Header icon
<Image source={require('./assets/icon.png')} style={styles.headerIcon} />
```

Would you like me to help you add specific icons to any part of your app?