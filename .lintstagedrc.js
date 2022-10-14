module.exports = {
  "src/**/*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "src/**/*.less": [
    "stylelint --fix",
    "prettier --write"
  ]
}