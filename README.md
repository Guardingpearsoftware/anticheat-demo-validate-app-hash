# Validate App Hash - Example Implementation

This Next.js demo shows a server-side implementation for validating Android application hashes against a static JSON file that works with AntiCheat's hash validation system to detect application tampering and ensure package integrity by comparing hashes computed at runtime with known valid values stored on the server.

# Overview

## Why Validate the App Hash?

Validating the app hash ensures that the app has not been tampered with or modified (e.g., by changing the package name, code, or resources). This is critical for security-sensitive applications, such as games or apps handling sensitive data.

## How It Works

Using AntiCheat, 
1. the app calculates its hash (e.g., using `SHA-256`) at runtime.
2. the app makes a request to a remote server to retrieve the correct hash for the given app version.
3. the app compares the locally calculated hash with the one provided by the server.
4. if the hashes do not match, the app is flagged as tampered.

# Client - Project Setup

## 1. Hash Monitor

The AndroidPackageHashMonitor calculates the hash of the entire app (APK/AAB) at runtime and provides it to the detector. Follow the monitor's documentation to integrate it into your app.

## 2. Tampering Detector

To detect tampering (mismatched hash), add the AndroidPackageTamperingDetector to your AntiCheat-Monitor, configured to react to mismatched hashes as cheating. Follow the detector's documentation for detailed implementation guidance.

## 3. Project Settings

To activate app hash validation in your project:

- Go to `Edit -> Project Settings -> GuardingPearSoftware -> AntiCheat`.
- Navigate to the `Android - App Hash - Settings` section.
- Configure the following settings:
	- Verify App Hash: Enable this option to validate the app hash against a remote source.
	- Used Hash Algorithm: Use `SHA-256` for generating and validating hashes (recommended).
	- Remote Hash Location: Specify the remote server's endpoint to fetch the hash. Use {version} as a placeholder for the app version (e.g., `https://example.com/yourapp/hash?version={version}`).

# Server - Project Setup

## 1. Project Structure

The demo Next.js project has the following structure:
```
src/
├── app/
│   └── api/
│       └── hash/
│           ├── route.ts
│           └── hash.json
```

## 2. Hash Storage

The `hash.json` file stores your app versions and their corresponding hashes (for example):
```json
{
    "0.1": "12:AF:34:BC:56:DE:78:90:AB:CD:EF:12:34:56:78:90:12:34:56:78:9A:BC:DE:F0:12:34:56:78:90:AB:CD:11",
    "0.2": "00:E4:C4:13:2F:09:91:4A:B5:A0:D6:64:AC:38:FD:50:82:02:3C:45:5E:64:69:B1:F7:0E:43:04:14:1C:1A:3A"
}
```

## 3. API Implementation

The route handler in `route.ts` serves hash requests:
```typescript
// app/api/hash/route.ts

import { NextRequest } from 'next/server';
import hashJson from './hash.json';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const version = searchParams.get('version');

    if (version && version in hashJson) {
        // Return plain text response with just the hash
        return new Response(hashJson[version as keyof typeof hashJson]);
    }

    // Return plain text error
    return new Response('Unknown version', { status: 400 });
}
```

The responses will be:

Success case:
```
00:E4:C4:13:2F:09:91:4A:B5:A0:D6:64:AC:38:FD:50:82:02:3C:45:5E:64:69:B1:F7:0E:43:04:14:1C:1A:3A
```

Error case:
```
Unknown version
```

## 4. Deployment Considerations

- Ensure HTTPS is enabled for production use
- Keep `hash.json` secure and not publicly accessible
- Consider implementing rate limiting
- Add proper error handling
- Use environment variables for sensitive configurations

## 5. Testing

Test your endpoint using curl:
```bash
curl "http://localhost:3000/api/hash?version=0.2"
```

Expected response:
```
00:E4:C4:13:2F:09:91:4A:B5:A0:D6:64:AC:38:FD:50:82:02:3C:45:5E:64:69:B1:F7:0E:43:04:14:1C:1A:3A
```

## 5. Deploy

For example, deploy the backend on Vercel with a free account to get started.