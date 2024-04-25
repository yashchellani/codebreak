import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import {
    Card,
    Table,
    Button,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
// sections
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../sections/@dashboard/user/list';
import useAuth from '../../hooks/useAuth';
import axios from '../../utils/axios';

/* eslint-disable camelcase */

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'cycle_id', label: 'ID', alignCenter: true },
    { id: 'workyear', label: 'Recruitment Cycle', alignCenter: true },
    { id: 'category', label: 'Category', alignCenter: true },
    { id: 'question_quantity', label: 'No. of Questions', alignCenter: true },
    { id: 'status', label: 'Status', alignCenter: true },
    { id: 'view_qn', label: ' ', alignCenter: true}
];

// ----------------------------------------------------------------------

export default function CycleList() {
    const theme = useTheme();
    const { user } = useAuth();
    const [cycleList, setCycleList] = useState([]);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        const initialize = async () => {
            try {
                await axios.get('https://t99hwkreli.execute-api.us-east-1.amazonaws.com/default/getRecruitmentCycles').then((res) => {
                    setCycleList(res.data)
                });
            } catch (err) {
                console.log(err);
            }
        };
        initialize();
    }, []);

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (checked) => {
        if (checked) {
            const newSelecteds = cycleList.map((n) => n.email);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };



    const handleClick = (name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (filterName) => {
        setFilterName(filterName);
        setPage(0);
    };


    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - cycleList.length) : 0;

    const filteredUsers = applySortFilter(cycleList, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && Boolean(filterName);


    return (
        <Card sx={{ height: '54vh' }}>
            <UserListToolbar
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
                onDeleteUsers={{}}
            />

            <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                        <UserListHead
                            order={order}
                            orderBy={orderBy}
                            headLabel={TABLE_HEAD}
                            rowCount={cycleList.length}
                            numSelected={selected.length}
                            onRequestSort={handleRequestSort}
                            onSelectAllClick={handleSelectAllClick}
                        />
                        <TableBody>
                            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                const { cycle_id, workyear, category, question_quantity, status } = row;
                                const isItemSelected = selected.indexOf(cycle_id) !== -1;

                                return (
                                    <TableRow
                                        hover
                                        key={cycle_id}
                                        tabIndex={-1}
                                        role="checkbox"
                                        selected={isItemSelected}
                                        aria-checked={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox checked={isItemSelected} onClick={() => handleClick(cycle_id)} />
                                        </TableCell>

                                        <TableCell align="center">{cycle_id}</TableCell>
                                        <TableCell align="center">{workyear}</TableCell>
                                        <TableCell align="center">{category}</TableCell>
                                        <TableCell align="center">{question_quantity}</TableCell>

                                        <TableCell align="center">
                                            <Label
                                                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                                color={(status === 'Completed' && 'warning') || 'success'}
                                            >
                                                {sentenceCase(status)}
                                            </Label>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button color="info" variant="contained" sx={{ p: 1 }} onClick={() => navigate(`${PATH_DASHBOARD.question.root}/${cycle_id}/list`)}>View Questions →</Button>
                                        </TableCell>
                                        {user?.is_superuser &&
                                            <TableCell align="right">
                                                <UserMoreMenu onDelete={{}} />
                                            </TableCell>}
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        {isNotFound && (
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                        <SearchNotFound searchQuery={filterName} />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
            </Scrollbar>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={cycleList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, page) => setPage(page)}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Card>
    );
}

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return array.filter((_user) => _user.cycle_id.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}
