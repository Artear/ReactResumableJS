/**
 * Resumable JS for React JS
 * @author Gonzalo Rubino gonzalo_rubino@artear.com || gonzalorubino@gmail.com
 * @version 1.0.11
 *
 * Creates an uploader component in React, to use with Resumable JS
 * On file added, the upload will begin.
 *
 * Options values:

 @param {String} options.uploaderID The uploader ID. Ex: "image-upload"
 @param {Array} options.filetypes The allowed files extensions to upload. Ex: "['jpg', 'png']"
 @param {String} options.fileAddedMessage The message to print when file is added. Optional. Ex: 'Starting....'
 @param {String} options.completedMessage The message to print when file is completely uploaded. Optional. Ex: 'Completed!'
 @param {String} options.service The service that will receive the file. Ex: 'http://www.someurl.com/myservice/image.json'
 @param {String} options.textLabel The label of the upload. Ex: 'What photo do you want to add?'
 @param {String} options.previousText A Text that will be displayed before the component. Optional.
 @param {Boolean} options.disableDragAndDrop True to disable Drag and Drop. Enable by default.
 @param {Function} options.onUploadErrorCallback Function to call on Upload error. @returns file and message
 @param {Function} options.onFileAddedError Function to call on File Added error. @returns file and errorCount
 @param {Object} options.headerObject Optional, if you need to add a headers object.
 @param {Function} options.onFileSuccess Method to call when file is upload. Usually a method to set the filename that was uploaded by the component.
 };

 */

'use strict';

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

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactResumableJs = function (_React$Component) {
    _inherits(ReactResumableJs, _React$Component);

    function ReactResumableJs(props) {
        _classCallCheck(this, ReactResumableJs);

        var _this = _possibleConstructorReturn(this, (ReactResumableJs.__proto__ || Object.getPrototypeOf(ReactResumableJs)).call(this, props));

        _this.state = {
            progressBar: 0,
            messageStatus: '',
            fileList: { files: [] }
        };

        _this.componentDidMount = _this.componentDidMount.bind(_this);
        _this.removeFile = _this.removeFile.bind(_this);
        _this.createFileList = _this.createFileList.bind(_this);
        _this.resumable = null;
        return _this;
    }

    _createClass(ReactResumableJs, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var self = this;
            var ResumableField = new _resumablejs2.default({
                target: self.props.options.service,
                query: {},
                fileType: self.props.options.filetypes,
                fileTypeErrorCallback: function fileTypeErrorCallback(file, errorCount) {
                    if (self.props.options.onFileAddedError !== undefined) {
                        self.props.options.onFileAddedError(file, errorCount);
                    }
                },
                testMethod: 'post',
                testChunks: false,
                headers: self.props.options.headerObject ? self.props.options.headerObject : {} /* Add your own headers here if needed */
            });

            ResumableField.assignBrowse(document.querySelector('input[type=file]'));

            //Enable or Disable DragAnd Drop
            if (self.props.options.disableDragAndDrop === undefined) {
                ResumableField.assignDrop(document.getElementById('dropTarget'));
            }

            ResumableField.on('fileAdded', function (file, event) {
                self.setState({
                    messageStatus: self.props.options.fileAddedMessage ? self.props.options.fileAddedMessage : ' Starting upload! '
                });
                ResumableField.upload();
            });

            ResumableField.on('fileSuccess', function (file, message) {

                var fileObject = JSON.parse(message);
                if (fileObject.file != undefined) {

                    var currentFiles = self.state.fileList.files;

                    //rename the fileName with the new file from server
                    file.fileName = fileObject.file;

                    currentFiles.push(file);

                    self.setState({
                        fileList: { files: currentFiles },
                        messageStatus: self.props.options.completedMessage ? self.props.options.completedMessage + fileObject.file : ' Completed! : ' + fileObject.file
                    });

                    self.props.options.onFileSuccess(currentFiles);
                } else {
                    self.setState({
                        messageStatus: self.props.options.errorMessage ? self.props.options.errorMessage + fileObject.error : 'Error uploading file : ' + fileObject.error
                    });
                }
            });

            ResumableField.on('progress', function () {
                if (ResumableField.progress() * 100 < 100) {
                    self.setState({
                        messageStatus: parseInt(ResumableField.progress() * 100, 10) + '%',
                        progressBar: ResumableField.progress() * 100
                    });
                } else {
                    setTimeout(function () {
                        self.setState({
                            progressBar: 0
                        });
                    }, 1000);
                }
            });

            ResumableField.on('fileError', function (file, message) {
                if (self.props.options.onUploadErrorCallback) {
                    self.props.options.onUploadErrorCallback(file, errorCount);
                } else {
                    console.log('fileError');
                    console.log(file);
                    console.log(message);
                }
            });

            this.resumable = ResumableField;
        }
    }, {
        key: "removeFile",
        value: function removeFile(file, index) {

            var currentFileList = this.state.fileList.files;
            delete currentFileList[index];

            this.setState({
                fileList: { files: currentFileList }
            });

            this.resumable.removeFile(file);
        }
    }, {
        key: "createFileList",
        value: function createFileList() {

            var self = this;
            var markup = this.state.fileList.files.map(function (file, index) {

                var filez = file.file;
                var fileReader = new FileReader();
                fileReader.readAsDataURL(filez);
                fileReader.onload = function (event) {
                    document.querySelector('#image_' + index).src = event.target.result;
                };

                return _react2.default.createElement(
                    "li",
                    { key: index },
                    _react2.default.createElement("img", { width: "80", id: "image_" + index }),
                    _react2.default.createElement(
                        "a",
                        { onClick: function onClick() {
                                return self.removeFile(file, index);
                            }, href: "#" },
                        "[X]"
                    )
                );
            });

            return _react2.default.createElement(
                "ul",
                null,
                markup
            );
        }
    }, {
        key: "render",
        value: function render() {

            return _react2.default.createElement(
                "div",
                { id: "dropTarget" },
                _react2.default.createElement(
                    "p",
                    null,
                    this.props.options.previousText ? this.props.options.previousText : ''
                ),
                _react2.default.createElement("input", {
                    type: "file",
                    id: this.props.options.uploaderID,
                    className: "btn",
                    name: "image-upload",
                    label: this.props.options.textLabel ? this.props.options.textLabel : '',
                    accept: "image/*",
                    capture: "camera",
                    multiple: true
                }),
                _react2.default.createElement(
                    "div",
                    { id: "messageStatus" },
                    this.messageStatus
                ),
                _react2.default.createElement(
                    "div",
                    { id: "myProgress", style: { display: this.state.progressBar == 0 ? "none" : "block" } },
                    _react2.default.createElement("div", { id: "myBar", style: { width: this.state.progressBar + '%' } })
                ),
                _react2.default.createElement(
                    "div",
                    { id: "fileList" },
                    this.createFileList()
                )
            );
        }
    }]);

    return ReactResumableJs;
}(_react2.default.Component);

exports.default = ReactResumableJs;