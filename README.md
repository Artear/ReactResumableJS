# React Resumable JS
Creates an uploader component in React, to use with [Resumable JS.](http://www.resumablejs.com/)

[![NPM](https://nodei.co/npm/react-resumable-js.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/react-resumable-js/)

[![CircleCI](https://circleci.com/gh/Artear/ReactResumableJS.svg)](https://circleci.com/gh/Artear/ReactResumableJS) [![CircleCI](https://circleci.com/gh/Artear/ReactResumableJS.svg?style=shield)](https://circleci.com/gh/Artear/ReactResumableJS)

On file added, the upload will begin.

### Changelog:
- 1.1.2
    - changed unique identifier
    - changed option onFileSuccess, now return file uploaded and server message
- 1.1.0
    - Removed property options
    - Now all options are properties ( see the example )
    - Refactor: functions to arrow functions
    
**Install:**

`npm i react-resumable-js`

**Options:**
- uploaderID The uploader ID. Ex: "image-upload"
- fileAccept content type file accept on input file Ex: 'image/*'
- filetypes The allowed files extensions to upload. Ex: "['jpg', 'png']"
- fileAddedMessage The message to print when file is added. Optional. Ex: 'Starting....'
- completedMessage The message to print when file is completely uploaded. Optional. Ex: 'Completed!'
- service The service that will receive the file. Ex: 'http://www.someurl.com/myservice/image.json'
- textLabel The label of the upload. Ex: 'What photo do you want to add?'
- previousText A Text that will be displayed before the component. Optional.
- disableDragAndDrop True to disable Drag and Drop. Enable by default.
- onUploadErrorCallback Function to call on Upload error. @returns file and message
- onFileAddedError Function to call on File Added error. @returns file and errorCount
- headerObject Optional, if you need to add a headers object.
- onFileSuccess Method to call when file is upload. Usually a method to set the filename that was uploaded by the component.

**Folders**
- build: last deploy build
- example: webpack dev server to run the demo
    - server: nodejs server to upload the files
- src: source code

**Example Code**

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
      );
    }
});
```

**Running Example:**

If are you cloning the repo, you must run on root folder:

`npm install`

To startup the example just run into ./example folder:

`npm start`

To stop the example run:

`npm stop`
