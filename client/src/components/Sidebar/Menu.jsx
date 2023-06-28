import { Box, List } from '@mui/material'
import MenuItem from './MenuItem'

export default function Menu({ pages = [], ...other }) {
    return (
        <Box {...other}>
            <List disablePadding sx={{ p: 1 }}>
                {pages.map((item) => (
                    <MenuItem key={item.name} item={item} />
                ))}
            </List>
        </Box>
    )
}
