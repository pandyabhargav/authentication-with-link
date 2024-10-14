const Subtopic = require('../config/subTopic');
const Topic = require('../config/topicScema');

// Form to add a subtopic
const addSubtopicForm = async (req, res) => {
    try {
        const topics = await Topic.find().lean();  // Fetch all topics
        console.log('Fetched topics for addSubtopicForm:', topics);  // Log fetched topics
        res.render('addsubTopic', { user: req.user, topics });  // Pass topics to the view
    } catch (error) {
        console.error('Error in addSubtopicForm:', error);  // Log error
        res.status(500).send('Server Error');
    }
};

// Add new subtopic to the database
const addSubtopic = async (req, res) => {
    try {
        const { title, description, topicId } = req.body;

        // Log the incoming request data
        console.log('Request data for adding subtopic:', { title, description, topicId });
        
        if (!req.user) {
            console.warn('User not logged in, redirecting to login.');
            return res.redirect('/login');
        }

        const newSubtopic = new Subtopic({
            title,
            description,
            user: req.user._id,
            topic: topicId
        });

        await newSubtopic.save();
        console.log('Newly added subtopic:', newSubtopic);  // Log the new subtopic

        // Update the Topic to include the new subtopic
        const updatedTopic = await Topic.findByIdAndUpdate(topicId, { $push: { subtopics: newSubtopic._id } }, { new: true });
        console.log('Updated topic with new subtopic:', updatedTopic);  // Log the updated topic

        res.redirect('/viewTopics');
    } catch (err) {
        console.error('Error in addSubtopic:', err);  // Log error
        res.status(500).send('Server Error');
    }
};


module.exports = { addSubtopicForm, addSubtopic };
