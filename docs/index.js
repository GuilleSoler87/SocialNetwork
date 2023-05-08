const basicInfo = require('./basicInfo');
const endpoints = require('./endpoints');
const components = require('./components');

module.exports = {
    ...basicInfo,
    ...endpoints,
    ...components
};