import React from 'react';
import { Modal, Button } from 'react-bootstrap'

function DialogWrap({ className, show, content}) {
  return (
    <Modal className={className} show={show} children={content} />
  );
}

const ModalDialog = ({ title, body, footer }) => {
  return (
    <div>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{body}</h4>
      </Modal.Body>
      <Modal.Footer>
        {footer}
      </Modal.Footer>
    </div>
  )
}

const AcceptButton = ({ onClick }) => (
  <Button onClick={onClick}>Accept</Button>
)

const CancelButton = ({ onClick }) => (
  <Button onClick={onClick}>Cancel</Button>
)

export const DialogResignRequest = ({ className, show, response }) => {
  return (
    <DialogWrap
      className={className}
      show={show}
      content={
        <ModalDialog
          title={'Resign'}
          body={'Are you sure you want to resign from game?'}
          footer={
            [
              <AcceptButton key={1} onClick={response.bind(null, true)} />,
              <CancelButton key={2} onClick={response.bind(null, false)} />
            ]
          }
        />
      }
    />
  );
}

export const DialogRequestReceiver = ({ className, show, response }) => {
  return (
    <DialogWrap
      className={className}
      show={show}
      content={
        <ModalDialog
          title={'Rematch'}
          body={'Opponent request rematch. Agree?'}
          footer={
            [
              <AcceptButton key={1} onClick={response.bind(null, true)} />,
              <CancelButton key={2} onClick={response.bind(null, false)} />
            ]
          }
          response={response}
        />
      }
    />
  );
}

export const DialogRequestSender = ({ className, show, onRematchCancel }) => {
  return (
    <DialogWrap
      className={className}
      show={show}
      content={
        <ModalDialog
          title={'Rematch'}
          body={'Waiting for opponent response..'}
          footer={
            <CancelButton onClick={onRematchCancel.bind(null, false)} />
          }
        />
      }
    />
  );
}