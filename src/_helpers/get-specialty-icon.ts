import {
  Activity,
  Baby,
  Bone,
  Brain,
  Eye,
  Hand,
  Heart,
  Stethoscope,
} from 'lucide-react'

export function getSpecialtyIcon(specialty: string) {
  const specialtyLower = specialty.toLowerCase()

  if (specialtyLower.includes('cardiolog')) return Heart
  if (
    specialtyLower.includes('ginecolog') ||
    specialtyLower.includes('obstetri')
  )
    return Baby
  if (specialtyLower.includes('pediatr')) return Activity
  if (specialtyLower.includes('dermatolog')) return Hand
  if (
    specialtyLower.includes('ortoped') ||
    specialtyLower.includes('traumatolog')
  )
    return Bone
  if (specialtyLower.includes('oftalmolog')) return Eye
  if (specialtyLower.includes('neurolog')) return Brain

  return Stethoscope
}
