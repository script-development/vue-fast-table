var index = {
    name: 'minimal-table',
    props: {
        items: {
            type: Array,
            required: false,
        },
        fields: {
            type: Array,
            required: true,
        },
    },
    render(h) {
        const header = h('thead', this.fields);

        return h('table', [header]);
    },
};

export default index;
