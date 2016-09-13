# React Resumable JS
Resumable JS for React JS
version 1.0.5

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
