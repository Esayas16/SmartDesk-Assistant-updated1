import { Wrench } from 'lucide-react'
import NetworkTopologyDiagram from './NetworkTopologyDiagram'
import EthernetDiagram from './EthernetDiagram'
import WifiSignalDiagram from './WifiSignalDiagram'
import DisplayDiagram from './DisplayDiagram'

export default function StepIllustration({ visualGuide = 'generic', stepIndex = 0 }) {
  return (
    <div className="rounded-xl border border-line bg-panel/60 p-6 flex items-center justify-center min-h-[180px]">
      {(() => {
        switch (visualGuide) {
          case 'network-topology':
            return <NetworkTopologyDiagram highlight={stepIndex} />
          case 'ethernet-diagram':
            return <EthernetDiagram highlight={stepIndex} />
          case 'wifi-signal':
            return <WifiSignalDiagram highlight={stepIndex} />
          case 'display-diagram':
            return <DisplayDiagram highlight={stepIndex} />
          default:
            return (
              <div className="flex flex-col items-center gap-3 text-text-faint">
                <div className="w-16 h-16 rounded-full border border-line flex items-center justify-center">
                  <Wrench size={24} />
                </div>
                <p className="font-mono text-[11px] uppercase tracking-wider">Step {stepIndex + 1} illustration</p>
              </div>
            )
        }
      })()}
    </div>
  )
}
