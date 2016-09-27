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
                if (typeof  this.props.onFileAddedError === "function") {
                    this.props.onFileAddedError(file, errorCount);
                }
            },
            testMethod: this.props.testMethod || 'post',
            testChunks: this.props.testChunks || false,
            headers: this.props.headerObject || {}
        });

        ResumableField.assignBrowse(document.querySelector('#' + this.props.uploaderID));

        //Enable or Disable DragAnd Drop
        if (this.props.disableDragAndDrop === true) {
            ResumableField.assignDrop(document.querySelector('#' + this.props.dropTargetID));
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
            this.props.onUploadErrorCallback(file, errorCount);
        });

        this.resumable = ResumableField;
    };

    removeFile = (file, index) => {

        let currentFileList = this.state.fileList.files;
        delete currentFileList[index];

        this.setState({
            fileList: {files: currentFileList}
        });

        this.props.onFileRemoved(file);
        this.resumable.removeFile(file);
    };

    createFileList = () => {

        let markup = this.state.fileList.files.map((file, index) => {


            let uniqID = this.props.uploaderID + index;
            let originFile = file.file;
            let fileReader = new FileReader();
            fileReader.readAsDataURL(originFile);
            fileReader.onload = (event) => {

                let media = '';
                if (file.file.type.indexOf('video') > -1) {
                    media = '<label class="video">' + originFile.name + '</label>';
                }
                else if (file.file.type.indexOf('image') > -1) {
                    media = '<img class="image" width="80" src="' + event.target.result + '">';
                } else {
                    media = '<label class="document">' + originFile.name + '</label>';
                }

                document.querySelector('#media_' + uniqID).innerHTML = media;
            };

            return <li className="thumbnail" key={uniqID}>
                       <label id={"media_" + uniqID}/>
                       <a onClick={() => this.removeFile(file, index)} href="#">[X]</a>
                   </li>;

        });

        return <ul id={"filelist-" + this.props.uploaderID}>{markup}</ul>;
    };

    render() {

        let fileList = "";
        if(this.props.showFileList) {
            fileList = <div className="resumable-list" >{this.createFileList()}</div>;
        }

        return (
            <div id={this.props.dropTargetID}>
                <p>{this.props.previousText || ''}</p>

                <label class='btn file-upload'>{this.props.textLabel || 'Browse'}
                <input
                    type="file"
                    id={this.props.uploaderID}
                    className='btn'
                    name={this.props.uploaderID + '-upload'}
                    accept={this.props.fileAccept || '*'}
                    capture="camera"
                    multiple
                />
                </label>

                <div className="progress" style={{display: this.state.progressBar == 0 ? "none" : "block"}}>
                    <div className="progress-bar" style={{width: this.state.progressBar + '%'}}></div>
                </div>

                {fileList}
            </div>
        );
    }
}

ReactResumableJs.propTypes = {
    uploaderID: React.PropTypes.string,
    dropTargetID: React.PropTypes.string,
    filetypes: React.PropTypes.array,
    fileAccept: React.PropTypes.string,
    fileAddedMessage: React.PropTypes.string,
    completedMessage: React.PropTypes.string,
    service: React.PropTypes.string,
    textLabel: React.PropTypes.string,
    previousText: React.PropTypes.string,
    disableDragAndDrop: React.PropTypes.bool,
    showFileList: React.PropTypes.bool,
    onFileSuccess: React.PropTypes.func,
    onFileAdded: React.PropTypes.func,
    onFileRemoved: React.PropTypes.func,
    onUploadErrorCallback: React.PropTypes.func
};

ReactResumableJs.defaultProps = {
    uploaderID: 'default-resumable-uploader',
    dropTargetID: 'dropTarget',
    filetypes: [],
    fileAccept: '*',
    showFileList: true,
    onUploadErrorCallback: (file, errorCount) => {
        console.log('error', file, errorCount);
    },
    onFileRemoved: function (file) {
      return file;
    },
    disableDragAndDrop: false
};