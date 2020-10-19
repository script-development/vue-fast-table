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
    },
    methods: {
        clickRow(row) {
            this.$emit('row-clicked', this.items[row]);
        },
    },
    data() {
        return {
            functionOverride: false,
        };
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
                        return h('th', {attrs: {role: 'columnheader', scope: 'col'}}, [h('div', [field.label])]);
                    }),
                ]),
            ]
        );

        const tableRows = this.items.map((item, rowNumber) => {
            const cells = this.fields.map(field => {
                if (field['tdClass']) {
                    return h('td', {attrs: {class: field['tdClass'](item[field.key], field.key, item)}, role: 'cell'});
                }
                if (field['formatter']) {
                    return h('td', {on: {click: () => this.clickRow(rowNumber)}}, [
                        field['formatter'](item[field.key], field.key, item),
                    ]);
                }
                if (this.$scopedSlots[`cell(${field.key})`]) {
                    return h('td', [h('slot', [h('div', this.$scopedSlots[`cell(${field.key})`](item))])]);
                }
                return h('td', {on: {click: () => this.clickRow(rowNumber)}, attrs: {role: 'cell'}}, item[field.key]);
            });
            return h('tr', [cells]);
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
