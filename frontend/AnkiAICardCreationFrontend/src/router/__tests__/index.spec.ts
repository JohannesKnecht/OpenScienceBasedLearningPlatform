import { describe, it, expect } from 'vitest'
import router from '../index'

describe('router', () => {
  it('has 7 routes', () => {
    expect(router.getRoutes()).toHaveLength(7)
  })

  it('has a home route at /', () => {
    const homeRoute = router.getRoutes().find((route) => route.path === '/')
    expect(homeRoute?.name).toBe('home')
  })

  it('has a learn overview route at /learn', () => {
    const route = router.getRoutes().find((item) => item.path === '/learn')
    expect(route?.name).toBe('learn')
  })

  it('has a graph route at /graph', () => {
    const route = router.getRoutes().find((item) => item.path === '/graph')
    expect(route?.name).toBe('graph')
  })

  it('has a diagnostic route at /diagnostic', () => {
    const route = router.getRoutes().find((item) => item.path === '/diagnostic')
    expect(route?.name).toBe('diagnostic')
  })

  it('has a review route at /review/:skillId?', () => {
    const route = router.getRoutes().find((item) => item.path === '/review/:skillId?')
    expect(route?.name).toBe('review')
  })

  it('has a lesson route with params', () => {
    const route = router.getRoutes().find((item) => item.path === '/learn/:moduleSlug/:lessonSlug')
    expect(route?.name).toBe('lesson')
    expect(typeof route?.components?.default).toBe('function')
  })

  it('has a practice route with params', () => {
    const route = router.getRoutes().find((item) => item.path === '/practice/:moduleSlug/:lessonSlug')
    expect(route?.name).toBe('practice')
    expect(typeof route?.components?.default).toBe('function')
  })
})
