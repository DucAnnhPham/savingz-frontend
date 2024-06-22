import { describe, it, expect, vi } from 'vitest'

import { flushPromises, shallowMount } from '@vue/test-utils'
import axios from 'axios'
import TransactionsList from '../TransactionsList.vue'

describe('TransactionsList', () => {
    vi.mock('axios')
    type Transaction = {
        id: number;
        transactionName: string;
        transactionCategory: string;
        transactionDate: string;
        transactionAmount: number;
        isEditing: boolean
    };

    const twoItemsResponse: Transaction[] = [
        { id: 1, transactionName: 'wasser', transactionCategory: 'Food', transactionDate: '2024-07-24', transactionAmount: 1.50, isEditing: false },
        { id: 2, transactionName: 'cola', transactionCategory: 'Food', transactionDate: '2024-07-25', transactionAmount: 2.50, isEditing: false }
    ];

    it('should display info if list from backend is empty', async () => {
        vi.mocked(axios, true).get.mockResolvedValueOnce({ data: [] })
        const wrapper = shallowMount(TransactionsList, { props: { title: 'test' } })
        await flushPromises()
        expect(wrapper.text()).toContain('The are no past Transactions!')
    })

    it('should render list from backend', async () => {
        vi.mocked(axios, true).get.mockResolvedValueOnce({ data: twoItemsResponse })
        const wrapper = shallowMount(TransactionsList, { props: { title: 'test' } })
        await flushPromises()
        const expectedRows = 2 + twoItemsResponse.length
        expect(wrapper.findAll('tr').length).toBe(expectedRows)
        expect(wrapper.text()).toContain('wasser')
        expect(wrapper.text()).toContain('cola')
    })
})