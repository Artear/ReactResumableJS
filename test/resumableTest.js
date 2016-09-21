import "babel-polyfill";
import createComponent from "./helpers/shallowRenderHelper";
import ReactResumableJs from "../src/ReactResumableJs";
import {expect} from "chai";
import "jsdom-global/register";
import React from "react";

describe('React ResumableJs Component', function () {


    let component;

    let optionsObject = {
        'uploaderID': 'image-upload',
        'filetypes': ["jpg", "png"],
        'fileAddedMessage': 'Started!',
        'completedMessage': 'Complete! : ',
        'service': 'http://localhost:3000/upload',
        'textLabel': 'Uploaded files',
        'previousText': 'Drop to upload your media:',
        'disableDragAndDrop': true,
        'onFileSuccess': function (files) {
            console.log('Object Resumable Files', files)
        },
        'headerObject': {}
    };

    beforeEach(() => {
        component = createComponent(ReactResumableJs, {optionsObject});
    });

    it('should have component id as dropTarget', () => {
        expect(component.props.id).to.equal('dropTarget');
    });

});