import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
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
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
// sections
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../sections/@dashboard/user/list';
import useAuth from '../../hooks/useAuth';
import axios from '../../utils/axios';

/* eslint-disable camelcase */

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'cycleId', label: 'Recruitment Cycle', alignCenter: true },
    { id: 'title', label: 'Question Title', alignCenter: true },
    { id: 'cs_hr', label: 'Question Owner', alignCenter: true },
    { id: 'question_hash', label: 'ID', alignCenter: true },
    { id: 'select_qn', label: ' ', alignCenter: true}
];

// ----------------------------------------------------------------------

export default function ReuseList() {
    const { user } = useAuth();
    const [reuseList, setReuseList] = useState([]);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('title');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const navigate = useNavigate();

    const { id } = useParams()

    useEffect(() => {
        const initialize = async () => {
            try {
                await axios.get('https://t99hwkreli.execute-api.us-east-1.amazonaws.com/default/getAllQuestions').then((res) => {
                    setReuseList(res.data)
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
            const newSelecteds = reuseList.map((n) => n.email);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const onClick = async (question_hash, cycleId) => {
        const data = {
            "new_id": id
        }
        console.log(data)
        try {
            await axios.post(`https://t99hwkreli.execute-api.us-east-1.amazonaws.com/default/reuseQuestion/?question_hash=${question_hash}&cycle_id=${cycleId}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }});
            await axios.patch(`/question_count_update/${data.new_id}/add`);
            navigate(`${PATH_DASHBOARD.question.root}/${id}/list`);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

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

    const handleDeleteUser = async (userId) => {
        const deleteUser = reuseList.filter((user) => user.id !== userId);
        // await axios.delete(`/auth/admin/user-crud/?user_id=${userId}`).catch((err) => {console.log(err)});
        console.log("deleting data...")
        setSelected([]);
        setReuseList(deleteUser);
    };


    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - reuseList.length) : 0;

    const filteredUsers = applySortFilter(reuseList, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && Boolean(filterName);


    return (
        <Card sx={{ height: '60vh' }}>
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
                            rowCount={reuseList.length}
                            numSelected={selected.length}
                            onRequestSort={handleRequestSort}
                            onSelectAllClick={handleSelectAllClick}
                        />
                        <TableBody>
                            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                const { question_hash, title, cs_hr, cycleId } = row;
                                const isItemSelected = selected.indexOf(question_hash) !== -1;

                                return (
                                    <TableRow
                                        hover
                                        key={question_hash + cycleId}
                                        tabIndex={-1}
                                        role="checkbox"
                                        selected={isItemSelected}
                                        aria-checked={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox checked={isItemSelected} onClick={() => handleClick(question_hash)} />
                                        </TableCell>
                                        <TableCell>{cycleId}</TableCell>
                                        <TableCell>{title}</TableCell>
                                        <TableCell>{cs_hr}</TableCell>
                                        <TableCell>{question_hash}</TableCell>

                                        <TableCell align="center">
                                            <Button color="info" variant="contained" sx={{ p: 1 }} onClick={() => onClick(question_hash, cycleId)}>Reuse Question →</Button>
                                        </TableCell>
                                        {user?.is_superuser &&
                                            <TableCell align="right">
                                                <UserMoreMenu onDelete={() => handleDeleteUser(question_hash)} id={question_hash} />
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
                count={reuseList.length}
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
        return array.filter((_user) => _user.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}
