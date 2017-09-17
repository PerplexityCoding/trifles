import { Component, h, render } from 'preact';

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

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
            apiKey: 'xxx123xxx'
        };
        render((h(FileSelector, null)), options.element || document.body);
    };
    FileSelector.prototype.load = function () {
        var _this = this;
        fetch(this.options.configUrl).then(function (response) {
            response.json().then(function (config) {
                _this.setState({ roots: config.roots });
                _this.setState({ files: config.files });
                _this.setState({ displayFilePath: config.selectedRoot.displayPath });
            });
        });
    };
    FileSelector.prototype.render = function (_a, _b) {
        var _this = this;
        var roots = _b.roots, files = _b.files, displayFilePath = _b.displayFilePath;
        return (h("div", { class: "file-selector" },
            h("div", { class: "file-selector_header" }, this.renderFullPath(displayFilePath)),
            h("div", { class: "file-selector__content" },
                h("ul", { class: "file-selector__left-column" }, roots && roots.map(function (root, index) {
                    return h("li", { onClick: function () {
                            _this.selectRoot(root);
                        } }, root.label);
                })),
                h("ul", { class: "file-selector__right-column" }, files && files.map(function (file, index) {
                    return (h("li", { onClick: function () {
                            _this.selectFile(file);
                        }, className: file.isFile ? "file-selector__is-file" : "file-selector__is-directory" }, file.label));
                })))));
    };
    FileSelector.prototype.selectRoot = function (root) {
        this.setState({ displayFilePath: root.displayPath });
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
        return (h("div", null, displayFilePath));
    };
    return FileSelector;
}(Component));

export default FileSelector;
