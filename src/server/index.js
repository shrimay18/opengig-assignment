const mongoose = require('mongoose');
const express = require('express');
const Email = require('./models/Email');

const app = express();
const PORT = 5000;

const emailLogs = {};

const cors = require('cors');
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://shrimaynotion18:notion@cluster0.b1uui.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('MongoDb connection error:', err);
});


const addLogMessage = (email, message) => {
    if (!emailLogs[email]) {
        emailLogs[email] = [];
    }
    emailLogs[email].push({ message, timestamp: new Date() });
};

app.post('/api/emails', async (req, res) => {
    const { email, status } = req.body;

    try {
        const newEmail = new Email({ email, status });
        await newEmail.save();
        addLogMessage(email, 'Workflow started');
        res.status(201).json({ message: 'Workflow started', newEmail });

        setTimeout(async () => {
            const currentEmail = await Email.findOne({ email });
            if (currentEmail && currentEmail.status === 'pending') {
                addLogMessage(email, '45-second check: email not accepted yet.');

                setTimeout(async () => {
                    const updatedEmail = await Email.findOne({ email });
                    if (updatedEmail && updatedEmail.status === 'pending') {
                        addLogMessage(email, '30-second follow-up: email still not accepted. Removing...');
                        await Email.deleteOne({ email });
                        addLogMessage(email, 'Email removed from the database.');
                    } else {
                        addLogMessage(email, 'Email accepted. Workflow complete.');
                    }
                }, 30000);
            } else {
                addLogMessage(email, 'Email accepted. Workflow complete.');
            }
        }, 45000);

    } catch (error) {
        console.error('Error saving email:', error);
        if (error.code === 11000) {
            res.status(400).json({ message: 'Email already exists. Please check the status.' });
        } else {
            res.status(500).json({ message: 'Error saving email' });
        }
    }
});

app.put('/api/emails/:email/accept', async (req, res) => {
    const { email } = req.params;

    try {
        const result = await Email.findOneAndUpdate(
            { email },
            { status: 'completed' },
            { new: true }
        );

        if (result) {
            res.status(200).json({ message: 'Email status updated to completed', result });
        } else {
            res.status(404).json({ message: 'Email not found' });
        }
    } catch (error) {
        console.error('Error updating email status:', error);
        res.status(500).json({ message: 'Error updating email status' });
    }
});

app.put('/api/emails/:email/reject', async (req, res) => {
    const { email } = req.params;

    try {
        const result = await Email.findOneAndUpdate(
            { email },
            { status: 'rejected' },
            { new: true }
        );

        if (result) {
            res.status(200).json({ message: 'Email status updated to rejected', result });
        } else {
            res.status(404).json({ message: 'Email not found' });
        }
    } catch (error) {
        console.error('Error updating email status:', error);
        res.status(500).json({ message: 'Error updating email status' });
    }
});

app.get('/api/logs/:email', (req, res) => {
    const { email } = req.params;
    const logs = emailLogs[email];
    if (logs) {
        res.status(200).json({ logs });
    } else {
        res.status(404).json({ message: 'No logs found for the specified email.' });
    }
});

app.get('/api/emails/status/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const emailRecord = await Email.findOne({ email });

        if (emailRecord) {
            res.status(200).json({ status: emailRecord.status });
        } else {
            res.status(404).json({ message: 'Email not found' });
        }
    } catch (error) {
        console.error('Error fetching email status:', error);
        res.status(500).json({ message: 'Error fetching email status' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

