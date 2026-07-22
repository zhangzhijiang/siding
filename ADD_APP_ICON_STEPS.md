# Steps to Add App Icon to Android App

## Method 1: Using Android Asset Studio (Recommended - Easiest)

1. **Go to Android Asset Studio:**

   - Visit: https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html

2. **Upload your logo:**

   - Click "Image" tab
   - Upload your `logo.png` file (from project root)

3. **Configure the icon:**

   - **Shape**: Choose "None" to keep your logo as-is, or select a shape
   - **Background color**: `#0f172a` (matches your app's dark theme)
   - **Padding**: 10-20% (adjust to your preference)
   - **Resize**: Adjust if needed

4. **Download:**

   - Click "Download" button (bottom right)
   - This downloads a ZIP file

5. **Extract and replace:**

   - Extract the downloaded ZIP file
   - You'll see a `res` folder inside
   - Copy all the `mipmap-*` folders from the ZIP's `res` folder
   - Paste them into: `android/app/src/main/res/`
   - **Replace** the existing mipmap folders when prompted

6. **Rebuild your app:**
   ```bash
   npm run android:sync
   npx cap run android
   ```

## Method 2: Manual Setup with Capacitor Assets

1. **Create resources folder:**

   ```bash
   mkdir resources
   ```

2. **Copy your logo:**

   ```bash
   copy logo.png resources\icon.png
   ```

3. **Generate icons:**
   ```bash
   npx capacitor-assets generate --android --asset-path ./resources
   ```

## Method 3: Manual Replacement (If you have image editing software)

1. **Resize your logo.png to these sizes:**

   - 48x48px → Save as `android/app/src/main/res/mipmap-mdpi/ic_launcher.png`
   - 72x72px → Save as `android/app/src/main/res/mipmap-hdpi/ic_launcher.png`
   - 96x96px → Save as `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png`
   - 144x144px → Save as `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png`
   - 192x192px → Save as `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`

2. **Also create round versions** (same sizes):

   - Copy each `ic_launcher.png` and rename to `ic_launcher_round.png` in each folder

3. **Rebuild:**
   ```bash
   npm run android:sync
   npx cap run android
   ```

## Quick Command Reference

After updating icons, always rebuild:

```bash
npm run android:sync
npx cap run android
```

## Icon File Locations

Your icons should be in:

```
android/app/src/main/res/
├── mipmap-mdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-hdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-xhdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-xxhdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
└── mipmap-xxxhdpi/
    ├── ic_launcher.png
    └── ic_launcher_round.png
```
