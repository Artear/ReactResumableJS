/**
 * Function to get the shallow output for a given component
 * As we are using phantom.js, we also need to include the fn.proto.bind shim!
 *
 * @see http://simonsmith.io/unit-testing-react-components-without-a-dom/
 * @author somonsmith
 */
import React from 'react';
import TestUtils from 'react-addons-test-utils';

export default function findDOMNode(component) {
    return TestUtils.findDOMNode(component);
}