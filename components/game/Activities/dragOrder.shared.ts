import {
  Atom,
  BatteryCharging,
  Beaker,
  Bot,
  Cog,
  FlaskConical,
  Gauge,
  Leaf,
  Lightbulb,
  PawPrint,
  Sparkles,
  Sprout,
  SunMedium,
  Waves,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { DragOrderActivity, DragOrderIconKey, DragOrderItemDetail } from '@/types/activity'

type ResolvedDragOrderItem = Required<DragOrderItemDetail> & {
  label: string
  Icon: LucideIcon
}

const DRAG_ORDER_ICON_MAP: Record<DragOrderIconKey, LucideIcon> = {
  atom: Atom,
  battery: BatteryCharging,
  beaker: Beaker,
  bot: Bot,
  cog: Cog,
  flask: FlaskConical,
  gauge: Gauge,
  leaf: Leaf,
  lightbulb: Lightbulb,
  paw: PawPrint,
  sparkles: Sparkles,
  sprout: Sprout,
  sun: SunMedium,
  waves: Waves,
  zap: Zap,
}

function inferIconKey(label: string): DragOrderIconKey {
  const normalized = label.toLowerCase()

  if (normalized.includes('luz solar') || normalized.includes('solar')) return 'sun'
  if (normalized.includes('fotosintesis')) return 'sparkles'
  if (normalized.includes('plantas')) return 'sprout'
  if (normalized.includes('materia organica')) return 'leaf'
  if (normalized.includes('animales')) return 'paw'
  if (normalized.includes('quimica')) return 'flask'
  if (normalized.includes('potencial')) return 'battery'
  if (normalized.includes('cinetica') || normalized.includes('cinética')) return 'waves'
  if (normalized.includes('electrica') || normalized.includes('eléctrica')) return 'zap'
  if (normalized.includes('luminica') || normalized.includes('lumínica')) return 'lightbulb'
  if (normalized.includes('reactivo')) return 'flask'
  if (normalized.includes('reacción') || normalized.includes('reaccion')) return 'beaker'
  if (normalized.includes('liberación') || normalized.includes('liberacion') || normalized.includes('energía') || normalized.includes('energia')) return 'sparkles'
  if (normalized.includes('producto')) return 'atom'
  if (normalized.includes('movimiento')) return 'gauge'
  if (normalized.includes('motor')) return 'cog'
  if (normalized.includes('robot')) return 'bot'

  return 'zap'
}

function inferSlotLabel(label: string, step: number): string {
  const normalized = label.toLowerCase()

  if (normalized.includes('luz solar')) return 'Fuente'
  if (normalized.includes('fotosintesis')) return 'Conversion'
  if (normalized.includes('plantas')) return 'Captura'
  if (normalized.includes('materia organica')) return 'Reserva'
  if (normalized.includes('animales')) return 'Consumo'
  if (normalized.includes('movimiento')) return 'Accion'
  if (normalized.includes('energia cinetica') || normalized.includes('cinética')) return 'Resultado'
  if (normalized.includes('quimica')) return 'Origen'
  if (normalized.includes('potencial')) return 'Acumulacion'
  if (normalized.includes('electrica') || normalized.includes('eléctrica')) return 'Corriente'
  if (normalized.includes('luminica') || normalized.includes('lumínica')) return 'Luz'
  if (normalized.includes('reactivo')) return 'Entrada'
  if (normalized.includes('reacción') || normalized.includes('reaccion')) return 'Proceso'
  if (normalized.includes('producto')) return 'Resultado'

  return `Paso ${step + 1}`
}

function inferDescription(label: string): string {
  const normalized = label.toLowerCase()

  if (normalized.includes('luz solar')) return 'La energia entra al ecosistema desde la radiacion del Sol.'
  if (normalized.includes('fotosintesis')) return 'Las plantas convierten la luz en energia quimica utilizable.'
  if (normalized.includes('plantas')) return 'Los productores capturan y almacenan la energia del ambiente.'
  if (normalized.includes('materia organica')) return 'La energia queda guardada en biomasa que puede alimentar a otros seres vivos.'
  if (normalized.includes('animales')) return 'Los consumidores obtienen esa energia al alimentarse.'
  if (normalized.includes('movimiento')) return 'Los seres vivos usan la energia para desplazarse y actuar.'
  if (normalized.includes('energia cinetica') || normalized.includes('cinética')) return 'La energia del movimiento se manifiesta como energia cinetica.'
  if (normalized.includes('quimica')) return 'La energia queda almacenada en sustancias o combustibles listos para activarse.'
  if (normalized.includes('potencial')) return 'La energia se acumula en altura o posicion antes de liberarse.'
  if (normalized.includes('cinetica') || normalized.includes('cinética')) return 'La energia almacenada pasa a ser movimiento.'
  if (normalized.includes('electrica') || normalized.includes('eléctrica')) return 'El sistema transforma el movimiento en corriente.'
  if (normalized.includes('luminica') || normalized.includes('lumínica')) return 'La electricidad alimenta la luz final del sistema.'
  if (normalized.includes('reactivo')) return 'Son las sustancias iniciales del proceso.'
  if (normalized.includes('reacción') || normalized.includes('reaccion')) return 'Aqui ocurre la transformacion principal.'
  if (normalized.includes('liberación') || normalized.includes('liberacion')) return 'La energia se transfiere al siguiente sistema.'
  if (normalized.includes('producto')) return 'Es el resultado final de la transformacion.'
  if (normalized.includes('movimiento')) return 'La energia se expresa en una accion observable.'

  return 'Selecciona esta pieza para colocarla en la secuencia.'
}

function inferAccent(label: string): string {
  const normalized = label.toLowerCase()

  if (normalized.includes('luz solar') || normalized.includes('luminica') || normalized.includes('lumínica')) return '#fde047'
  if (normalized.includes('fotosintesis') || normalized.includes('plantas') || normalized.includes('materia organica')) return '#4ade80'
  if (normalized.includes('animales')) return '#fb923c'
  if (normalized.includes('movimiento') || normalized.includes('cinetica') || normalized.includes('cinética')) return '#22c55e'
  if (normalized.includes('potencial')) return '#60a5fa'
  if (normalized.includes('electrica') || normalized.includes('eléctrica')) return '#a78bfa'
  if (normalized.includes('quimica')) return '#f59e0b'
  if (normalized.includes('reactivo') || normalized.includes('reacción') || normalized.includes('reaccion')) return '#38bdf8'
  if (normalized.includes('producto')) return '#f472b6'

  return '#4ade80'
}

export function resolveDragOrderItem(
  activity: DragOrderActivity,
  itemIndex: number,
  step: number,
): ResolvedDragOrderItem {
  const label = activity.items[itemIndex]
  const configured = activity.itemDetails?.[itemIndex]
  const iconKey = configured?.icon ?? inferIconKey(label)

  return {
    label,
    icon: iconKey,
    Icon: DRAG_ORDER_ICON_MAP[iconKey],
    slotLabel: configured?.slotLabel ?? inferSlotLabel(label, step),
    description: configured?.description ?? inferDescription(label),
    accent: configured?.accent ?? inferAccent(label),
  }
}

export function getSeededOrder(length: number, seed: string) {
  const values = Array.from({ length }, (_, index) => index)
  let hash = 0

  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }

  for (let index = values.length - 1; index > 0; index -= 1) {
    hash = (hash * 1664525 + 1013904223) >>> 0
    const swapIndex = hash % (index + 1)
    ;[values[index], values[swapIndex]] = [values[swapIndex], values[index]]
  }

  if (values.every((value, index) => value === index) && values.length > 1) {
    ;[values[0], values[1]] = [values[1], values[0]]
  }

  return values
}
