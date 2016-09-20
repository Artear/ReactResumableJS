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
 @param {String} options.fileAccept content type file accept on input file Ex: 'image/*'
 @param {Array} options.filetypes The allowed files extensions to upload. Ex: "['jpg', 'png']"
 @param {String} options.fileAddedMessage The message to print when file is added. Optional. Ex: 'Starting....'
 @param {String} options.completedMessage The message to print when file is completely uploaded. Optional. Ex: 'Completed!'
 @param {String} options.service The service that will receive the file. Ex: 'http://www.someurl.com/myservice/image.json'
 @param {String} options.textLabel The label of the upload. Ex: 'What photo do you want to add?'
 @param {String} options.previousText A Text that will be displayed before the component. Optional.
 @param {Boolean} options.disableDragAndDrop True to disable Drag and Drop. Enable by default.
 @param {Object} options.headerObject Optional, if you need to add a headers object.
 @param {Function} options.onUploadErrorCallback Function to call on Upload error. @returns file and message
 @param {Function} options.onFileAddedError Function to call on File Added error. @returns file and errorCount
 @param {Function} options.onFileSuccess Method to call when file is upload. Usually a method to set the filename that was uploaded by the component;
 @param {Function} options.onFileAdded Method to call when file is added.
 */

'use strict';
import React from "react";
import Resumablejs from "resumablejs";

export default class ReactResumableJs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            progressBar: 0,
            messageStatus: '',
            fileList: {files: []}
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.removeFile = this.removeFile.bind(this);
        this.createFileList = this.createFileList.bind(this);
        this.resumable = null;
    }

    componentDidMount() {
        let self = this;
        var ResumableField = new Resumablejs({
            target: self.props.options.service,
            query: {},
            fileType: self.props.options.filetypes,
            fileTypeErrorCallback: function (file, errorCount) {
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


            if(typeof self.props.options.onFileAdded === "function"){
                self.props.options.onFileAdded(self.resumable);
            } else {
                ResumableField.upload();
            }

        });

        ResumableField.on('fileSuccess', function (file, message) {

            var fileObject = JSON.parse(message);
            if (fileObject.file != undefined) {

                let currentFiles = self.state.fileList.files;

                //rename the fileName with the new file from server
                file.fileName = fileObject.file;

                currentFiles.push(file);

                self.setState({
                    fileList: {files: currentFiles},
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
            if ((ResumableField.progress() * 100) < 100) {
                self.setState({
                    messageStatus: parseInt(ResumableField.progress() * 100, 10) + '%',
                    progressBar: ResumableField.progress() * 100
                });
            } else {
                setTimeout(function () {
                    self.setState({
                        progressBar: 0
                    })
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

    removeFile(file, index) {

        let currentFileList = this.state.fileList.files;
        delete currentFileList[index];

        this.setState({
            fileList: {files: currentFileList}
        });

        this.resumable.removeFile(file);
    };

    createFileList() {

        let self = this;
        var markup = this.state.fileList.files.map(function (file, index) {

            var filez = file.file;
            var fileReader = new FileReader();
            fileReader.readAsDataURL(filez);
            fileReader.onload = function (event) {
                document.querySelector('#image_' + index).src =event.target.result;
            };

            return <li key={index}><img width="80" id={"image_" + index} /><a onClick={() => self.removeFile(file, index)} href="#">[X]</a></li>;

        });

        return <ul>{markup}</ul>;
    };

    render() {

        return (
            <div id='dropTarget'>
                <p>{this.props.options.previousText ? this.props.options.previousText : ''}</p>

                <input
                    type="file"
                    id={this.props.options.uploaderID}
                    className='btn'
                    name='image-upload'
                    label={this.props.options.textLabel ? this.props.options.textLabel : ''}
                    accept={this.props.options.fileAccept || '*'}
                    capture="camera"
                    multiple
                />
                <div id='messageStatus'>{this.messageStatus}</div>
                <div id='myProgress' style={{display: this.state.progressBar == 0 ? "none" : "block"}}>
                    <div id='myBar' style={{width: this.state.progressBar + '%'}}></div>
                </div>

                <div id="fileList">{this.createFileList()}</div>
            </div>
        );
    }
}