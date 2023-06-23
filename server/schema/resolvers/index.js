import merge from 'lodash.merge'

import {resolvers as Company} from './Company.js';
import {resolvers as CompanyLeave} from './CompanyLeave.js';
import {resolvers as UserLeave} from './UserLeave.js';
import {resolvers as Department} from './Department.js';
import {resolvers as Notification} from './Notification.js';
import {resolvers as LeaveType} from './LeaveType.js';
import {resolvers as User} from './User.js';
import {resolvers as ScalarType} from './ScalarType.js';

const resolversMap = merge(
    {},
    Company,
    CompanyLeave,
    UserLeave,
    Department,
    Notification,
    LeaveType,
    User,
    ScalarType
)

export default resolversMap;