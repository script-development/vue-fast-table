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
    },

    render(h, {props, listeners, scopedSlots}) {
        /** @type {Item[]} */
        const items = props.items;

        /**@type {Field[]} */
        const fields = props.fields;

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

        const minimalTable = h(
            'table',
            {attrs: {class: 'table b-table table-hover table-borderless b-table-selectable b-table-select-single'}},
            [[tableheader], [tableBody]]
        );

        return h('div', {attrs: {class: 'table-responsive'}}, [minimalTable]);
    },
};

module.exports = index;
