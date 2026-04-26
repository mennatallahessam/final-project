import User from '../models/User.js';

export async function getAllUsers(req, res) {
    try {
        const users = await User.find();
        res.status(200).json({ status: 'success', data: users });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
}

export async function getUser(req, res) {
    try {
        const user = await User.findById(req.params.id).populate('friends', 'username fullName avatar');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
}

export async function getMe(req, res) {
    try {
        const user = await User.findById(req.user._id).populate('friends', 'username fullName avatar');
        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
}

export async function updateUser(req, res) {
    try {
        // Don't allow password updates via this route
        if (req.body.password) delete req.body.password;

        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
}

export async function deleteUser(req, res) {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
}

export async function addFriend(req, res) {
    try {
        const currentUser = await User.findById(req.user._id);
        const friendId = req.body.friendId;

        if (currentUser.friends.includes(friendId)) {
            return res.status(400).json({ message: 'User is already your friend' });
        }

        currentUser.friends.push(friendId);
        await currentUser.save();

        res.status(200).json({ status: 'success', data: currentUser });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
}

export async function removeFriend(req, res) {
    try {
        const currentUser = await User.findById(req.user._id);
        currentUser.friends = currentUser.friends.filter(id => id.toString() !== req.params.friendId);
        await currentUser.save();
        res.status(200).json({ status: 'success', data: currentUser });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
}
