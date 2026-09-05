# Info.plist snippets (add after `npx cap add ios`)

Paste into the iOS app `Info.plist` (or Xcode target → Info).

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>MOMENT uses your location to unlock Moments at the place they were left.</string>
<key>NSCameraUsageDescription</key>
<string>MOMENT uses the camera to capture photos and video for Moments.</string>
<key>NSMicrophoneUsageDescription</key>
<string>MOMENT uses the microphone for voice notes.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>MOMENT lets you attach photos and videos from your library.</string>
<key>ITSAppUsesNonExemptEncryption</key>
<false/>
```

Bundle ID: `app.moment.ios`  
Display name: MOMENT
