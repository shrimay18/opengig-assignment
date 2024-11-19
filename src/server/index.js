const mongoose = require('mongoose');
const express = require('express');
const Email = require('./models/Email');

const app = express();
const PORT = 5000;

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

app.post('/api/emails', async (req, res) => {
    const { email, status } = req.body;

    try {
        const newEmail = new Email({ email, status });
        await newEmail.save();
        res.status(201).json({ message: 'Workflow started', newEmail });

        // Start the first delayed check after 45 seconds
        setTimeout(async () => {
            const currentEmail = await Email.findOne({ email });
            if (currentEmail && currentEmail.status === 'pending') {
                console.log(`45-second check: ${email} has not accepted yet.`);

                // Re-check after an additional 30 seconds
                setTimeout(async () => {
                    const updatedEmail = await Email.findOne({ email });
                    if (updatedEmail && updatedEmail.status === 'pending') {
                        console.log(`30-second follow-up: ${email} has still not accepted. Removing...`);
                        await Email.deleteOne({ email });
                        console.log(`Removed ${email} from the database.`);
                    }
                    else{
                        console.log('Thank you for the purchase');
                    }
                }, 30000); // 30 seconds
            }
            else{
                console.log('Thank you for the purchase');
            }
        }, 45000); // 45 seconds

    } catch (error) {
        console.error('Error saving email:', error);

        if (error.code === 11000) {
            res.status(400).json({ message: 'Email already exists. Please check the status.' });
        } else {
            res.status(500).json({ message: 'Error saving email' });
        }
    }
});

// Endpoint to mark the workflow as accepted (status = "completed")
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

// Endpoint to mark the workflow as rejected
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

app.get('/api/emails/status/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const emailRecord = await Email.findOne({ email });

        if (emailRecord) {
            res.status(200).json({ status: emailRecord.status });
        } else {
            res.status(404).json({ message: 'Email not found in the database' });
        }
    } catch (error) {
        console.error('Error checking email status:', error);
        res.status(500).json({ message: 'Error checking email status' });
    }
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

