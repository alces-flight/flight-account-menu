import React from 'react';
import { Collapse, Label } from 'reactstrap';
import { withProps } from 'recompose';
import classNames from 'classnames';

const Section = ({ children, isOpen, toggle, }) => {
  const icon = (
    <i classNames={
      classNames('fa', { 'chevron-up': isOpen, 'chevron-down': !isOpen })
    }></i>
  );

  return (
    <div>
      <Label onClick={() => toggle(isOpen)}>
        Change your password {icon}
      </Label>
      <Collapse isOpen={isOpen}>
        {children}
      </Collapse>
    </div>
  );
};

const enhance = withProps(props => ({
  isOpen: props.input.value,
  toggle: (isOpen) => {
    props.input.onChange(!isOpen);
  }
}));

const EnhancedSection = enhance(Section);

export default EnhancedSection;
