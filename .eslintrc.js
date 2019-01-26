module.exports = {
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 2018,
        "ecmaFeatures": {
            "globalReturn": true,
            "experimentalObjectRestSpread": true
        }
    },
    "env": {
        "es6": true,
        "node": true
    },
    "ecmaFeatures": {
        "modules": true,
        "experimentalObjectRestSpread": true
    },
    "plugins": [ "babel" ],
    "extends": "eslint:recommended"
};
