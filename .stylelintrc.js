// https://github.com/ant-design/ant-design/blob/master/.stylelintrc.json
module.exports = {
  extends: [
    'stylelint-config-standard',
    "stylelint-config-rational-order",
    'stylelint-config-prettier',
  ],
  customSyntax: "postcss-less",
  rules: {
    // https://github.com/callstack/linaria/issues/443#issuecomment-723722246
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'local'],
      },
    ],
    'selector-class-pattern': null
  }
}