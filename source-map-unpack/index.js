#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var chalk = require("chalk");
var mkdirp = require("mkdirp");
var minimist = require("minimist");
var source_map_1 = require("source-map");
var argv = minimist(process.argv.slice(2));
var projectNameInput = argv._[0];
var mapInput = argv._[1];
if (!projectNameInput || !mapInput) {
    console.log();
    console.log(chalk.white('Usage: unpack'), chalk.green('<folder-name-to-unpack-files-to)> <path-to-map-file>'));
    console.log();
    console.log(chalk.blue('Note: Minified javascript file should be placed under path specified in .map file.'));
    console.log();
    process.exit();
}
var pathToProject = path.join(process.cwd(), projectNameInput);
var pathToMap = path.isAbsolute(mapInput)
    ? mapInput
    : path.join(process.cwd(), mapInput);
if (fs.existsSync(pathToProject)) {
    console.log();
    console.log(chalk.red("Project folder already exists at: " + pathToProject));
    console.log();
    process.exit();
}
if (!fs.existsSync(pathToMap)) {
    console.log();
    console.log(chalk.red("Can't find map file under : " + pathToMap));
    console.log();
    process.exit();
}
try {
    var mapFile = fs.readFileSync(pathToMap, 'utf8');
    if (pathToMap.includes("js")) {
    	var WEBPACK_SUBSTRING_INDEX = 4;
    } else {
    	var WEBPACK_SUBSTRING_INDEX = 0;
    }
    source_map_1.SourceMapConsumer.with(mapFile, null, function (consumer) {
        console.log(chalk.green("Unpacking \uD83D\uDECD  your source\u00A0maps \uD83D\uDDFA"));
        var sources = consumer.sources;
        sources.forEach(function (source) {
            var content = consumer.sourceContentFor(source);
            var filePath = process.cwd() + "/" + projectNameInput + "/" + source.substring(WEBPACK_SUBSTRING_INDEX);
            mkdirp.sync(path.dirname(filePath));
	    try }
                fs.writeFileSync(filePath, content);
	    } catch (error) {
	        console.log(error);
            }
        });
        console.log(chalk.green('🎉  All done! Enjoy exploring your code 💻'));
    });
}
catch (err) {
    console.log(chalk.red('Oops! Something is wrong with the source map'), err);
    console.log(chalk.red('Make sure .min.js is correctly placed under the path specified in .map file'));
    console.log('STDERR: ');
    console.log(err);
}
//# sourceMappingURL=index.js.map
