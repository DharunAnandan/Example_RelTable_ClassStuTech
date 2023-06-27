"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesLoader = void 0;
const fs = require("fs");
const path = require("path");
class FilesLoader {
    static *load(root, filesPath) {
        if (!Array.isArray(filesPath)) {
            filesPath = [filesPath];
        }
        for (let filePath of filesPath) {
            yield* this._loadFiles(path.join(root, filePath));
        }
    }
    static *_loadFiles(filePath) {
        if (fs.existsSync(filePath)) {
            for (let file of fs.readdirSync(filePath)) {
                let newPath = path.join(filePath, file);
                let stat = fs.statSync(newPath);
                if (stat.isFile() && /(.*)\.(js)$/.test(file) && !file.startsWith("~")) {
                    yield newPath;
                }
                else if (stat.isDirectory() && !file.startsWith("~")) {
                    yield* this._loadFiles(newPath);
                }
            }
        }
    }
}
exports.FilesLoader = FilesLoader;
//# sourceMappingURL=filesLoader.js.map