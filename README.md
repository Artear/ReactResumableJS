# React Resumable JS

Creates an uploader component in React, to use with [Resumable JS.](http://www.resumablejs.com/)

[![NPM](https://nodei.co/npm/react-resumable-js.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/react-resumable-js/)

[![CircleCI](https://circleci.com/gh/Artear/ReactResumableJS.svg)](https://circleci.com/gh/Artear/ReactResumableJS) [![CircleCI](https://circleci.com/gh/Artear/ReactResumableJS.svg?style=shield)](https://circleci.com/gh/Artear/ReactResumableJS)

On file added, the upload will begin.

### Changelog:
[Changelog](changelog.md)

### Install
`npm i react-resumable-js`

### Options
- uploaderID The uploader ID. Ex: "image-upload"
- dropTargetID The dropTarget ID. Ex: "myDropTarget"
- fileAccept content type file accept on input file Ex: 'image/*'
- filetypes The allowed files extensions to upload. Ex: "['jpg', 'png']"
- maxFileSize The allowed file size for upload. Is expressed in bytes. Default is: 10240000 (10mb).
- onMaxFileSizeErrorCallback Usefull to use with the above param, and take the exception for use as you want.
- fileAddedMessage The message to print when file is added. Optional. Ex: 'Starting....'
- completedMessage The message to print when file is completely uploaded. Optional. Ex: 'Completed!'
- service The service that will receive the file. Ex: 'http://www.someurl.com/myservice/image.json'
- textLabel The label of the upload. Ex: 'What photo do you want to add?'
- previousText A Text that will be displayed before the component. Optional.
- disableDragAndDrop True to disable Drag and Drop. Enable by default.
- showFileList Show or hide the filelist of uploaded files. accept boolean value
- onUploadErrorCallback Function to call on Upload error. @returns file and message
- onFileAddedError Function to call on File Added error. @returns file and errorCount
- onFileRemoved Function to call on File Removed. @return file object
- headerObject Optional, if you need to add a headers object.
- onFileSuccess Method to call when file is upload. Usually a method to set the filename that was uploaded by the component.
- disableInput Boolean to disable or enable input file. Send true to disable, false otherwise.

### Folders
- build: last deploy build
- example: webpack dev server to run the demo
    - server: nodejs server to upload the files
- src: source code

### Example 

```javascript
export default class ExampleForm extends React.Component {
  
  constructor(props) {
    super(props);
  }

  render() {
  
      return (
        <fieldset>
          <p>You can add other inputs, selects or stuff right here to complete a form.</p>
          <ReactResumableJs
            uploaderID="image-upload"
            dropTargetID="myDropTarget"
            filetypes={["jpg", "png"]}
            fileAccept="image/*"
            fileAddedMessage="Started!"
            completedMessage="Complete!"
            service="http://localhost:3000/upload"
            textLabel="Uploaded files"
            previousText="Drop to upload your media:"
            disableDragAndDrop={true}
            onFileSuccess={(file, message) => {
              console.log(file, message);
            }}
            onFileAdded={(file, resumable) => {
              resumable.upload();
            }}
          />
        </fieldset>
      );
    }
});
```

### Demo
`npm run demo`