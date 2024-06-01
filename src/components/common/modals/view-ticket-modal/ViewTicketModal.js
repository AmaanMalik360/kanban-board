import { Modal } from 'antd'
import React from 'react'
import "./ViewTicketModal.css"
import { FiDownload } from "react-icons/fi";
import { BASE_URL } from '../../../../backendlink';

const ViewTicketModal = ({isOpen, cancel, ticket}) => {

    console.log("Title",ticket?.title)
    console.log("Description",ticket?.description)
    console.log("image",ticket?.image)
    return (
        <Modal title={ticket.id} open={isOpen} onOk={cancel} onCancel={cancel}                          className='view-modal-section'>

                <div className='view-title'>
                    <h2>Title:</h2>
                    <p>{ticket?.title}</p>
                </div>
                
                <div className='view-description'>
                    <h2>Description:</h2>
                    <p>{ticket?.description}</p>
                </div>
                
                <div className="upload-movie-img" >
                    {ticket?.image ? (
                        <img
                        src= {`${BASE_URL}/${ticket?.image}`}
                        alt="Uploaded Preview"
                        />
                    ) : (
                        <div className='drop-area'>
                            <div className='drop-icon'>
                                <FiDownload />
                            </div>
                        </div>
                    )}
                </div>
        </Modal>
  )
}

export default ViewTicketModal
