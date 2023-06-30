module.exports = {
  createOldCatalogs: true,
  indentation: 2,
  lexers: {
    js: ['JsxLexer'],
    jsx: ['JsxLexer'],
    default: ['JsxLexer']
  },
  locales: ['en', 'ro'],
  output: 'public/locales/$LOCALE/$NAMESPACE.json',
  input: ['src/**/*.{js,jsx}'],
  keySeparator: false,
  namespaceSeparator: false,
  sort: true,
  keepRemoved: true,
  useKeysAsDefaultValue: true
};
