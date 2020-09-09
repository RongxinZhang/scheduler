import React, { useState, useEffect } from "react";
import axios from "axios"

const useApplicationData = (initial) => {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => {
    setState(prev => ({ ...prev, day }));
  };

  useEffect(()=>{
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((all) => {
        setState(prev => {
        //   //*** IMPORTANT: MUST INCLUDE PREVBIOUS STATE */
          const resObj = {
            ...prev, 
            days: all[0].data,
            appointments: all[1].data,
            interviewers: all[2].data
          }
          
          return resObj;
        });
      });
  }, [])

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    console.log(id, interview);

    return axios.put(`/api/appointments/${id}`, appointment)
      .then((res)=>{

        setState({
          ...state,
          appointments
        });

        console.log("saved")
      })

  }

  const cancelInterview = function(id){
    console.log("cancelling interview", id);

    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`, appointment)
      .then((res)=>{
        console.log("CANCELLING", res);

        setState({
          ...state,
          appointments
        });

        console.log("DELETED")
      })
  }

  return {state, setDay, bookInterview, cancelInterview}
}

export default useApplicationData;