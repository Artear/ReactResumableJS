import React from 'react';
import FRC from 'formsy-react-components';
import EmptyForm from 'emptyform';
import ReactResumableJs from '../../../src/ReactResumableJs';

const ContentInside = React.createClass({
  mixins: [FRC.ParentContextMixin],
  inputDisable: false,

  propTypes: {
    children: React.PropTypes.node
  },

  render() {

    return (
      <fieldset>
        <p>You can add other inputs, selects or stuff right here to complete a form.</p>
        <ReactResumableJs
          uploaderID="image-upload"
          dropTargetID="myDropTarget"
          filetypes={["jpg", "JPG", "png", "PNG", "mp4", "MP4", "mkv"]}
          maxFileSize={512000000}
          fileAccept="*/*"
          fileAddedMessage="Started!"
          completedMessage="Complete!"
          service="http://localhost:3000/upload"

          disableDragAndDrop={true}
          onFileSuccess={(file, message) => {
            this.props.setFiles(file, message);
            this.inputDisable = false;
          }}
          onFileAdded={(file, resumable) => {
            this.inputDisable = true;
            //resumable.upload();
          }}
          onFileRemoved={(file) => {
            this.inputDisable = false;
            this.forceUpdate();
            console.log('file removed', file);
          }}
          onMaxFileSizeErrorCallback={(file, errorCount) => {
            console.log('Error! Max file size reached: ', file);
            console.log('errorCount: ', errorCount);
          }}
          fileNameServer="file"
          tmpDir="http://localhost:3000/tmp/"
          maxFiles={1}
          onFileAddedError={(file, errorCount) => {
            console.log('error file added', file, errorCount);
          }}
          maxFilesErrorCallback={(file, errorCount) => {
            console.log('maxFiles', file, errorCount);
          }}
          disableInput={this.inputDisable}
          startButton={true}
          pauseButton={false}
          cancelButton={false}
          onStartUpload={() => {

          }}
          onCancelUpload={() => {
            this.inputDisable = false;
          }}
          onPauseUpload={() =>{
            this.inputDisable = false;
          }}
          onResumeUpload={() => {
            this.inputDisable = true;
          }}

        />
      </fieldset>
    );
  }
});

export default class ExampleForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      files: []
    };
  }

  setFiles = (file, message) => {

    console.log('Message: ', message);

    let files = this.state.files.slice();
    files.push(file);

    this.setState({
      files: files
    });
  };

  submit = () => {
    console.log('Files: ', this.state.files);
  };

  render() {
    return (
      <EmptyForm
        insideForm={<ContentInside setFiles={this.setFiles}/>}
        submitValue="Publish"
        submitAction={this.submit}
      />
    );
  }
};
