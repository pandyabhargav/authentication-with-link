const Topic = require('../config/topicScema'); // Import your Topic model

const Addtopics = (req, res) => {
    res.render('addTopics', { user: req.user });
};

const addNewTopic = async (req, res) => {
    try {
        // Ensure that the user is logged in
        if (!req.user) {
            return res.status(401).send('Unauthorized. Please log in.');
        }

        const { title, description } = req.body;

        const newTopic = new Topic({
            title,
            description,
            user: req.user._id  // Assign the user ID from req.user
        });

        await newTopic.save();
        res.redirect('/viewTopics');
    } catch (error) {
        console.error('Error adding new topic:', error);
        res.status(500).send('Server Error');
    }
};


const viewTopics = async (req, res) => {
    try {
        // Fetch topics and their associated subtopics with populated user
        const topics = await Topic.find()
            .populate('user') // Populate user for topics
            .populate({
                path: 'subtopics',
                populate: { path: 'user' } // Populate user for subtopics
            });

        const user = req.user ? req.user.name : 'Guest'; // Ensure user is handled correctly

        // Render the page and pass the topics and user data
        console.log(user, "helloo wold topic");
        res.render('viewTopics', { topics, user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};



  


const deleteTopic = async (req, res) => {
    try {
        const topicId = req.params.id;
        const topic = await Topic.findById(topicId).populate('user');

        if (!topic) {
            return res.status(404).send('Topic not found');
        }

        if (!req.user || !topic.user || topic.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).send('Unauthorized');
        }

        await Topic.findByIdAndDelete(topicId);
        res.redirect('/viewTopics');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};





module.exports = { Addtopics, addNewTopic, viewTopics,deleteTopic };
