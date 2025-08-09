import EventCard from "./EventCard";
import { IoTodaySharp } from "react-icons/io5";

import './EventList.css';
import { useState } from "react";
import { useEventData } from "../hook/usePageData";
import { useNavigate } from "react-router";

const EventList = () => {
    const today = new Date();
    const [selectedDay, setSelectedDay] = useState({ day: today, stringDay: today.toLocaleDateString('en-GB').split('/').join('-') });
    const { data } = useEventData(selectedDay.stringDay);
    const currentYear = new Date().getFullYear();
    const navigate = useNavigate();

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

    const handleRedirection = (event) => {
        navigate(`/event/${event.id}`)
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
                        <div key={day} onClick={() => setSelectedDay({
                            day,
                            stringDay: day?.toLocaleDateString('en-GB').split('/').join('-')
                        })}
                            className={`day-card ${isSameDays(selectedDay?.day, day) && 'active'}`}>
                            <h6>{day?.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</h6>
                        </div>
                    ))
                }
            </div>
            <div className="events">
                {
                    data?.length > 0 ?
                        data?.map(event => (
                            <div key={event.id} onClick={() => handleRedirection(event)}>
                                <EventCard name={event.name} date={event.date} image={event?.media?.[0]?.url} />
                            </div>
                        )) : (
                            <p>No Events Found!</p>
                        )
                }
            </div>
        </div>
    )
}

export default EventList;