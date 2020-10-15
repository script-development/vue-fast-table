'use strict';

/**
 * @typedef {import('vue').CreateElement} CreateElement
 */

var index = {
    name: 'minimal-table',
    props: {
        items: {
            type: Array,
            required: true,
        },
        fields: {
            type: Array,
            required: true,
        },
        valueField: {
            type: String,
            required: false,
            default: () => 'label',
        },
        perPage: {
            type: Number,
            required: false,
            default: () => 20,
        },
    },
    methods: {
        clickRow(row) {
            this.$emit('row-clicked', row);
        },
    },
    render(h) {
        const tableheader = h(
            'thead',
            {
                attrs: {
                    role: 'rowgroup',
                },
            },
            [
                h('tr', {attrs: {role: 'row'}}, [
                    this.fields.map(field => {
                        return h('td', [field[this.valueField]]);
                    }),
                ]),
            ]
        );

        const tableRows = this.items.map((item, rowNumber) => {
            let cells = this.fields.map(field => {
                if (field == 'formatter') {
                    return h('td', [item[field].call()]);
                }
                if (field == 'actions') {
                    return h('slot', [item[field]]);
                }
                return h('td', [item[field[this.valueField]]]);
            });
            return h(
                'tr',
                {
                    attrs: {
                        role: 'row',
                    },
                    on: {click: () => this.clickRow(rowNumber)},
                },
                [cells]
            );
        });

        const tableBody = h('tbody', [tableRows]);
        const minimalTable = h(
            'table',
            {attrs: {class: 'table b-table table-hover table-borderless b-table-selectable b-table-select-single'}},
            [[tableheader], [tableBody]]
        );
        return h('div', [minimalTable]);
    },
};

export default index;
