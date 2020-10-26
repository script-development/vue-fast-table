import 'jsdom-global/register';
import assert from 'assert';
import MinimalTable from '../src';
import {shallowMount} from '@vue/test-utils';

describe('Vue minimal table', () => {
    describe('header', () => {
        it('should have a table header element', () => {
            const wrapper = shallowMount(MinimalTable, {
                propsData: {
                    fields: [{key: 'name'}],
                    items: [{name: 'hoi'}],
                },
            });

            assert(wrapper.find('thead').exists());
        });

        describe('table header cells', () => {
            it('should show the field key in the header when there is no label given', () => {
                const wrapper = shallowMount(MinimalTable, {
                    propsData: {
                        fields: [{key: 'name'}],
                        items: [{name: 'hoi'}],
                    },
                });

                assert.strictEqual(wrapper.find('thead').find('tr').find('th').text(), 'name');
            });

            it('should show the label in the header', () => {
                const wrapper = shallowMount(MinimalTable, {
                    propsData: {
                        fields: [{key: 'name', label: 'Naam'}],
                        items: [{name: 'hoi'}],
                    },
                });

                assert.strictEqual(wrapper.find('thead').find('tr').find('th').text(), 'Naam');
            });

            it('should show the amount of headers as there are fields', () => {
                const wrapper = shallowMount(MinimalTable, {
                    propsData: {
                        fields: [{key: 'name'}, {key: 'street'}, {key: 'city'}, {key: 'email'}],
                        items: [{name: 'hoi'}],
                    },
                });

                assert.strictEqual(wrapper.find('thead').find('tr').findAll('th').length, 4);
            });
        });
    });

    describe('body', () => {
        it('should have a table body element', () => {
            const wrapper = shallowMount(MinimalTable, {
                propsData: {
                    fields: [{key: 'name'}],
                    items: [{name: 'hoi'}],
                },
            });

            assert(wrapper.find('tbody').exists());
        });

        describe('table data cells', () => {
            it('should show the text of the item belonging to the field key', () => {
                const wrapper = shallowMount(MinimalTable, {
                    propsData: {
                        fields: [{key: 'name'}],
                        items: [{name: 'hoi'}],
                    },
                });

                assert.strictEqual(wrapper.find('tbody').find('tr').find('td').text(), 'hoi');
            });

            it('should show the formatted text of the item belonging to the field formatter', () => {
                const wrapper = shallowMount(MinimalTable, {
                    propsData: {
                        fields: [{key: 'name', formatter: () => 'nope'}],
                        items: [{name: 'hoi'}],
                    },
                });

                assert.strictEqual(wrapper.find('tbody').find('tr').find('td').text(), 'nope');
            });

            it("should use a field's tdClass as its classname", () => {
                const wrapper = shallowMount(MinimalTable, {
                    propsData: {
                        fields: [{key: 'name', tdClass: () => 'rood'}],
                        items: [{name: 'hoi'}],
                    },
                });
                assert(wrapper.find('.rood').exists());
            });

            it('should render scoped slots', () => {
                const wrapper = shallowMount(MinimalTable, {
                    propsData: {
                        fields: [{key: 'name'}],
                        items: [{name: 'hoi'}],
                    },
                    scopedSlots: {
                        'cell(name)': `<test-tag>Hoi</test-tag>`,
                    },
                    components: {
                        'test-tag': 'test-tag',
                    },
                });
                assert(wrapper.find('test-tag').exists());
            });

            it('should emit when a row is clicked', () => {
                let testResult = false;
                const wrapper = shallowMount(MinimalTable, {
                    propsData: {
                        fields: [{key: 'name'}],
                        items: [{name: 'hoi!'}],
                    },
                    listeners: {
                        'row-clicked': () => {
                            testResult = true;
                        },
                    },
                });
                const row = wrapper.findAll('td');
                row.trigger('click');

                assert.strictEqual(testResult, true);
            });

            it('a formatter should also emit when a row is clicked', () => {
                let testResult = false;
                const wrapper = shallowMount(MinimalTable, {
                    propsData: {
                        fields: [{key: 'name', formatter: () => 'harry'}],
                        items: [{name: 'hoi!'}],
                    },
                    listeners: {
                        'row-clicked': () => {
                            testResult = true;
                        },
                    },
                });
                const row = wrapper.findAll('tr');
                row.trigger('click');

                assert.strictEqual(testResult, true);
            });
        });
    });
});
