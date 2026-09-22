import {
  Wifi, Printer, Monitor, Mouse, Cpu, Volume2, AppWindow, Settings2,
  ShieldAlert, HardDrive, HelpCircle,
} from 'lucide-react'

const MAP = {
  Wifi, Printer, Monitor, Mouse, Cpu, Volume2, AppWindow, Settings2,
  ShieldAlert, HardDrive,
}

export function resolveIcon(name) {
  return MAP[name] || HelpCircle
}
