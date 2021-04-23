require('jsdom-global')();
const assert = require('assert');
const { InternalCell, VueFastTable } = require('../dist/index.ssr');
const { shallowMount, mount } = require('@vue/test-utils');

const Cell = InternalCell;
const Table = VueFastTable;

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
                    fields: [{ key: 'name' }],
                    items: [{ name: 'hoi' }],
                    borderless: true,
                    hover: true,
                    small: true,
                    outlined: true,
                    bordered: true,
                    striped: true,
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
                    fields: [{ key: 'name' }],
                    items: [{ name: 'hoi' }],
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
                    fields: [{ key: 'name' }],
                    items: [{ name: 'hoi' }],
                },
            });

            assert(wrapper.find('thead').exists());
        });

        describe('table header cells', () => {
            it('should show the field key in the header when there is no label given', () => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{ key: 'name' }],
                        items: [{ name: 'hoi' }],
                    },
                });

                assert.strictEqual(wrapper.find('thead').find('tr').find('th').text(), 'name');
            });

            it('should show the label in the header', () => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{ key: 'name', label: 'Naam' }],
                        items: [{ name: 'hoi' }],
                    },
                });

                assert.strictEqual(wrapper.find('thead').find('tr').find('th').text(), 'Naam');
            });

            it('should show the amount of headers as there are fields', () => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{ key: 'name' }, { key: 'street' }, { key: 'city' }, { key: 'email' }],
                        items: [{ name: 'hoi' }],
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
                    fields: [{ key: 'name' }],
                    items: [{ name: 'hoi' }],
                },
            });

            assert(wrapper.find('tbody').exists());
        });

        describe('table data cells', () => {
            it('should show the text of the item belonging to the field key', () => {
                const wrapper = mount(Table, {
                    propsData: {
                        fields: [{ key: 'name' }],
                        items: [{ name: 'hoi' }],
                    },
                });

                assert.strictEqual(wrapper.findComponent(Cell).text(), 'hoi');
            });

            it('should have table empty element if no items are provided', () => {
                const wrapper = shallowMount(Table, {
                    propsData: {
                        fields: [{ key: 'name' }],
                        items: [],
                    },
                });

                assert(wrapper.find('tbody').find('tr.b-table-empty-slot').exists());
            });

            it('should show the formatted text of the item belonging to the field formatter', () => {
                const wrapper = mount(Table, {
                    propsData: {
                        fields: [{ key: 'name', formatter: () => 'nope' }],
                        items: [{ name: 'hoi' }],
                    },
                });

                assert.strictEqual(wrapper.findComponent(Cell).text(), 'nope');
            });

            describe('scoped fields', () => {
                it('should render scoped slots #head', () => {
                    const wrapper = mount(Table, {
                        propsData: {
                            fields: [{ key: 'name' }],
                            items: [],
                        },
                        scopedSlots: {
                            'head': `<div>Hoi</div>`,
                        },
                    });
                    assert.strictEqual(wrapper.find('thead').find('tr').find('th').text(), 'Hoi');
                });

                it('should render scoped slots #head()', () => {
                    const wrapper = mount(Table, {
                        propsData: {
                            fields: [{ key: 'name' }],
                            items: [],
                        },
                        scopedSlots: {
                            'head()': `<div>Hoi</div>`,
                        },
                    });
                    assert.strictEqual(wrapper.find('thead').find('tr').find('th').text(), 'Hoi');
                });

                it('should render a #row slot', () => {
                    const wrapper = mount(Table, {
                        propsData: {
                            fields: [{ key: 'name' }],
                            items: [{ name: 'foo bar' }],
                        },
                        scopedSlots: {
                            'row': `<div>Hoi</div>`,
                        },
                    });
                    assert.strictEqual(wrapper.find('tbody').text(), 'Hoi');
                });

                it('should render scoped slots #cell', () => {
                    const wrapper = mount(Table, {
                        propsData: {
                            fields: [{ key: 'name' }],
                            items: [{ name: 'foo bar' }],
                        },
                        scopedSlots: {
                            'cell': `<div>Hoi</div>`,
                        },
                    });
                    assert.strictEqual(wrapper.findComponent(Cell).text(), 'Hoi');
                });

                it('should render scoped slots #cell()', () => {
                    const wrapper = mount(Table, {
                        propsData: {
                            fields: [{ key: 'name' }],
                            items: [{ name: 'foo bar' }],
                        },
                        scopedSlots: {
                            'cell()': `<div>Hoi</div>`,
                        },
                    });
                    assert.strictEqual(wrapper.findComponent(Cell).text(), 'Hoi');
                });

                it('should render scoped slots #cell(name)', () => {
                    const wrapper = mount(Table, {
                        propsData: {
                            fields: [{ key: 'name' }],
                            items: [{ name: 'foo bar' }],
                        },
                        scopedSlots: {
                            'cell(name)': `<div>Hoi</div>`,
                        },
                    });
                    assert.strictEqual(wrapper.findComponent(Cell).text(), 'Hoi');
                });

                it('should NOT render scoped slots #cell(does_not_exist)', () => {
                    const wrapper = mount(Table, {
                        propsData: {
                            fields: [{ key: 'name' }],
                            items: [{ name: 'foo bar' }],
                        },
                        scopedSlots: {
                            'cell(does_not_exist)': `<div>Hoi</div>`,
                        },
                    });
                    assert.strictEqual(wrapper.findComponent(Cell).text(), 'foo bar');
                });

                it('should only render one slot per #cell', () => {
                    const wrapper = mount(Table, {
                        propsData: {
                            fields: [{ key: 'name' }],
                            items: [{ name: 'foo bar' }],
                        },
                        scopedSlots: {
                            'cell': `<div>cell 1</div>`,
                            'cell()': `<div>cell 2</div>`,
                            'cell(name)': `<div>cell name</div>`,
                            'cell(does_not_exist)': `<div>cell does_not_exist</div>`,
                        },
                    });
                    assert.strictEqual(wrapper.findComponent(Cell).text(), 'cell name');
                });

                it('should render context scoped slots', () => {
                    const wrapper = mount(Table, {
                        propsData: {
                            fields: [{ key: 'name' }],
                            items: [{ name: 'foo bar' }],
                            getContext: () => 'foo_bar',
                        },
                        scopedSlots: {
                            'cell@foo_bar': `<div>Hoi</div>`,
                        },
                    });
                    assert.strictEqual(wrapper.findComponent(Cell).text(), 'Hoi');
                });

                it('should render context based on field', () => {
                    const wrapper = mount(Table, {
                        propsData: {
                            fields: [{ key: 'name', getContext: () => 'foo_bar' }, { key: 'other' }],
                            items: [{ name: 'foo bar', other: 'other field content' }],
                        },
                        scopedSlots: {
                            'cell@foo_bar': `<div>Hoi</div>`,
                        },
                    });
                    assert.deepStrictEqual(['Hoi', 'other field content'], wrapper.findAllComponents(Cell).wrappers.map(el => el.text()));
                });

                it('should render context based on item', () => {
                    const wrapper = mount(Table, {
                        propsData: {
                            fields: [{ key: 'name' }],
                            items: [{ name: 'item 1', getContext: () => 'foo_bar' }, { name: 'item 2' }],
                        },
                        scopedSlots: {
                            'cell@foo_bar': `<div>Hoi</div>`,
                        },
                    });
                    assert.deepStrictEqual(['Hoi', 'item 2'], wrapper.findAllComponents(Cell).wrappers.map(el => el.text()));
                });

                it('should not render invalid scoped slot name', () => {
                    const wrapper = mount(Table, {
                        propsData: {
                            fields: [{ key: 'name' }],
                            items: [{ name: 'foo bar' }],
                            getContext: () => 'foo_bar',
                        },
                        scopedSlots: {
                            'cell@nope': `<div>Hoi</div>`,
                        },
                    });
                    assert.strictEqual(wrapper.findComponent(Cell).text(), 'foo bar');
                });

                it('should render context scoped slots cell scoped', () => {
                    const wrapper = mount(Table, {
                        propsData: {
                            fields: [{ key: 'name' }],
                            items: [{ name: 'foo bar' }],
                            getContext: () => 'foo_bar',
                        },
                        scopedSlots: {
                            'cell(name)@foo_bar': `<div>Hoi</div>`,
                        },
                    });
                    assert.strictEqual(wrapper.findComponent(Cell).text(), 'Hoi');
                });

                it('should render context scoped slots over normal slot', () => {
                    const wrapper = mount(Table, {
                        propsData: {
                            fields: [{ key: 'name' }],
                            items: [{ name: 'foo bar' }],
                            getContext: () => 'foo_bar',
                        },
                        scopedSlots: {
                            'cell@foo_bar': `<div>GOOD</div>`,
                            'cell': `<div>WRONG</div>`,
                        },
                    });
                    assert.strictEqual(wrapper.findComponent(Cell).text(), 'GOOD');
                });

                it('should render cell scoped slots over context slot', () => {
                    const wrapper = mount(Table, {
                        propsData: {
                            fields: [{ key: 'name' }],
                            items: [{ name: 'foo bar' }],
                            getContext: () => 'foo_bar',
                        },
                        scopedSlots: {
                            'cell(name)': `<div>GOOD</div>`,
                            'cell@foo_bar': `<div>WRONG</div>`,
                        },
                    });
                    assert.strictEqual(wrapper.findComponent(Cell).text(), 'GOOD');
                });

                it('render correct slot if all kinds are provided NO context', () => {
                    const wrapper = mount(Table, {
                        propsData: {
                            fields: [{ key: 'name' }],
                            items: [{ name: 'foo bar' }],
                        },
                        scopedSlots: {
                            'cell': `<div>cell</div>`,
                            'cell()': `<div>cell()</div>`,
                            'cell@foo_bar': `<div>cell@foo_bar</div>`,
                            'cell()@foo_bar': `<div>cell()@foo_bar</div>`,
                            'cell(name)': `<div>cell(name)</div>`, // GOOD
                            'cell(name)@foo_bar': `<div>cell(name)@foo_bar</div>`,
                        },
                    });
                    assert.strictEqual(wrapper.findComponent(Cell).text(), 'cell(name)');
                });

                it('render correct slot if all kinds are provided with context', () => {
                    const wrapper = mount(Table, {
                        propsData: {
                            fields: [{ key: 'name' }],
                            items: [{ name: 'foo bar' }],
                            getContext: () => 'foo_bar',
                        },
                        scopedSlots: {
                            'cell': `<div>cell</div>`,
                            'cell()': `<div>cell()</div>`,
                            'cell@foo_bar': `<div>cell@foo_bar</div>`,
                            'cell()@foo_bar': `<div>cell()@foo_bar</div>`,
                            'cell(name)': `<div>cell(name)</div>`,
                            'cell(name)@foo_bar': `<div>cell(name)@foo_bar</div>`, // GOOD
                        },
                    });
                    assert.strictEqual(wrapper.findComponent(Cell).text(), 'cell(name)@foo_bar');
                });
            });

            it('should render data returned using formatter', () => {
                const wrapper = mount(Table, {
                    propsData: {
                        fields: [{ key: 'name', formatter: () => 'Hoi' }],
                        items: [{}],
                    },
                });
                assert.strictEqual(wrapper.findComponent(Cell).text(), 'Hoi');
            });

            it('should render data returned using formatter using item data', () => {
                const wrapper = mount(Table, {
                    propsData: {
                        fields: [{ key: 'name', formatter: item => item.customProperty }],
                        items: [{ customProperty: 'Hoi' }],
                    },
                });
                assert.strictEqual(wrapper.find('td').text(), 'Hoi');
            });

            it('should render multiple rows of data', () => {
                const wrapper = mount(Table, {
                    propsData: {
                        fields: [{ key: 'name' }],
                        items: [{ name: 'foo' }, { name: 'bar' }],
                    },
                });

                assert.deepStrictEqual(wrapper.findAll('td').wrappers.map(d => d.text()), ['foo', 'bar']);
            });

            it('should render changes made to items', async () => {
                const wrapper = mount(Table, {
                    propsData: {
                        fields: [{ key: 'name' }],
                        items: [{ name: 'foo' }],
                    },
                });

                await wrapper.setProps({ items: [{ name: 'foo' }, { name: 'bar' }] });
                assert.deepStrictEqual(wrapper.findAll('td').wrappers.map(d => d.text()), ['foo', 'bar']);

                await wrapper.setProps({ items: [{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }] });
                assert.deepStrictEqual(wrapper.findAll('td').wrappers.map(d => d.text()), ['foo', 'bar', 'baz']);

                await wrapper.setProps({ items: [{ name: 'hoi' }] });
                assert.deepStrictEqual(wrapper.findAll('td').wrappers.map(d => d.text()), ['hoi']);
            });

            it('should render loading if busy', () => {
                const wrapper = mount(Table, {
                    propsData: {
                        fields: [{ key: 'name' }],
                        busy: true,
                    },
                });

                assert.strictEqual(wrapper.findAll('td').wrappers.length, 1);
                assert.strictEqual(wrapper.find('td').text(), 'Loading...');
            });

            it('should render loading or items when busy it toggled', async () => {
                const wrapper = mount(Table, {
                    propsData: {
                        fields: [{ key: 'name' }],
                        items: [{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }],
                        busy: false,
                    },
                });

                assert.strictEqual(wrapper.findAll('td').wrappers.length, 3);

                await wrapper.setProps({ busy: true });
                assert.strictEqual(wrapper.findAll('td').wrappers.length, 1);
                assert.strictEqual(wrapper.find('td').text(), 'Loading...');

                await wrapper.setProps({ busy: false });
                assert.strictEqual(wrapper.findAll('td').wrappers.length, 3);
            });

            describe('sorting', () => {
                it('should render lines in correct order when sort is provided', () => {
                    const wrapper = mount(Table, {
                        propsData: {
                            sortBy: 'name',
                            sort: 'ascending',
                            fields: [{ key: 'name' }],
                            items: [{ name: 'foo' }, { name: 'bar' }],
                        },
                    });

                    assert.deepStrictEqual(wrapper.findAll('td').wrappers.map(d => d.text()), ['bar', 'foo']);
                });

                it('should render lines in correct order when sort changes', async () => {
                    const wrapper = mount(Table, {
                        propsData: {
                            sortBy: 'name',
                            sort: 'ascending',
                            fields: [{ key: 'name' }],
                            items: [{ name: 'foo' }, { name: 'bar' }],
                        },
                    });

                    assert.deepStrictEqual(wrapper.findAllComponents(Cell).wrappers.map(d => d.text()), ['bar', 'foo']);

                    await wrapper.setProps({ sort: 'descending' });
                    assert.deepStrictEqual(wrapper.findAllComponents(Cell).wrappers.map(d => d.text()), ['foo', 'bar']);

                    await wrapper.setProps({ sort: 'ascending' });
                    assert.deepStrictEqual(wrapper.findAllComponents(Cell).wrappers.map(d => d.text()), ['bar', 'foo']);
                });

                it('should sort when a sortBy prop was passed', () => {
                    const wrapper = mount(Table, {
                        propsData: {
                            fields: [{ key: 'name' }],
                            items: [{ name: 'Xantippe' }, { name: 'Adam' }, { name: 'Harry' }],
                            sortBy: 'name',
                        },
                    });
                    const tds = wrapper.findAllComponents(Cell);
                    const tableNames = [];
                    for (let i = 0; i < tds.length; i++) {
                        tableNames.push(tds.at(i).text());
                    }
                    const sortedNames = ['Adam', 'Harry', 'Xantippe'];
                    assert.deepStrictEqual(sortedNames, tableNames);
                });

                it('should sort when sortFn prop was passed', () => {
                    const wrapper = mount(Table, {
                        propsData: {
                            fields: [{ key: 'name' }],
                            items: [{ name: 'Xantippe' }, { name: 'Adam' }, { name: 'Harry' }],
                            sortFn: (a, b) => {
                                if (a.name < b.name) {
                                    return -1;
                                }
                                if (a.name > b.name) {
                                    return 1;
                                }
                                return 0;
                            },
                        },
                    });
                    const tds = wrapper.findAllComponents(Cell);
                    const tableNames = [];
                    for (let i = 0; i < tds.length; i++) {
                        tableNames.push(tds.at(i).text());
                    }
                    const sortedNames = ['Adam', 'Harry', 'Xantippe'];
                    assert.deepStrictEqual(sortedNames, tableNames);
                });

                it('should sort descending when sortFn and sort props was passed', () => {
                    const wrapper = mount(Table, {
                        propsData: {
                            fields: [{ key: 'name' }],
                            items: [{ name: 'Xantippe' }, { name: 'Adam' }, { name: 'Harry' }],
                            sortFn: (a, b) => {
                                if (a.name < b.name) {
                                    return -1;
                                }
                                if (a.name > b.name) {
                                    return 1;
                                }
                                return 0;
                            },
                            sort: 'descending'
                        },
                    });
                    const tds = wrapper.findAllComponents(Cell);
                    const tableNames = [];
                    for (let i = 0; i < tds.length; i++) {
                        tableNames.push(tds.at(i).text());
                    }
                    const sortedNames = ['Xantippe', 'Harry', 'Adam'];
                    assert.deepStrictEqual(sortedNames, tableNames);
                });
            });

            it('should emit when a row is clicked', () => {
                let testResult = false;
                const wrapper = mount(Table, {
                    propsData: {
                        fields: [{ key: 'name' }],
                        items: [{ name: 'hoi!' }],
                    },
                    listeners: {
                        'row-clicked': () => {
                            testResult = true;
                        },
                    },
                });
                const row = wrapper.findAllComponents(Cell);
                row.trigger('click');

                assert.strictEqual(testResult, true);
            });

            it('a row should also emit when a formatter is clicked', () => {
                let testResult = false;
                const wrapper = mount(Table, {
                    propsData: {
                        fields: [{ key: 'name', formatter: () => 'harry' }],
                        items: [{ name: 'hoi!' }],
                    },
                    listeners: {
                        'row-clicked': () => {
                            testResult = true;
                        },
                    },
                });
                const row = wrapper.findComponent(Cell);
                row.trigger('click');

                assert.strictEqual(testResult, true);
            });

            it('should not emit when a row is clicked without a listener', () => {
                let testResult = false;
                const wrapper = mount(Table, {
                    propsData: {
                        fields: [{ key: 'name' }],
                        items: [{ name: 'hoi!' }],
                    },
                });
                const row = wrapper.findAllComponents(Cell);
                row.trigger('click');

                assert.strictEqual(testResult, false);
            });

            it('when no listener is defined, a row should not emit', () => {
                let testResult = false;
                const wrapper = mount(Table, {
                    propsData: {
                        fields: [{ key: 'name', formatter: () => 'harry' }],
                        items: [{ name: 'hoi!' }],
                    },
                });
                const row = wrapper.findComponent(Cell);
                row.trigger('click');

                assert.strictEqual(testResult, false);
            });
        });
    });

    describe('tdClass & thClass argument', () => {
        ['tdClass', 'thClass'].map(name => {
            it(name + " with simple string should appear in dom", () => {
                const wrapper = mount(Table, {
                    propsData: {
                        fields: [{ key: 'name', [name]: 'rood' }],
                        items: [{ name: 'hoi' }],
                    },
                });
                if (name == 'thClass') {
                    assert(wrapper.find('.rood').exists());
                } else {
                    assert.deepStrictEqual(wrapper.findComponent(Cell).classes(), ['rood']);
                }
            });

            it(name + " with multiple in one string should appear in dom", () => {
                const wrapper = mount(Table, {
                    propsData: {
                        fields: [{ key: 'name', [name]: 'foo bar' }],
                        items: [{ name: 'hoi' }],
                    },
                });
                if (name == 'thClass') {
                    assert(wrapper.find('.foo.bar').exists());
                } else {
                    assert.deepStrictEqual(wrapper.findComponent(Cell).classes(), ['foo', 'bar']);
                }
            });

            it(name + " with multiple in array should appear in dom", () => {
                const wrapper = mount(Table, {
                    propsData: {
                        fields: [{ key: 'name', [name]: ['foo', 'bar'] }],
                        items: [{ name: 'hoi' }],
                    },
                });
                if (name == 'thClass') {
                    assert(wrapper.find('.foo.bar').exists());
                } else {
                    assert.deepStrictEqual(wrapper.findComponent(Cell).classes(), ['foo', 'bar']);
                }
            });

            it(name + " with function returning string should appear in dom", () => {
                const wrapper = mount(Table, {
                    propsData: {
                        fields: [{ key: 'name', [name]: () => 'foo bar' }],
                        items: [{ name: 'hoi' }],
                    },
                });
                if (name == 'thClass') {
                    assert(wrapper.find('.foo.bar').exists());
                } else {
                    assert.deepStrictEqual(wrapper.findComponent(Cell).classes(), ['foo', 'bar']);
                }
            });

            it(name + " with function returning array should appear in dom", () => {
                const wrapper = mount(Table, {
                    propsData: {
                        fields: [{ key: 'name', [name]: () => ['foo', 'bar'] }],
                        items: [{ name: 'hoi' }],
                    },
                });
                if (name == 'thClass') {
                    assert(wrapper.find('.foo.bar').exists());
                } else {
                    assert.deepStrictEqual(wrapper.findComponent(Cell).classes(), ['foo', 'bar']);
                }
            });

            it(name + " should have no added classes when none are provided", () => {
                const wrapper = mount(Table, {
                    propsData: {
                        fields: [{ key: 'name' }],
                        items: [{ name: 'hoi' }],
                    },
                });

                const elName = name.substring(0, 2);
                if (elName == 'th') {
                    const classes = wrapper.find(elName).classes().join(' ').trim();
                    assert.deepStrictEqual(classes, 'header');
                } else {
                    const cell = wrapper.findComponent(Cell);
                    assert.deepStrictEqual(cell.classes().join(' ').trim(), '');
                }
            });
        });
    });
});
