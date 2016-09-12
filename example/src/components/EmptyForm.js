/**
 * Empty Form ReactJS Component
 * @author Gonzalo Rubino gonzalo_rubino@artear.com
 * @version 1.0
 */
/* Based on: https://github.com/twisty/formsy-react-components/blob/gh-pages/playground/src/app.js */
'use strict';

import React from 'react';
import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';

const EmptyForm = React.createClass({
  mixins: [FRC.ParentContextMixin],

  propTypes: {
      children: React.PropTypes.node
  },

  render() {
      return (
          <Formsy.Form className={this.props.className} ref="empty_form" onSubmit={this.props.onSubmit}>
              {this.props.children}
          </Formsy.Form>
      );
  }
});


export default class TnFormReactComponent extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
        getclass: 'tnylg-publish form-vertical'
    };
	}

	changeOption = (name, value) => {
	    var newState = {};
	    newState[name] = value;
	    this.setState(newState);
	}

  render(){
    return (
    	<EmptyForm onSubmit={this.props.submitAction} ref="empty_form" className={this.state.getclass} >
        {this.props.insideForm}
        <input className="btn btn-primary" type="submit" defaultValue={this.props.submitValue} />
	  </EmptyForm>
    );
  }
}