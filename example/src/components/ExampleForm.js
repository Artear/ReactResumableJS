/*

@author Gonzalo Rubino on Thursday, September 8th, 2016, 10:54:00 AM
@version 1.0
@Description TN y La Gente Publish Form

*/

import React from 'react';
import FRC from 'formsy-react-components';
import EmptyForm from 'emptyform';
import ReactResumableJs from './ReactResumableJs'

const { Input, Textarea } = FRC;

const ContentInside = React.createClass({
  mixins: [FRC.ParentContextMixin],

  propTypes: {
      children: React.PropTypes.node
  },

  render() {
      let optionsObject = {
        'uploaderID': 'image-upload',
        'filetypes': '["jpg", "png"]',
        'fileAddedMessage': 'INICIANDO',
        'completedMessage': 'COMPLETADO! : ',
        'service': 'http://local.next.tn.com.ar:8080/3.0/uploader/image.json',
        'textLabel': '¿Pudiste tomar fotos o filmar un video?',
        'previousText': 'Arrastrá a esta ventana tus fotos y videos:',
        'disableDragAndDrop': true,
        'headerObject': {
            "UIDSignature": "123=",
            "signatureTimestamp": "456",
            "UID" : 123456789
        }
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

    };
  }

  submit(data) {
    console.log('Data of the Form: ', data)
  }

  render() {
    return (
      <EmptyForm insideForm={<ContentInside />} submitValue="Publish" submitAction={this.submit}/>
    );
  }

};
