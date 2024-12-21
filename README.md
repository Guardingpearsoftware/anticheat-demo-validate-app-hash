# Android Application Hash Validation - Example Implementation

This repository provides a **Next.js** server-side implementation example of app hash validation, combining client-side integrity checks with a server-side hash verification mechanism. The system is designed to detect tampering of Android application packages (APK/AAB) and ensure the integrity of your app using AntiCheat's hash monitoring and validation framework.

More Infos: 
- [AntiCheat Documentation](https://docs.guardingpearsoftware.com)
- [Next.js Documentation](https://nextjs.org/docs)

---

## Overview

### **Why Validate the App Hash?**

App hash validation protects your app against tampering, such as unauthorized modifications to the code, resources, or package name. This is essential for:

- **Game Security**: Prevent cheating or unauthorized modifications.
- **Data Protection**: Secure applications handling sensitive user data.
- **Application Integrity**: Ensure the app is in its original, unaltered state.

### **How the System Works**

Using AntiCheat,
1. The app calculates its hash (e.g., using the `SHA-256` algorithm) at runtime. (Monitor)
2. The calculated hash is sent to a remote server for comparison. (Detector)
3. The server returns the correct hash for the app version being validated. (Detector)
4. If the locally calculated hash **does not match** the server-provided value, the app is flagged as tampered. (Detected-Tampering-Event)

---

## Client Integration

### **1. AndroidPackageHashMonitor**

The `AndroidPackageHashMonitor` is designed to calculate the app's hash at runtime. It uses the hashing algorithm specified in your project settings (default: `SHA-256`) and notifies observers about the calculated hash.

#### **Features:**
- Calculates the hash of the entire app package (APK/AAB).
- Supports lifecycle management (start, pause, resume, stop).
- Allows observer subscription for event notifications.
- Retrieves the hashing algorithm from global settings.

Refer to the `AndroidPackageHashMonitor` documentation for detailed setup instructions.

---

### **2. AndroidPackageTamperingDetector**

The `AndroidPackageTamperingDetector` observes the calculated hash result from the monitor and detects tampering if there is a mismatch between the calculated and expected hashes.

#### **Features:**
- Subscribes to monitors (e.g., `AndroidPackageHashMonitor`) on the same GameObject.
- Notifies observers (such as the AntiCheat-Monitor) of tampering events.
- Triggers the `OnCheatingDetectionEvent` for custom event handling.

Follow the `AndroidPackageTamperingDetector` documentation to integrate it into your AntiCheat system.

---

### **3. Configuring Project Settings**

To activate app hash validation in your Unity project:

1. Go to **`Edit -> Project Settings -> GuardingPearSoftware -> AntiCheat`**.
2. Navigate to the **`Android - App Hash - Settings`** section.
3. Configure the following options:
   - **Verify App Hash**: Enable this to activate hash validation.
   - **Used Hash Algorithm**: Set the algorithm (default: `SHA-256`) for both client and server.
   - **Remote Hash Location**: Specify the server's endpoint for retrieving the expected hash. Use `{version}` as a placeholder for the app version (e.g., `https://yourserver.com/hash?version={version}`).

---

## Server Implementation

This repository provides a demo implementation using **Next.js** as the backend framework. 

### **1. Project Structure**

The backend project is organized as follows:

```
src/
├── app/
│   └── api/
│       └── hash/
│           ├── route.ts
│           └── hash.json
```

### **2. Storing Hashes**

The `hash.json` file contains the expected hashes for each app version. For example:

```json
{
	"0.1": "12:AF:34:BC:56:DE:78:90:AB:CD:EF:12:34:56:78:90:12:34:56:78:9A:BC:DE:F0:12:34:56:78:90:AB:CD:11",
	"0.2": "00:E4:C4:13:2F:09:91:4A:B5:A0:D6:64:AC:38:FD:50:82:02:3C:45:5E:64:69:B1:F7:0E:43:04:14:1C:1A:3A"
}
```

### **3. API Route Implementation**

The `route.ts` file serves as the handler for hash requests:

```typescript
// app/api/hash/route.ts

import { NextRequest } from 'next/server';
import hashJson from './hash.json';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const version = searchParams.get('version');

    if (version && version in hashJson) {
        // Return the hash for the requested version
        return new Response(hashJson[version as keyof typeof hashJson]);
    }

    // Return an error if the version is not found
    return new Response('Unknown version', { status: 400 });
}
```

#### **Example API Responses:**

1. **Successful Request:**
   ```
   GET /api/hash?version=0.2
   Response: 00:E4:C4:13:2F:09:91:4A:B5:A0:D6:64:AC:38:FD:50:82:02:3C:45:5E:64:69:B1:F7:0E:43:04:14:1C:1A:3A
   ```

2. **Error Case:**
   ```
   GET /api/hash?version=0.3
   Response: Unknown version (400 Bad Request)
   ```

---

### **4. Deployment Considerations**

- **Security**: Use HTTPS for secure communication between the app and server.
- **Rate Limiting**: Implement rate limiting to prevent abuse.
- **Environment Variables**: Store sensitive settings in environment variables.
- **Error Handling**: Provide meaningful error messages for debugging and production use.

---

### **5. Testing the API**

Use tools like `curl` to test the endpoint locally:

```bash
curl "http://localhost:3000/api/hash?version=0.2"
```

Expected response:
```
00:E4:C4:13:2F:09:91:4A:B5:A0:D6:64:AC:38:FD:50:82:02:3C:45:5E:64:69:B1:F7:0E:43:04:14:1C:1A:3A
```

---

### **6. Deployment**

Deploy the backend using services like **Vercel**, **AWS**, etc. For example, to deploy on Vercel:

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy the project:
   ```bash
   vercel
   ```

3. Configure your deployment to use environment variables for sensitive data, such as API keys or security configurations.

[Vercel Website](https://vercel.com/)
