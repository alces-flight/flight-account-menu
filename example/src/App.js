import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { AccountMenu } from 'flight-account-menu';
import 'flight-account-menu/dist/index.css';

function SignInModal({
  hideLoginForm,
  isOpen,
}) {
  return (
    <Modal
      isOpen={isOpen}
      toggle={hideLoginForm}
    >
      <ModalHeader toggle={hideLoginForm}>My title</ModalHeader>
      <ModalBody>Fake Signin Modal</ModalBody>
      <ModalFooter>
        <Button
          color="link"
          onClick={hideLoginForm}
        >
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

const App = () => {
  return (
    <AccountMenu 
      signedInLinks={[
        {
          href: "https://center.alces-flight.com",
          text: "Flight Center",
        }
      ]}
      privacyPolicyUrl="https://next.alces-flight.com/privacy"
      termsUrl="https://next.alces-flight.com/terms"
      components={{
        // SignInModal: SignInModal,
      }}
    />
  );
}

export default App
