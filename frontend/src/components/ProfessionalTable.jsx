import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Box,
    Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

/**
 * Composant Table professionnel
 * Header couleur Secondary (#0F4C75)
 */
const ProfessionalTable = ({
    columns,
    data,
    onView,
    onEdit,
    onDelete,
    emptyMessage = 'Aucune donnée disponible'
}) => {
    return (
        <TableContainer
            component={Paper}
            sx={{
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                borderRadius: '12px',
                overflow: 'hidden'
            }}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                align={column.align || 'left'}
                                sx={{
                                    backgroundColor: '#0F4C75',
                                    color: '#FFFFFF',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.05em',
                                    py: 2
                                }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                        {(onView || onEdit || onDelete) && (
                            <TableCell
                                align="right"
                                sx={{
                                    backgroundColor: '#0F4C75',
                                    color: '#FFFFFF',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.05em',
                                    py: 2
                                }}
                            >
                                Actions
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length + 1}
                                align="center"
                                sx={{ py: 6 }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    {emptyMessage}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row, index) => (
                            <TableRow
                                key={row.id || index}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#F9FAFB'
                                    },
                                    '&:last-child td': {
                                        borderBottom: 0
                                    }
                                }}
                            >
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align || 'left'}
                                        sx={{ py: 2 }}
                                    >
                                        {column.render ? column.render(row) : row[column.id]}
                                    </TableCell>
                                ))}
                                {(onView || onEdit || onDelete) && (
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                                            {onView && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => onView(row)}
                                                    sx={{
                                                        color: '#3282B8',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(50, 130, 184, 0.1)'
                                                        }
                                                    }}
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                            {onEdit && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => onEdit(row)}
                                                    sx={{
                                                        color: '#3282B8',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(50, 130, 184, 0.1)'
                                                        }
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                            {onDelete && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => onDelete(row)}
                                                    sx={{
                                                        color: '#DC2626',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(220, 38, 38, 0.1)'
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProfessionalTable;
