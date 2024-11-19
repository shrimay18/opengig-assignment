import React from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';

function Homepage() {
    const [email, setEmail] = React.useState('');
    const [status, setStatus] = React.useState('pending');
    const [notification, setNotification] = React.useState('');
    const [notificationType, setNotificationType] = React.useState('');
    const [checkEmail, setCheckEmail] = React.useState(''); // For checking email status
    const [statusMessage, setStatusMessage] = React.useState(''); // Status of checked email
    const navigate = useNavigate();

    const handleStart = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, status }),
            });

            const data = await response.json();

            if (response.ok) {
                setNotification(data.message);
                setNotificationType('success');
            } else {
                setNotification('Error starting workflow');
                setNotificationType('error');
            }

            console.log(data);
        } catch (error) {
            console.log('Error saving email:', error);
            setNotification('Error starting workflow');
            setNotificationType('error');
        }

        setTimeout(() => {
            setNotification('');
            setNotificationType('');
        }, 5000);
    };

    const navigateToDecision = () => {
        navigate(`/decision/${email}`);
    };

    // Function to check email status
    const handleCheckStatus = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/emails/status/${checkEmail}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setStatusMessage(`Status: ${data.status}`);
            } else {
                setStatusMessage(data.message || 'Email not found in the database');
            }
        } catch (error) {
            console.log('Error checking status:', error);
            setStatusMessage('Error checking status');
        }

        setTimeout(() => {
            setStatusMessage('');
        }, 5000);
    };

    return (
        <div className="homepage">
            <div className="navbar">
                <div className="nav-left typewriter">Welcome to OpenGig</div>
            </div>
            {notification && (
                <div className={`notification ${notificationType}`}>
                    {notification}
                </div>
            )}
            <div className="nav-below">
                <div className="start-block">
                    <div className="start heading">Start Workflow</div>
                    <div className="start-content">
                        <input
                            type="email"
                            className="start-email"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email"
                        />
                        <div className='button-holder'>
                            <button className="start-button" onClick={handleStart}>Start</button>
                            <button className="decision-button" onClick={navigateToDecision}>
                                Go to Decision Page
                            </button>
                        </div>
                    </div>
                </div>
                <div className="check-block">
                    <div className="check heading">Check Status</div>
                    <div className="check-content">
                        <input
                            type="email"
                            className="check-email"
                            onChange={(e) => setCheckEmail(e.target.value)}
                            placeholder="Enter Email to Check Status"
                        />
                        <button className="check-button" onClick={handleCheckStatus}>
                            Check Status
                        </button>
                    </div>
                    {statusMessage && (
                        <div className="status-message">
                            {statusMessage}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Homepage;
