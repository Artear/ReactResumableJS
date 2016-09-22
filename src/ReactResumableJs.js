/**
 * Resumable JS for React JS
 * @author Gonzalo Rubino gonzalo_rubino@artear.com || gonzalorubino@gmail.com
 * @version 1.1.0
 *
 * Creates an uploader component in React, to use with Resumable JS
 * On file added, the upload will begin.
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

        this.resumable = null;
    }

    componentDidMount = () => {

        let ResumableField = new Resumablejs({
            target: this.props.service,
            query: this.props.query || {},
            fileType: this.props.filetypes,
            fileTypeErrorCallback: (file, errorCount) => {
                if (this.props.onFileAddedError !== undefined) {
                    this.props.onFileAddedError(file, errorCount);
                }
            },
            testMethod: this.props.testMethod || 'post',
            testChunks: this.props.testChunks || false,
            headers: this.props.headerObject || {}
        });

        ResumableField.assignBrowse(document.querySelector('input[type=file]'));

        //Enable or Disable DragAnd Drop
        if (this.props.disableDragAndDrop === undefined) {
            ResumableField.assignDrop(document.getElementById('dropTarget'));
        }

        ResumableField.on('fileAdded', (file, event) => {
            this.setState({
                messageStatus: this.props.fileAddedMessage || ' Starting upload! '
            });

            if (typeof this.props.onFileAdded === "function") {
                this.props.onFileAdded(file, this.resumable);
            } else {
                ResumableField.upload();
            }
        });

        ResumableField.on('fileSuccess', (file, message) => {

            let currentFiles = this.state.fileList.files;
            currentFiles.push(file);
            this.setState({
                fileList: {files: currentFiles},
                messageStatus: this.props.completedMessage + file.fileName || message
            });

            if (typeof this.props.onFileSuccess === "function") {
                this.props.onFileSuccess(file, message);
            }

        });

        ResumableField.on('progress', () => {
            if ((ResumableField.progress() * 100) < 100) {
                this.setState({
                    messageStatus: parseInt(ResumableField.progress() * 100, 10) + '%',
                    progressBar: ResumableField.progress() * 100
                });
            } else {
                setTimeout(() => {
                    this.setState({
                        progressBar: 0
                    })
                }, 1000);
            }

        });

        ResumableField.on('fileError', (file, message) => {
            if (this.props.onUploadErrorCallback) {
                this.props.onUploadErrorCallback(file, errorCount);
            } else {
                console.log('fileError');
                console.log(file);
                console.log(message);
            }
        });

        this.resumable = ResumableField;
    };

    removeFile = (file, index) => {

        let currentFileList = this.state.fileList.files;
        delete currentFileList[index];

        this.setState({
            fileList: {files: currentFileList}
        });

        this.resumable.removeFile(file);
    };

    createFileList = () => {

        let markup = this.state.fileList.files.map((file, index) => {

            let originFile = file.file;
            let fileReader = new FileReader();
            fileReader.readAsDataURL(originFile);
            fileReader.onload = (event) => {
                document.querySelector('#image_' + index).src = event.target.result;
            };

            return <li className="thumbnail" key={index}><img width="80" id={"image_" + index}/><a
                onClick={() => this.removeFile(file, index)} href="#">[X]</a></li>;

        });

        return <ul>{markup}</ul>;
    };

    render() {

        return (
            <div id='dropTarget'>
                <p>{this.props.previousText || ''}</p>

                <input
                    type="file"
                    id={this.props.uploaderID}
                    className='btn'
                    name='image-upload'
                    label={this.props.textLabel || ''}
                    accept={this.props.fileAccept || '*'}
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

ReactResumableJs.propTypes = {
    uploaderID: React.PropTypes.string,
    filetypes: React.PropTypes.array,
    fileAccept: React.PropTypes.string,
    fileAddedMessage: React.PropTypes.string,
    completedMessage: React.PropTypes.string,
    service: React.PropTypes.string,
    textLabel: React.PropTypes.string,
    previousText: React.PropTypes.string,
    disableDragAndDrop: React.PropTypes.bool,
    onFileSuccess: React.PropTypes.func,
    onFileAdded: React.PropTypes.func
};

ReactResumableJs.defaultProps = {
    uploaderID: 'default-resumable-uploader',
    filetypes: [],
    fileAccept: '*'
};