'use strict';

var index = {
    name: 'minimal-table',
    props: {
        items: {
            type: Array,
            required: true,
        },
        // fields: {
        //     type: Array,
        //     required: true,
        // }
    },
    render(h) {
        let fields = ['a', 'b'];
        const header = h('thead', fields);

        return h('table', header);
    },
};

module.exports = index;
