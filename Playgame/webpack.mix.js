let mix = require("laravel-mix");

mix
  .js("src/hard.js", "public")
  .js("src/easy.js", "public")
  .js("src/medium.js", "public")
  .sass("src/style.scss", "public");
// .copy("src/index.html", "public/index.html");
