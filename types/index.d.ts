export type Item = {[key: string] : any}

type Formatter = (value: any, key: string, item: Item) => string;

export type Field = {key: string, label: string, tdClass: string, formatter: Formatter}
