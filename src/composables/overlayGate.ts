import type { InjectionKey, Ref } from 'vue'

export type OverLayGate = { active: Ref<number> }
export const OverLayGateKey: InjectionKey<OverLayGate> = Symbol('OverlayGate')
