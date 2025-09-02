import { ref } from 'vue'

import fanfareUrl    from '@/assets/sounds/fanfare.wav?url'
import herecomesUrl  from '@/assets/sounds/herecomes.mp3?url'
import pimpUrl       from '@/assets/sounds/pimp.mp3?url'

type MelodyKey = 'fanfare' | 'herecomes' | 'pimp'
const sources: Record<MelodyKey, string> = {
    fanfare: fanfareUrl,
    herecomes: herecomesUrl,
    pimp: pimpUrl,
}

const enabled = ref(true)
const current = ref<MelodyKey>('herecomes')

let singleton: HTMLAudioElement | null = null
function play(url: string, force = false) {
    if (!force && !enabled.value) return
    try {
        if (singleton) {
            singleton.pause()
            singleton.currentTime = 0
        }
        singleton = new Audio(url)
        void singleton.play()
    } catch { /* no-op */ }
}

export function useSound() {
    return {
        enabled,
        // іконка хедера переключає глобальний звук
        toggleEnabled: () => { enabled.value = !enabled.value },

        // вибір мелодії
        setMelody: (k: MelodyKey) => { current.value = k },
        getMelody: () => current.value,

        // тест у модалі — грає навіть коли звук вимкнено
        test: () => play(sources[current.value], /*force*/ true),

        // утиліта для інших місць у апці
        play: (k: MelodyKey) => play(sources[k]),
    }
}
