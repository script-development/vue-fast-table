export interface Item {
    [key: string]: any;
    getContext?: (_item: Item) => string;
    __id?: number | string;
    __key?: string;
    __context?: string;
}
export interface Field {
    key?: string;
    label?: string;
    formatter?: (_item: Item) => any;
    thClass?: (() => string[] | string) | string | string[];
    tdClass?: ((_item: Item) => string[] | string) | string | string[];
    getContext?: (_item: Item) => string;
    [key: string]: any;
}
