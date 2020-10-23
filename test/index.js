import 'jsdom-global/register';
import assert from 'assert';
import minimalTable from '../src';
import {expect} from 'chai';
import {shallowMount, localVue, mount} from '@vue/test-utils';
// import sinon from 'sinon';

describe('Vue minimal table', () => {
    const wrappedTable = {
        components: {minimalTable},
        template: `
        <div>
            <minimalTable v-bind="$attrs" v-on="$listeners" /> 
        </div>`,
    };

    const wrapper = mount(wrappedTable, {
        propsData: {
            fields: [
                {id: 0, key: 'a', label: 'harry'},
                {id: 1, key: 'b', label: 'sjaak'},
                {id: 2, key: 'tdClass', label: 'script'},
                {id: 3, key: 'formatter', label: 'test'},
            ],
            items: [{harry: 'sjaak'}],
        },
    });

    it('should have a header', () => {
        assert(wrapper.find('thead').exists);
    });

    it('the header should contain subelements', () => {
        // let tags = wrapper.find('thead').find('tr').find('td');
        // assert(tags.length.to.be(2));
        assert(wrapper.find('thead').find('tr').find('th').exists());
    });

    it('the amount of subelements should equal the number of fields', () => {});

    it("the subelements should be named according to the fields' labels", () => {
        const wrapper = mount(wrappedTable, {
            propsData: {
                fields: [{id: 0, label: 'a'}],
                items: [{id: 0, a: 'b'}],
            },
        });
        console.log(wrapper.find('th').textContent);
        assert(wrapper.find('th').text().to.equal('a'));
    });

    it('should have a body', () => {});

    it('the body should contain the number of items specified', () => {});

    it("a row should emit 'row-clicked' when it is clicked", () => {});

    it('should contain a classname that is specified in items', () => {
        const wrapper = mount(wrappedTable, {
            propsData: {
                fields: [{id: 0, label: 'a'}],
                items: [{id: 0, a: 'b'}],
            },
        });
    });

    it('should be able to use a formatter', () => {});
});
