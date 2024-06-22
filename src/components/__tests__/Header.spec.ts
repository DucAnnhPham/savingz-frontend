import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils';
import Header from '@/components/Header.vue';
import {RouterLink} from "vue-router";

describe('Header Component', () => {


    beforeEach(() => {
        // Clear localStorage before each test
        window.localStorage.clear();
    });



    it('renders correct RouterLink components when logged out', () => {
        // Simulate logged out state by clearing localStorage
        window.localStorage.removeItem('userId');

        const wrapper = shallowMount(Header);

        // Assert that the logo (img tag) is rendered
        expect(wrapper.find('img').exists()).toBe(true);

        // Find all RouterLink components rendered in the header
        const routerLinks = wrapper.findAllComponents(RouterLink);

        // Assert the number of RouterLink components
        expect(routerLinks.length).toBe(2); // Expecting two RouterLink components

        // Assert content 'to' prop of each RouterLink component
        expect(routerLinks[0].props().to).toBe('/');
        expect(routerLinks[1].props().to).toBe('/login');
    });

    it('renders correct RouterLink components when logged in', () => {
        // Simulate logged in state by setting userId in localStorage
        window.localStorage.setItem('userId', 'someUserId');

        const wrapper = shallowMount(Header);

        // Assert that the logo (img tag) is rendered
        expect(wrapper.find('img').exists()).toBe(true);

        // Find all RouterLink components rendered in the header
        const routerLinks = wrapper.findAllComponents(RouterLink);

        // Assert the number of RouterLink components
        expect(routerLinks.length).toBe(2); // Expecting two RouterLink components

        // Assert content 'to' prop of each RouterLink component
        expect(routerLinks[0].props().to).toBe('/');
        expect(routerLinks[1].props().to).toBe('/transactions');
    });

    it('renders logout button when logged in', () => {
        // Set localStorage to simulate logged in state
        window.localStorage.setItem('userId', 'someUserId');

        const wrapper = shallowMount(Header);

        expect(wrapper.find('button').exists()).toBe(true);
    });

    it('does not render logout button when not logged in', () => {
        // Clear localStorage to simulate logged out state
        window.localStorage.removeItem('userId');

        const wrapper = shallowMount(Header);

        expect(wrapper.find('button').exists()).toBe(false);
    });

    it('logs out user when logout button is clicked', async () => {
        // Set localStorage to simulate logged in state
        window.localStorage.setItem('userId', 'someUserId');

        const wrapper = shallowMount(Header);

        await wrapper.find('button').trigger('click');

        expect(window.localStorage.getItem('userId')).toBeNull();
    });





});
