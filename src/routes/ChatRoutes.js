/**
 * ============================================================
 *  Chat Routes
 * ============================================================
 *
 *   GET /chat/users                             → online users
 *   GET /chat/groups                            → all groups
 *   GET /chat/groups/:groupName/members         → group members
 *   GET /chat/messages/private/:userId          → DM history
 *   GET /chat/messages/group/:groupName         → group msg history
 * ============================================================
 */

import { Router } from 'express';
import {
    getDirectUsers,
    getGroups,
    getGroupMembersController,
    getPrivateMessageHistory,
    getGroupMessageHistory,
} from '../controllers/chatController.js';

const router = Router();

router.get('/users', getDirectUsers);
router.get('/groups', getGroups);
router.get('/groups/:groupName/members', getGroupMembersController);

router.get('/messages/private/:userId', getPrivateMessageHistory);
router.get('/messages/group/:groupName', getGroupMessageHistory);

export default router;
