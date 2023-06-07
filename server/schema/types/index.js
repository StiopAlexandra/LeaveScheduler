import {typeDefs as Company} from './Company.js';
import {typeDefs as CompanyLeave} from './CompanyLeave.js';
import {typeDefs as UserLeave} from './UserLeave.js';
import {typeDefs as Department} from './Department.js';
import {typeDefs as LeaveType} from './LeaveType.js';
import {typeDefs as User} from './User.js';
import {typeDefs as Query} from './Query.js';
import {typeDefs as Mutation} from './Mutation.js';
import {typeDefs as ScalarType} from './ScalarType.js';

const typesArray = [
    Company,
    CompanyLeave,
    UserLeave,
    Department,
    LeaveType,
    User,
    Query,
    Mutation,
    ScalarType
]

export default typesArray;
