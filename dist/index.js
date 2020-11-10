'use strict';

var vue = require('vue');

/**
 * @typedef {import('vue').CreateElement} CreateElement
 * @typedef {import('../types').Field} Field
 * @typedef {import('../types').Item} Item
 */

//  TODO :: dependant on Bootstrap CSS, either add that or add custom css
const VueFastTable = {
    name: 'vueFastTable',
    functional: true,
    props: {
        /**
         * @type {Item[]} items - required
         */
        items: {
            type: Array,
            required: true,
        },

        /**
         * @type {Field[]} fields - required
         */
        fields: {
            type: Array,
            required: true,
        },
        borderless: {
            type: Boolean,
            default: () => false,
        },
        outlined: {
            type: Boolean,
            default: () => false,
        },
        bordered: {
            type: Boolean,
            default: () => false,
        },
        striped: {
            type: Boolean,
            default: () => false,
        },
        dark: {
            type: Boolean,
            default: () => false,
        },
        small: {
            type: Boolean,
            default: () => false,
        },
    },
    methods: {
        compare(a, b) {
            console.log(a, b);
        },
    },

    setup(props, context) {
        return {props, context};
    },

    render() {
        let tableClassName = 'table b-table';
        for (const [key, value] of Object.entries(this.props)) {
            if (key == 'items' || key == 'fields') {
                continue;
            }
            if (value) {
                console.log(value);
                if (key == 'small') {
                    tableClassName += ' ' + 'table-sm';
                } else {
                    tableClassName += ' ' + 'table-' + key;
                }
            }
        }
        /** @type {Item[]} */
        const items = this.props.items;
        /**@type {Field[]} */
        const fields = this.props.fields;

        const tableheader = vue.h('thead', [
            vue.h('tr', [
                fields.map(field => {
                    let fieldContainsLabel = Object.prototype.hasOwnProperty.call(field, 'label');
                    return vue.h('th', {attrs: {class: 'header'}}, [
                        vue.h('div', [fieldContainsLabel ? field.label : field.key]),
                    ]);
                }),
            ]),
        ]);
        const tableRows = items.map(item => {
            const cells = fields.map(field => {
                let className = field.tdClass ? field.tdClass(item[field.key], field.key, item) : '';
                if (field.formatter) {
                    return vue.h(
                        'td',
                        {
                            on: {
                                click: () => {
                                    if (this.attrs.listeners['row-clicked']) this.attrs.listeners['row-clicked'](item);
                                },
                            },
                            attrs: {
                                class: className,
                            },
                        },
                        [field.formatter(item[field.key], field.key, item)]
                    );
                }
                if (this.context.slots[`cell(${field.key})`]) {
                    return vue.h('td', {attrs: {class: className}}, [
                        vue.h('slot', [vue.h('div', scopedSlots[`cell(${field.key})`](item))]),
                    ]);
                }
                return vue.h(
                    'td',
                    {
                        on: {
                            click: () => {
                                if (this.attrs.listeners['row-clicked']) this.attrs.listeners['row-clicked'](item);
                            },
                        },
                        attrs: {
                            class: className,
                        },
                    },
                    item[field.key]
                );
            });
            return vue.h('tr', [cells]);
        });
        const tableBody = vue.h('tbody', [tableRows]);
        const minimalTable = vue.h('table', {attrs: {class: tableClassName}}, [[tableheader], [tableBody]]);
        return vue.h('div', {attrs: {class: 'table-responsive'}}, [minimalTable]);
    },
};

module.exports = VueFastTable;
