// app/api/hash/route.ts

/**
 * API Route Handler for Android app hash validation
 * Endpoint: /api/hash?version={version}
 * 
 * This endpoint returns the stored hash for a specific app version.
 * It's designed to work with GuardingPearSoftware's AntiCheat system
 * for Android app integrity validation.
 */

import { NextRequest } from 'next/server';
import hashJson from './hash.json';

/**
 * GET handler for hash validation requests
 * @param req - The incoming HTTP request
 * @returns Response containing either the hash string or an error message
 * 
 * Success Response: Plain text SHA-256 hash (e.g., "00:E4:C4:13:...")
 * Error Response: "Unknown version" with 400 status code
 */
export async function GET(req: NextRequest) {
    // Extract version parameter from query string
    const { searchParams } = new URL(req.url);
    const version = searchParams.get('version');

    // Check if version exists in our hash database
    if (version && version in hashJson) {
        // Return the hash as plain text to match AntiCheat's expected format
        return new Response(hashJson[version as keyof typeof hashJson]);
    }

    // Return error for unknown versions
    return new Response('Unknown version', { 
        status: 400,
        statusText: 'Bad Request - Unknown Version'
    });
}