import React from 'react';
import FRC from 'formsy-react-components';
import EmptyForm from 'emptyform';
import ReactResumableJs from '../../../src/ReactResumableJs';

const ContentInside = React.createClass({
  mixins: [FRC.ParentContextMixin],

  propTypes: {
    children: React.PropTypes.node
  },

  render() {

    return (
      <fieldset>
        <p>You can add other inputs, selects or stuff right here to complete a form.</p>
        <ReactResumableJs
          uploaderID="image-upload"
          filetypes={["jpg", "png"]}
          fileAccept="image/*"
          fileAddedMessage="Started!"
          completedMessage="Complete!"
          service="http://localhost:3000/upload"
          textLabel="Uploaded files"
          previousText="Drop to upload your media:"
          disableDragAndDrop={true}
          onFileSuccess={(files) => {
            this.props.setFiles(files);
          }}
          onFileAdded={(file, resumable) => {
            resumable.upload();
          }}
      />
  </fieldset>
  )
    ;
  }
});

export default class ExampleForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      files: []
    };
  }

  setFiles = (files) => {
    this.setState({
      files: files
    });
  };

  submit = (data) => {
    console.log('my files', this.state.files);
    console.log('Data of the Form: ', data);
  };

  render() {
    return (
      <EmptyForm insideForm={<ContentInside setFiles={this.setFiles}/>} submitValue="Publish"
                 submitAction={this.submit}/>
    );
  }

};
