const fs = require('fs');
const path = require('path');

// Copies a folder of static files (images, video, zip) into the build as-is,
// e.g. src/perfect-parcel/press -> perfect-parcel/press. Works for both the
// production build and the dev server, because it adds the files as assets.
class CopyFolderPlugin {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  apply(compiler) {
    compiler.hooks.emit.tap('CopyFolderPlugin', compilation => {
      const walk = dir =>
        fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) return walk(full);
          if (entry.name.startsWith('.')) return;
          const content = fs.readFileSync(full);
          const name = path
            .join(this.to, path.relative(this.from, full))
            .split(path.sep)
            .join('/');
          compilation.assets[name] = {
            source: () => content,
            size: () => content.length
          };
        });
      walk(this.from);
    });
  }
}

module.exports = CopyFolderPlugin;
