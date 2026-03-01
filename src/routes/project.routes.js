import {Router} from 'express';
import {createProject, deleteProject, renameProject, fetchMembers, addMembers, deleteMembers, getAllMembersOfAProject} from '../controllers/project.controllers.js';
import authorizeUser from '../middlewares/auth.middlewares.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = Router();

router.route('/add').post(authorizeUser, createProject);
router.route('/delete/:projectid').delete(authorizeUser, checkRole, deleteProject);
router.route('/rename/:projectid').patch(authorizeUser, checkRole, renameProject);
router.route('/fetch-members/:projectid').get(authorizeUser, checkRole, fetchMembers);
router.route('/add-members/:id/:projectid').patch(authorizeUser, checkRole, addMembers);
router.route('/delete-members/:id/:projectid').delete(authorizeUser, checkRole, deleteMembers);
router.route('/fetch-all-members/:projectid').get(authorizeUser, getAllMembersOfAProject);

export default router;