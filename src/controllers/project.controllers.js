import { Project } from "../models/projects.models";
import { User } from '../models/user.models.js';

const createProject = async(req,res) => {
    const {title, description} = req.body;

    if([title, description].some((field) => field.trim() == '')) {
        return res.status(400)
        .json({
            message: 'All the fields are required.'
        })
    }

    const createdProject = await Project.create({
        title,
        description,
        owner: req.user._id
    })

    return res.status(201)
    .json({
        message: 'Project created successfully.',
        createdProject
    })
}

const deleteProject = async(req,res) => {
    await Project.deleteOne({owner: req.user._id});
    return res.status(200)
    .json({
        message: 'Successfully deleted the project.'
    })
}

const renameProject = async(req,res) => {
    const {name} = req.body;
    if(name.trim() == '') {
        return res.status(400)
        .json({
            message: 'Name is required.'
        })
    }

    const updatedProject = await Project.findOneAndUpdate(
        {owner: req.user._id},
        {$set: { name } },
        { new: true }
    );

    return res.status(200)
    .json({
        message: 'Project title updated successfully.',
        updatedProject    
    })
}

const fetchMembers = async(req,res) => {
    const members = await User.find({currentProject: null});
    if(!members) {
        return res.status(400)
        .json({
            message: 'Failed to fetch members.'
        })
    }

    return res.status(200)
    .json({
        message: 'Members fetched successfully.',
        members
    })
}

const addMembers = async(req,res) => {
    const {id} = req.params;

    const user = User.findById(id);

    const updatedMembers = Project.findOneAndUpdate(
        {owner: req.user._id},
        {$set: {members: [...members, user]}}
    );

    return res.status(200)
    .json({
        message: 'Member is successfully added.',
        updatedMembers
    })
}

export {createProject, deleteProject, renameProject, fetchMembers, addMembers};