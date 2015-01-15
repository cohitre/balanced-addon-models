/* globals blanket */

blanket.options({
   filter: "//..*(addon).*/",
   antifilter: "//.*(tests).*/",
   loaderExclusions: ["ember-data"]
});
