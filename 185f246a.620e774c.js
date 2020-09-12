(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{58:function(e,i,t){"use strict";t.r(i),t.d(i,"frontMatter",(function(){return l})),t.d(i,"metadata",(function(){return s})),t.d(i,"rightToc",(function(){return o})),t.d(i,"default",(function(){return c}));var n=t(2),a=t(6),r=(t(0),t(94)),l={title:"useForm()"},s={unversionedId:"use-form",id:"use-form",isDocsHomePage:!1,title:"useForm()",description:"useForm hook provides everything needed for form state management.",source:"@site/docs/use-form.mdx",slug:"/use-form",permalink:"/react-next-form/docs/use-form",editUrl:"https://github.com/inkOfPixel/react-next-form/edit/master/docs/docs/use-form.mdx",version:"current",sidebar:"docs",previous:{title:"Integration with component libraries",permalink:"/react-next-form/docs/integration"},next:{title:"<FormProvider />",permalink:"/react-next-form/docs/form-provider"}},o=[{value:"Form config",id:"form-config",children:[{value:'initialValues <span class="badge badge--primary">Required</span>',id:"initialvalues-required",children:[]},{value:"enableReinitialize",id:"enablereinitialize",children:[]},{value:"reinitializeOptions",id:"reinitializeoptions",children:[]},{value:'onSubmit <span class="badge badge--primary">Required</span>',id:"onsubmit-required",children:[]},{value:"validationSchema",id:"validationschema",children:[]}]},{value:"Form context",id:"form-context",children:[{value:"initialValues",id:"initialvalues",children:[]},{value:"values",id:"values",children:[]},{value:"validationErrors",id:"validationerrors",children:[]},{value:"changes",id:"changes",children:[]},{value:"touchedFields",id:"touchedfields",children:[]},{value:"status",id:"status",children:[]},{value:"isValidating",id:"isvalidating",children:[]},{value:"isSubmitting",id:"issubmitting",children:[]},{value:"isDirty",id:"isdirty",children:[]},{value:"submission",id:"submission",children:[]},{value:"submit",id:"submit",children:[]},{value:"dismissSubmissionError",id:"dismisssubmissionerror",children:[]},{value:"reset",id:"reset",children:[]},{value:"fieldProps",id:"fieldprops",children:[]},{value:"setFieldValue",id:"setfieldvalue",children:[]},{value:"setFieldTouched",id:"setfieldtouched",children:[]},{value:"resetField",id:"resetfield",children:[]},{value:"dismissValidationErrors",id:"dismissvalidationerrors",children:[]},{value:"isTouched",id:"istouched",children:[]},{value:"isFieldDirty",id:"isfielddirty",children:[]},{value:"append",id:"append",children:[]},{value:"swap",id:"swap",children:[]},{value:"move",id:"move",children:[]},{value:"insert",id:"insert",children:[]},{value:"prepend",id:"prepend",children:[]},{value:"remove",id:"remove",children:[]},{value:"replace",id:"replace",children:[]}]}],d={rightToc:o};function c(e){var i=e.components,t=Object(a.a)(e,["components"]);return Object(r.b)("wrapper",Object(n.a)({},d,t,{components:i,mdxType:"MDXLayout"}),Object(r.b)("p",null,Object(r.b)("inlineCode",{parentName:"p"},"useForm")," hook provides everything needed for form state management.\nIt receive ",Object(r.b)("inlineCode",{parentName:"p"},"FormConfig")," and returns a ",Object(r.b)("inlineCode",{parentName:"p"},"FormContext")," that can be used to\nmanipulate form state and passed down to nested components via a ",Object(r.b)("a",Object(n.a)({parentName:"p"},{href:"form-provider"}),Object(r.b)("inlineCode",{parentName:"a"},"FormProvider"))),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"function useForm(config: FormConfig): FormContext;\n")),Object(r.b)("h2",{id:"form-config"},"Form config"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"interface FormConfig<Values, SubmissionResult> {\n  initialValues: Values;\n  enableReinitialize?: boolean;\n  reinitializeOptions?: ResetOptions;\n  onSubmit: (\n    values: Values,\n    context: SubmissionContext<Values>\n  ) => Promise<SubmissionResult> | SubmissionResult;\n  validationSchema?: ObjectSchema<Values>;\n}\n")),Object(r.b)("h3",{id:"initialvalues-required"},"initialValues ",Object(r.b)("span",{class:"badge badge--primary"},"Required")),Object(r.b)("p",null,"The initial field values of the form."),Object(r.b)("h3",{id:"enablereinitialize"},"enableReinitialize"),Object(r.b)("p",null,"TBD"),Object(r.b)("h3",{id:"reinitializeoptions"},"reinitializeOptions"),Object(r.b)("p",null,"TBD - ResetOptions"),Object(r.b)("h3",{id:"onsubmit-required"},"onSubmit ",Object(r.b)("span",{class:"badge badge--primary"},"Required")),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"function onSubmit(\n  values: Values,\n  context: SubmissionContext<Values>\n): Promise<SubmissionResult> | SubmissionResult;\n")),Object(r.b)("h3",{id:"validationschema"},"validationSchema"),Object(r.b)("p",null,"A Yup object validation schema."),Object(r.b)("h2",{id:"form-context"},"Form context"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"interface FormContext<Values extends Record<string, any>, SubmissionResult> {\n  // Form\n  initialValues: Values;\n  values: Values;\n  validationErrors: Record<string, FieldError>;\n  changes: Patch[];\n  touchedFields: DeepFlagMap;\n  status: FormStatus;\n  isValidating: boolean;\n  isSubmitting: boolean;\n  isDirty: boolean;\n  submission: {\n    result?: SubmissionResult;\n    error?: string;\n    count: number;\n  };\n  submit: () => void;\n  dismissSubmissionError: () => void;\n  reset: (values?: Values, options?: ResetOptions) => void;\n  // Field\n  fieldProps: <FieldValue = any>(\n    options: FieldConfig<FieldValue> | string\n  ) => FieldProps;\n  setFieldValue: <FieldValue = any>(\n    fieldPath: string,\n    newValue: FieldValue\n  ) => void;\n  setFieldTouched: (fieldPath: string, touched?: boolean) => void;\n  resetField: (fieldPath: string) => void;\n  dismissValidationErrors: (fieldPaths?: string[] | string) => void;\n  isTouched(fieldPath: string): boolean;\n  isFieldDirty(fieldPath: string): boolean;\n  // Array field\n  append: <ItemValue = any>(fieldPath: string, value: ItemValue) => void;\n  swap: (fieldPath: string, indexA: number, indexB: number) => void;\n  move: (fieldPath: string, from: number, to: number) => void;\n  insert: <ItemValue = any>(\n    fieldPath: string,\n    index: number,\n    value: ItemValue\n  ) => void;\n  prepend: <ItemValue = any>(fieldPath: string, value: ItemValue) => void;\n  remove: (fieldPath: string, index: number) => void;\n  replace: <ItemValue = any>(\n    fieldPath: string,\n    index: number,\n    value: ItemValue\n  ) => void;\n}\n")),Object(r.b)("h3",{id:"initialvalues"},"initialValues"),Object(r.b)("p",null,"Values;"),Object(r.b)("h3",{id:"values"},"values"),Object(r.b)("p",null,"Values;"),Object(r.b)("h3",{id:"validationerrors"},"validationErrors"),Object(r.b)("p",null,Object(r.b)("inlineCode",{parentName:"p"},"Record<string, FieldError>")),Object(r.b)("h3",{id:"changes"},"changes"),Object(r.b)("p",null,Object(r.b)("inlineCode",{parentName:"p"},"Patch[]")),Object(r.b)("h3",{id:"touchedfields"},"touchedFields"),Object(r.b)("p",null,Object(r.b)("inlineCode",{parentName:"p"},"DeepFlagMap")),Object(r.b)("h3",{id:"status"},"status"),Object(r.b)("p",null,Object(r.b)("inlineCode",{parentName:"p"},"FormStatus")),Object(r.b)("h3",{id:"isvalidating"},"isValidating"),Object(r.b)("h3",{id:"issubmitting"},"isSubmitting"),Object(r.b)("h3",{id:"isdirty"},"isDirty"),Object(r.b)("h3",{id:"submission"},"submission"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"{\n  result?: SubmissionResult;\n  error?: string;\n  count: number;\n}\n")),Object(r.b)("h3",{id:"submit"},"submit"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"() => void\n")),Object(r.b)("h3",{id:"dismisssubmissionerror"},"dismissSubmissionError"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"() => void\n")),Object(r.b)("h3",{id:"reset"},"reset"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"(values?: Values, options?: ResetOptions) => void\n")),Object(r.b)("h3",{id:"fieldprops"},"fieldProps"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"<FieldValue>(options: FieldConfig<FieldValue> | string) => FieldProps;\n")),Object(r.b)("h3",{id:"setfieldvalue"},"setFieldValue"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"<FieldValue>(fieldPath: string, newValue: FieldValue) => void\n")),Object(r.b)("h3",{id:"setfieldtouched"},"setFieldTouched"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"(fieldPath: string, touched?: boolean) => void\n")),Object(r.b)("h3",{id:"resetfield"},"resetField"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"(fieldPath: string) => void\n")),Object(r.b)("h3",{id:"dismissvalidationerrors"},"dismissValidationErrors"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"(fieldPaths?: string[] | string) => void\n")),Object(r.b)("h3",{id:"istouched"},"isTouched"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"(fieldPath: string): boolean\n")),Object(r.b)("h3",{id:"isfielddirty"},"isFieldDirty"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"(fieldPath: string): boolean\n")),Object(r.b)("h3",{id:"append"},"append"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"<ItemValue>(fieldPath: string, value: ItemValue) => void\n")),Object(r.b)("h3",{id:"swap"},"swap"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"(fieldPath: string, indexA: number, indexB: number) => void\n")),Object(r.b)("h3",{id:"move"},"move"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"(fieldPath: string, from: number, to: number) => void\n")),Object(r.b)("h3",{id:"insert"},"insert"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"<ItemValue>(fieldPath: string, index: number, value: ItemValue) => void\n")),Object(r.b)("h3",{id:"prepend"},"prepend"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"<ItemValue>(fieldPath: string, value: ItemValue) => void\n")),Object(r.b)("h3",{id:"remove"},"remove"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"(fieldPath: string, index: number) => void\n")),Object(r.b)("h3",{id:"replace"},"replace"),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"<ItemValue>(fieldPath: string, index: number, value: ItemValue) => void\n")))}c.isMDXComponent=!0},94:function(e,i,t){"use strict";t.d(i,"a",(function(){return u})),t.d(i,"b",(function(){return p}));var n=t(0),a=t.n(n);function r(e,i,t){return i in e?Object.defineProperty(e,i,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[i]=t,e}function l(e,i){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);i&&(n=n.filter((function(i){return Object.getOwnPropertyDescriptor(e,i).enumerable}))),t.push.apply(t,n)}return t}function s(e){for(var i=1;i<arguments.length;i++){var t=null!=arguments[i]?arguments[i]:{};i%2?l(Object(t),!0).forEach((function(i){r(e,i,t[i])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(i){Object.defineProperty(e,i,Object.getOwnPropertyDescriptor(t,i))}))}return e}function o(e,i){if(null==e)return{};var t,n,a=function(e,i){if(null==e)return{};var t,n,a={},r=Object.keys(e);for(n=0;n<r.length;n++)t=r[n],i.indexOf(t)>=0||(a[t]=e[t]);return a}(e,i);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)t=r[n],i.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var d=a.a.createContext({}),c=function(e){var i=a.a.useContext(d),t=i;return e&&(t="function"==typeof e?e(i):s(s({},i),e)),t},u=function(e){var i=c(e.components);return a.a.createElement(d.Provider,{value:i},e.children)},b={inlineCode:"code",wrapper:function(e){var i=e.children;return a.a.createElement(a.a.Fragment,{},i)}},m=a.a.forwardRef((function(e,i){var t=e.components,n=e.mdxType,r=e.originalType,l=e.parentName,d=o(e,["components","mdxType","originalType","parentName"]),u=c(t),m=n,p=u["".concat(l,".").concat(m)]||u[m]||b[m]||r;return t?a.a.createElement(p,s(s({ref:i},d),{},{components:t})):a.a.createElement(p,s({ref:i},d))}));function p(e,i){var t=arguments,n=i&&i.mdxType;if("string"==typeof e||n){var r=t.length,l=new Array(r);l[0]=m;var s={};for(var o in i)hasOwnProperty.call(i,o)&&(s[o]=i[o]);s.originalType=e,s.mdxType="string"==typeof e?e:n,l[1]=s;for(var d=2;d<r;d++)l[d]=t[d];return a.a.createElement.apply(null,l)}return a.a.createElement.apply(null,t)}m.displayName="MDXCreateElement"}}]);