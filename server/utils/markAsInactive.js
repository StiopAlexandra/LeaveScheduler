import UserLeave from "../model/UserLeave.js";

const markAsInactive = async () => {
    const today = new Date();
    const usersLeaves = await UserLeave.find({
         startDate: today
    });

    for (const userLeave of usersLeaves) {
        const {user} = userLeave;
        if (user) {
            user.status = 'inactive';
            await user.save();
            console.log('User status updated successfully');
        }
    }
};

export default markAsInactive
