/*

@author Gonzalo Rubino on Thursday, September 8th, 2016, 10:54:00 AM
@version 1.0
@Description TN y La Gente Publish Form

*/

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

      let self = this;

      let optionsObject = {
        'uploaderID': 'image-upload',
        'filetypes': ["jpg", "png"],
        'fileAddedMessage': 'INICIANDO',
        'completedMessage': 'COMPLETADO! : ',
        'service': 'http://localhost:3000/upload',
        'textLabel': '¿Pudiste tomar fotos o filmar un video?',
        'previousText': 'Arrastrá a esta ventana tus fotos y videos:',
        'disableDragAndDrop': true,
        'onFileSuccess': function (files) {
          self.props.setFiles(files);
        },
        'headerObject': {}
      };

      return (
          <fieldset>
            <p>You can add other inputs, selects or stuff right here to complete a form.</p>
            <ReactResumableJs options={optionsObject} />
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

    this.submit = this.submit.bind(this);
    this.setFiles = this.setFiles.bind(this);
  }

  setFiles(files) {
    this.setState({
      files: files
    });
  }

  submit(data) {



    console.log('my files', this.state.files);
    console.log('Data of the Form: ', data);
  }

  render() {
    return (
      <EmptyForm insideForm={<ContentInside setFiles={this.setFiles} />} submitValue="Publish" submitAction={this.submit}/>
    );
  }

};
