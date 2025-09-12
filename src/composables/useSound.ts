import { ref, type Ref } from 'vue'

/** Available melody keys */
export type MelodyKey = 'fanfare' | 'herecomes' | 'pimp'

/** LocalStorage keys */
const LS_ENABLED  = 'sb:sound:enabled'
const LS_SELECTED = 'sb:sound:selected'

/** Assets (vite ?url) */
import fanfareUrl   from '@/assets/sounds/fanfare.wav?url'
import herecomesUrl from '@/assets/sounds/herecomes.mp3?url'
import pimpUrl      from '@/assets/sounds/pimp.mp3?url'

/** Create an <audio> element with sane defaults */
function createAudio(src: string): HTMLAudioElement {
    const a = new Audio(src)
    a.preload = 'auto'
    return a
}

type Channels = Record<MelodyKey, HTMLAudioElement>

function buildChannels(): Channels {
    return {
        fanfare:   createAudio(fanfareUrl),
        herecomes: createAudio(herecomesUrl),
        pimp:      createAudio(pimpUrl),
    }
}

/** Public API surfaced by the hook */
export interface SoundApi {
    enabled: Ref<boolean>
    getMelody(): MelodyKey
    setMelody(k: MelodyKey): void
    play(key?: MelodyKey, opts?: { force?: boolean }): Promise<void> | void
    test(): void
    stop(): void
    toggleEnabled(): void
    unlock(): void
}

/** Singleton factory */
function createInstance(): SoundApi {
    const enabled = ref(localStorage.getItem(LS_ENABLED) !== '0')
    const selected = ref<MelodyKey>(
        (localStorage.getItem(LS_SELECTED) as MelodyKey) || 'fanfare'
    )

    const channels = buildChannels()

    /** Stop and rewind all channels to avoid overlap */
    function stop(): void {
        Object.values(channels).forEach(a => {
            try { a.pause(); a.currentTime = 0 } catch {}
        })
    }

    /**
     * Play a sound.
     * - If `key` omitted → plays the currently selected melody.
     * - If `force` true → bypasses `enabled` (used for "Test melody").
     * - Always stops previous sounds to prevent overlap.
     */
    function play(key?: MelodyKey, opts?: { force?: boolean }): Promise<void> | void {
        const force = !!opts?.force
        if (!force && !enabled.value) return

        const k = key ?? selected.value
        const a = channels[k]
        if (!a) return

        try {
            stop() // ensure no overlap
            const p = a.play()
            if (p && typeof (p as any).catch === 'function') {
                return (p as Promise<void>).catch(() => { /* ignore NotAllowedError/AbortError */ })
            }
        } catch { /* ignore */ }
    }

    function test(): void {
        play(undefined, { force: true })
    }

    function toggleEnabled(): void {
        enabled.value = !enabled.value
        localStorage.setItem(LS_ENABLED, enabled.value ? '1' : '0')
    }

    function setMelody(k: MelodyKey): void {
        selected.value = k
        localStorage.setItem(LS_SELECTED, k)
    }

    function getMelody(): MelodyKey {
        return selected.value
    }

    /** Optional unlock after a user gesture (autoplay policies) */
    function unlock(): void {
        Object.values(channels).forEach(a => {
            try {
                const p = a.play()
                if (p && typeof (p as any).then === 'function') {
                    (p as Promise<void>).then(() => a.pause()).catch(() => {})
                } else {
                    a.pause()
                }
            } catch {}
        })
    }

    return { enabled, getMelody, setMelody, play, test, stop, toggleEnabled, unlock }
}

/** Singleton instance */
let _instance: SoundApi | null = null
export function useSound(): SoundApi {
    if (!_instance) _instance = createInstance()
    return _instance
}
