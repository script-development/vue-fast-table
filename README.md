# Vue Fast Table

Vue Fast Table is a component for displaying tabular data. Build around the vue table and uses Vue 2.

## Getting started:

1. Make sure you have the bootstrap css
2. `npm install @script-development/vue-fast-table`
3. Add the component and data

```js
import VueFastTable from '@script-development/vue-fast-table';

export default {
    components: {
        VueFastTable,
    },
    data() {
        return {
            fields: [
                {key: 'name', label: 'Name'},
                {key: 'dob', label: 'Date of birth'},
            ],
            items: [
                {name: 'Harry', dob: '14-03-1948'},
                {name: 'Sally', dob: '19-11-1961'},
            ],
        };
    },
};
```

4. Add the component

```html
<VueFastTable :fields="fields" :items="items" />
```

## Examples:

-   [simple fields and items](https://codesandbox.io/s/simple-example-7ncws?file=/src/App.vue)
-   [field formatter function](https://codesandbox.io/s/field-formatter-xv2nn?file=/src/App.vue)
-   [sorting](https://codesandbox.io/s/sorting-5irno?file=/src/App.vue)
-   [#head and #cell slots](https://codesandbox.io/s/simple-slots-8pxxp?file=/src/App.vue)
-   [field slots (#cell(name))](https://codesandbox.io/s/field-slots-rzxem?file=/src/App.vue)
-   [context](https://codesandbox.io/s/context-otfmm?file=/src/App.vue)

## Props

### `fields: Array<Field>`

An array containing the fields to show in the table.

```ts
Array<{
    // The field identifier
    key: string;
    // The visual name of the field, if undefined the key will be used as label
    label?: string

    // Class(es) to add to every <th> element
    thClass?: (() => string[] | string) | string | string[];
    // Class(es) to add to every <td> element
    tdClass?: ((item: Item) => string[] | string) | string | string[];
    // provide a item with a context
    // ONLY ALPHABETIC CHARACTERS AND _
    getContext?: (item: Item) => string;
    // Format the field data
    formatter?: (item: Item) => any;
}>
```

### `items: Array<Item>`

The table data with every array item as row and the item data as fields, note that the `key` of the fields property will be used to select what to show.

```ts
Array<{
    // The data to show in the table, key needs to match field keys
    [key: string]: any;

    // provide a item with a context
    // ONLY ALPHABETIC CHARACTERS AND _
    // item.__key can be used to identify the field
    getContext?: (item: Item) => string;

    // SET AUTOMATICALLY
    // A internal used to track the position of an item in a table
    readonly __id?: number | string;
    // SET AUTOMATICALLY
    // Contains the field it's key when item is provided to cell functions like formatter, getContext, etc..
    readonly __key?: string;
    // SET AUTOMATICALLY
    // MIGHT contain the Item's context based on it's context, mainly for internal use
    readonly __context?: string;
}>
```

### `borderless: boolean`

Add the `table-borderless` class to the `<table>` for more info read: [bootstrap tables without borders](https://getbootstrap.com/docs/5.0/content/tables/#tables-without-borders)

```html
<table class="table table-borderless">...</table>
```

### `hover: boolean`

Add the `table-hover` class to the `<table>` for more info read: [bootstrap table hoverable rows](https://getbootstrap.com/docs/5.0/content/tables/#hoverable-rows)

```html
<table class="table table-hover">...</table>
```

### `outlined: boolean`

Add the `table-outlined` class to the `<table>`

```html
<table class="table table-outlined">...</table>
```

### `bordered: boolean`

Add the `table-bordered` class to the `<table>` for more info read: [bootstrap bordered table](https://getbootstrap.com/docs/5.0/content/tables/#bordered-tables)

```html
<table class="table table-bordered">...</table>
```

### `striped: boolean`

Add the `table-striped` class to the `<table>` for more info read: [bootstrap table striped-rows](https://getbootstrap.com/docs/5.0/content/tables/#striped-rows)

```html
<table class="table table-striped">...</table>
```

### `dark: boolean`

Add the `table-dark` class to the `<table>` for more info read: [bootstrap table variants](https://getbootstrap.com/docs/5.0/content/tables/#variants)

```html
<table class="table table-dark">...</table>
```

### `small: boolean`

Add the `table-sm` class to the `<table>` for more info read: [bootstrap small table](https://getbootstrap.com/docs/5.0/content/tables/#small-tables)

```html
<table class="table table-sm">...</table>
```

### `sortBy: string`

A field key to sort the data by

### `sort: 'ascending' | 'descending' = 'ascending'`

If sortBy is provided what way should the data be sorted

### `id: string`

An id to provide to the table

```html
<table id="YourInputWillGoHere" class="table">...</table>
```

### `busy: boolean`

Toggle the table busy state

### `getContext: (item: Item) => string`

Provide a item with a context **(ONLY ALPHABETIC CHARACTERS AND \_)**

The `item.__key` will contain the field key

## Slots

### header field `#head`

Format the header fields _(can also be written as: `#head()`)_

```html
<VueFastTable>
    <template #head="field">
        <div>{{ field.label }}</div>
    </template>
</VueFastTable>
```

### all cells `#cell`

Format the cell fields _(can also be written as: `#cell()`)_

```html
<VueFastTable>
    <template #cell="item">
        <div>{{ item[item.__key] }}</div>
    </template>
</VueFastTable>
```

### specific field `#cell(field_key_here)`

Format a specific cell by field key

```html
<VueFastTable>
    <template #cell(name)="item">
        <div>{{ item.name }}</div>
    </template>
</VueFastTable>
```

### context `#cell@ctx_value` or `#cell(field_key)@ctx_value`

Format cell(s) based on a given context

A context can be provided via `getContext` of `Item` or `Field` or via it's component prop

```html
<VueFastTable :getContext="getContext">
    <template #cell(name)="item">
        <p>{{item.name}}</p>
    </template>

    <template #cell(name)@editing="item">
        <div>
            <p>Edit name:</p>
            <input v-model="item.name" />
        </div>
    </template>
</VueFastTable>

<script>
    export default {
        data() {
            return {
                // If false first will be rendered
                // If true second template will be rendered
                inEditMode: true,
            };
        }
        methods: {
            getContext(item) {
                if (this.inEditMode) {
                    return 'editing';
                }
                return undefined;
            },
        },
    };
</script>
```

## Order of methods to show data

With advanced tables using multiple methods of showing data you can get stuck trying to show data while some other method already shows it, for those situation this is the order in witch the table tries to show cell data.

1. field formatter
2. specific field with context slot _(`#cell(name)@editing`)_
3. specific field slot _(`#cell(name)`)_
4. all cells with context slot _(`#cell@editing`)_
5. all cells slot _(`#cell`)_
6. show `item[item.__key]`
