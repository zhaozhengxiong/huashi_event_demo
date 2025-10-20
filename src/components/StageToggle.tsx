import type { Stage } from '../types'

interface StageToggleProps {
  stage: Stage
  onStageChange: (stage: Stage) => void
  isVisible?: boolean
}

const STAGE_LABEL: Record<Stage, string> = {
  registration: '报名期',
  evaluation: '评选期',
  announcement: '公示期'
}

const ORDER: Stage[] = ['registration', 'evaluation', 'announcement']

function StageToggle({ stage, onStageChange, isVisible = true }: StageToggleProps) {
  if (!isVisible) {
    return null
  }

  const handleClick = () => {
    const currentIndex = ORDER.indexOf(stage)
    const nextIndex = (currentIndex + 1) % ORDER.length
    onStageChange(ORDER[nextIndex])
  }

  return (
    <button className='stage-toggle' onClick={handleClick}>
      测试阶段：{STAGE_LABEL[stage]}（点击切换）
    </button>
  )
}

export default StageToggle


