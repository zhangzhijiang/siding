# Logo/Icon Adjustment Guide

## What Was Changed

The Android adaptive icon inset has been reduced from **16.7%** to **5%** to minimize gaps around your logo.

## Files Modified

- `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml`
- `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml`

## Further Adjustments

If you want to adjust the gap further, edit the `android:inset` value in both files:

### Options:

1. **No gap (fill completely)**: Set `android:inset="0%"`

   - ⚠️ Warning: Logo edges may be slightly clipped on some device shapes

2. **Minimal gap**: Set `android:inset="2%"` (current: 5%)

   - Good balance between fill and safety margin

3. **Small gap**: Set `android:inset="5%"` (current setting)

   - Recommended for most cases

4. **Medium gap**: Set `android:inset="10%"`

   - More conservative, ensures no clipping

5. **Original gap**: Set `android:inset="16.7%"`
   - Android's default safe zone

## Testing Your Icon

After making changes:

1. **Rebuild the app**:

   ```bash
   npm run android:sync
   ```

2. **Install and test**:

   ```bash
   npm run android:dev
   ```

3. **Check on device/emulator**:
   - Look at the app icon on the home screen
   - Check different launcher shapes (square, rounded square, circle)
   - Verify the logo looks good in all cases

## Using Your Own Logo

If you want to replace the current icon with your `logo.png`:

### Option 1: Android Asset Studio (Easiest)

1. Go to: https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
2. Upload your `logo.png`
3. Set padding to 0-5% (to minimize gaps)
4. Download and replace the mipmap folders

### Option 2: Manual Update

1. Resize your logo to 512x512px
2. Use an image editor to create versions for each density:
   - mdpi: 48x48px
   - hdpi: 72x72px
   - xhdpi: 96x96px
   - xxhdpi: 144x144px
   - xxxhdpi: 192x192px
3. Replace the `ic_launcher_foreground.png` files in each mipmap folder
4. Rebuild the app

## Current Settings

- **Inset**: 5% (reduced from 16.7%)
- **Background**: Uses `ic_launcher_background` (teal grid pattern)
- **Foreground**: Uses `ic_launcher_foreground` (default Capacitor icon)

To use your logo, you'll need to replace the foreground images in the mipmap folders.
