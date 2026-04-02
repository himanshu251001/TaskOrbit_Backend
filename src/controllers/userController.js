import { search } from '../models/userModel.js';

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

export default { searchUsers };

