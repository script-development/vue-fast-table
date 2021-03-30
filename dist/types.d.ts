export interface Item {
    __id?: number | string;
    __key?: string;
    __context?: string;
    formatter?: (_item: Item) => any;
    getContext?: (_item: Item) => string;
    [key: string]: any;
}
export interface Field {
    key?: string;
    thClass?: (() => string[] | string) | string | string[];
    tdClass?: ((_item: Item) => string[] | string) | string | string[];
    getContext?: (_item: Item) => string;
    [key: string]: any;
}
