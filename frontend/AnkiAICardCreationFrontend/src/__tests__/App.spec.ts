import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '../App.vue'
import DiagnosticView from '../views/DiagnosticView.vue'
import GraphView from '../views/GraphView.vue'
import HomeView from '../views/HomeView.vue'
import LearnOverviewView from '../views/LearnOverviewView.vue'

describe('App', () => {
  beforeEach(() => {
    if (typeof window.localStorage?.clear === 'function') {
      window.localStorage.clear()
    }
  })

  it('renders the home route content', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: HomeView }],
    })

    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: { plugins: [router] },
    })

    expect(wrapper.text()).toContain('Work toward target lessons')
    expect(wrapper.text()).toContain('Choose one or more lesson targets')
  })

  it('renders the learn dashboard route content', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/learn', component: LearnOverviewView }],
    })

    router.push('/learn')
    await router.isReady()

    const wrapper = mount(App, {
      global: { plugins: [router] },
    })

    expect(wrapper.text()).toContain('Work toward target lessons')
    expect(wrapper.text()).toContain('Target queue')
  })

  it('renders the diagnostic route content', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/diagnostic', component: DiagnosticView }],
    })

    router.push('/diagnostic')
    await router.isReady()

    const wrapper = mount(App, {
      global: { plugins: [router] },
    })

    expect(wrapper.text()).toContain('Entry diagnostic')
  })

  it('renders the graph route content', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/graph', component: GraphView }],
    })

    router.push('/graph')
    await router.isReady()

    const wrapper = mount(App, {
      global: { plugins: [router] },
    })

    expect(wrapper.text()).toContain('All lessons, one map')
    expect(wrapper.text()).toContain('Scroll to zoom')
  })
})
