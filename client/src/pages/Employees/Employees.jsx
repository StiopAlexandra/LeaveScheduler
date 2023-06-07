import React, {memo} from 'react'
import Button from "../../components/common/Button";
import { useTranslation } from "react-i18next"
import useOpenState from "../../hooks/useOpenState";
import EmployeesTable from "./EmployeesTable/EmployeesTable";
import AddEmployee from "./AddEmployee";

const Employees = () => {
    const { t } = useTranslation();
    const { open, onShow, onClose } = useOpenState()

    return(
        <div style={{height: '100%',width: '100%'}}>
            <Button
                color={'primary'}
                variant={'contained'}
                onClick={onShow}
            >
                {t('Add Employee')}
            </Button>
            {open && <AddEmployee open={open} onClose={onClose}/>}
            <EmployeesTable/>
        </div>
    )
}

export default memo(Employees)