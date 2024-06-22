import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import axios from 'axios'
import { useRouter} from 'vue-router'
import type { Router } from 'vue-router';
import Login from '../Login.vue'

vi.mock('axios')
vi.mock('vue-router', () => ({
    useRouter: vi.fn()
}))


describe('Login.vue', () => {

    let mockRouter = {
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
    beforeEach(() => {
        // Mock the router
        vi.mocked(useRouter).mockReturnValue(mockRouter)
        // Clear localStorage and mocks before each test
        window.localStorage.clear()
        vi.clearAllMocks()
    })

    it('renders login form', () => {
        const wrapper = shallowMount(Login)
        expect(wrapper.find('h1').text()).toBe('Login')
        expect(wrapper.find('form').exists()).toBe(true)
        expect(wrapper.find('input#username').exists()).toBe(true)
        expect(wrapper.find('input#password').exists()).toBe(true)
        expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    })

    it('shows error message on failed login', async () => {
        const errorMessage = 'Invalid username or password'
        vi.mocked(axios.post).mockRejectedValueOnce({
            response: { status: 401 }
        })

        const wrapper = shallowMount(Login)
        wrapper.find('input#username').setValue('wronguser')
        wrapper.find('input#password').setValue('wrongpass')
        await wrapper.find('form').trigger('submit.prevent')

        await flushPromises()
        expect(wrapper.find('p').text()).toBe(errorMessage)
    })

    it('shows  error message', async () => {
        const errorMessage = 'An error occurred'
        vi.mocked(axios.post).mockRejectedValueOnce(new Error('Network Error'))

        const wrapper = shallowMount(Login)
        wrapper.find('input#username').setValue('user')
        wrapper.find('input#password').setValue('pass')
        await wrapper.find('form').trigger('submit.prevent')

        await flushPromises()
        expect(wrapper.find('p').text()).toBe(errorMessage)
    })

    it('redirects to home on successful login', async () => {
        const userId = '12345'
        vi.mocked(axios.post).mockResolvedValueOnce({ status: 200, data: userId })

        const wrapper = shallowMount(Login)
        wrapper.find('input#username').setValue('user')
        wrapper.find('input#password').setValue('pass')
        await wrapper.find('form').trigger('submit.prevent')

        await flushPromises()
        expect(window.localStorage.getItem('userId')).toBe(userId)
        expect(mockRouter.push).toHaveBeenCalledWith('/')
    })

    it('navigates to register page when Register button is clicked', async () => {
        const wrapper = shallowMount(Login)
        await wrapper.find('button2').trigger('click')
        expect(mockRouter.push).toHaveBeenCalledWith('/register')
    })
})
