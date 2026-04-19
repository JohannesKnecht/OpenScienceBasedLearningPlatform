import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import PracticeView from '../PracticeView.vue'
import { useLearningProgress } from '../../lib/progress'

describe('PracticeView', () => {
  beforeEach(() => {
    if (typeof window.localStorage?.clear === 'function') {
      window.localStorage.clear()
    }
    useLearningProgress().resetProgress()
  })

  it('passes a lesson check and marks the lesson skill as mastered', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/practice/:moduleSlug/:lessonSlug',
          component: PracticeView,
        },
      ],
    })

    const progress = useLearningProgress()
    progress.completeAssessment('diagnostic-computational-thinking', {
      passed: true,
      correctCount: 2,
      totalCount: 5,
      itemResults: [
        { itemId: 'diag-seq-1', skillId: 'read-sequential-program', correct: true },
        { itemId: 'diag-var-1', skillId: 'track-variable-state', correct: true },
        { itemId: 'diag-branch-1', skillId: 'branch-on-boolean', correct: false },
        { itemId: 'diag-loop-1', skillId: 'trace-simple-loops', correct: false },
        { itemId: 'diag-debug-1', skillId: 'isolate-bug-with-hypothesis', correct: false },
      ],
    })

    router.push('/practice/program-state/tracking-variables')
    await router.isReady()

    const wrapper = mount(PracticeView, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    const textInput = wrapper.find('input[type="text"]')
    await textInput.setValue('6')

    const radios = wrapper.findAll('input[type="radio"]')
    await radios[1]?.setValue(true)

    await wrapper.get('button').trigger('click')

    const { progressState, isSkillMastered, getLessonState } = useLearningProgress()
    expect(isSkillMastered('track-variable-state')).toBe(true)
    expect(getLessonState('tracking-variables')).toBe('mastered')
    expect(progressState.xp).toBeGreaterThan(0)
    expect(wrapper.text()).toContain('Lesson check passed')
  })
})
