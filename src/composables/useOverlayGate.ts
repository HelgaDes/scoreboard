import { inject, ref } from 'vue'
import { OverLayGateKey } from './overlayGate'

export function useOverlayActive() {
    const gate = inject(OverLayGateKey)
    return gate?.active ?? ref(0)
}

export function useOverlayGate(tag?: string) {
    const gate = inject(OverLayGateKey)
    if (!gate) {
        if (import.meta.env.DEV) console.warn('[overlayGate] provider missing')
        return () => {}
    }
    gate.active.value++
    if (import.meta.env.DEV && tag) /* console.debug(`[gate +] ${tag}:`, gate.active.value) */ {}
    return () => {
        gate.active.value = Math.max(0, gate.active.value - 1)
        if (import.meta.env.DEV && tag) /* console.debug(`[gate -] ${tag}:`, gate.active.value) */ {}
    }
}
