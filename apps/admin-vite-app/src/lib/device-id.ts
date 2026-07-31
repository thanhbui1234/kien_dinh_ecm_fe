import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { STORAGE_KEYS } from 'shared-api';

export interface DeviceInfo {
  deviceId: string;
  fingerprint: string;
}

export async function getDeviceInfo(): Promise<DeviceInfo> {
  let deviceId = localStorage.getItem(STORAGE_KEYS.DEVICE_UUID);
  if (!deviceId) {
    deviceId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : `uuid_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(STORAGE_KEYS.DEVICE_UUID, deviceId);
  }

  let fingerprint = 'unknown_fp';
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    fingerprint = result.visitorId;
  } catch (error) {
    console.error('Failed to load FingerprintJS:', error);
  }

  return {
    deviceId,
    fingerprint,
  };
}
