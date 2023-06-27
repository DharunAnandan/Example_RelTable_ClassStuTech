"use strict";

import fs = require('fs');
import    path = require('path');
import {Objects,Classes} from 'appolo-utils';

export class FilesLoader {

    public static * load(root:string, filesPath:string|string[]) {
        if (!Array.isArray(filesPath)) {
            filesPath = [filesPath];
        }

        for (let filePath of filesPath) {

            yield * this._loadFiles(path.join(root, filePath));
        }
    }

    private static * _loadFiles(filePath:string) {
        if (fs.existsSync(filePath)) {

            for (let file of fs.readdirSync(filePath)) {
                let newPath = path.join(filePath, file);
                let stat = fs.statSync(newPath);

                if (stat.isFile() && /(.*)\.(js)$/.test(file) && !file.startsWith( "~")) {

                    yield newPath;

                } else if (stat.isDirectory()  && !file.startsWith( "~")) {
                    yield * this._loadFiles(newPath);
                }
            }
        }
    }
}

