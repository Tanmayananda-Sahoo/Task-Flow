import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is a required field.']
    },
    description: {
        type: String,
        required: [true, 'Description is a required field.']
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'PENDING', 'PROGRESS'],
        required: true,
        default: 'PROGRESS'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: true,
        default: []
    }
})

projectSchema.index({owner: 1}, {unique: true});

export const Project = new mongoose.model('Project', projectSchema);