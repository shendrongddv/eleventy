const path = require("path")
const { DateTime}  = require('luxon')
const prettier = require("prettier")
const htmlmin = require("html-minifier")

const stringify = require('javascript-stringify').stringify;

module.exports = function (eleventyConfig) {

    eleventyConfig.addPassthroughCopy('./src/assets/')
    eleventyConfig.addPassthroughCopy('./src/admin/')

    eleventyConfig.addNunjucksFilter("limit", (arr, limit) => arr.slice(0, limit));

    // human readable date
    eleventyConfig.addFilter("readableDate", (dateObj) => {
        return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
        "dd LLL yyyy"
        );
    });

    /* html-minifier */
    eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
        if( outputPath && outputPath.endsWith(".html")) {
          let minified = htmlmin.minify(content, {
            useShortDoctype: true,
            removeComments: true,
            collapseWhitespace: true
          });
          return minified;
        }    
        return content;
    });
    /* end html-minifier */

    eleventyConfig.addFilter('console', function(value) {
        const output = stringify(value, null, "\t", { maxDepth: 3 });
        console.log(output);
        return '';
      });

    return {
        dir: {
            input: "src",
            data: '_data',
            includes: '_includes',
            output: "_site"
        },
        htmlTemplateEngine: "njk",
    };
};
