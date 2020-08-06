import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import auth from '../modules/auth';

function StandardModal({
  buttons,
  children,
  closeButtonText='Close',
  isOpen,
  size,
  title,
  toggle,
  ...rest
}) {
  return (
    <Modal
      isOpen={isOpen}
      size={size}
      toggle={toggle}
      {...rest}
    >
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        {buttons}
        <Button
          color="link"
          onClick={toggle}
        >
          {closeButtonText}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default StandardModal;
