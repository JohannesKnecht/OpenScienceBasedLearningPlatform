import { createRouter, createWebHistory } from 'vue-router'
import DiagnosticView from '../views/DiagnosticView.vue'
import GraphView from '../views/GraphView.vue'
import LearnOverviewView from '../views/LearnOverviewView.vue'
import ReviewView from '../views/ReviewView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LearnOverviewView,
    },
    {
      path: '/learn',
      name: 'learn',
      component: LearnOverviewView,
    },
    {
      path: '/graph',
      name: 'graph',
      component: GraphView,
    },
    {
      path: '/diagnostic',
      name: 'diagnostic',
      component: DiagnosticView,
    },
    {
      path: '/review/:skillId?',
      name: 'review',
      component: ReviewView,
    },
    {
      path: '/learn/:lessonSlug',
      name: 'lesson',
      component: () => import('../views/LessonView.vue'),
      props: true,
    },
    {
      path: '/practice/:lessonSlug',
      name: 'practice',
      component: () => import('../views/PracticeView.vue'),
      props: true,
    },
    {
      path: '/learn/:moduleSlug/:lessonSlug',
      name: 'lesson-legacy',
      component: () => import('../views/LessonView.vue'),
      props: true,
    },
    {
      path: '/practice/:moduleSlug/:lessonSlug',
      name: 'practice-legacy',
      component: () => import('../views/PracticeView.vue'),
      props: true,
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
