'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var script$1 = {
    name: 'Cell',
    props: {
        item: {
            type: Object,
            required: true,
        },
        field: {
            type: Object,
            required: true,
        },
        getContext: {
            type: Function,
            default: undefined,
        },
    },
    computed: {
        formatted() {
            return this.field.formatter(this.extendedItem);
        },
        extendedItem() {
            var _a;
            const item = Object.assign({}, this.item);
            item.__key = this.field.key;
            if (this.getContext) {
                item.__context = this.getContext(item);
            }
            else if ((_a = this.field) === null || _a === void 0 ? void 0 : _a.getContext) {
                item.__context = this.field.getContext(item);
            }
            else if (item === null || item === void 0 ? void 0 : item.getContext) {
                item.__context = item.getContext(item);
            }
            return item;
        },
        classes() {
            const tdClass = this.field.tdClass;
            const item = this.extendedItem;
            let className = tdClass ? (typeof tdClass == 'function' ? tdClass(item) : tdClass) : '';
            if (Array.isArray(className)) {
                className = className.join(' ');
            }
            if (item.__context) {
                className += ` context_${item.__context}`;
            }
            return className.trim();
        },
    },
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
const __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "td",
    {
      class: _vm.classes,
      attrs: { role: "cell" },
      on: {
        click: function($event) {
          return _vm.$emit("click", _vm.extendedItem)
        },
        dblclick: function($event) {
          return _vm.$emit("dblclick", _vm.extendedItem)
        }
      }
    },
    [
      _vm.field.formatter
        ? [_vm._v("\n        " + _vm._s(_vm.formatted) + "\n    ")]
        : _vm._t("default", null, null, _vm.extendedItem)
    ],
    2
  )
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$1 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    false,
    undefined,
    undefined,
    undefined
  );

const propToClassKeys = ['borderless', 'hover', 'outlined', 'bordered', 'striped', 'dark', 'small', 'busy'];
var script = {
    name: 'VueFastTable',
    components: { Cell: __vue_component__$1 },
    props: {
        items: {
            type: Array,
            default: () => [],
        },
        fields: {
            type: Array,
            default: () => [],
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
            default: undefined,
        },
        id: {
            type: String,
            default: undefined,
        },
        busy: {
            type: Boolean,
            default: false,
        },
        getContext: {
            type: Function,
            default: undefined,
        },
    },
    data() {
        return {
            sortedItems: [],
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
        headSlotName() {
            return this.$scopedSlots['head()'] ? 'head()' : 'head';
        },
    },
    watch: {
        items() {
            this.sortItems();
        },
        sortBy(newVal, oldVal) {
            if (newVal != oldVal) {
                this.sortItems();
            }
        },
        sort(newVal, oldVal) {
            if (newVal != oldVal) {
                this.sortItems();
            }
        },
        fields() {
            this.sortItems();
        },
    },
    beforeMount() {
        this.sortItems();
    },
    methods: {
        getSlotName(item) {
            let name;
            const context = item.__context;
            if (context) {
                name = `cell(${item.__key})@${context}`;
                if (this.$scopedSlots[name]) {
                    return name;
                }
            }
            name = `cell(${item.__key})`;
            if (this.$scopedSlots[name]) {
                return name;
            }
            if (context) {
                name = `cell()@${context}`;
                if (this.$scopedSlots[name]) {
                    return name;
                }
                name = `cell@${context}`;
                if (this.$scopedSlots[name]) {
                    return name;
                }
            }
            return this.$scopedSlots[`cell()`] ? `cell()` : `cell`;
        },
        sortItems() {
            const items = [...this.items];
            if (this.sortBy && items.length > 1) {
                items.sort((a, b) => {
                    const field = this.fields.find(f => f.key === this.sortBy);
                    let item1, item2;
                    if (field && field.formatter) {
                        item1 = field.formatter(a[this.sortBy], this.sortBy, a);
                        item2 = field.formatter(b[this.sortBy], this.sortBy, b);
                    }
                    else if (typeof a[this.sortBy] === 'string') {
                        item1 = a[this.sortBy].toUpperCase();
                        item2 = b[this.sortBy].toUpperCase();
                    }
                    else {
                        item1 = a[this.sortBy];
                        item2 = b[this.sortBy];
                    }
                    let comparison = 0;
                    if (item1 > item2) {
                        comparison = 1;
                    }
                    else if (item2 > item1) {
                        comparison = -1;
                    }
                    else {
                        comparison = 0;
                    }
                    if (this.sort == 'descending') {
                        comparison *= -1;
                    }
                    return comparison;
                });
            }
            this.sortedItems = items.map((item, idx) => (Object.assign({ __id: idx }, item)));
        },
        parseClasses(input) {
            let className = input ? (typeof input == 'function' ? input() : input) : '';
            if (Array.isArray(className)) {
                className = className.join(' ');
            }
            return className.trim();
        },
    },
};

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "table-responsive" }, [
    _c("table", { class: _vm.tableClassName, attrs: { id: _vm.id } }, [
      _c("thead", { attrs: { role: "rowgroup" } }, [
        _c(
          "tr",
          { attrs: { role: "row" } },
          _vm._l(_vm.fields, function(field) {
            return _c(
              "th",
              {
                key: field.key,
                class: "header " + _vm.parseClasses(field.thClass),
                attrs: { role: "columnheader" }
              },
              [
                _vm._t(
                  _vm.headSlotName,
                  [
                    _c("div", [
                      _vm._v(
                        "\n                            " +
                          _vm._s(field.label || field.key) +
                          "\n                        "
                      )
                    ])
                  ],
                  null,
                  field
                )
              ],
              2
            )
          }),
          0
        )
      ]),
      _vm._v(" "),
      _c(
        "tbody",
        { attrs: { role: "rowgroup" } },
        [
          _vm.busy
            ? _c(
                "tr",
                { staticClass: "b-table-busy-slot", attrs: { role: "row" } },
                [
                  _c(
                    "td",
                    { attrs: { colspan: _vm.fields.length, role: "cell" } },
                    [_vm._t("table-busy", [_vm._m(0)])],
                    2
                  )
                ]
              )
            : _vm.sortedItems.length == 0
            ? _c(
                "tr",
                { staticClass: "b-table-empty-slot", attrs: { role: "row" } },
                [
                  _c(
                    "td",
                    { attrs: { colspan: _vm.fields.length, role: "cell" } },
                    [_vm._t("table-empty")],
                    2
                  )
                ]
              )
            : _vm._l(_vm.sortedItems, function(item) {
                return _vm._t(
                  "row",
                  [
                    _c(
                      "tr",
                      {
                        key: item.__id,
                        staticClass: "b-table-data",
                        attrs: { role: "row" },
                        on: {
                          click: function($event) {
                            return _vm.$emit("row-clicked", item)
                          }
                        }
                      },
                      _vm._l(_vm.fields, function(field) {
                        return _c("Cell", {
                          key: field.key,
                          attrs: {
                            item: item,
                            field: field,
                            "get-context": _vm.getContext
                          },
                          on: {
                            click: function($event) {
                              return _vm.$emit("cell-click", $event)
                            },
                            dblclick: function($event) {
                              return _vm.$emit("cell-dblclick", $event)
                            }
                          },
                          scopedSlots: _vm._u(
                            [
                              {
                                key: "default",
                                fn: function(extendedItem) {
                                  return [
                                    _vm._t(
                                      _vm.getSlotName(extendedItem),
                                      [
                                        _vm._v(
                                          "\n                                " +
                                            _vm._s(item[field.key] || "") +
                                            "\n                            "
                                        )
                                      ],
                                      null,
                                      extendedItem
                                    )
                                  ]
                                }
                              }
                            ],
                            null,
                            true
                          )
                        })
                      }),
                      1
                    )
                  ],
                  null,
                  item
                )
              })
        ],
        2
      )
    ])
  ])
};
var __vue_staticRenderFns__ = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "text-center text-danger my-2" }, [
      _c("span", {
        staticClass: "align-middle spinner-border",
        attrs: { "aria-hidden": "true" }
      }),
      _vm._v(" "),
      _c("strong", [_vm._v("Loading...")])
    ])
  }
];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    undefined,
    undefined,
    undefined
  );

const VueFastTable = __vue_component__;
const InternalCell = __vue_component__$1;

exports.InternalCell = InternalCell;
exports.VueFastTable = VueFastTable;
exports.default = __vue_component__;
