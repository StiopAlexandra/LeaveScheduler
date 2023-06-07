import React, { useContext, useMemo} from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import UserContext from "./contexts/UserContext";
import {getPageRoutePath} from "./utils/path";
import Company from "./pages/Company";
import Reports from "./pages/Reports";
import Requests from "./pages/Requests";
import Employees from "./pages/Employees";
import TeamScheduling from "./pages/TeamScheduling";
import MyLeaves from "./pages/MyLeaves";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import HomeLayout from "./layouts/HomeLayout";
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import CalendarViewMonthOutlinedIcon from '@mui/icons-material/CalendarViewMonthOutlined';
import ResetPassword from "./pages/ResetPassword";
import Employee from "./pages/Employees/Employee";


const employeePages = [
    {name: 'Dashboard', Page: Dashboard, icon: <HomeOutlined/>},
    {name: 'My Leaves', Page: MyLeaves, icon: <EventAvailableOutlinedIcon/>},
    {name: 'Team Scheduling', Page: TeamScheduling, icon: <CalendarViewMonthOutlinedIcon/>},
]

const adminPages = [
    ...employeePages,
    {name: 'Employees', Page: Employees, icon: <PeopleAltOutlinedIcon/>},
    {name: 'Requests', Page: Requests, icon: <PendingActionsOutlinedIcon/>},
    {name: 'Reports', Page: Reports, icon: <AssessmentOutlinedIcon/>},
    {name: 'Company', Page: Company, icon: <BusinessOutlinedIcon/>},
]

const App = () => {
    const context = useContext(UserContext);

    const pages = useMemo(() => {
        return context?.user?.manager ? adminPages : employeePages
    }, [context?.user?.manager])

    return (

        <Routes>
            <Route path="/" element={<HomeLayout pages={pages}/>}>
                {pages.map(({name, Page}, index) => {
                    return (
                        <Route
                            path={getPageRoutePath({name})}
                            element={<Page/>}
                            key={index}
                        />
                    )
                })}
                <Route path="/employees/:id/:type" element={<Employee />} />
                <Route path="/company/:type" element={<Company />} />
                <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
                <Route path="/settings" element={<Settings/>}/>
            </Route>
            <Route path="/reset-password/:resetToken" element={<ResetPassword/>} />
            <Route path="/login" element={<SignIn/>}/>
            <Route path="/register" element={<SignUp/>}/>
            {/*<Route path="*" element={<Navigate to="/dashboard" replace/>}/>*/}
        </Routes>

    )
}

export default App