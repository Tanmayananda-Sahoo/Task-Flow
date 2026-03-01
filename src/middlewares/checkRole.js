import { Project } from '../models/projects.models.js';

export const checkRole = async(req, res, next) => {
    const {projectid} = req.params;

    const project = await Project.findById(projectid);
    if(!project) {
        return res.status(400)
        .json({
            message: 'Project not found.'
        })
    }

    console.log(project.owner);
    console.log(req.user._id);
    let isUserOwner;

    if(req.user.currentProject != null) {
        isUserOwner = (req.user._id.equals(project.owner));
        console.log(isUserOwner);
    }

    if(!isUserOwner) {
        return res.status(400)
        .json({
            message: 'You are not authorized to do this task.'
        })
    }

    req.project = project;
    next();
}