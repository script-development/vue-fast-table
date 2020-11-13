'use strict';

var vue = require('vue');

/**
 * @typedef {import('../types').Field} Field
 * @typedef {import('../types').Item} Item
 * @typedef {import('vue').ComponentObjectPropsOptions} ComponentObjectPropsOptions
 * @typedef {import('vue').Component} Component
 */

/**
 * Get the table classes based on the given props
 * @param {ComponentObjectPropsOptions} props
 */
const getTableClasses = props => {
    let tableClassName = 'table b-table';
    for (const [key, value] of Object.entries(props)) {
        if (key == 'items' || key == 'fields' || !value) {
            continue;
        }

        if (key == 'small') {
            tableClassName += ' ' + 'table-sm';
        } else {
            tableClassName += ' ' + 'table-' + key;
        }
    }
    return tableClassName;
};

// TODO :: documentation for the following functions
const buildTableRow = cells => vue.h('tr', [cells]);

const buildTableHeader = fields => {
    return vue.h('thead', [
        buildTableRow(
            fields.map(field => {
                const fieldContainsLabel = Object.prototype.hasOwnProperty.call(field, 'label');
                return vue.h('th', {class: 'header'}, [vue.h('div', [fieldContainsLabel ? field.label : field.key])]);
            })
        ),
    ]);
};

const buildTableData = (item, field, slot, emit) => {
    let className = field.tdClass ? field.tdClass(item[field.key], field.key, item) : '';
    let cellContent = '';
    if (field.formatter) {
        cellContent = field.formatter(item[field.key], field.key, item);
    } else if (slot) {
        cellContent = [vue.h('div', slot(item))];
    } else {
        cellContent = item[field.key];
    }
    return vue.h('td', {class: className, onclick: () => emit('row-clicked', item)}, cellContent);
};

//  TODO :: dependant on Bootstrap CSS, either add that or add custom css
var index = vue.defineComponent({
    name: 'vueFastTable',
    functional: true,
    props: {
        /**
         * @type {Item[]} items - required
         */
        items: {
            type: Array,
            required: true,
        },

        /**
         * @type {Field[]} fields - required
         */
        fields: {
            type: Array,
            required: true,
        },
        borderless: {
            type: Boolean,
            default: () => false,
        },
        outlined: {
            type: Boolean,
            default: () => false,
        },
        bordered: {
            type: Boolean,
            default: () => false,
        },
        striped: {
            type: Boolean,
            default: () => false,
        },
        dark: {
            type: Boolean,
            default: () => false,
        },
        small: {
            type: Boolean,
            default: () => false,
        },
    },

    setup(props) {
        return {tableClassName: getTableClasses(props)};
    },

    render() {
        const rows = this.items.map(item => {
            const cells = this.fields.map(field => {
                const slot = this.$slots[`cell(${field.key})`] || '';
                return buildTableData(item, field, slot, this.$emit);
            });
            return buildTableRow(cells);
        });

        return vue.h('table', {class: this.tableClassName}, [buildTableHeader(this.fields), vue.h('tbody', [rows])]);
    },
});

module.exports = index;
