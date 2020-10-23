/**
 * @typedef {import('vue').CreateElement} CreateElement
 */

export default {
    name: 'minimal-table',
    functional: true,
    props: {
        /**
         * @property {array} items - required
         * An array of items that is used to build the table.
         * An item may contain a formatter to dynamically render data
         * An item may contain a td classname
         */
        items: {
            type: Array,
            required: true,
        },

        /**
         * @property {array} fields - required
         * An array of fields that are used to access item data
         * and to build the table header.
         */
        fields: {
            type: Array,
            required: true,
        },
    },

    render(h, context) {
        const {listeners} = context;
        let items = context.props.items;
        let fields = context.props.fields;

        const tableheader = h('thead', [
            h('tr', [
                fields.map(field => {
                    return h('th', {attrs: {scope: 'col', class: 'header'}}, [h('div', [field.key])]);
                }),
            ]),
        ]);
        const tableRows = items.map((item, rowNumber) => {
            const cells = fields.map(field => {
                if (field.tdClass) {
                    return h('td', {attrs: {class: field.tdClass(item[field.key], field.key, item)}});
                }

                if (field.formatter) {
                    return h('td', {on: {click: () => this.clickRow(rowNumber)}}, [
                        field.formatter(item[field.key], field.key, item),
                    ]);
                }

                if (context.scopedSlots[`cell(${field.key})`]) {
                    return h('td', [h('slot', [h('div', context.scopedSlots[`cell(${field.key})`](item))])]);
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

// module.exports = index;
