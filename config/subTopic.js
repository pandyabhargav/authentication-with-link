const mongoose = require('mongoose');

const subTopicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ensure this is correct
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true }
});

module.exports = mongoose.model('Subtopic', subTopicSchema);

