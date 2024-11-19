import React from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';

function Homepage() {
    const [email, setEmail] = React.useState('');
    const [status, setStatus] = React.useState('pending');
    const [notification, setNotification] = React.useState('');
    const [notificationType, setNotificationType] = React.useState('');
    const [checkEmail, setCheckEmail] = React.useState('');
    const [statusMessage, setStatusMessage] = React.useState('');
    const [logMessages, setLogMessages] = React.useState([]);
    const navigate = useNavigate();
    const logIntervalRef = React.useRef(null);

    const addLogMessage = (message) => {
        setLogMessages((prev) => [...prev, message]);
    };

    const fetchLogs = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/logs/${email}`);
            const data = await response.json();

            if (response.ok) {
                setLogMessages(data.logs.map((log) => `${log.timestamp}: ${log.message}`));
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    const handleStart = async (e) => {
        e.preventDefault();

        addLogMessage('Starting workflow...');
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
                addLogMessage('Workflow started successfully.');

                logIntervalRef.current = setInterval(fetchLogs, 5000);
            } else {
                setNotification('Error starting workflow');
                setNotificationType('error');
                addLogMessage('Error: Unable to start workflow.');
            }
        } catch (error) {
            console.error('Error saving email:', error);
            setNotification('Error starting workflow');
            setNotificationType('error');
            addLogMessage('Error: Could not connect to the server.');
        }

        setTimeout(() => {
            setNotification('');
            setNotificationType('');
        }, 5000);
    };

    const navigateToDecision = () => {
        addLogMessage('Navigating to the Decision Page...');
        navigate(`/decision/${email}`);
    };

    const handleCheckStatus = async () => {
        addLogMessage('Checking email status...');
        try {
            const response = await fetch(`http://localhost:5000/api/emails/status/${checkEmail}`);
            const data = await response.json();
    
            if (response.ok) {
                setStatusMessage(`Status: ${data.status}`);
                addLogMessage(`Status fetched successfully: ${data.status}`);
            } else {
                setStatusMessage(data.message || 'Email not found in the database');
                addLogMessage('Error: Email not found.');
            }
        } catch (error) {
            console.error('Error checking status:', error);
            setStatusMessage('Error checking status');
            addLogMessage('Error: Could not connect to the server.');
        }
    
        setTimeout(() => {
            setStatusMessage('');
        }, 5000);
    };    

    React.useEffect(() => {
        return () => {
            if (logIntervalRef.current) {
                clearInterval(logIntervalRef.current);
            }
        };
    }, []);

    return (
        <div className="homepage">
            <div className="navbar">
                <div className="nav-left typewriter">Welcome to OpenGig</div>
            </div>
            {notification && (
                <div className='notification-holder'>
                    <div className={`notification ${notificationType}`}>
                        {notification}
                    </div>
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
                        <div className="button-holder">
                            <button className="start-button" onClick={handleStart}>Start</button>
                            <button className="decision-button" onClick={navigateToDecision}>
                                Go to Decision Page
                            </button>
                        </div>
                    </div>
                    <div className="log-block">
                        <div className="log-heading">Workflow Logs:</div>
                        <div className="log-messages">
                            {logMessages.map((message, index) => (
                                <div key={index} className="log-message">{message}</div>
                            ))}
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
