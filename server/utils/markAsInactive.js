import UserLeave from "../model/UserLeave.js";
import User from "../model/User.js";

const markAsInactive = async () => {
    const today = new Date();
    today.setUTCHours(0,0,0,0);
    const usersLeaves = await UserLeave.find({
         startDate: today
    });

    for (const userLeave of usersLeaves) {
        const {user: id} = userLeave;
        const user = await User.findById(id);
        if (user && user.status === 'active') {
            user.status = 'inactive';
            await user.save();
            console.log('User status updated successfully');
        }
    }
};

export default markAsInactive
