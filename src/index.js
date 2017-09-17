"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("./styles.less");
var preact_1 = require("preact");
var FileSelector = /** @class */ (function (_super) {
    __extends(FileSelector, _super);
    function FileSelector() {
        var _this = _super.call(this) || this;
        _this.options = FileSelector.options;
        _this.load();
        return _this;
    }
    FileSelector.init = function (options) {
        if (options === void 0) { options = {}; }
        FileSelector.options = {
            configUrl: options.configUrl || "http://localhost:3000/config",
            listFilesUrl: options.listFilesUrl || "http://localhost:3000/list_files?id=",
            onSelectRoot: options.onSelectRoot,
            onSelectFile: options.onSelectFile,
            apiKey: "xxx123xxx"
        };
        preact_1.render((preact_1.h(FileSelector, null)), options.element || document.body);
    };
    FileSelector.prototype.render = function (_a, _b) {
        var roots = _b.roots, files = _b.files, selectedRoot = _b.selectedRoot, displayFilePath = _b.displayFilePath;
        return (preact_1.h("div", { class: "file-selector" },
            preact_1.h("div", { class: "file-selector__header" }, this.renderFullPath(displayFilePath)),
            preact_1.h("div", { class: "file-selector__content" },
                preact_1.h("ul", { class: "file-selector__left-column" }, this.renderRoots(roots, selectedRoot)),
                preact_1.h("ul", { class: "file-selector__right-column" }, this.renderFiles(files)))));
    };
    FileSelector.prototype.renderRoots = function (roots, selectedRoot) {
        var _this = this;
        return roots && roots.map(function (root, index) {
            return _this.renderRoot(root, selectedRoot);
        });
    };
    FileSelector.prototype.renderRoot = function (root, selectedRoot) {
        var _this = this;
        return (preact_1.h("li", { onClick: function () {
                _this.selectRoot(root);
            }, className: this.getRootCssClass(selectedRoot, root) },
            preact_1.h("span", { class: "file-selector__root__label" }, root.label)));
    };
    FileSelector.prototype.renderFiles = function (files) {
        var _this = this;
        return files && files.map(function (file, index) {
            return _this.renderFile(file);
        });
    };
    FileSelector.prototype.renderFile = function (file) {
        var _this = this;
        return (preact_1.h("li", { onClick: function () {
                _this.selectFile(file);
            }, className: this.getFileCssClass(file) },
            preact_1.h("span", { class: "file-selector__file__label" }, file.label)));
    };
    FileSelector.prototype.load = function () {
        var _this = this;
        fetch(this.options.configUrl).then(function (response) {
            response.json().then(function (config) {
                var selectedRoot = config.selectedRoot;
                _this.setState({
                    roots: config.roots,
                    files: config.files,
                    selectedRoot: selectedRoot,
                    displayFilePath: selectedRoot.displayPath
                });
            });
        });
    };
    FileSelector.prototype.getRootCssClass = function (selectedRoot, root) {
        var classes = "file-selector__item file-selector__root";
        if (root.type) {
            classes += (" file-selector__root__is-" + root.type);
        }
        if (selectedRoot.id == root.id) {
            classes += " file-selector__root__is-selected";
        }
        return classes;
    };
    FileSelector.prototype.getFileCssClass = function (file) {
        var classes = "file-selector__item file-selector__file";
        if (file.type) {
            classes += (" file-selector__file__is-" + file.type);
        }
        return classes;
    };
    FileSelector.prototype.selectRoot = function (root) {
        this.setState({
            selectedRoot: root,
            displayFilePath: root.displayPath
        });
        this.fetchFiles(root);
        if (this.options.onSelectRoot) {
            this.options.onSelectRoot({
                root: root
            });
        }
    };
    FileSelector.prototype.selectFile = function (file) {
        if (!file.isFile) {
            this.setState({ displayFilePath: file.displayPath });
            this.fetchFiles(file);
        }
        if (this.options.onSelectFile) {
            this.options.onSelectFile({
                file: file
            });
        }
    };
    FileSelector.prototype.fetchFiles = function (file) {
        var _this = this;
        fetch(this.options.listFilesUrl + file.id).then(function (response) {
            response.json().then(function (data) {
                _this.setState({ files: data.files });
            });
        });
    };
    FileSelector.prototype.renderFullPath = function (displayFilePath) {
        return (preact_1.h("div", null, displayFilePath));
    };
    return FileSelector;
}(preact_1.Component));
exports.default = FileSelector;
