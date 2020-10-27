/**
 * @typedef {import('vue').CreateElement} CreateElement
 *
 * @typedef {object} Field
 * @property {String} key the string used to access an item's value
 * @property {String} label the string visible in the table
 *
 * @typedef {object} Item
 * @property {String} field.key the name of the key of the field the item belongs to
 * @property {String} tdClass the classname that is used for the td the item is rendered in
 * @func formatter a function to dynamically render table data
 */

var index = {
    name: 'minimal-table',
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
        const items = props.items;
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
                if (field.tdClass) {
                    return h('td', {attrs: {class: field.tdClass(item[field.key], field.key, item)}});
                }

                if (field.formatter) {
                    return h(
                        'td',
                        {
                            on: {
                                click: () => {
                                    if (listeners['row-clicked']) listeners['row-clicked'](item);
                                },
                            },
                        },
                        [field.formatter(item[field.key], field.key, item)]
                    );
                }

                if (scopedSlots[`cell(${field.key})`]) {
                    return h('td', [h('slot', [h('div', scopedSlots[`cell(${field.key})`](item))])]);
                }
                return h(
                    'td',
                    {
                        on: {
                            click: () => {
                                if (listeners['row-clicked']) listeners['row-clicked'](item);
                            },
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

export default index;
