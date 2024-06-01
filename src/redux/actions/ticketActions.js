import axios from "axios";
import { BASE_URL } from "../../backendlink";
import { showToast } from "../../components/common/toasts/Toast";

export const fetchTickets = (token) =>{    
    return async (dispatch) => {
      try {
        dispatch({ type: "TICKETS_REQUEST" });

        const response = await axios.get(`${BASE_URL}/tickets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("All tickets",response.data.tickets);

        if (response.status === 200) {
          const { tickets } = response.data;
          dispatch({ type: "TICKETS_SUCCESS", payload: tickets });
        } 
        else {
          dispatch({
            type: "TICKETS_FAILURE",
            payload: { error: response.data.message },
          });
        }
      } 
      catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
}

export const fetchAllUsers = (token) =>{    
  return async (dispatch) => {
    try {
      dispatch({ type: "GET_USERS_REQUEST" });

      const response = await axios.get(`${BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const { users } = response.data;
        dispatch({ type: "GET_USERS_SUCCESS", payload: users });
      } 
      else 
      {
        dispatch({
          type: "GET_USERS_FAILURE", payload: { error: response.data.message }
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
}

export const fetchSearchedTickets = (token, word) =>{    
    return async (dispatch) => {
      try {
        dispatch({ type: "TICKETS_REQUEST" });

        const response = await axios.get(`${BASE_URL}/tickets/${word}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log("Gotten Searched Tickets",response.data.tickets);

        if (response.status == 200) {
          const { tickets } = response.data;
          dispatch({ type: "TICKETS_SUCCESS", payload: tickets });
        } 
        else {
          dispatch({
            type: "TICKETS_FAILURE",
            payload: { error: response.data.message },
          });
        }
      } 
      catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
}

export const fetchSearchedTicketsByUsers = (token, users) =>{    
  return async (dispatch) => {
    try {
      dispatch({ type: "TICKETS_REQUEST" });

      console.log(">>>>>>>>>", users, "<<<<<<<<<")
      const response = await axios.post(`${BASE_URL}/tickets/by-users`, users,
      {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Gotten Searched Tickets By Users",response.data.tickets);

      if (response.status === 201) {
        const { tickets } = response.data;
        dispatch({ type: "TICKETS_SUCCESS", payload: tickets });
      } 
      else if (response.status = 400){
        showToast('Unable to Fetch', 'info')
        dispatch({
          type: "TICKETS_FAILURE",
          payload: { error: response.data.message },
        });
      }
      else{
        dispatch({
          type: "TICKETS_FAILURE",
          payload: { error: response.data.message },
        });
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };
}

export const fetchPhases = (token) =>{    
  return async (dispatch) => {
    try {
      dispatch({ type: "PHASES_REQUEST" });

      const response = await axios.get(`${BASE_URL}/phases`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        const { phases } = response.data;
        dispatch({ type: "PHASES_SUCCESS", payload: phases });
      } 
      else 
      {
        dispatch({
          type: "PHASES_FAILURE", payload: { error: response.data.message }
        });
      }
    } 
    catch (error) {
      console.error("Error fetching movies:", error);
    }
  };
}   

export const changeTicketPhase = ( ticketId, token, oldPhaseId, newPhaseId, tickets, ) =>
{
  return async (dispatch) => {
    try {
      dispatch({ type: "CHANGE_PHASE_REQUEST" });

      // First Check the newPhaseId is not the same in which ticket is already in.
      // For That, oldPhaseId must not be equal to newPhaseId. If it is you dont do anything.
      if(oldPhaseId === newPhaseId)
      {
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/tickets/change-phase`,
        { ticketId, phaseId: newPhaseId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        // update the frontend accordingly to reflect changes.
        showToast(response.data.message, 'success');
        let updatedTicketIndex = tickets.findIndex((ticket) => ticket.id === ticketId);

        if (updatedTicketIndex !== -1) {
          let updatedTickets = [...tickets];
          updatedTickets[updatedTicketIndex].phase_id = newPhaseId;
          dispatch({ type: "CHANGE_PHASE_SUCCESS", payload: updatedTickets });
        } 
        else {
          // Ticket not found in the existing array
          // You might want to fetch updated tickets from the server and dispatch an action accordingly

          // Showing error for the time being.
          showToast("Error while changing ticket", "error");
          dispatch({
            type: "CHANGE_PHASE_FAILURE",
            payload: { error: "Error while changing ticket" },
          });
        }
      } 
      else {
        // Handle other status codes as needed
        showToast(response.data.message, "error");
        dispatch({
          type: "CHANGE_PHASE_FAILURE",
          payload: { error: response.data.message },
        });
      }
    } 
    catch (error) {
      console.error("Error changing ticket:", error);
      // Handle error scenarios
      showToast("An error occurred while changing ticket", "error");
    }
  };
}

export const deleteTicket = (ticketId, token) =>{  
  return async (dispatch) => {
    try {
      console.log(ticketId,token);
      dispatch({ type: "DELETE_TICKET_REQUEST" });
      const response = await axios.delete(`${BASE_URL}/tickets/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });      

      if(response.status === 200)
      { 
        dispatch({ type: "DELETE_TICKET_SUCCESS", payload: ticketId  });
        console.log("ticket delete response:", response.data);
        showToast(response.data.message, 'success')
      }
      else if(response.status === 404)
      {
        dispatch({ type: "DELETE_TICKET_FAILURE", payload: response.data.message  });
        showToast(response.data.message, 'info')
      }
      else{
        dispatch({ type: "DELETE_TICKET_FAILURE", payload: response.data.message });
        showToast(response.data.message, 'error')
      }
      
    } 
    catch (error) {
      console.error("Error Deleting tickets:", error.message);
      showToast("Error Deleting tickets", 'error')     
    }
  }
}

export const addTicket = (formData, token, tickets) => async (dispatch) => {
  try {
    dispatch({ type: "TICKETS_REQUEST" });
    const url = `${BASE_URL}/tickets`;
    const method = 'post';

    const response = await axios[method](url, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    if (response.status === 201) {
      console.log("Ticket upload response:", response.data.ticket);
      showToast(response.data.message, 'success');

      // Dispatch success action if needed
      let updatedTickets = [...tickets, response.data.ticket]
      
      dispatch({ type: "TICKETS_SUCCESS", payload: updatedTickets});
    } 
    else if (response.status === 409) {
      showToast(response.data.message, 'info');

    } 
    else {
      showToast(response.data.message, 'error');
      dispatch({ type: "TICKETS_FAILURE", payload: response.data.message });
      
    }
  } catch (error) {
    console.error(`Error creating Ticket:`, error.message);
    // Dispatch error action if needed
    dispatch({ type: "TICKETS_FAILURE", payload: error.message });
  }
};

export const editTicket = (formData, ticketId, token, tickets) => async (dispatch) => {
  try {
    dispatch({ type: "TICKETS_REQUEST" });
    const url = `${BASE_URL}/tickets/${ticketId}`;
    const method = 'patch';

    const response = await axios[method](url, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    if (response.status === 200) {
      showToast(response.data.message, 'success');

      console.log("Response Ticket", response.data.ticket)
      let ticketExists = tickets.filter((ticket) => ticket.id == ticketId);
      if (ticketExists) {

          let newTicket = {...ticketExists, ...response.data.ticket}
          let updatedTickets = tickets.filter((ticket) => ticket.id != ticketId)
          console.log("Less than previous counted tickets",updatedTickets)
          updatedTickets = [...updatedTickets, newTicket]

          dispatch({ type: "TICKETS_SUCCESS", payload: updatedTickets });
        } 

    } 
    else if (response.status === 404) {
      showToast(response.data.message, 'info');

    } 
    else {
      showToast(response.data.message, 'error');
      dispatch({ type: "TICKETS_FAILURE", payload: response.data.message });
      
    }
  } catch (error) {
    console.error(`Error creating Ticket:`, error.message);
    // Dispatch error action if needed
    dispatch({ type: "TICKETS_FAILURE", payload: error.message });
  }
};

export const updateTicketsVertically = (currentPhaseTickets, tickets, pId, token) =>{    
  return async (dispatch) => {
    try {
      dispatch({ type: "TICKETS_REQUEST" });
      console.log("New Order Tasks:",currentPhaseTickets)

      let newPhaseId = parseInt(pId)
      let phaseId = newPhaseId
      let payload = {currentPhaseTickets}
      
      const response = await axios.patch(`${BASE_URL}/tickets/vertical-drag/${phaseId}`, payload , {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if(response.status == 200)
      {
        // showToast('Changed Order Successfully.','success')
        let filteredTickets = tickets.filter((ticket) => ticket.phase_id != phaseId)
        let newTickets = [...currentPhaseTickets,...filteredTickets]
        console.log("New Tickets:",newTickets)
        dispatch({ type: "TICKETS_SUCCESS", payload: newTickets });
      }
      else {
        showToast('Changing in Order Failed.','error')
        dispatch({
          type: "TICKETS_FAILURE",
          payload: response.data.message
        });
      }
    } 
    catch (error) {
      console.error(`Error creating Ticket:`, error.message);
    // Dispatch error action if needed
    dispatch({ type: "TICKETS_FAILURE", payload: error.message });
    }
  };
}

export const updateTicketsHorizontally = (oldPhaseTickets, newPhaseTickets, oldPhaseId, newPhaseId, TicketId, tickets, token) =>{    
  return async (dispatch) => {
    try {
      dispatch({ type: "TICKETS_REQUEST" });

      newPhaseId = parseInt(newPhaseId)
      oldPhaseId = parseInt(oldPhaseId)
      let ticketId = parseInt(TicketId)
      let payload = {oldPhaseTickets, newPhaseTickets}
      
      const response = await axios.patch(`${BASE_URL}/tickets/horizontal-drag/${oldPhaseId}/${newPhaseId}/${ticketId}`, payload , {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      console.log(response.data.message)

      if(response.status == 200)
      {
        // showToast('Changed Order Successfully.','success')
        let oldTickets = [...oldPhaseTickets, ...newPhaseTickets]
        let filteredTickets = tickets.filter((ticket) => ((ticket.phase_id != newPhaseId )&& (ticket.phase_id != oldPhaseId))) 
        let newTickets = [...oldTickets,...filteredTickets]
        dispatch({ type: "TICKETS_SUCCESS", payload: newTickets });
        
      }
      else {
        showToast('Changing in Order Failed.','error')
        dispatch({
          type: "TICKETS_FAILURE",
          payload: response.data.message
        });
      }
    } 
    catch (error) {
      console.error(`Error creating Ticket:`, error.message);
    // Dispatch error action if needed
    dispatch({ type: "TICKETS_FAILURE", payload: error.message });
    }
  };
}

