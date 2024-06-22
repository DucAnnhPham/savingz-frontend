import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import TheHome from '../TheHome.vue'

describe('TheHome.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = shallowMount(TheHome)
    window.localStorage.clear()
  })

    it('renders welcome message and prompts user to login when not logged in', () => {
        const wrapper = shallowMount(TheHome)
        expect(wrapper.text()).toContain('Welcome to the Home Page')
        expect(wrapper.text()).toContain('Savingz is your personal expense tracker.')
        expect(wrapper.text()).toContain('It will help you to track your expenses and income.')
        expect(wrapper.text()).toContain('To start login.')
    })


    it('renders welcome message and prompts user to go to Transactions when logged in', () => {
        window.localStorage.setItem('userId', '12345')
        const wrapper = shallowMount(TheHome)
        expect(wrapper.text()).toContain('Welcome to the Home Page')
        expect(wrapper.text()).toContain('Savingz is your personal expense tracker.')
        expect(wrapper.text()).toContain('It will help you to track your expenses and income.')
        expect(wrapper.text()).toContain('To start go to Transactions.')
    })
})