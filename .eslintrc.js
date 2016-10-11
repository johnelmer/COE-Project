module.exports = {
    "extends": "airbnb",
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "env": {
      "browser": true
    },
    "parser": "babel-eslint",
    "rules": {
      "semi": ["off", "always"],
      "new-cap": ["error", { "capIsNew": false }],
      "class-methods-use-this": ["off"],
      "new-parens": "off",
      "no-underscore-dangle": ["error", { "allowAfterThis": true }],
      "object-shorthand": ["off", "always", { "ignoreConstructors": true }],
      "no-underscore-dangle": "off",
      "func-names": ["off", "always"]
   }
};
