// lib/geo.ts
import { NextRequest } from "next/server";

// Mock function - replace with actual IP lookup service
export async function getCountryFromIP(ip: string): Promise<string | null> {
  if (!ip || ip === '::1' || ip.startsWith('127.')) {
    // Localhost or invalid IP
    return null;
  }

  if (process.env.NODE_ENV === "development") {
    // For development, return a mock value
    return "BR"; // Brazil as default for testing
  }

  try {
    // In production, use a real IP geolocation service
    // Example with ip-api.com (free tier available)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`);
    if (response.ok) {
      const data = await response.json();
      return data.countryCode || null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching country from IP:", error);
    return null;
  }
}