# React Resumable JS

Creates an uploader component in React, to use with Resumable JS
On file added, the upload will begin.

Options:
- options.uploaderID The uploader ID. Ex: "image-upload"
- options.filetypes The allowed files extensions to upload. Ex: "['jpg', 'png']"
- options.fileAddedMessage The message to print when file is added. Optional. Ex: 'Starting....'
- options.completedMessage The message to print when file is completely uploaded. Optional. Ex: 'Completed!'
- options.service The service that will receive the file. Ex: 'http://www.someurl.com/myservice/image.json'
- options.textLabel The label of the upload. Ex: 'What photo do you want to add?'
- options.previousText A Text that will be displayed before the component. Optional.
- options.disableDragAndDrop True to disable Drag and Drop. Enable by default.
- options.onUploadErrorCallback Function to call on Upload error. @returns file and message
- options.onFileAddedError Function to call on File Added error. @returns file and errorCount
- options.headerObject Optional, if you need to add a headers object.
- options.onFileSuccess Method to call when file is upload. Usually a method to set the filename that was uploaded by the component.

**Folders**
- build: last deploy build
- example: webpack dev server to run the demo
    - server: nodejs server to upload the files
- src: source code

**Example:**

First you must install pm2 as global, so run:

`sudo npm install -g pm2`

To startup the example just run:

`npm start`

To stop the example run:

`npm stop`