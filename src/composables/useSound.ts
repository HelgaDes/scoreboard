import { ref } from 'vue'
import fanfare from '@/assets/sounds/fanfare.97ad99f4.wav'
import herecomes from '@/assets/sounds/herecomes.a0e1aefc.mp3'
import pimp from '@/assets/sounds/pimp.22249497.mp3'

export type MelodyKey = 'fanfare'|'herecomes'|'pimp'

const MELODY_MAP: Record<MelodyKey,string> = { fanfare, herecomes, pimp }
const KEY_MELODY = 'sb_melody'
const KEY_ENABLED = 'sb_sound_enabled'

const enabled = ref(localStorage.getItem(KEY_ENABLED) !== 'false')
const melodyKey = ref<MelodyKey>((localStorage.getItem(KEY_MELODY) as MelodyKey) || 'fanfare')
let audio: HTMLAudioElement | null = null

function ensureAudio(){
  if(!audio) audio = new Audio(MELODY_MAP[melodyKey.value])
  audio.src = MELODY_MAP[melodyKey.value]
  audio.volume = 1.0
}

export function useSound(){
  function toggleEnabled(){ enabled.value = !enabled.value; localStorage.setItem(KEY_ENABLED, String(enabled.value)) }
  function setMelody(k: MelodyKey){ melodyKey.value = k; localStorage.setItem(KEY_MELODY, k); ensureAudio() }
  function getMelody(){ return melodyKey.value }
  function isEnabled(){ return enabled.value }
  function play(){ if(!enabled.value) return; ensureAudio(); audio!.currentTime = 0; audio!.play().catch(()=>{}) }
  function test(){ ensureAudio(); audio!.currentTime = 0; audio!.play().catch(()=>{}) }
  return { enabled, melodyKey, MELODY_MAP, toggleEnabled, setMelody, getMelody, isEnabled, play, test }
}
