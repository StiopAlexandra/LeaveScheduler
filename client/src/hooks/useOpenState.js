import { useState, useCallback } from 'react'

const useOpenState = () => {
    const [open, setOpen] = useState(false)

    const onShow = useCallback(() => {
        setOpen(true)
    }, [setOpen])

    const onClose = useCallback(() => {
        setOpen(false)
    }, [setOpen])

    return {
        open,
        onShow,
        onClose,
    }
}

export default useOpenState
