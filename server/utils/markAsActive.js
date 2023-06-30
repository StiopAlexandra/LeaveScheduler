import UserLeave from "../model/UserLeave.js";
import User from "../model/User.js";

const markAsActive = async () => {
    const today = new Date();
    today.setUTCHours(0,0,0,0);
    const usersLeaves = await UserLeave.find({
         endDate: today
    });

    for (const userLeave of usersLeaves) {
        const {user: id} = userLeave;
        const user = await User.findById(id);
        if (user && user.status === 'inactive') {
            user.status = 'active';
            await user.save();
            console.log('User status updated successfully');
        }
    }
};

export default markAsActive
