/**
 * @typedef {import('vue').CreateElement} CreateElement
 */

export default {
    name: 'minimal-table',
    functional: true,
    props: {
        items: {
            type: Array,
            required: true,
        },
        // TODO :: define fields JSDoc style
        fields: {
            type: Array,
            required: true,
        },
    },
    methods: {
        clickRow(event) {
            console.log(event);
            // this.$emit('row-clicked', this.items[rowNumber]);
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
                                listeners['row-clicked'](item);
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
