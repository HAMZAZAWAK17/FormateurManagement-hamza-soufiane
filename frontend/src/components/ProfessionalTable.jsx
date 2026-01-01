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
                boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)',
                borderRadius: '20px',
                overflow: 'hidden',
                border: 'none'
            }}
        >
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                align={column.align || 'left'}
                                sx={{
                                    backgroundColor: '#FFFFFF', // Clean White Header
                                    color: '#A3AED0', // Grey Text
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.05em',
                                    py: 2,
                                    borderBottom: '1px solid #E9EDF7'
                                }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                        {(onView || onEdit || onDelete) && (
                            <TableCell
                                align="right"
                                sx={{
                                    backgroundColor: '#FFFFFF',
                                    color: '#A3AED0',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.05em',
                                    py: 2,
                                    borderBottom: '1px solid #E9EDF7'
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
                                        backgroundColor: '#F4F7FE' // Very light touch
                                    },
                                    '& td': {
                                        color: '#1B254B', // Dark Navy Text
                                        fontWeight: 600,
                                        borderBottom: '1px solid #E9EDF7',
                                        fontSize: '0.90rem'
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
                                                        color: '#4318FF',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(67, 24, 255, 0.1)'
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
                                                        color: '#4318FF',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(67, 24, 255, 0.1)'
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
                                                        color: '#E31A1A',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(227, 26, 26, 0.1)'
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
