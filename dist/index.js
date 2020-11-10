'use strict';

/**
 * @typedef {import('vue').CreateElement} CreateElement
 * @typedef {import('../types').Field} Field
 * @typedef {import('../types').Item} Item
 */

//  TODO :: dependant on Bootstrap CSS, either add that or add custom css
var index = {
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
        sort: {
            type: String,
            default: 'ascending',
        },
        sortBy: {
            type: String,
            default: () => '',
        },
    },

    render(h, {props, listeners, scopedSlots}) {
        let tableClassName = 'table b-table';

        for (const [key, value] of Object.entries(props)) {
            const keysToIgnore = ['items', 'fields', 'sort', 'sortBy'];
            if (keysToIgnore.includes(key)) {
                continue;
            }
            if (value) {
                if (key == 'small') {
                    tableClassName += ' ' + 'table-sm';
                } else {
                    tableClassName += ' ' + 'table-' + key;
                }
            }
        }
        /** @type {Item[]} */
        let items = [...props.items];

        /**@type {Field[]} */
        let fields = [...props.fields];

        // sort items when a sortBy prop was passed
        if (props.sortBy.length) {
            items.sort((a, b) => {
                const item1 = a[props.sortBy].toUpperCase();
                const item2 = b[props.sortBy].toUpperCase();
                let comparison = 0;
                if (item1 > item2) {
                    comparison = 1;
                } else if (item2 > item1) {
                    comparison = -1;
                } else {
                    comparison = 0;
                }
                if (props.sort == 'descending') {
                    comparison *= -1;
                }
                return comparison;
            });
        }

        const tableheader = h('thead', [
            h('tr', [
                fields.map(field => {
                    let fieldContainsLabel = Object.prototype.hasOwnProperty.call(field, 'label');
                    return h('th', {attrs: {class: 'header'}}, [
                        h('div', [fieldContainsLabel ? field.label : field.key]),
                    ]);
                }),
            ]),
        ]);
        const tableRows = items.map(item => {
            const cells = fields.map(field => {
                // TODO :: improve on this
                let className = field.tdClass ? field.tdClass(item[field.key], field.key, item) : '';

                if (field.formatter) {
                    return h(
                        'td',
                        {
                            on: {
                                click: () => {
                                    if (listeners['row-clicked']) listeners['row-clicked'](item);
                                },
                            },
                            attrs: {
                                class: className,
                            },
                        },
                        [field.formatter(item[field.key], field.key, item)]
                    );
                }

                if (scopedSlots[`cell(${field.key})`]) {
                    return h('td', {attrs: {class: className}}, [
                        h('slot', [h('div', scopedSlots[`cell(${field.key})`](item))]),
                    ]);
                }
                return h(
                    'td',
                    {
                        on: {
                            click: () => {
                                if (listeners['row-clicked']) listeners['row-clicked'](item);
                            },
                        },
                        attrs: {
                            class: className,
                        },
                    },
                    item[field.key]
                );
            });
            return h('tr', [cells]);
        });

        const tableBody = h('tbody', [tableRows]);
        const minimalTable = h('table', {attrs: {class: tableClassName}}, [[tableheader], [tableBody]]);

        return h('div', {attrs: {class: 'table-responsive'}}, [minimalTable]);
    },
};

module.exports = index;
