# Development Commands for Local Testing

## Quick Development Workflow

### 1. Build and Deploy to Emulator/Device (Recommended)

```bash
npm run android:dev
```

This will:

- Build your web app
- Sync to Android
- Build debug APK
- Install to connected device/emulator

### 2. Build, Sync, and Open Android Studio

```bash
npm run android:run
```

This will:

- Build and sync
- Open Android Studio
- Let you select device and run

### 3. Open Android Project in Android Studio

```bash
npm run android:open
```

Opens the Android project in Android Studio for manual building/running.

## Step-by-Step Commands

### Build Web App Only

```bash
npm run build:android
```

### Sync Web App to Android

```bash
npm run android:sync
```

### Build Debug APK

```bash
cd android
gradlew.bat assembleDebug
```

### Install Debug APK to Device

```bash
cd android
gradlew.bat installDebug
```

### Check Connected Devices

```bash
adb devices
```

### Install APK Manually (if auto-install fails)

```bash
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

### Reinstall App (uninstall then install)

```bash
adb uninstall com.idatagear.siding
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

## Clean Build Commands

### Clean Everything

```bash
npm run clean:all
```

### Clean and Rebuild

```bash
npm run android:clean:build
```

## Development Tips

1. **For quick iterations**: Use `npm run android:dev` - it's the fastest way
2. **For debugging**: Use `npm run android:run` to open in Android Studio
3. **Check logs**: Use `adb logcat` to see app logs
4. **Restart ADB**: If device not detected, run `adb kill-server && adb start-server`

## Common Issues

### Device not found

```bash
adb kill-server
adb start-server
adb devices
```

### App already installed

```bash
adb uninstall com.idatagear.siding
npm run android:dev
```

### Build errors

```bash
npm run clean:all
npm run android:sync
```

## Google Play Store Release

### Prerequisites

Before building for release, ensure you have:

1. **Keystore file** (`android/key.properties`):

   - `storeFile` - path to your keystore file
   - `storePassword` - keystore password
   - `keyAlias` - key alias name
   - `keyPassword` - key password

2. **Version updated** in `android/app/build.gradle`:
   - `versionCode` - increment for each release (currently: 3)
   - `versionName` - user-facing version (currently: "1.0.0")

### Build Release App Bundle (AAB)

#### Quick Build (Recommended)

```bash
npm run android:build
```

This will:

- Build the web app for Android
- Sync to Android project
- Build the signed release App Bundle (AAB)

#### Clean Build (if you encounter issues)

```bash
npm run android:clean:build
```

This will:

- Clean all build artifacts
- Rebuild everything from scratch
- Generate the release AAB

#### Manual Step-by-Step

```bash
# 1. Build web app for Android
npm run build:android

# 2. Sync to Android
npx cap sync android

# 3. Build release bundle
cd android
gradlew.bat bundleRelease
cd ..
```

### Locate the App Bundle

After building, your AAB file will be located at:

```
android\app\build\outputs\bundle\release\app-release.aab
```

### Locate the Deobfuscation File (Mapping File)

When `minifyEnabled` is `true`, a mapping file is generated for crash/ANR debugging:

```
android\app\build\outputs\mapping\release\mapping.txt
```

**Important**: Upload this file to Google Play Console along with your AAB to enable proper crash reporting and debugging.

### Verify the Build

Before uploading to Google Play:

1. **Check file exists**:

   ```bash
   dir android\app\build\outputs\bundle\release\app-release.aab
   ```

2. **Check file size** (should be reasonable, typically 5-50MB):
   ```bash
   dir android\app\build\outputs\bundle\release\app-release.aab
   ```

### Version Management

Before each release:

1. **Update version code** in `android/app/build.gradle`:

   ```gradle
   versionCode 4  // Increment by 1 for each release
   versionName "1.0.1"  // Update as needed (e.g., 1.0.1, 1.1.0, 2.0.0)
   ```

2. **Commit version changes**:
   ```bash
   git add android/app/build.gradle
   git commit -m "Bump version to 1.0.1 (versionCode 4)"
   ```

### Upload to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app
3. Go to **Production** (or **Internal testing** / **Closed testing** / **Open testing**)
4. Click **Create new release**
5. Upload the AAB file: `android\app\build\outputs\bundle\release\app-release.aab`
6. **Upload the mapping file** (if available):
   - Go to **App bundle explorer** or **Release** section
   - Find **Deobfuscation file** or **ProGuard mapping file**
   - Upload: `android\app\build\outputs\mapping\release\mapping.txt`
   - This eliminates the warning about missing deobfuscation file
7. Fill in release notes
8. Review and roll out

### Testing Before Release

#### Test the Release Build Locally

You can't install an AAB directly, but you can test the release APK:

```bash
# Build release APK (for testing only)
cd android
gradlew.bat assembleRelease
cd ..

# Install release APK to device
adb install android\app\build\outputs\apk\release\app-release.apk
```

**Note**: The release APK is for testing only. Google Play requires AAB format for uploads.

### Troubleshooting Release Builds

#### Build fails with signing errors

1. Verify `android/key.properties` exists and is correct
2. Check keystore file path is correct
3. Verify passwords are correct

#### Build succeeds but AAB is missing

```bash
# Clean and rebuild
npm run clean:all
npm run android:build
```

#### Version code conflicts

If Google Play rejects due to version code:

- Increment `versionCode` in `android/app/build.gradle`
- Rebuild: `npm run android:build`

### Release Checklist

- [ ] Version code incremented in `build.gradle`
- [ ] Version name updated (if needed)
- [ ] All features tested in debug build
- [ ] Release build successful (`npm run android:build`)
- [ ] AAB file located and verified
- [ ] Mapping file located (`android\app\build\outputs\mapping\release\mapping.txt`)
- [ ] Release notes prepared
- [ ] Screenshots/descriptions updated in Play Console (if needed)
- [ ] Privacy policy URL set (if required)
- [ ] Content rating completed
- [ ] Ready to upload to Play Console
- [ ] Mapping file uploaded to Play Console (to avoid deobfuscation warning)
