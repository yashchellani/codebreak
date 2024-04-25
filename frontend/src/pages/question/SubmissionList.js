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
import LoadingScreen from '../../components/LoadingScreen';
import useAuth from '../../hooks/useAuth';
import axios from '../../utils/axios';

/* eslint-disable camelcase */

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'first_name', label: 'First Name', alignRight: false },
  { id: 'last_name', label: 'Last Name', alignRight: false },
  { id: 'birth_date', label: 'Birth Date', alignRight: false },
  // { id: 'similarity_score', label: 'Similarity Score', alignRight: false },
  { id: 'view_qn', label: ' ', alignCenter: true}
]
// ----------------------------------------------------------------------

export default function UserList() {
  const { user } = useAuth();
  const [isLoading, setLoading] = useState(false);
  const [submissionList, setSubmissionList] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { cycleId, id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const initialize = async () => {
      try {
        await axios.get(`https://t99hwkreli.execute-api.us-east-1.amazonaws.com/default/getSubmissionMetadata/?question_hash=${id}`).then((res) => {
          setLoading(false);
          setSubmissionList(res.data)
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
      const newSelecteds = submissionList.map((n) => n.email);
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


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - submissionList.length) : 0;

  const filteredUsers = applySortFilter(submissionList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && Boolean(filterName);

    if (isLoading) {
      return <LoadingScreen />;
    }

  return (
    <Card>
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
              rowCount={submissionList.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                const { account_id, first_name, last_name, email, birth_date, similarity_score } = row;
                const isItemSelected = selected.indexOf(account_id) !== -1;

                return (
                  <TableRow
                    hover
                    key={account_id}
                    tabIndex={-1}
                    role="checkbox"
                    selected={isItemSelected}
                    aria-checked={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} onClick={() => handleClick(account_id)} />
                    </TableCell>

                    <TableCell align="left">{email}</TableCell>
                    <TableCell align="left">{first_name}</TableCell>
                    <TableCell align="left">{last_name}</TableCell>
                    <TableCell align="left">{birth_date}</TableCell>
                    {/* <TableCell align="left">{similarity_score}</TableCell> */}
                    <TableCell align="center">
                      <Button color="info" variant="contained" onClick={() => navigate(`${PATH_DASHBOARD.question.root}/${cycleId}/${id}/${account_id}/view`)}>View Submission →</Button>
                    </TableCell>
                    {user?.is_superuser &&
                      <TableCell align="right">
                        <UserMoreMenu onDelete={{}} id={account_id} />
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
        count={submissionList.length}
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
    return array.filter((_user) => _user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
