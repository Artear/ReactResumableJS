/**
 * Resumable JS for React JS
 * @author Gonzalo Rubino gonzalo_rubino@artear.com || gonzalorubino@gmail.com
 * @version 1.0
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
};

 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _formsyReactComponents = require('formsy-react-components');

var _formsyReactComponents2 = _interopRequireDefault(_formsyReactComponents);

var _ResumableJS = require('ResumableJS');

var _ResumableJS2 = _interopRequireDefault(_ResumableJS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var File = _formsyReactComponents2.default.File;

var ReactResumableJs = function (_React$Component) {
  _inherits(ReactResumableJs, _React$Component);

  function ReactResumableJs(props) {
    _classCallCheck(this, ReactResumableJs);

    var _this = _possibleConstructorReturn(this, (ReactResumableJs.__proto__ || Object.getPrototypeOf(ReactResumableJs)).call(this, props));

    _this.state = {
      progressBar: 0,
      messageStatus: ''
    };
    return _this;
  }

  _createClass(ReactResumableJs, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var self = this;
      var ResumableField = new _ResumableJS2.default({
        target: self.props.options.service,
        query: {
          upload_token: 'my_token'
        },
        fileType: self.props.options.filetypes,
        fileTypeErrorCallback: function fileTypeErrorCallback(file, errorCount) {
          if (self.props.options.onFileAddedError) {
            self.props.options.onFileAddedError(file, errorCount);
          }
        },
        testMethod: 'post',
        testChunks: false,
        headers: self.props.options.headerObject ? self.props.options.headerObject : {} /* Add your own headers here if needed */
      });

      ResumableField.assignBrowse(document.querySelector('input[type=file]'));

      //Enable or Disable DragAnd Drop
      if (self.props.options.disableDragAndDrop == undefined) {
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
          self.setState({
            messageStatus: self.props.options.completedMessage ? self.props.options.completedMessage + fileObject.file : ' Completed! : ' + fileObject.file
          });
        } else {
          self.setState({
            messageStatus: self.props.options.errorMessage ? self.props.options.errorMessage + fileObject.error : 'Error uploading file : ' + fileObject.error
          });
        }
      });

      ResumableField.on('progress', function () {
        self.setState({
          messageStatus: parseInt(ResumableField.progress() * 100, 10) + '%',
          progressBar: ResumableField.progress() * 100
        });
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
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { id: 'dropTarget' },
        _react2.default.createElement(
          'p',
          null,
          this.props.options.previousText ? this.props.options.previousText : ''
        ),
        _react2.default.createElement(File, {
          id: this.props.options.uploaderID,
          className: 'btn',
          name: 'images',
          value: '',
          label: this.props.options.textLabel ? this.props.options.textLabel : '',
          accept: 'image/*',
          capture: 'camera',
          required: true,
          multiple: true
        }),
        _react2.default.createElement(
          'div',
          { id: 'messageStatus' },
          this.messageStatus
        ),
        _react2.default.createElement('div', { id: 'myProgress' }),
        _react2.default.createElement('div', { id: 'myBar', style: { width: this.state.progressBar + '%' } })
      );
    }
  }]);

  return ReactResumableJs;
}(_react2.default.Component);

exports.default = ReactResumableJs;