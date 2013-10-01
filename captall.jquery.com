{
  "name": "captall",
  "version": "1.1",
  "title": "Captall",
  "description": "A jQuery plugin for adding a caption to any DOM element, packed with a massive amount of options so it can be adjusted to everyone's needs.",
  "keywords": [
    "jquery",
    "plugin",
    "caption",
    "options",
    "callback"
  ],
  "homepage": "https://www.captall.be",
  "author": {
    "name": "Erwin Van Wesemael",
    "url": "http://www.wezy.be"
  },
  "bugs": "https://github.com/jstayton/jquery-manifest/issues",
  "licenses": [
    {
      "type": "MIT",
      "url": "http://www.opensource.org/licenses/mit-license.php"
    }
  ],
  "dependencies": {
    "jquery": ">=1.5",
    "easing": ">=1.3"
  },
  "docs": "http://www.captall.be/options.php",
  "demo": "http://www.captall.be/examples.php"
}
