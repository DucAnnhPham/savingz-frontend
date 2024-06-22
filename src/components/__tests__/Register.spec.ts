import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import axios from 'axios'
import { useRouter, type Router } from 'vue-router'
import Register from '../Register.vue'

vi.mock('axios')
vi.mock('vue-router', () => ({
    useRouter: vi.fn()
}))

describe('Register.vue', () => {
    let mockRouter: Router

    beforeEach(() => {
        mockRouter = {
            push: vi.fn(),
            currentRoute: {},
            options: {},
            beforeEach: vi.fn(),
            beforeResolve: vi.fn(),
            afterEach: vi.fn(),
            addRoute: vi.fn(),
            removeRoute: vi.fn(),
            hasRoute: vi.fn(),
            getRoutes: vi.fn(),
            resolve: vi.fn(),
            createHref: vi.fn(),
            replace: vi.fn(),
            go: vi.fn(),
            back: vi.fn(),
            forward: vi.fn()
        } as unknown as Router

        // Mock the router
        vi.mocked(useRouter).mockReturnValue(mockRouter)
        // Clear localStorage and mocks before each test
        window.localStorage.clear()
        vi.clearAllMocks()
    })

    it('renders registration form', () => {
        const wrapper = shallowMount(Register)
        expect(wrapper.find('h1').text()).toBe('Register')
        expect(wrapper.find('form').exists()).toBe(true)
        expect(wrapper.find('input#email').exists()).toBe(true)
        expect(wrapper.find('input#username').exists()).toBe(true)
        expect(wrapper.find('input#password').exists()).toBe(true)
        expect(wrapper.find('input#repeatPassword').exists()).toBe(true)
        expect(wrapper.find('button').exists()).toBe(true)
    })

    it('shows error message if passwords do not match', async () => {
        const wrapper = shallowMount(Register)
        wrapper.find('input#password').setValue('password1')
        wrapper.find('input#repeatPassword').setValue('password2')
        await wrapper.find('form').trigger('submit.prevent')

        await flushPromises()
        expect(wrapper.find('p').text()).toBe('Passwords do not match')
    })

    it('shows error message from server', async () => {
        const errorMessage = 'Username already exists'
        vi.mocked(axios.post).mockRejectedValueOnce({
            response: { data: errorMessage }
        })

        const wrapper = shallowMount(Register)
        wrapper.find('input#username').setValue('existinguser')
        wrapper.find('input#email').setValue('user@example.com')
        wrapper.find('input#password').setValue('password')
        wrapper.find('input#repeatPassword').setValue('password')
        await wrapper.find('form').trigger('submit.prevent')

        await flushPromises()
        expect(wrapper.find('p').text()).toBe(errorMessage)
    })

    it('redirects to login on successful registration', async () => {
        vi.mocked(axios.post).mockResolvedValueOnce({ status: 200 })

        const wrapper = shallowMount(Register)
        wrapper.find('input#username').setValue('newuser')
        wrapper.find('input#email').setValue('user@example.com')
        wrapper.find('input#password').setValue('password')
        wrapper.find('input#repeatPassword').setValue('password')
        await wrapper.find('form').trigger('submit.prevent')

        await flushPromises()
        expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })
})
