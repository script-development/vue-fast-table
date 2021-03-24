<template>
    <div class="table-responsive">
        <table
            :id="id"
            :class="tableClassName"
        >
            <thead role="rowgroup">
                <tr role="row">
                    <th
                        v-for="field of fields"
                        :key="field.key"
                        :class="'header ' + parseClasses(field.thClass)"
                        role="columnheader"
                    >
                        <slot
                            v-bind="field"
                            name="head"
                        >
                            <slot
                                v-bind="field"
                                name="head()"
                            >
                                <div>
                                    {{ field.label || field.key }}
                                </div>
                            </slot>
                        </slot>
                    </th>
                </tr>
            </thead>

            <tbody role="rowgroup">
                <tr
                    v-for="item of sortedItems"
                    :key="item.__id"
                    role="row"
                    @click="$emit('row-clicked', item)"
                >
                    <td
                        v-for="field of fields"
                        :key="field.key"
                        role="cell"
                        :class="parseClasses(field.tdClass, item)"
                    >
                        <slot
                            v-bind="{...item, __key: field.key}"
                            :name="`cell(${field.key})`"
                        >
                            <slot
                                v-bind="{...item, __key: field.key}"
                                name="cell()"
                            >
                                <slot
                                    v-bind="{...item, __key: field.key}"
                                    name="cell"
                                >
                                    {{ field.formatter
                                        ? field.formatter(item)
                                        : item[field.key]
                                    }}
                                </slot>
                            </slot>
                        </slot>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import {PropType} from 'vue';
import {Field, Item} from './types';

const propToClassKeys = ['borderless', 'hover', 'outlined', 'bordered', 'striped', 'dark', 'small'];

//  TODO :: dependant on Bootstrap CSS, either add that or add custom css
export default {
    name: 'VueFastTable',
    props: {
        items: {
            type: Array as PropType<Item[]>,
            default: [],
        },
        fields: {
            type: Array as PropType<Field[]>,
            default: [],
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
            type: String as PropType<'ascending' | 'descending'>,
            default: 'ascending',
        },
        sortBy: {
            type: String,
            default: undefined,
        },
        id: {
            type: String,
            default: undefined,
        },
    },

    data() {
        return {
            sortedItems: [] as Item[],
        };
    },

    computed: {
        tableClassName() {
            let tableClassName = 'table b-table';

            for (const key of propToClassKeys) {
                const value = this[key];
                if (value) {
                    tableClassName += ' table-' + (key == 'small' ? 'sm' : key);
                }
            }

            return tableClassName;
        },
    },

    watch: {
        items() {
            this.sortItems();
        },
        sortBy() {
            this.sortItems();
        },
        sort() {
            this.sortItems();
        },
        fields() {
            this.sortItems();
        },
    },

    beforeMount() {
        this.sortItems();
    },

    methods: {
        sortItems() {
            const items = [...this.items];

            // sort items when a sortBy prop was passed
            if (this.sortBy && items.length > 1) {
                items.sort((a, b) => {
                    const field = this.fields.find(f => f.key === this.sortBy);
                    let item1, item2;
                    if (field && field.formatter) {
                        item1 = field.formatter(a[this.sortBy], this.sortBy, a);
                        item2 = field.formatter(b[this.sortBy], this.sortBy, b);
                    } else if (typeof a[this.sortBy] === 'string') {
                        item1 = a[this.sortBy].toUpperCase();
                        item2 = b[this.sortBy].toUpperCase();
                    } else {
                        item1 = a[this.sortBy];
                        item2 = b[this.sortBy];
                    }
                    let comparison = 0;
                    if (item1 > item2) {
                        comparison = 1;
                    } else if (item2 > item1) {
                        comparison = -1;
                    } else {
                        comparison = 0;
                    }
                    if (this.sort == 'descending') {
                        comparison *= -1;
                    }
                    return comparison;
                });
            }
            this.sortedItems = items.map<Item>((item, idx) => ({__id: idx, ...item}));
        },
        parseClasses(input: ((_item?: Item) => string | string[]) | string | string[], item?: Item) {
            let className = input ? (typeof input == 'function' ? input(item) : input) : '';

            if (Array.isArray(className)) {
                className = className.join(' ');
            }

            return className;
        },
    },
};
</script>
