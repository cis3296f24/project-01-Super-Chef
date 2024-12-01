"use client";
import React, { useState } from 'react';
import styles from './event.module.css';
import { useUser } from '@clerk/clerk-react';




type Event = {
    title: string;
    date: string;
    description: string;
    image: string;
    rules: string;
};


const events: Event[] = [
    {
        title: 'SuperChef Showdown',
        date: 'November 21, 2024',
        description: 'Come to our annual cooking showdown! Hosted by SuperChef',
        image: 'images/superchefshowdown.png',
        rules: 'Can not bring same dish as other opponent'
    },
    {
        title: 'Recipe Royale',
        date: 'December 15, 2024',
        description: 'Sign up to compete in the Grand Recipe Royale!',
        image: 'images/reciperoyale.jpeg',
        rules: 'Can not bring same dish as other opponent'
    },
    {
        title: 'Battle Of The Bakers',
        date: 'January 30, 2025',
        description: 'Have the best pie? Prove It!',
        image: 'images/bakeoff.jpg',
        rules: 'Can not bring same dish as other opponent'
    },
];
















const EventPage: React.FC = () => {
    const { user } = useUser();
    const [usernames, setUsernames] = useState<(string | null)[]>(Array(events.length).fill(null));
    const [items, setItems] = useState<(string | null)[]>(Array(events.length).fill(null));
    const [inputValues, setInputValues] = useState<string[]>(Array(events.length).fill(""));
    const [modalVisible, setModalVisible] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<Event | null>(null);








    const handleSignUpClick = (index: number) => {
        if (user) {
            const usernameToDisplay = user.username || 'Guest';
            const newUsernames = [...usernames];
            newUsernames[index] = usernameToDisplay;
            setUsernames(newUsernames);
        } else {
            const newUsernames = [...usernames];
            newUsernames[index] = 'Guest';
            setUsernames(newUsernames);
        }
    };








    const handleDishInput = (index: number, value: string) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = value;
        setInputValues(newInputValues);
    };








    const handleDishSubmit = (index: number) => {
        const newItems = [...items];
        newItems[index] = inputValues[index];
        setItems(newItems);
    };








    const handleShareClick = (eventIndex: number) => {
        setCurrentEvent(events[eventIndex]);
        setModalVisible(true);
    };




    const closeModal = () => {
        setModalVisible(false);
        setCurrentEvent(null);
    };




    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Link copied to clipboard!');
        });
    };








    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Upcoming Events</h1>
            </header>








            <div className={styles.cardContainer}>
                {events.map((event, index) => (
                    <div key={index} className={styles.eventCard}>
                        <img src="/images/signup.png" className={styles.signupButton}
                             onClick={() => handleSignUpClick(index)}/>
                        <img
                            src="/images/share.png"
                            className={styles.shareButton}
                            onClick={() => handleShareClick(index)}
                        />
                        <img src={event.image} className={styles.eventImage}/>
                        <div className={styles.eventDetails}>
                            <h2 className={styles.eventTitle}>{event.title}</h2>
                            <h3 className={styles.detailsHeader}> Event Details</h3>




                            <div className={styles.calendarContainer}>
                                <div className={styles.calendarDay}>
                                    {new Date(event.date).getDate()}
                                </div>
                                <div className={styles.calendarMonthYear}>
                                    {new Date(event.date).toLocaleString("default", {month: "short"})}
                                    <br/>
                                    {new Date(event.date).getFullYear()}
                                </div>
                            </div>




                            <p className={styles.eventDescription}>{event.description}</p>
                            <p className={styles.eventRules}> Rules: {event.rules}</p>
                        </div>




                        {usernames[index] && (
                            <div className={styles.usernameDisplay}>
                                Attendee: <strong>{usernames[index]}</strong>
                            </div>
                        )}








                        {usernames[index] && !items[index] && (
                            <div className={styles.itemInputContainer}>
                                <input
                                    type="text"
                                    placeholder="Enter Dish"
                                    value={inputValues[index]}
                                    onChange={(e) => handleDishInput(index, e.target.value)}
                                    className={styles.itemInput}
                                />
                                <button onClick={() => handleDishSubmit(index)} className={styles.submitButton}>Submit
                                </button>
                            </div>
                        )}




                        {items[index] && (
                            <div className={styles.itemDisplay}>
                                <strong> {usernames[index]}: </strong>{items[index]}
                            </div>








                        )}




                    </div>
                ))}
            </div>




            {modalVisible && currentEvent && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <button onClick={closeModal} className={styles.closeButton}>
                            X
                        </button>
                        <h2>{currentEvent.title}</h2>
                        <p>{currentEvent.description}</p>
                        <img src= "/images/qr.png" className={styles.modalImage} />
                        <p className={styles.modalText}>
                            <strong>Share this event: </strong>{`https://SuperChef.com/events/${encodeURIComponent(currentEvent.title)}`}
                        </p>
                        <button
                            className={styles.copyButton}
                            onClick={() =>
                                copyToClipboard(`https://SuperChef.com/events/${encodeURIComponent(currentEvent.title)}`)
                            }
                        >
                            Copy Link
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};




export default EventPage;
