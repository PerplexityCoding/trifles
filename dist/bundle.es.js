import { Component, h, render } from 'preact';

const __assign = Object.assign || function (target) {
    for (var source, i = 1; i < arguments.length; i++) {
        source = arguments[i];
        for (var prop in source) {
            if (Object.prototype.hasOwnProperty.call(source, prop)) {
                target[prop] = source[prop];
            }
        }
    }
    return target;
};

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var Trifles = /** @class */ (function (_super) {
    __extends(Trifles, _super);
    function Trifles(_a) {
        var options = _a.options;
        var _this = _super.call(this) || this;
        _this.options = __assign({ configUrl: "http://localhost:3000/config", listFilesUrl: "http://localhost:3000/list_files?id=" }, options);
        _this.load();
        return _this;
    }
    Trifles.prototype.render = function (_a, _b) {
        var roots = _b.roots, files = _b.files, selectedRoot = _b.selectedRoot, displayFilePath = _b.displayFilePath;
        return (h("div", { class: "trifles" },
            h("div", { class: "trifles__header" }, this.renderFullPath(displayFilePath)),
            h("div", { class: "trifles__content" },
                h("ul", { class: "trifles__left-column" }, this.renderRoots(roots, selectedRoot)),
                h("ul", { class: "trifles__right-column" }, this.renderFiles(files)))));
    };
    Trifles.prototype.renderRoots = function (roots, selectedRoot) {
        var _this = this;
        return roots && roots.map(function (root) {
            return _this.renderRoot(root, selectedRoot);
        });
    };
    Trifles.prototype.renderRoot = function (root, selectedRoot) {
        var _this = this;
        return (h("li", { onClick: function () { _this.selectRoot(root); }, className: this.getRootCssClass(selectedRoot, root) },
            h("span", { class: "trifles__root__label" }, root.label)));
    };
    Trifles.prototype.renderFiles = function (files) {
        var _this = this;
        return files && files.map(function (file, index) {
            return _this.renderFile(file);
        });
    };
    Trifles.prototype.renderFile = function (file) {
        var _this = this;
        return (h("li", { onClick: function () { _this.selectFile(file); }, className: this.getFileCssClass(file) },
            h("span", { class: "trifles__file__label" }, file.label)));
    };
    Trifles.prototype.load = function () {
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
    Trifles.prototype.getRootCssClass = function (selectedRoot, root) {
        var classes = "trifles__item trifles__root";
        if (root.type) {
            classes += (" trifles__root__is-" + root.type);
        }
        if (selectedRoot.id === root.id) {
            classes += " trifles__root__is-selected";
        }
        return classes;
    };
    Trifles.prototype.getFileCssClass = function (file) {
        var classes = "trifles__item trifles__file";
        if (file.type) {
            classes += (" trifles__file__is-" + file.type);
        }
        return classes;
    };
    Trifles.prototype.selectRoot = function (root) {
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
    Trifles.prototype.selectFile = function (file) {
        if (file.type === "folder") {
            this.setState({ displayFilePath: file.displayPath });
            this.fetchFiles(file);
        }
        if (this.options.onSelectFile) {
            this.options.onSelectFile({
                file: file
            });
        }
    };
    Trifles.prototype.fetchFiles = function (file) {
        var _this = this;
        fetch(this.options.listFilesUrl + file.id).then(function (response) {
            response.json().then(function (data) {
                _this.setState({ files: data.files });
            });
        });
    };
    Trifles.prototype.renderFullPath = function (displayFilePath) {
        return (h("div", null, displayFilePath));
    };
    return Trifles;
}(Component));

function create(element, wOptions) {
    if (wOptions === void 0) { wOptions = {}; }
    render((h(Trifles, { options: wOptions })), element || document.body);
}

export { create };
