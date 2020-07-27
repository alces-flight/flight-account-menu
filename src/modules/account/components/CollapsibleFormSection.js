import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { Collapse } from 'reactstrap';
import { Label } from 'reactstrap';
import { withProps } from 'recompose';
import { Field } from 'redux-form';

const Section = ({ children, isOpen, toggle, }) => {
  const iconName = isOpen ? 'chevron-up' : 'chevron-down';

  return (
    <div>
      <Label onClick={() => toggle(isOpen)}>
        Change your password <FontAwesome name={iconName} />
      </Label>
      <Collapse isOpen={isOpen}>
        {children}
      </Collapse>
    </div>
  );
};

Section.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

const enhance = withProps(props => ({
  isOpen: props.input.value,
  toggle: (isOpen) => {
    props.input.onChange(!isOpen);
  }
}));

const EnhancedSection = enhance(Section);

const CollapsibleFormSection = ({ children, name }) => (
  <Field
    children={children}
    component={EnhancedSection}
    name={name}
  />
);

CollapsibleFormSection.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
};

export default CollapsibleFormSection;
