import { search, getMembers, getOrgMembers, update } from '../models/userModel.js';
import argon2 from 'argon2';

export const searchUsers = async (req, res, next) => {

    const { value } = req.query;
    try {
        const requesterUserId = req.user?.id;

        if (!requesterUserId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const users = await search(value, requesterUserId);

        res.json({ data: users });

    } catch (err) {
        next(err);
    }
};

export const getProjectMembers = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const users = await getMembers(currentUserId);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch project members' });
    }
};

export const getOrganizationMembers = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const users = await getOrgMembers(currentUserId);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch organization members' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, ...rest } = req.body;
        if (password) {
            const hashedPassword = await argon2.hash(password);
            rest.passwordHash = hashedPassword;
        }
        rest.dateOfBirth = rest.dateOfBirth ? new Date(rest.dateOfBirth.split("T")[0]) : null;
        const updatedProfile = await update(id, rest);
        res.json(updatedProfile);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
};


export default { searchUsers, getProjectMembers, getOrganizationMembers, updateProfile };

