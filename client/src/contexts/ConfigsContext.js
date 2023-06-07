import { createContext } from 'react'

export default createContext({
	mode: 'light',
	changeTheme: () => {},
	lng: 'en',
	changeLng: () => {},
	companySettings: {
		dateFormat: "d/MM/Y",
		timeFormat: "h:i a",
		weekStart: "Monday",
		workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
	}
})
