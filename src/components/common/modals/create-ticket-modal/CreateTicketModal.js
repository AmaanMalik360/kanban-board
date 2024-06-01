import { Modal } from 'antd'
import React, { useCallback } from 'react'
import "./CreateTicketModal.css"
import { FiDownload } from "react-icons/fi";
import { useDropzone } from 'react-dropzone';

const CreateTicketModal = ({isOpen, cancel, title, setTitle, description, setDescription, createTicket, uploadedImage, setUploadedImage}) => {

    const handleTitleChange = (e) =>{
        setTitle(e.target.value)
    }
    
    const handleDescriptionChange = (e) =>{
        setDescription(e.target.value)
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
        <Modal title="Create A New Ticket" open={isOpen} onOk={createTicket} onCancel={cancel} >
            <div className='create-modal-section'>
                <input
                    placeholder='Enter Title'
                    type='text'
                    value={title}
                    onChange={(e)=>handleTitleChange(e)}
                    required
                    className='input'
                />
                <textarea
                    placeholder='Enter Description'
                    type='text'
                    value={description}
                    onChange={(e)=>handleDescriptionChange(e)}
                    required
                    className='input'                    
                />
                <div className="upload-movie-img" {...getRootProps()}>
                    {uploadedImage ? (
                        <img
                        src={URL.createObjectURL(uploadedImage)}
                        alt="Uploaded Preview"
                        />
                    ) : (
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
            </div>
        </Modal>
  )
}

export default CreateTicketModal
