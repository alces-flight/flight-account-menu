import React from 'react';
import classNames from 'classnames';
import { Collapse, Label } from 'reactstrap';
import { compose } from 'recompose';
import { withProps } from 'recompose';

const Section = ({ children, isOpen, toggle, }) => {
  const icon = (
    <i className={
      classNames('fa', { 'fa-chevron-up': isOpen, 'fa-chevron-down': !isOpen })
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

const enhance = compose(
  withProps(props => ({
    isOpen: props.isOpen,
    toggle: (isOpen) => {
      props.toggle(!isOpen);
    }
  })),
);

const EnhancedSection = enhance(Section);

export default EnhancedSection;
