"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassTreeProvider = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const promises_1 = require("node:fs/promises");
class PassTreeProvider {
    //onDidChangeTreeData?: vscode.Event<void | PassTreeItem | PassTreeItem[] | null | undefined> | undefined;
    _passTree = new Array();
    _passdir = String();
    constructor() {
        const os = require('os');
        // TODO: make this a setting in the extension
        this._passdir = path.join(os.homedir(), '.password-store-test');
        vscode.window.showInformationMessage("password-store directory: ", this._passdir);
        console.debug('pass dir: ', this._passdir);
        this.getFiles();
        // this.getFilesJNN();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (element === undefined) {
            console.debug('get children undefined');
            return this._passTree;
        }
        console.debug('get children');
        return element.children;
    }
    async getFiles() {
        if (this.pathExists(this._passdir)) {
            try {
                console.debug('Getting files from ', this._passdir);
                const files = await (0, promises_1.readdir)(this._passdir, { recursive: true });
                console.debug('files:', files);
                this.makeTree(files);
            }
            catch (err) {
                console.error(err);
            }
        }
    }
    makeTree(files) {
        for (var file of files) {
            if (file[0] === '.') {
                continue;
            }
            var splits = file.split('/');
            if (splits.length === 1) {
                this._passTree.push(new PassTreeItem(splits[0], file, new Array()));
            }
        }
        return [];
    }
    getFilesJNN() {
        // OneDir/
        //   |__one1.gpg
        //   |__two1.gpg
        var oneDir = new PassTreeItem('OneDir', 'OneDir', new Array());
        oneDir.children?.push(new PassTreeItem('one1.gpg', 'OneDir/one1.gpg'));
        oneDir.children?.push(new PassTreeItem('two1.gpg', 'OneDir/two1.gpg'));
        this._passTree.push(oneDir);
        // TwoDir/
        //   |__one2.gpg
        var twoDir = new PassTreeItem('TwoDir', 'TwoDir', new Array());
        twoDir.children?.push(new PassTreeItem('one2.gpg', 'Two/one2.gpg'));
        this._passTree.push(twoDir);
        // ThreeDir/
        //   |__one3.gpg
        //   |__Three1Dir/
        //      |__one31.gpg
        var threeDir = new PassTreeItem('ThreeDir', 'ThreeDir', new Array());
        threeDir.children?.push(new PassTreeItem('one3.gpg', 'ThreeDir/one3.gpg'));
        var three1Dir = new PassTreeItem('Three1Dir', 'ThreeDir/Three1Dir', new Array());
        threeDir.children?.push(three1Dir);
        three1Dir.children?.push(new PassTreeItem('one31.gpg', 'ThreeDir/Three1Dir/one31.gpg'));
        this._passTree.push(threeDir);
    }
    pathExists(p) {
        try {
            fs.accessSync(p);
        }
        catch (err) {
            console.error('Could not find folder: ', p);
            return false;
        }
        return true;
    }
}
exports.PassTreeProvider = PassTreeProvider;
class PassTreeItem extends vscode.TreeItem {
    lable;
    fullPath;
    children;
    constructor(lable, // string to show in the tree
    fullPath, // include full path of this TreeItem
    children) {
        super(lable, children === undefined ? vscode.TreeItemCollapsibleState.None :
            vscode.TreeItemCollapsibleState.Collapsed);
        this.lable = lable;
        this.fullPath = fullPath;
        if (fullPath.indexOf('.gpg') > 0) {
            this.command = {
                'title': 'PassTreeItem Open Command',
                'command': "vscode.open",
                'arguments': [vscode.Uri.file(fullPath)]
            };
        }
        this.children = children;
        // this.tooltip = `${this.label}`;
        // this.description = `${this.label}`;
    }
}
//# sourceMappingURL=tree-data.js.map