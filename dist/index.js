'use strict';

/**
 * @typedef {import('vue').CreateElement} CreateElement
 * @typedef {import('../types').Field} Field
 * @typedef {import('../types').Item} Item
 */

//  TODO :: dependant on Bootstrap CSS, either add that or add custom css
var index = {
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
            default: true,
        },
        hover: {
            type: Boolean,
            default: false,
        },
        outlined: {
            type: Boolean,
            default: false,
        },
        bordered: {
            type: Boolean,
            default: false,
        },
        striped: {
            type: Boolean,
            default: false,
        },
        dark: {
            type: Boolean,
            default: false,
        },
        small: {
            type: Boolean,
            default: false,
        },
        sort: {
            type: String,
            default: 'ascending',
        },
        sortBy: {
            type: String,
            required: false,
        },
        id: {
            type: String,
            required: false,
        }
    },

    render(h, {props, listeners, scopedSlots}) {
        const {fields, sortBy} = props;

        let tableClassName = 'table b-table';

        for (const [key, value] of Object.entries(props)) {
            const keysToIgnore = ['items', 'fields', 'sort', 'sortBy'];
            if (keysToIgnore.includes(key)) {
                continue;
            }
            if (value) {
                if (key == 'small') {
                    tableClassName += ' ' + 'table-sm';
                } else {
                    tableClassName += ' ' + 'table-' + key;
                }
            }
        }

        /** @type {Item[]} */
        const items = [...props.items];

        // sort items when a sortBy prop was passed
        if (sortBy && items.length > 1) {
            items.sort((a, b) => {
                const field = fields.find(f => f.key === sortBy);
                let item1, item2;
                if (field && field.formatter) {
                    item1 = field.formatter(a[sortBy], sortBy, a);
                    item2 = field.formatter(b[sortBy], sortBy, b);
                } else if (typeof a[sortBy] === 'string') {
                    item1 = a[sortBy].toUpperCase();
                    item2 = b[sortBy].toUpperCase();
                } else {
                    item1 = a[sortBy];
                    item2 = b[sortBy];
                }

                let comparison = 0;
                if (item1 > item2) {
                    comparison = 1;
                } else if (item2 > item1) {
                    comparison = -1;
                } else {
                    comparison = 0;
                }
                if (props.sort == 'descending') {
                    comparison *= -1;
                }
                return comparison;
            });
        }

        const tableheader = h('thead', {attrs: {role: "rowgroup"}}, [
            h('tr', {attrs: {role: 'row'}}, [
                fields.map(field => {
                    let className = field.thClass
                        ? typeof field.thClass == 'function'
                            ? field.thClass(field.key)
                            : field.thClass
                        : '';

                    if (Array.isArray(className)) {
                        className = className.join(' ');
                    }

                    className = ('header ' + className).trim();

                    const args = {attrs: {class: className, role: 'columnheader'}};

                    if (scopedSlots['head']) {
                        return h('th', args, [
                            scopedSlots['head'](field),
                        ]);
                    }

                    let fieldContainsLabel = Object.prototype.hasOwnProperty.call(field, 'label');
                    return h('th', args, [
                        h('div', [fieldContainsLabel ? field.label : field.key]),
                    ]);
                }),
            ]),
        ]);

        const tableRows = items.map(item => {
            const cells = fields.map(field => {
                // TODO :: improve on this
                let className = field.tdClass
                    ? typeof field.tdClass == 'function'
                        ? field.tdClass(item[field.key], field.key, item)
                        : field.tdClass
                    : '';

                if (Array.isArray(className)) {
                    className = className.join(' ');
                }

                const args = {
                    on: {
                        click: () => {
                            if (listeners['row-clicked']) listeners['row-clicked'](item);
                        },
                    },
                    attrs: {
                        role: 'cell',
                        class: className,
                    },
                };

                if (field.formatter) {
                    return h('td', args, [field.formatter(item[field.key], field.key, item)]);
                }

                const scopedField = scopedSlots[`cell(${field.key})`] || scopedSlots[`cell()`] || scopedSlots[`cell`];
                if (scopedField) {
                    if (item instanceof Object) {
                        item.__key = field.key;
                        if (!item.key) {
                            item.key = field.key;
                        }
                    }

                    return h('td', args, [
                        h('slot', [h('div', scopedField(item))]),
                    ]);
                }
                return h('td', args, item[field.key]);
            });
            return h('tr', {attrs: {role: 'row'}}, [cells]);
        });

        const tableBody = h('tbody', {attrs: {role: 'rowgroup'}}, [tableRows]);
        const minimalTable = h('table', {
            attrs: {
                class: tableClassName,
                id: props.id,
            }
        }, [[tableheader], [tableBody]]);

        return h('div', {attrs: {class: 'table-responsive'}}, [minimalTable]);
    },
};

module.exports = index;
