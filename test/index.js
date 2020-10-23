import 'jsdom-global/register';
import assert from 'assert';
import MinimalTable from '../src';
import {shallowMount} from '@vue/test-utils';
// import sinon from 'sinon';

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

                assert.strictEqual(wrapper.find('tbody').find('tr').find('td').text(), 'hoi');
            });
        });
    });

    // const wrappedTable = {
    //     components: {minimalTable},
    //     template: `
    //     <div>
    //         <minimalTable v-bind="$attrs" v-on="$listeners" />
    //     </div>`,
    // };

    // const wrapper = mount(wrappedTable, {
    //     propsData: {
    //         fields: [
    //             {id: 0, key: 'a', label: 'harry'},
    //             {id: 1, key: 'b', label: 'sjaak'},
    //             {id: 2, key: 'tdClass', label: 'script'},
    //             {id: 3, key: 'formatter', label: 'test'},
    //         ],
    //         items: [{harry: 'sjaak'}],
    //     },
    // });

    // it('should have a header', () => {
    //     assert(wrapper.find('thead').exists);
    // });

    // it('the header should contain subelements', () => {
    //     // let tags = wrapper.find('thead').find('tr').find('td');
    //     // assert(tags.length.to.be(2));
    //     assert(wrapper.find('thead').find('tr').find('th').exists());
    // });

    // it('the amount of subelements should equal the number of fields', () => {});

    // it("the subelements should be named according to the fields' labels", () => {
    //     const wrapper = mount(wrappedTable, {
    //         propsData: {
    //             fields: [{id: 0, label: 'a'}],
    //             items: [{id: 0, a: 'b'}],
    //         },
    //     });
    //     console.log(wrapper.find('th').textContent);
    //     assert(wrapper.find('th').text().to.equal('a'));
    // });

    // it('should have a body', () => {});

    // it('the body should contain the number of items specified', () => {});

    // it("a row should emit 'row-clicked' when it is clicked", () => {});

    // it('should contain a classname that is specified in items', () => {
    //     const wrapper = mount(wrappedTable, {
    //         propsData: {
    //             fields: [{id: 0, label: 'a'}],
    //             items: [{id: 0, a: 'b'}],
    //         },
    //     });
    // });

    // it('should be able to use a formatter', () => {});
});
