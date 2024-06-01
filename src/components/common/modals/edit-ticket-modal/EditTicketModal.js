import { Modal } from 'antd'
import React, { useCallback } from 'react'
import "./EditTicketModal.css"
import { FiDownload } from "react-icons/fi";
import { useDropzone } from 'react-dropzone';
import { BASE_URL } from '../../../../backendlink';

const EditTicketModal = ({isOpen, cancel, ticket, title, setTitle, description, setDescription, editTicket, uploadedImage, setUploadedImage, completed, setCompleted}) => {

    const handleTitleChange = (e) =>{
        setTitle(e.target.value)
    }
    
    const handleDescriptionChange = (e) =>{
        setDescription(e.target.value)
    }
    
    const handleCompletedChange = (e) =>{
        console.log(e.target.value)
        setCompleted(e.target.value)
    }
    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setUploadedImage(file);
    }, []);
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: "image/*",
    });

    return (
        <Modal title="Edit The Ticket" open={isOpen} onOk={editTicket} onCancel={cancel} >
            <div className='edit-modal-section'>
            
                <input
                    placeholder={ticket?.title}
                    type='text'
                    value={title}
                    onChange={(e)=>handleTitleChange(e)}
                    required
                    className='input'
                />
                
                <textarea
                    placeholder = {ticket?.description}
                    type='text'
                    value={description}
                    onChange={(e)=>handleDescriptionChange(e)}
                    required
                    className='input'                    
                />

                <div className="upload-movie-img" {...getRootProps()}>
                    {(uploadedImage || ticket?.image) ? (
                        <img
                        src={uploadedImage ? URL.createObjectURL(uploadedImage) : `${BASE_URL}/${ticket.image}`}
                        alt="Uploaded Preview"
                        />
                    ): (
                        <div className='drop-area'>
                            <div className='drop-icon'>
                                <FiDownload />
                            </div>
                            <div>
                                <p>Click to upload</p>
                            </div>
                        </div>
                    )}
                    <input {...getInputProps()} />
                </div>
                {/* <div className='checkbox'> 
                    <label>Completed</label>
                    <input
                        type='checkbox'
                        value={completed}
                        onChange={(e)=>handleCompletedChange(e)}
                        // className='input'
                    />
                </div> */}

            </div>
        </Modal>
  )
}

export default EditTicketModal
