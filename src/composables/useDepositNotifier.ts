import {reactive} from 'vue'
import {useSound} from '@/composables/useSound'

export type DepositPayload = {
    amount?: number
    agent?: string
    message?: string
    timeout?: number // default 5000
}

const state = reactive({
    queue: [] as Array<DepositPayload & { id: number }>,
    _id: 0,
    active: null as (DepositPayload & { id: number }) | null
})

export function useDepositNotifier() {
    function notifyDeposit(p: DepositPayload) {
        state.queue.push({id: ++state._id, ...p})
        process()
    }

    return {notifyDeposit}
}

let timer: number | null = null

function process() {
    if (state.active || !state.queue.length) return
    state.active = state.queue.shift()!
    const sound = useSound()
    sound.play(sound.getMelody())
    const ms = state.active.timeout ?? 5000
    timer && clearTimeout(timer)
    timer = window.setTimeout(() => {
        state.active = null
        process()
    }, ms)
}

export function _useDepositState() {
    return state
}
