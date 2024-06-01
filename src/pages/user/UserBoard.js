import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addTicket,  changeTicketPhase,  deleteTicket,  editTicket,  fetchPhases,  fetchSearchedTickets,  fetchSearchedTicketsByUsers,  fetchSearchedUsers,  fetchTickets, updateTickets, updateTicketsHorizontally, updateTicketsVertically,} from "../../redux/actions/ticketActions";
import { showToast } from "../../components/common/toasts/Toast";
import { jwtDecode } from "jwt-decode";
import "./UserBoard.css";
import { FaRegEdit } from "react-icons/fa";
import { IoMdAdd, IoMdTrash, IoMdEye } from "react-icons/io";
import DeleteModal from "../../components/common/modals/delete-modal/DeleteModal";
import CreateTicketModal from "../../components/common/modals/create-ticket-modal/CreateTicketModal";
import ViewTicketModal from "../../components/common/modals/view-ticket-modal/ViewTicketModal";
import EditTicketModal from "../../components/common/modals/edit-ticket-modal/EditTicketModal";
import { fetchAllUsers } from "../../redux/actions/ticketActions";
import Multiselect from "multiselect-react-dropdown";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";


const UserBoard = () => {
  const dispatch = useDispatch();
  const move = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const tickets = useSelector((state) => state.tickets.tickets);
  const phases = useSelector((state) => state.tickets.phases);
  const userslist = useSelector((state) => state.tickets.users);

  const [selectedColumn, setSelectedColumn] = useState()

  // states to contain data for creating a ticket.
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [completed, setCompleted] = useState(0);

  // To search a word
  const [search, setSearch] = useState("");

  // To search tickets based on selected users
  const [users, setUsers] = useState([]);
  // console.log("Users:",users)

  // To set permissions that are given to user
  const [permissions, setPermissions] = useState([]);

  // States that handle the logic to show or hide different modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [temp, setTemp] = useState();
  const [tempTicket, setTempTicket] = useState({});

  // Show And Hide Delete Modal
  const showDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => {
    setTemp(null);
    setIsDeleteModalOpen(false);
  };

  // Code that handles the Deletion Logic
  const handleDelete = (ticketId) => {
    console.log("Ticket about to be deleted.", ticketId);
    setTemp(ticketId);
    showDeleteModal();
  };

  // This function is invoked from inside the DeleteModal.
  const deleteTickets = async () => {
    if (permissions.includes("Delete")) {
      dispatch(deleteTicket(temp, token));
      setTemp(null);
    } else {
      showToast("Not Permitted to Delete.", "info");
    }
    closeDeleteModal();
  };

  // Show And Hide Create Modal
  const showCreateModal = () => {
    setIsCreateModalOpen(true);
  };
  const closeCreateModal = () => {
    setTemp();
    setTitle("");
    setDescription("");
    setUploadedImage(null);
    setIsCreateModalOpen(false);
  };

  // Code that handles the Creation Logic
  const handleCreate = (phaseId) => {
    console.log("Ticket about to be Create.");
    setTemp(phaseId);
    showCreateModal();
  };

  const submitTicket = async () => {
    if (permissions.includes("Write")) {
      const formData = new FormData();
      // Append form data
      formData.append("file", uploadedImage);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("user_id", user.id);
      formData.append("phase_id", temp);

      dispatch(addTicket(formData, token, tickets));

      setTemp();
      setTitle("");
      setDescription("");
      setUploadedImage(null);
      setIsCreateModalOpen(false);
    } else {
      showToast("Not Permitted to Create.", "info");
    }
    closeCreateModal();
  };

  // Show And Hide Edit Modal
  const showEditModal = () => {
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setTempTicket({ ...tempTicket, ...{} });
    setTemp();
    setTitle("");
    setDescription("");
    setUploadedImage(null);
    setCompleted(0)
    setIsEditModalOpen(false);
  };

  // Code that handles the Edit Logic
  const handleEdit = (ticket) => {
    setTemp(ticket.id);
    setCompleted(ticket.completed)
    setTempTicket({ ...tempTicket, ...ticket });
    showEditModal();
  };

  const submitEditTicket = async () => {
    if (permissions.includes("Edit")) {
      const formData = new FormData();
      // Append form data
      formData.append("file", uploadedImage);
      formData.append("title", title);
      formData.append("description", description);
      // formData.append("completed", completed);

      // let ticket = {
      //   file: uploadedImage,
      //   title: title,
      //   description: description,
      //   completed: completed
      // }
      
      dispatch(editTicket(formData, temp, token, tickets));

      setTemp();
      setTitle("");
      setDescription("");
      setUploadedImage(null);
      setIsEditModalOpen(false);
    } 
    else {
      showToast("Not Permitted to Edit.", "info");
    }
    closeEditModal();
  };

  // Show And Hide View Modal
  const showViewModal = () => {
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => {
    setTempTicket({ ...temp, ...{} });
    setIsViewModalOpen(false);
  };

  // Code that handles the view modal Logic
  const handleView = (ticket) => {
    setTempTicket({ ...temp, ...ticket });
    showViewModal();
  };

  const getTickets = async () => {
    dispatch(fetchTickets(token));
  };

  const getUsers = async () => {
    dispatch(fetchAllUsers(token));
  };

  const getSearchedTicketsByUser = async (users) => {
    dispatch(fetchSearchedTicketsByUsers(token, users));
  };
  
  const getSearchedTickets = async () => {
    dispatch(fetchSearchedTickets(token, search));
  };
  
  const getPhases = async () => {
    dispatch(fetchPhases(token));
  };

  const changePhase = async (ticket) => {
    let newPhaseId = 3;
    dispatch(
      changeTicketPhase(ticket.id, token, ticket.phase_id, newPhaseId, tickets)
    );
  };

  useEffect(() => {
    // Decode the token to get user permissions
    const decodedToken = jwtDecode(token);
    const permissions = decodedToken.permissions || [];

    // Store user permissions in state
    setPermissions(permissions);

    const fetchTickets = async () => {
      try {
        if (user && token) {
          await getTickets();
        }
      } catch (error) {
        console.error("Error Fetching Tickets:", error);
      }
    };
    const fetchUsers = async () => {
      try {
        if (user && token) {
          await getUsers();
        }
      } catch (error) {
        console.error("Error Fetching Tickets:", error);
      }
    };
    const fetchSearchedTickets = async () => {
      try {
        if (user && token) {
          await getSearchedTickets();
        }
      } catch (error) {
        console.error("Error Fetching Tickets:", error);
      }
    };
    const fetchPhases = async () => {
      try {
        if (user && token) await getPhases();
      } catch (error) {
        console.error("Error Fetching Phases:", error);
      }
    };
    fetchUsers();
    fetchPhases();

    if (search.length < 0 && users.length < 0) {
      fetchTickets();
      fetchSearchedTickets();
    } else {
      if (search.length >= 0) fetchSearchedTickets();
    }
  }, [search]);

  const handleSearchBarChange = (e) => {
    setUsers([]);
    setSearch(e.target.value);
  };

  if (loading) {
    return <p>Loading...</p>; // Display a loading message or spinner
  }

  const addUserToUsers = (selectedList, selectedItem) => {
    const userIds = selectedList.map((item) => item.id); // Extracting IDs from selected items
    setUsers(userIds);

    const fetchSearchedUsers = async () => {
      try {
        if (user && token) {
          await getSearchedTicketsByUser(userIds);
        }
      } catch (error) {
        console.error("Error Fetching Tickets:", error);
      }
    };

    fetchSearchedUsers();
  };

  const removeUserFromUsers = (selectedList, selectedItem) => {
    const userIds = selectedList.map((item) => item.id); // Extracting IDs from selected items
    setUsers(userIds);

    const fetchSearchedUsers = async () => {
      try {
        if (user && token) await getSearchedTicketsByUser(userIds);
      } catch (error) {
        console.error("Error Fetching Tickets:", error);
      }
    };

    fetchSearchedUsers();
  };
  
  const updateVerticalTickets = async (currentPhaseTickets, phaseId) => {
    dispatch(updateTicketsVertically(currentPhaseTickets, tickets, phaseId, token));
  };
  
  const updateHorizontalTickets = async (oldPhaseTickets, newPhaseTickets, oldPhaseId, newPhaseId, ticketId ) => {
    dispatch(updateTicketsHorizontally(oldPhaseTickets, newPhaseTickets, oldPhaseId, newPhaseId, ticketId, tickets, token));
  };

  const handleDragDrop = (results) => {
    console.log("Hello There", results);
    const { source, destination, draggableId, type } = results;
    if (!destination) return;

    // If source = destination and order is also same.
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Now we can reorder our states in remaining cases.
    if (source.droppableId == destination.droppableId) {
      let phaseId = destination.droppableId;
      let oldTicketOrder = source.index;
      let newTicketOrder = destination.index;

      console.log("phase Id =", phaseId);
      console.log("Ticket Id =", draggableId);
      console.log("Old Ticket Order =", oldTicketOrder);
      console.log("New Ticket Order =", newTicketOrder);

      // Ticket is dropped where it was picked. Hence, no change in position.
      if (oldTicketOrder == newTicketOrder) return;

      // Ticket is either moved up or down in current phase.
      const currentPhaseTickets = tickets.filter(
        (ticket) => ticket.phase_id == phaseId
      );
      // Here update the order of the tickets in array.
      const [removedTicket] = currentPhaseTickets.splice(oldTicketOrder, 1);
      removedTicket.order = parseInt(newTicketOrder)
      currentPhaseTickets.splice(newTicketOrder, 0, removedTicket);

      const updateTicket = async () => {
        try {
          if (user && token) {
            await updateVerticalTickets(currentPhaseTickets, phaseId);
          }
        } catch (error) {
          console.error("Error Fetching Tickets:", error);
        }
      };

      updateTicket();
      return fetchTickets();
    }
    // First case, ticket is moving in same phase.
    else if(source.droppableId !== destination.droppableId ){

      let oldPhaseId = source.droppableId;
      let newPhaseId = destination.droppableId;

      let oldTicketOrder = source.index;
      let newTicketOrder =  destination.index;
      let TicketId = draggableId

      console.log("Old Phase Id =", oldPhaseId)
      console.log("New Phase Id =", newPhaseId)
      console.log("Ticket Id =", TicketId)
      console.log("Old Ticket Order =", oldTicketOrder)
      console.log("New Ticket Order =", newTicketOrder)

      const oldPhaseTickets = tickets.filter((ticket) => (ticket.phase_id == oldPhaseId))
                                     .filter((ticket) => ticket.id != TicketId)
      console.log("Old Phase Tickets",oldPhaseTickets)
      
      const newPhaseTickets = tickets.filter((ticket) => (ticket.phase_id == newPhaseId))
      console.log("New Phase Tickets",newPhaseTickets)

      // Here update the order of the tickets in array.
      const [removedTicket] = tickets.filter((ticket) => ticket.id == TicketId);
      console.log("Removed Ticket before updation",removedTicket)
      removedTicket.phase_id = parseInt(newPhaseId)
      removedTicket.order = parseInt(newTicketOrder)
      console.log("Removed Ticket after updation",removedTicket)
      newPhaseTickets.splice(newTicketOrder, 0, removedTicket);

      console.log("New Phase Ticket:",newPhaseTickets)
      const updateTicket = async () => {
        try {
          if (user && token) {
            await updateHorizontalTickets(oldPhaseTickets, newPhaseTickets, oldPhaseId, newPhaseId, TicketId);
          }
        } catch (error) {
          console.error("Error Fetching Tickets:", error);
        }
      };

      updateTicket()
      return fetchTickets()
    }

    else{
      return;
    }
  };
  return (
    <>
      <div className="phases">
        <section className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search"
              value={search}
              className="search"
              onChange={(e) => handleSearchBarChange(e)}
            />
          </div>

          <div className="user-search">
            <label>Users</label>
            <Multiselect
              options={userslist.filter((user) => !user.is_admin)}
              displayValue="name"
              onSelect={addUserToUsers} // Function will trigger on select event
              onRemove={removeUserFromUsers} // Function will trigger on remove event
            />
          </div>
        </section>
        
        <div className="phase-panel">
        <DragDropContext onDragEnd={handleDragDrop}>
          <Droppable droppableId="ROOT" type="group">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={snapshot.isDraggingOver ? "dragging-over" : ""}
              >
                   <div className="phase-grid">
                    {phases?.map((phase, i) => (
                      <Draggable draggableId={"" + phase.id} key={"" + phase.id} index={i}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          > 
                            <div className="phase-item">
                              <div className="phase-heading">
                                <p className="phase-name">{phase?.name}</p>
                                <div className="add-button">
                                  <IoMdAdd
                                    onClick={() => handleCreate(phase?.id)}
                                    size={18}
                                    color="aliceblue"
                                    className="add-icon"
                                  />
                                </div>
                              </div>
                              <Droppable droppableId={"" + phase.id} key={"" + phase.id}>
                                {(provided) => (
                                  <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {tickets
                                      ?.filter((ticket) => ticket?.phase_id == phase.id)
                                      .sort((a, b) => a.order - b.order)
                                      .map((ticket, ii) => (
                                        <Draggable
                                          draggableId={"" + ticket.id}
                                          index={ii}
                                          key={"" + ticket.id}
                                        >
                                          {(provided) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                            >
                                              <div className="line">
                                                <div className="line1">
                                                  <div className="title">
                                                    {ticket.completed ? (
                                                      <p className="ticket-title crossed-out">
                                                        {ticket?.title.length > 15
                                                          ? `${ticket?.title.substring(
                                                              0,
                                                              20
                                                            )}...`
                                                          : ticket?.title}
                                                      </p>
                                                    ) : (
                                                      <p className="ticket-title">
                                                        {ticket?.title.length > 15
                                                          ? `${ticket?.title.substring(
                                                              0,
                                                              20
                                                            )}...`
                                                          : ticket?.title}
                                                      </p>
                                                    )}
                                                  </div>
                                                </div>

                                                <div className="line2">
                                                  <div className="view-link">
                                                    <IoMdEye
                                                      onClick={() => handleView(ticket)}
                                                      size={15}
                                                      className="view-icon"
                                                    />
                                                  </div>

                                                  {permissions.includes("Edit") ? (
                                                    <div className="edit-link">
                                                      <FaRegEdit
                                                        onClick={() => handleEdit(ticket)}
                                                        size={15}
                                                        className="edit-icon"
                                                      />
                                                    </div>
                                                  ) : (
                                                    <></>
                                                  )}
                                                  {permissions.includes("Delete") ? (
                                                    <div className="delete-link">
                                                      <IoMdTrash
                                                        onClick={() =>
                                                          handleDelete(ticket?.id)
                                                        }
                                                        size={15}
                                                        className="delete-icon"
                                                      />
                                                    </div>
                                                  ) : (
                                                    <></>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </Draggable>
                                      ))}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        cancel={closeDeleteModal}
        deleteTicket={deleteTickets}
      />
      {isViewModalOpen && (
        <ViewTicketModal
          isOpen={isViewModalOpen}
          cancel={closeViewModal}
          ticket={tempTicket}
        />
      )}

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        cancel={closeCreateModal}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        createTicket={submitTicket}
        uploadedImage={uploadedImage}
        setUploadedImage={setUploadedImage}
      />

      {isEditModalOpen && (
        <EditTicketModal
          isOpen={isEditModalOpen}
          cancel={closeEditModal}
          ticket={tempTicket}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
          editTicket={submitEditTicket}
          completed={completed}
          setCompleted={setCompleted}
        />
      )}
    </>
  );
};

export default UserBoard;
