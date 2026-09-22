export const categories = [
  {
    id: 'network',
    name: 'Network',
    icon: 'Wifi',
    description: 'Wi-Fi drops, no internet access, VPN failures, slow connections.',
  },
  {
    id: 'printer',
    name: 'Printer',
    icon: 'Printer',
    description: 'Printer offline, spooler problems, print jobs stuck in queue.',
  },
  {
    id: 'display',
    name: 'Display',
    icon: 'Monitor',
    description: 'Resolution errors, no signal, multi-monitor setup problems.',
  },
  {
    id: 'peripheral',
    name: 'Peripheral',
    icon: 'Mouse',
    description: 'Keyboard, mouse, webcam, USB device not detected.',
  },
  {
    id: 'hardware',
    name: 'Computer / Hardware',
    icon: 'Cpu',
    description: 'Overheating, won\u2019t power on, blue screens, hardware failures.',
  },
  {
    id: 'audio',
    name: 'Audio',
    icon: 'Volume2',
    description: 'No sound, microphone not working, audio device conflicts.',
  },
  {
    id: 'software',
    name: 'Software',
    icon: 'AppWindow',
    description: 'App crashes, installation failures, licensing errors.',
  },
  {
    id: 'os',
    name: 'Operating System',
    icon: 'Settings2',
    description: 'Boot failures, update errors, slow startup, system freezes.',
  },
  {
    id: 'security',
    name: 'Security',
    icon: 'ShieldAlert',
    description: 'Login failures, suspicious activity, MFA and password issues.',
  },
  {
    id: 'storage',
    name: 'Storage',
    icon: 'HardDrive',
    description: 'Low disk space, drive not detected, slow read/write speeds.',
  },
]

export function getCategory(id) {
  return categories.find((c) => c.id === id)
}
