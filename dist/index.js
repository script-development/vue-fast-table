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
    render(h) {
        const tableheader = h('thead', [
            h('tr', [
                this.fields.map(field => {
                    return h('td', [field[this.valueField]]);
                }),
            ]),
        ]);
        const tableRows = this.items.map(item => {
            console.log(this.perPage);
            for (let i = 0; i < this.perPage; i++) {
                let cells = this.fields.map(field => {
                    if (field == 'formatter') {
                        if (!item['result']) {
                            item['result'] = item[field].call();
                            return h('td', [item['result']]);
                        }
                        return h('td', [item['result']]);
                    }
                    return h('td', [item[field]]);
                });
                return h('tr', [cells]);
            }
        });

        const tableBody = h('tbody', [tableRows]);
        const minimalTable = h('table', [[tableheader], [tableBody]]);
        return h('div', [minimalTable]);
    },
};

export default index;
