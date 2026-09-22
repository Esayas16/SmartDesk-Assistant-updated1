// The browser sandbox cannot perform real low-level network probing (raw
// pings, ARP lookups, adapter speed negotiation, etc). Everything here is
// clearly simulated demo data standing in for what a native diagnostic
// agent would report, and every consumer must label it as DEMO DATA.

import { isOnline } from './connectivityService'

function jitter(base, spread) {
  return Math.round(base + (Math.random() - 0.5) * spread)
}

export function getDiagnosticSnapshot() {
  const online = isOnline()

  return {
    isDemoData: true,
    generatedAt: new Date().toISOString(),
    internet: online ? 'CONNECTED' : 'DISCONNECTED',
    wifi: online ? 'CONNECTED' : 'DISCONNECTED',
    ipAddress: online ? '192.168.1.100' : '169.254.12.4',
    gateway: '192.168.1.1',
    dns: online ? 'AVAILABLE' : 'UNREACHABLE',
    pingMs: online ? jitter(24, 12) : null,
    ethernet: online ? '1 Gbps' : 'No link',
    connectionQuality: online ? 'GOOD' : 'NONE',
    devices: [
      { name: 'Keyboard', status: 'OK' },
      { name: 'Mouse', status: 'OK' },
      { name: 'Webcam', status: online ? 'OK' : 'UNKNOWN' },
      { name: 'Audio Output', status: 'OK' },
    ],
  }
}

export async function runPingTest(target = 'gateway') {
  await new Promise((r) => setTimeout(r, 900))
  const online = isOnline()
  return {
    isDemoData: true,
    target,
    success: online,
    timeMs: online ? jitter(22, 16) : null,
    packetLoss: online ? 0 : 100,
  }
}
