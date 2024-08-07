import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { readdir } from 'node:fs/promises';

export class PassTreeProvider implements vscode.TreeDataProvider<PassTreeItem> {
    //onDidChangeTreeData?: vscode.Event<void | PassTreeItem | PassTreeItem[] | null | undefined> | undefined;

    private _passTree = new Array<PassTreeItem>();
    private _passdir = String();

    constructor() {
        const os = require('os');
        // TODO: make this a setting in the extension
        this._passdir = path.join(os.homedir(), '.password-store-test');
        vscode.window.showInformationMessage("password-store directory: ", this._passdir);
        console.debug('pass dir: ', this._passdir);
        this.getFiles();
        // this.getFilesJNN();
    }

    getTreeItem(element: PassTreeItem): vscode.TreeItem|Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: PassTreeItem): vscode.ProviderResult<PassTreeItem[]> {
        if(element === undefined) {
            console.debug('get children undefined');
            return this._passTree;
        }
        console.debug('get children');
        return element.children;
    }

    private async getFiles() {
        if (this.pathExists(this._passdir)) {
            try {
                console.debug('Getting files from ', this._passdir);
                const files = await readdir(this._passdir, { recursive: true });
                console.debug('files:', files);
                this.makeTree(files);
            } catch (err) {
                console.error(err);
            }
        }
    }

    private makeTree(files: string[]) {
        for (var file of files) {
            if(file[0] === '.'){
                continue;
            }
            var splits = file.split('/');
            if (splits.length === 1) {
                this._passTree.push(new PassTreeItem(splits[0], file, new Array<PassTreeItem>()));
            }
        }
        return [];
    }

    private getFilesJNN() {
        // OneDir/
        //   |__one1.gpg
        //   |__two1.gpg
        var oneDir = new PassTreeItem('OneDir','OneDir', new Array<PassTreeItem>());
        oneDir.children?.push(new PassTreeItem('one1.gpg', 'OneDir/one1.gpg'));
        oneDir.children?.push(new PassTreeItem('two1.gpg', 'OneDir/two1.gpg'));
        this._passTree.push(oneDir);

        // TwoDir/
        //   |__one2.gpg
        var twoDir = new PassTreeItem('TwoDir','TwoDir',new Array<PassTreeItem>());
        twoDir.children?.push(new PassTreeItem('one2.gpg', 'Two/one2.gpg'));
        this._passTree.push(twoDir);

        // ThreeDir/
        //   |__one3.gpg
        //   |__Three1Dir/
        //      |__one31.gpg
        var threeDir = new PassTreeItem('ThreeDir','ThreeDir', new Array<PassTreeItem>());
        threeDir.children?.push(new PassTreeItem('one3.gpg', 'ThreeDir/one3.gpg'));
        var three1Dir = new PassTreeItem('Three1Dir','ThreeDir/Three1Dir',new Array<PassTreeItem>());
        threeDir.children?.push(three1Dir);
        three1Dir.children?.push(new PassTreeItem('one31.gpg','ThreeDir/Three1Dir/one31.gpg'));
        this._passTree.push(threeDir);
    }

    private pathExists(p: string): boolean {
        try {
            fs.accessSync(p);
        } catch (err) {
            console.error('Could not find folder: ', p);
            return false;
        }
        return true;
    }
}

class PassTreeItem extends vscode.TreeItem {
    children: PassTreeItem[] | undefined;

    constructor(
        public readonly lable: string,              // string to show in the tree
        public readonly fullPath: string,           // include full path of this TreeItem
        children?: PassTreeItem[]
    ) {
        super(lable,
            children === undefined ? vscode.TreeItemCollapsibleState.None :
                                     vscode.TreeItemCollapsibleState.Collapsed
        );
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