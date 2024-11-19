import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DecisionPage() {
    const { email } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('pending');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Set a timer for 45 seconds to prompt the user again
        const timer = setTimeout(() => {
            if (status === 'pending') {
                setMessage('Please accept or reject the offer.');
            }
        }, 45000);

        return () => clearTimeout(timer); // Cleanup timer on unmount
    }, [status]);

    const handleAccept = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/emails/${email}/accept`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setStatus('completed');
                setMessage('Offer accepted successfully!');
                navigate('/'); // Redirect back to homepage after accept
            } else {
                setMessage('Failed to accept the offer.');
            }
        } catch (error) {
            console.error('Error accepting offer:', error);
            setMessage('Error occurred while accepting.');
        }
    };

    const handleReject = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/emails/${email}/reject`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setStatus('rejected');
                setMessage('Offer rejected successfully.');
                navigate('/'); // Redirect back to homepage after reject
            } else {
                setMessage('Failed to reject the offer.');
            }
        } catch (error) {
            console.error('Error rejecting offer:', error);
            setMessage('Error occurred while rejecting.');
        }
    };

    return (
        <div>
            <h2>Decision for {email}</h2>
            {message && <p>{message}</p>}
            {status === 'pending' && (
                <div>
                    <button onClick={handleAccept}>Accept</button>
                    <button onClick={handleReject}>Reject</button>
                </div>
            )}
        </div>
    );
}

export default DecisionPage;
