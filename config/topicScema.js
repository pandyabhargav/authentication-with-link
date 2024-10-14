const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TopicSchema = new Schema({
    title: String,
    description: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    subtopics: [{ type: Schema.Types.ObjectId, ref: 'Subtopic' }]  // Reference to subtopics
});

module.exports = mongoose.model('Topic', TopicSchema);

