require('jsdom-global')();
const assert = require('assert');
const Table = require('../dist/index.ssr');
const {createLocalVue, shallowMount} = require('@vue/test-utils');

describe('Vue minimal table', () => {
    describe('table', () => {
        it('should have default set of classes when no class mutating args are provided', () => {
            const wrapper = shallowMount(Table, {});
            assert.deepStrictEqual(wrapper.find('table').classes(), [
                'table',
                'b-table',
                'table-borderless',
            ]);
        });

        it('should have a classname based on props', () => {
            const wrapper = shallowMount(Table, {
                propsData: {
                    fields: [{key: 'name'}],
                    items: [{name: 'hoi'}],
                    borderless: true,
                    hover: true,
                    small: true,
                    outlined:true,
                    bordered: true,
                    striped:true,
                    dark: true,
                    busy: true,
                },
            });
            assert.deepStrictEqual(wrapper.find('table').classes(), [
                "table",
                "b-table",
                "table-borderless",
                "table-hover",
                "table-outlined",
                "table-bordered",
                "table-striped",
                "table-dark",
                "table-sm",
                "table-busy"
            ]);
        });

        it('should have a id based on props', () => {
            const wrapper = shallowMount(Table, {
                propsData: {
                    fields: [{key: 'name'}],
                    items: [{name: 'hoi'}],
                    id: 'FooBar'
                },
            });
            assert.deepStrictEqual(wrapper.find('table').attributes('id'), 'FooBar');
        });
    });

    describe('header', () => {
        it('should have a table header element', () => {
            const wrapper = shallowMount(Table, {
                propsData: {
                    fields: [{key: 'name'}],
                    items: [{name: 'hoi'}],
                },
            });

            assert(wrapper.find('thead').exists());
        });

        describe('table header cells', () => {
            it('should show the field key in the header when there is no label given', () => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{key: 'name'}],
                        items: [{name: 'hoi'}],
                    },
                });

                assert.strictEqual(wrapper.find('thead').find('tr').find('th').text(), 'name');
            });

            it('should show the label in the header', () => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{key: 'name', label: 'Naam'}],
                        items: [{name: 'hoi'}],
                    },
                });

                assert.strictEqual(wrapper.find('thead').find('tr').find('th').text(), 'Naam');
            });

            it('should show the amount of headers as there are fields', () => {
                const wrapper = shallowMount(Table, {
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
            const wrapper = shallowMount(Table, {
                propsData: {
                    fields: [{key: 'name'}],
                    items: [{name: 'hoi'}],
                },
            });

            assert(wrapper.find('tbody').exists());
        });

        describe('table data cells', () => {
            it('should show the text of the item belonging to the field key', () => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{key: 'name'}],
                        items: [{name: 'hoi'}],
                    },
                });

                assert.strictEqual(wrapper.find('tbody').find('tr').find('td').text(), 'hoi');
            });

            it('should have no <tr> elements if no items are provided', () => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{key: 'name'}],
                        items: [],
                    },
                });

                assert.strictEqual(wrapper.find('tbody').find('tr').exists(), false);
            });

            it('should show the formatted text of the item belonging to the field formatter', () => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{key: 'name', formatter: () => 'nope'}],
                        items: [{name: 'hoi'}],
                    },
                });

                assert.strictEqual(wrapper.find('tbody').find('tr').find('td').text(), 'nope');
            });

            it('should render scoped slots', () => {
                const localVue = createLocalVue();
                localVue.component('TestTag', {
                    template: `<div class="test-tag">
                        <slot></slot>
                    </div>`,
                });

                const wrapper = shallowMount(Table, {
                    localVue,
                    propsData: {
                        fields: [{key: 'name'}],
                        items: [{name: 'foo bar'}],
                    },
                    scopedSlots: {
                        'cell(name)': `<test-tag>Hoi</test-tag>`,
                    },
                });
                assert.strictEqual(wrapper.find('td').text(), 'Hoi');
            });

            it('should render data returned using formatter', () => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{key: 'name', formatter: () => 'Hoi'}],
                        items: [{}],
                    },
                });
                assert.strictEqual(wrapper.find('td').text(), 'Hoi');
            });

            it('should render data returned using formatter using item data', () => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{key: 'name', formatter: item => item.customProperty}],
                        items: [{customProperty: 'Hoi'}],
                    },
                });
                assert.strictEqual(wrapper.find('td').text(), 'Hoi');
            });

            it('should render multiple rows of data', () => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{key: 'name'}],
                        items: [{name: 'foo'}, {name: 'bar'}],
                    },
                });

                assert.deepStrictEqual(wrapper.findAll('td').wrappers.map(d => d.text()), ['foo', 'bar']);
            });

            it('should render changes made to items', async() => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{key: 'name'}],
                        items: [{name: 'foo'}],
                    },
                });

                await wrapper.setProps({items: [{name: 'foo'}, {name: 'bar'}]});
                assert.deepStrictEqual(wrapper.findAll('td').wrappers.map(d => d.text()), ['foo', 'bar']);

                await wrapper.setProps({items: [{name: 'foo'}, {name: 'bar'}, {name: 'baz'}]});
                assert.deepStrictEqual(wrapper.findAll('td').wrappers.map(d => d.text()), ['foo', 'bar', 'baz']);

                await wrapper.setProps({items: [{name: 'hoi'}]});
                assert.deepStrictEqual(wrapper.findAll('td').wrappers.map(d => d.text()), ['hoi']);
            });

            it('should render loading if busy', () => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{key: 'name'}],
                        busy: true,
                    },
                });

                assert.strictEqual(wrapper.findAll('td').wrappers.length, 1);
                assert.strictEqual(wrapper.find('td').text(), 'Loading...');
            });

            it('should render loading or items when busy it toggled', async() => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{key: 'name'}],
                        items: [{name: 'foo'}, {name: 'bar'}, {name: 'baz'}],
                        busy: false,
                    },
                });

                assert.strictEqual(wrapper.findAll('td').wrappers.length, 3);

                await wrapper.setProps({busy: true});
                assert.strictEqual(wrapper.findAll('td').wrappers.length, 1);
                assert.strictEqual(wrapper.find('td').text(), 'Loading...');

                await wrapper.setProps({busy: false});
                assert.strictEqual(wrapper.findAll('td').wrappers.length, 3);
            });

            it('should render lines in correct order when sort is provided', () => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        sortBy: 'name',
                        sort: 'ascending',
                        fields: [{key: 'name'}],
                        items: [{name: 'foo'}, {name: 'bar'}],
                    },
                });

                assert.deepStrictEqual(wrapper.findAll('td').wrappers.map(d => d.text()), ['bar', 'foo']);
            });

            it('should render lines in correct order when sort changes', async() => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        sortBy: 'name',
                        sort: 'ascending',
                        fields: [{key: 'name'}],
                        items: [{name: 'foo'}, {name: 'bar'}],
                    },
                });

                assert.deepStrictEqual(wrapper.findAll('td').wrappers.map(d => d.text()), ['bar', 'foo']);

                await wrapper.setProps({sort: 'descending'});
                assert.deepStrictEqual(wrapper.findAll('td').wrappers.map(d => d.text()), ['foo', 'bar']);

                await wrapper.setProps({sort: 'ascending'});
                assert.deepStrictEqual(wrapper.findAll('td').wrappers.map(d => d.text()), ['bar', 'foo']);
            });

            it('should emit when a row is clicked', () => {
                let testResult = false;
                const wrapper = shallowMount(Table, {
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

            it('a row should also emit when a formatter is clicked', () => {
                let testResult = false;
                const wrapper = shallowMount(Table, {
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
                const row = wrapper.find('td');
                row.trigger('click');

                assert.strictEqual(testResult, true);
            });

            it('should not emit when a row is clicked without a listener', () => {
                let testResult = false;
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{key: 'name'}],
                        items: [{name: 'hoi!'}],
                    },
                });
                const row = wrapper.findAll('td');
                row.trigger('click');

                assert.strictEqual(testResult, false);
            });

            it('when no listener is defined, a row should not emit', () => {
                let testResult = false;
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{key: 'name', formatter: () => 'harry'}],
                        items: [{name: 'hoi!'}],
                    },
                });
                const row = wrapper.find('td');
                row.trigger('click');

                assert.strictEqual(testResult, false);
            });

            it('should sort when a sortBy prop was passed', () => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{key: 'name'}],
                        items: [{name: 'Xantippe'}, {name: 'Adam'}, {name: 'Harry'}],
                        sortBy: 'name',
                    },
                });
                const tds = wrapper.findAll('td');
                const tableNames = [];
                for (let i = 0; i < tds.length; i++) {
                    tableNames.push(tds.at(i).text());
                }
                const sortedNames = ['Adam', 'Harry', 'Xantippe'];
                assert.deepStrictEqual(sortedNames, tableNames);
            });

            // TODO :: not all sorting lines are covered
        });
    });

    describe('tdClass & thClass argument', () => {
        ['tdClass', 'thClass'].map(name => {
            it(name+" with simple string should appear in dom", () => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{key: 'name', [name]: 'rood'}],
                        items: [{name: 'hoi'}],
                    },
                });
                assert(wrapper.find('.rood').exists());
            });

            it(name+" with multiple in one string should appear in dom", () => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{key: 'name', [name]: 'foo bar'}],
                        items: [{name: 'hoi'}],
                    },
                });
                assert(wrapper.find('.foo.bar').exists());
            });

            it(name+" with multiple in array should appear in dom", () => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{key: 'name', [name]: ['foo', 'bar']}],
                        items: [{name: 'hoi'}],
                    },
                });
                assert(wrapper.find('.foo.bar').exists());
            });

            it(name+" with function returning string should appear in dom", () => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{key: 'name', [name]: () => 'foo bar'}],
                        items: [{name: 'hoi'}],
                    },
                });
                assert(wrapper.find('.foo.bar').exists());
            });

            it(name+" with function returning array should appear in dom", () => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{key: 'name', [name]: () => ['foo', 'bar']}],
                        items: [{name: 'hoi'}],
                    },
                });
                assert(wrapper.find('.foo.bar').exists());
            });

            it(name+" should have no added classes when none are provided", () => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{key: 'name'}],
                        items: [{name: 'hoi'}],
                    },
                });

                if (name == 'thClass') {
                    assert.deepStrictEqual(wrapper.find(name.substring(0, 2)).classes().join(' ').trim(), 'header');
                } else {
                    assert.deepStrictEqual(wrapper.find(name.substring(0, 2)).classes().join(' ').trim(), '');
                }
            });
        });
    });
});
