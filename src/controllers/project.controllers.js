import { Project } from "../models/projects.models.js";
import { User } from '../models/user.models.js';

const createProject = async(req,res) => {
    const {title = "", description = ""} = req.body;

    if([title, description].some((field) => field.trim() == '')) {
        return res.status(400)
        .json({
            message: 'All the fields are required.'
        })
    }

    const doesOwnerHaveAProject = await Project.findOne({owner: req.user._id});

    if(doesOwnerHaveAProject) {
        return res.status(400)
        .json({
            message: "You already have a project pending."
        })
    }

    
    const createdProject = await Project.create({
        title,
        description,
        owner: req.user._id
    })

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {$set: {currentProject: createdProject._id}},
        {new:true}
    )

    await Project.findByIdAndUpdate(
        createdProject._id,
        {$push: {members: user._id}},
        {new:true}
    )
    
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
    const {title = ""} = req.body;
    if(title.trim() == '') {
        return res.status(400)
        .json({
            message: 'Name is required.'
        })
    }

    const updatedProject = await Project.findOneAndUpdate(
        {owner: req.user._id},
        {$set: { title } },
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
    // console.log(id);
    const user = await User.findById(id);
    // console.log(user);

    //Add a validation for checking whether the user is present in the members array list or not.
    const updatedMembersProject = await Project.findOneAndUpdate(
        {owner: req.user._id},
        {$push: {members: user._id} },
        {new: true}
    );

    await User.findByIdAndUpdate(
        id,
        {$set: {currentProject: updatedMembersProject}},
        {new:true}
    )

    return res.status(200)
    .json({
        message: 'Member is successfully added.',
        updatedMembersProject
    })
}

const deleteMembers = async(req,res) => {
    const {id} = req.params;

    const project = await Project.findOne({owner: req.user._id});
    
    const members = project.members;
    // console.log(members);

    const user = await User.findById(id);

    const updatedMembers = await Project.findOneAndUpdate(
        {owner: req.user._id},
        {$pull: {members : user._id}},
        {new : true}
    )

    return res.status(200)
    .json({
        message: "Member deleted successfully.",
        updatedMembers
    })
}

const getAllMembersOfAProject = async(req,res) => {
    const {projectid} = req.params;

    const project = await Project.findById(projectid);

    if(!project) {
        return res.status(400)
        .json({
            message: 'Project could not be found.'
        })
    }

    const members = project.members;

    return res.status(200)
    .json({
        message: 'Members fetched successfully.',
        members
    })
}

export {createProject, deleteProject, renameProject, fetchMembers, addMembers, deleteMembers, getAllMembersOfAProject}