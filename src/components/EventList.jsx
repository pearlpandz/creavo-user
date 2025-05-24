import EventCard from "./EventCard";
import { IoTodaySharp } from "react-icons/io5";

import './EventList.css';

const EventList = ({ data, selectedDay, setSelectedDay }) => {
    const currentYear = new Date().getFullYear();

    const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return date
    });

    const isSameDays = (date1, date2) => {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    }

    return (
        <div className="events-container">
            <div className="event-headingg">
                <IoTodaySharp />
                <h4>Festival Calendar {currentYear}</h4>
            </div>
            <div className="day-container">
                {
                    nextSevenDays.map(day => (
                        <div key={day} onClick={() => setSelectedDay(day)} className={`day-card ${isSameDays(selectedDay, day) && 'active'}`}>
                            <h6>{day?.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</h6>
                        </div>
                    ))
                }
            </div>
            <div className="events">
                {
                    data?.length > 0 ?
                        data?.map(event => (
                            <EventCard key={event.id} name={event.name} date={event.date} image={event.media[0].url} />
                        )) : (
                            <p>No Events Found!</p>
                        )
                }
            </div>
        </div>
    )
}

export default EventList;