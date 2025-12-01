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
