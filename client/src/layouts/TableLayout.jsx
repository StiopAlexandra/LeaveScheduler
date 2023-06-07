import React from 'react'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const TableLayout = () => {
	const navigate = useNavigate()

	useEffect(() => {
		navigate('/')
	}, [])

	return <Outlet />
}

export default TableLayout
