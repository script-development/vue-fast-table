import { PropType } from 'vue';
import { Field, Item } from './types';
declare const _default: {
    name: string;
    props: {
        items: {
            type: PropType<Item[]>;
            default: any[];
        };
        fields: {
            type: PropType<Field[]>;
            default: any[];
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
    };
    data(): {
        sortedItems: Item[];
    };
    computed: {
        tableClassName(): string;
    };
    watch: {
        items(): void;
        sortBy(): void;
        sort(): void;
        fields(): void;
    };
    beforeMount(): void;
    methods: {
        sortItems(): void;
        parseClasses(input: string | string[] | ((_item?: Item) => string | string[]), item?: Item): string;
    };
};
export default _default;
