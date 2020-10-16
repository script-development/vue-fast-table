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
        itemKey: {
            type: String,
            required: false,
            default: () => 'name',
        },
    },
    methods: {
        clickRow(row) {
            this.$emit('row-clicked', this.items[row]);
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
                        return h('th', {attrs: {role: 'columnheader', scope: 'col'}}, [
                            h('div', [field[this.valueField]]),
                        ]);
                    }),
                ]),
            ]
        );

        const tableRows = this.items.map((item, rowNumber) => {
            let cells = this.fields.map(field => {
                if (field['formatter']) {
                    return h('td', [field['formatter'](item[field.key], field.key, item)]);
                }
                if (item[field.key]) {
                    return h('td', [item[field.key]]);
                }
                return h('td', [
                    h('slot', {attrs: {name: 'actions'}}, [h('div', this.$scopedSlots['cell(actions)']())]),
                ]);
            });
            return h(
                'tr',
                {
                    attrs: {role: 'row'},
                    on: {click: () => this.clickRow(rowNumber)},
                },
                [cells]
            );
        });
        const tableBody = h('tbody', {attrs: {role: 'rowgroup'}}, [tableRows]);

        const minimalTable = h(
            'table',
            {attrs: {class: 'table b-table table-hover table-borderless b-table-selectable b-table-select-single'}},
            [[tableheader], [tableBody]]
        );

        return h('div', {attrs: {class: 'table-responsive', role: 'table'}}, [minimalTable]);
    },
};

export default index;
