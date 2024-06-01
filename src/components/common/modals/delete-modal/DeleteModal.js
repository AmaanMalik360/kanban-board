import { Modal } from 'antd'
import React from 'react'

const DeleteModal = ({isOpen, cancel, deleteTicket}) => {

  return (
    <div>
      <Modal title="Are you sure you want to delete?" open={isOpen} onOk={deleteTicket} onCancel={cancel}>
      </Modal>
    </div>
  )
}

export default DeleteModal
