import { beforeEach, describe, expect, it } from 'vitest'
import { getAssessment } from '../../content'
import { useLearningProgress } from '../progress'

describe('useLearningProgress', () => {
  beforeEach(() => {
    if (typeof window.localStorage?.clear === 'function') {
      window.localStorage.clear()
    }
    const { resetProgress } = useLearningProgress()
    resetProgress()
  })

  it('starts with default mastery progress', () => {
    const { progressState, completionPercentage, masteredSkillCount } = useLearningProgress()

    expect(progressState.xp).toBe(0)
    expect(progressState.streak).toBe(0)
    expect(completionPercentage.value).toBe(0)
    expect(masteredSkillCount.value).toBe(0)
  })

  it('marks skills from the diagnostic and awards xp', () => {
    const { completeAssessment, progressState, isSkillMastered } = useLearningProgress()
    const diagnostic = getAssessment('diagnostic-computational-thinking')

    expect(diagnostic).toBeDefined()

    completeAssessment('diagnostic-computational-thinking', {
      passed: true,
      correctCount: 3,
      totalCount: 5,
      itemResults: [
        { itemId: 'diag-seq-1', skillId: 'read-sequential-program', correct: true },
        { itemId: 'diag-var-1', skillId: 'track-variable-state', correct: true },
        { itemId: 'diag-branch-1', skillId: 'branch-on-boolean', correct: true },
        { itemId: 'diag-loop-1', skillId: 'trace-simple-loops', correct: false },
        { itemId: 'diag-debug-1', skillId: 'isolate-bug-with-hypothesis', correct: false },
      ],
    })

    expect(progressState.diagnosticCompleted).toBe(true)
    expect(isSkillMastered('read-sequential-program')).toBe(true)
    expect(isSkillMastered('track-variable-state')).toBe(true)
    expect(progressState.xp).toBeGreaterThan(0)
  })
})
