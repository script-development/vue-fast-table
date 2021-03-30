import { PropType } from 'vue';
import { Field, Item } from './types';
import Cell from './Cell.vue';
declare const _default: {
    name: string;
    components: {
        Cell: import("vue").VueConstructor<Cell>;
    };
    props: {
        items: {
            type: PropType<Item[]>;
            default: () => any[];
        };
        fields: {
            type: PropType<Field[]>;
            default: () => any[];
        };
        borderless: {
            type: BooleanConstructor;
            default: boolean;
        };
        hover: {
            type: BooleanConstructor;
            default: boolean;
        };
        outlined: {
            type: BooleanConstructor;
            default: boolean;
        };
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        striped: {
            type: BooleanConstructor;
            default: boolean;
        };
        dark: {
            type: BooleanConstructor;
            default: boolean;
        };
        small: {
            type: BooleanConstructor;
            default: boolean;
        };
        sort: {
            type: PropType<"ascending" | "descending">;
            default: string;
        };
        sortBy: {
            type: StringConstructor;
            default: any;
        };
        id: {
            type: StringConstructor;
            default: any;
        };
        busy: {
            type: BooleanConstructor;
            default: boolean;
        };
        getContext: {
            type: PropType<(_item: Item) => string>;
            default: any;
        };
    };
    data(): {
        sortedItems: Item[];
    };
    computed: {
        tableClassName(): string;
        headSlotName(): "head()" | "head";
    };
    watch: {
        items(): void;
        sortBy(newVal: any, oldVal: any): void;
        sort(newVal: any, oldVal: any): void;
        fields(): void;
    };
    beforeMount(): void;
    methods: {
        getSlotName(item: Item): any;
        sortItems(): void;
        parseClasses(input: (() => string | string[]) | string | string[]): string;
    };
};
export default _default;
