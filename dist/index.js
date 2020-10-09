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
    },
    render(h) {
        const tableheader = h('thead', [
            h('tr', [
                this.fields.map(field => {
                    return h('td', [field]);
                }),
            ]),
        ]);

        const tableRows = this.items.map(item => {
            let cells = this.fields.map(field => {
                return h('td', [item[field]]);
            });
            return h('tr', [cells]);
        });

        const tableBody = h('tbody', [tableRows]);

        return h('table', [[tableheader], [tableBody]]);
    },
};

export default index;
