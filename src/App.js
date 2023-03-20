
import { BiCalendar } from "react-icons/bi";
import { useState, useEffect, useCallback } from "react";
import Search from "./components/Search";
import AddAppointment from "./components/AddAppointment";
import AppointmentInfo from "./components/AppointmentInfo";

function App() {
  let [appointmentsList, setAppointmentsList] = useState([]);
  let [query, setQuery] = useState("");
  let [sortBy, setSortBy] = useState("petName");
  let [orderBy, setOrderBy] = useState("asc");

  const filteredAppointments = appointmentsList.filter(
    item => {
      return (
        item.petName.toLowerCase().includes(query.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        item.aptNotes.toLowerCase().includes(query.toLowerCase())
      );
    }
  ).sort((a, b) => {
    let order = (orderBy === 'asc') ? 1 : -1;
    return (
      a[sortBy].toLowerCase() < 
      b[sortBy].toLowerCase() ? 
      -1 * order : 1 * order
    );
  });

  const fetchData = useCallback(() => {
    fetch('./data.json')
      .then(response => response.json())
      .then(data => {
        setAppointmentsList(data);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl mb-3">
        <BiCalendar className="inline-block text-red-400 align-top" /> 
        Your Appointments
      </h1>
      <AddAppointment lastId={appointmentsList.reduce((max, item) => Number(item.id) > max ? Number(item.id) : max, 0)}
        onSendAppointmentInfo = {myAppointment => setAppointmentsList([...appointmentsList, myAppointment])}/>
      <Search query={query} 
        onQueryChange={myQuery => setQuery(myQuery)} 
        orderBY={orderBy}
        onOrderByChange={mySort=>setOrderBy(mySort)}
        sortBy={sortBy}
        onSortByChange={mySort=>setSortBy(mySort)}
      />
      <ul className="divide-y divide-grey-200">
        {filteredAppointments.map(appointment => (
          <AppointmentInfo 
            appointment={appointment} 
            key={appointment.id}
            onDeleteAppointment = {
              appointmentId => 
                setAppointmentsList(appointmentsList.filter(appointment => appointment.id !== appointmentId))
            } 
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
