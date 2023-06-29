import UserLeave from "../model/UserLeave.js";

const markAsActive = async () => {
    const today = new Date();

    const usersLeaves = await UserLeave.find({
         endDate: today
    });

    for (const userLeave of usersLeaves) {
        const {user} = userLeave;
        if (user && user.status === 'inactive') {
            user.status = 'active';
            await user.save();
            console.log('User status updated successfully');
        }
    }
};

export default markAsActive
