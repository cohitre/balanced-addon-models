/* globals blanket */

blanket.options({
   filter: "//balanced-addon-models.*/",
   antifilter: "//.*(tests).*/",
   loaderExclusions: ["ember-data"]
});
