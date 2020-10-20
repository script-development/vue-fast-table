/**
 * @typedef {import('vue').CreateElement} CreateElement
 */

var index = {
    name: 'minimal-table',
    // functional: true,
    // functional: true, // TODO :: make this work, and check if it's faster
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
        clickRow(rowNumber) {
            this.$emit('row-clicked', this.items[rowNumber]);
        },
    },

    render(h) {
        // TODO :: are the roles necessary?
        // check: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Cell_Role#:~:text=The%20element%20with%20role%3D%22cell,with%20role%3D%22row%22%20.
        const tableheader = h('thead', [
            h('tr', [
                this.fields.map(field => {
                    console.log(field);
                    return h('th', {attrs: {scope: 'col'}}, [h('div', [field.key])]);
                }),
            ]),
        ]);

        const tableRows = this.items.map((item, rowNumber) => {
            const cells = this.fields.map(field => {
                if (field.tdClass) {
                    return h('td', {attrs: {class: field.tdClass(item[field.key], field.key, item)}});
                }

                if (field.formatter) {
                    return h('td', {on: {click: () => this.clickRow(rowNumber)}}, [
                        field.formatter(item[field.key], field.key, item),
                    ]);
                }

                if (this.$scopedSlots[`cell(${field.key})`]) {
                    return h('td', [h('slot', [h('div', this.$scopedSlots[`cell(${field.key})`](item))])]);
                }

                return h('td', {on: {click: () => this.clickRow(rowNumber)}}, item[field.key]);
            });
            return h('tr', [cells]);
        });

        const tableBody = h('tbody', {attrs: {role: 'rowgroup'}}, [tableRows]);

        const minimalTable = h(
            'table',
            {attrs: {class: 'table b-table table-hover table-borderless b-table-selectable b-table-select-single'}},
            [[tableheader], [tableBody]]
        );

        return h('div', {attrs: {class: 'table-responsive'}}, [minimalTable]);
    },
};

module.exports = index;
