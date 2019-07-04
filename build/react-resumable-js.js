"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _resumablejs = require("resumablejs");

var _resumablejs2 = _interopRequireDefault(_resumablejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Resumable JS for React JS
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author Gonzalo Rubino gonzalo_rubino@artear.com || gonzalorubino@gmail.com
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @version 1.1.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Creates an uploader component in React, to use with Resumable JS
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * On file added, the upload will begin.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ReactResumableJs = function (_React$Component) {
    _inherits(ReactResumableJs, _React$Component);

    function ReactResumableJs(props) {
        _classCallCheck(this, ReactResumableJs);

        var _this = _possibleConstructorReturn(this, (ReactResumableJs.__proto__ || Object.getPrototypeOf(ReactResumableJs)).call(this, props));

        _this.removeFile = function (event, file, index) {

            event.preventDefault();

            var currentFileList = _this.state.fileList.files;
            delete currentFileList[index];

            _this.setState({
                fileList: { files: currentFileList }
            });

            _this.props.onFileRemoved(file);
            _this.resumable.removeFile(file);
        };

        _this.createFileList = function () {

            var markup = _this.state.fileList.files.map(function (file, index) {

                var uniqID = _this.props.uploaderID + '-' + index;
                var originFile = file.file;
                var media = '';

                if (file.file.type.indexOf('video') > -1) {
                    media = _react2.default.createElement(
                        "label",
                        { className: "video" },
                        originFile.name
                    );
                    return _react2.default.createElement(
                        "li",
                        { className: "thumbnail", key: uniqID },
                        _react2.default.createElement(
                            "label",
                            { id: "media_" + uniqID },
                            media
                        ),
                        _react2.default.createElement(
                            "a",
                            { onClick: function onClick(event) {
                                    return _this.removeFile(event, file, index);
                                }, href: "#" },
                            "[X]"
                        )
                    );
                } else if (file.file.type.indexOf('image') > -1) {
                    if (_this.props.tmpDir !== "") {
                        var src = _this.props.tmpDir + file.fileName;
                        media = _react2.default.createElement("img", { className: "image", width: "80", src: src, alt: "" });
                        return _react2.default.createElement(
                            "li",
                            { className: "thumbnail", key: uniqID },
                            _react2.default.createElement(
                                "label",
                                { id: "media_" + uniqID },
                                media
                            ),
                            _react2.default.createElement(
                                "a",
                                { onClick: function onClick(event) {
                                        return _this.removeFile(event, file, index);
                                    }, href: "#" },
                                "[X]"
                            )
                        );
                    } else {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(originFile);
                        fileReader.onload = function (event) {
                            media = '<img class="image" width="80" src="' + event.target.result + '"/>';
                            document.querySelector("#media_" + uniqID).innerHTML = media;
                        };
                        return _react2.default.createElement(
                            "li",
                            { className: "thumbnail", key: uniqID },
                            _react2.default.createElement("label", { id: "media_" + uniqID }),
                            _react2.default.createElement(
                                "a",
                                { onClick: function onClick(event) {
                                        return _this.removeFile(event, file, index);
                                    }, href: "#" },
                                "[X]"
                            )
                        );
                    }
                } else {
                    media = _react2.default.createElement(
                        "label",
                        { className: "document" },
                        originFile.name
                    );
                    return _react2.default.createElement(
                        "li",
                        { className: "thumbnail", key: uniqID },
                        _react2.default.createElement(
                            "label",
                            { id: "media_" + uniqID },
                            media
                        ),
                        _react2.default.createElement(
                            "a",
                            { onClick: function onClick(event) {
                                    return _this.removeFile(event, file, index);
                                }, href: "#" },
                            "[X]"
                        )
                    );
                }
            });

            return _react2.default.createElement(
                "ul",
                { id: "items-" + _this.props.uploaderID },
                markup
            );
        };

        _this.cancelUpload = function () {
            _this.resumable.cancel();

            _this.setState({
                fileList: { files: [] }
            });

            _this.props.onCancelUpload();
        };

        _this.pauseUpload = function () {
            if (!_this.state.isPaused) {

                _this.resumable.pause();
                _this.setState({
                    isPaused: true
                });
                _this.props.onPauseUpload();
            } else {

                _this.resumable.upload();
                _this.setState({
                    isPaused: false
                });
                _this.props.onResumeUpload();
            }
        };

        _this.startUpload = function () {
            _this.resumable.upload();
            _this.setState({
                isPaused: false
            });
            _this.props.onStartUpload();
        };

        _this.retryUpload = function () {
            _this.resumable.retry();
            _this.setState({
                isUploading: true,
                hasError: false
            });
            _this.props.onResumeUpload();
        };

        _this.state = {
            progressBar: 0,
            messageStatus: '',
            fileList: { files: [] },
            isPaused: false,
            isUploading: false,
            hasError: false
        };

        _this.resumable = null;
        return _this;
    }

    _createClass(ReactResumableJs, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;

            var ResumableField = new _resumablejs2.default({
                target: this.props.service,
                query: this.props.query || {},
                fileType: this.props.filetypes,
                maxFiles: this.props.maxFiles,
                maxFileSize: this.props.maxFileSize,
                fileTypeErrorCallback: function fileTypeErrorCallback(file, errorCount) {
                    if (typeof _this2.props.onFileAddedError === "function") {
                        _this2.props.onFileAddedError(file, errorCount);
                    }
                },
                maxFileSizeErrorCallback: function maxFileSizeErrorCallback(file, errorCount) {
                    if (typeof _this2.props.onMaxFileSizeErrorCallback === "function") {
                        _this2.props.onMaxFileSizeErrorCallback(file, errorCount);
                    }
                },
                testMethod: this.props.testMethod || 'post',
                testChunks: this.props.testChunks || false,
                headers: this.props.headerObject || {},
                withCredentials: this.props.withCredentials || false,
                chunkSize: this.props.chunkSize,
                simultaneousUploads: this.props.simultaneousUploads,
                fileParameterName: this.props.fileParameterName,
                generateUniqueIdentifier: this.props.generateUniqueIdentifier,
                forceChunkSize: this.props.forceChunkSize
            });

            if (typeof this.props.maxFilesErrorCallback === "function") {
                ResumableField.opts.maxFilesErrorCallback = this.props.maxFilesErrorCallback;
            }

            ResumableField.assignBrowse(this.uploader);

            //Enable or Disable DragAnd Drop
            if (this.props.disableDragAndDrop === false) {
                ResumableField.assignDrop(this.dropZone);
            }

            ResumableField.on('fileAdded', function (file, event) {
                _this2.setState({
                    messageStatus: _this2.props.fileAddedMessage || ' Starting upload! '
                });

                if (typeof _this2.props.onFileAdded === "function") {
                    _this2.props.onFileAdded(file, _this2.resumable);
                } else {
                    ResumableField.upload();
                }
            });

            ResumableField.on('fileSuccess', function (file, fileServer) {

                if (_this2.props.fileNameServer) {
                    var objectServer = JSON.parse(fileServer);
                    file.fileName = objectServer[_this2.props.fileNameServer];
                } else {
                    file.fileName = fileServer;
                }

                var currentFiles = _this2.state.fileList.files;
                currentFiles.push(file);

                _this2.setState({
                    fileList: { files: currentFiles },
                    messageStatus: _this2.props.completedMessage + file.fileName || fileServer
                }, function () {
                    if (typeof _this2.props.onFileSuccess === "function") {
                        _this2.props.onFileSuccess(file, fileServer);
                    }
                });
            });

            ResumableField.on('progress', function () {

                _this2.setState({
                    isUploading: ResumableField.isUploading()
                });

                if (ResumableField.progress() * 100 < 100) {
                    _this2.setState({
                        messageStatus: parseInt(ResumableField.progress() * 100, 10) + '%',
                        progressBar: ResumableField.progress() * 100
                    });
                } else {
                    setTimeout(function () {
                        _this2.setState({
                            progressBar: 0
                        });
                    }, 1000);
                }
            });

            ResumableField.on('fileError', function (file, errorCount) {
                _this2.setState({ hasError: true });
                _this2.props.onUploadErrorCallback(file, errorCount);
            });

            this.resumable = ResumableField;
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            var fileList = null;
            if (this.props.showFileList) {
                fileList = _react2.default.createElement(
                    "div",
                    { className: "resumable-list" },
                    this.createFileList()
                );
            }

            var previousText = null;
            if (this.props.previousText) {
                if (typeof this.props.previousText === "string") previousText = _react2.default.createElement(
                    "p",
                    null,
                    this.props.previousText
                );else previousText = this.props.previousText;
            }

            var textLabel = null;
            if (this.props.textLabel) {
                textLabel = this.props.textLabel;
            }

            var startButton = null;
            if (this.props.startButton) {
                if (typeof this.props.startButton === "string" || typeof this.props.startButton === "boolean") startButton = _react2.default.createElement(
                    "label",
                    null,
                    _react2.default.createElement(
                        "button",
                        { disabled: this.state.isUploading, className: "btn start", onClick: this.startUpload },
                        this.props.startButton && "upload"
                    )
                );else startButton = this.props.startButton;
            }

            var cancelButton = null;
            if (this.props.cancelButton) {
                if (typeof this.props.cancelButton === "string" || typeof this.props.cancelButton === "boolean") cancelButton = _react2.default.createElement(
                    "label",
                    null,
                    _react2.default.createElement(
                        "button",
                        { disabled: !this.state.isUploading, className: "btn cancel", onClick: this.cancelUpload },
                        this.props.cancelButton && "cancel"
                    )
                );else cancelButton = this.props.cancelButton;
            }

            var pauseButton = null;
            if (this.props.pauseButton) {
                if (typeof this.props.pauseButton === "string" || typeof this.props.pauseButton === "boolean") pauseButton = _react2.default.createElement(
                    "label",
                    null,
                    _react2.default.createElement(
                        "button",
                        { disabled: !this.state.isUploading, className: "btn pause", onClick: this.pauseUpload },
                        this.props.pauseButton && "pause"
                    )
                );else pauseButton = this.props.pauseButton;
            }

            var retryButton = null;
            if (this.props.retryButton) {
                if (typeof this.props.retryButton === "string" || typeof this.props.retryButton === "boolean") retryButton = _react2.default.createElement(
                    "label",
                    null,
                    _react2.default.createElement(
                        "button",
                        { disabled: !this.state.hasError, className: "btn pause", onClick: this.retryUpload },
                        this.props.retryButton && "retry"
                    )
                );else retryButton = this.props.retryButton;
            }

            return _react2.default.createElement(
                "div",
                { id: this.props.dropTargetID, ref: function ref(node) {
                        return _this3.dropZone = node;
                    } },
                previousText,
                _react2.default.createElement(
                    "label",
                    { className: this.props.disableInput ? 'btn file-upload disabled' : 'btn file-upload' },
                    textLabel,
                    _react2.default.createElement("input", {
                        ref: function ref(node) {
                            return _this3.uploader = node;
                        },
                        type: "file",
                        id: this.props.uploaderID,
                        className: "btn",
                        name: this.props.uploaderID + '-upload',
                        accept: this.props.fileAccept || '*',
                        disabled: this.props.disableInput || false
                    })
                ),
                _react2.default.createElement(
                    "div",
                    { className: "progress", style: { display: this.state.progressBar === 0 ? "none" : "block" } },
                    _react2.default.createElement("div", { className: "progress-bar", style: { width: this.state.progressBar + '%' } })
                ),
                fileList,
                startButton,
                pauseButton,
                retryButton,
                cancelButton
            );
        }
    }]);

    return ReactResumableJs;
}(_react2.default.Component);

exports.default = ReactResumableJs;


ReactResumableJs.defaultProps = {
    maxFiles: undefined,
    uploaderID: 'default-resumable-uploader',
    dropTargetID: 'dropTarget',
    filetypes: [],
    fileAccept: '*',
    maxFileSize: 10240000,
    showFileList: true,
    onUploadErrorCallback: function onUploadErrorCallback(file, errorCount) {
        console.log('error', file, errorCount);
    },
    onFileRemoved: function onFileRemoved(file) {
        return file;
    },
    onCancelUpload: function onCancelUpload() {
        return true;
    },
    onPauseUpload: function onPauseUpload() {
        return true;
    },
    onResumeUpload: function onResumeUpload() {
        return true;
    },
    onStartUpload: function onStartUpload() {
        return true;
    },
    disableDragAndDrop: false,
    fileNameServer: "",
    tmpDir: "",
    chunkSize: 1024 * 1024,
    simultaneousUploads: 1,
    fileParameterName: 'file',
    generateUniqueIdentifier: null,
    maxFilesErrorCallback: null,
    cancelButton: false,
    pause: false,
    startButton: null,
    pauseButton: null,
    retryButton: null,
    previousText: "",
    headerObject: {},
    withCredentials: false,
    forceChunkSize: false
};