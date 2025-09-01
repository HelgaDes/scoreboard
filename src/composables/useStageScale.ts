import { onMounted, onUnmounted } from 'vue'

// Fit scaling on the document root: --s = min(h/540, w/960)
export function useStageScale(){
  const apply = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    const s = Math.min(h / 540, w / 960)
    document.documentElement.style.setProperty('--s', String(s))
  }
  onMounted(() => { apply(); window.addEventListener('resize', apply) })
  onUnmounted(() => window.removeEventListener('resize', apply))
}
