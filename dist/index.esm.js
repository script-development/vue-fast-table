const propToClassKeys = ['borderless', 'hover', 'outlined', 'bordered', 'striped', 'dark', 'small', 'busy'];
var script = {
    name: 'VueFastTable',
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
        getItemBindingData(item, field) {
            return Object.assign(Object.assign({}, item), { __key: field.key });
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
        parseClasses(input, item) {
            let className = input ? (typeof input == 'function' ? input(item) : input) : '';
            if (Array.isArray(className)) {
                className = className.join(' ');
            }
            return className;
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
                  "head",
                  [
                    _vm._t(
                      "head()",
                      [
                        _c("div", [
                          _vm._v(
                            "\n                                " +
                              _vm._s(field.label || field.key) +
                              "\n                            "
                          )
                        ])
                      ],
                      null,
                      field
                    )
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
                { staticClass: "b-table-busy-slot", attrs: { role: "row" } },
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
                return _c(
                  "tr",
                  {
                    key: item.__id,
                    attrs: { role: "row" },
                    on: {
                      click: function($event) {
                        return _vm.$emit("row-clicked", item)
                      }
                    }
                  },
                  _vm._l(_vm.fields, function(field) {
                    return _c(
                      "td",
                      {
                        key: field.key,
                        class: _vm.parseClasses(field.tdClass, item),
                        attrs: { role: "cell" }
                      },
                      [
                        _vm._t(
                          "cell(" + field.key + ")",
                          [
                            _vm._t(
                              "cell()",
                              [
                                _vm._t(
                                  "cell",
                                  [
                                    _vm._v(
                                      "\n                                " +
                                        _vm._s(
                                          field.formatter
                                            ? field.formatter(item)
                                            : item[field.key]
                                        ) +
                                        "\n                            "
                                    )
                                  ],
                                  null,
                                  _vm.getItemBindingData(item, field)
                                )
                              ],
                              null,
                              _vm.getItemBindingData(item, field)
                            )
                          ],
                          null,
                          _vm.getItemBindingData(item, field)
                        )
                      ],
                      2
                    )
                  }),
                  0
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

export default __vue_component__;
