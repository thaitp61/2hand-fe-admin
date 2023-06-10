import React, { useEffect, useState } from 'react';


import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';


// @mui
import {
    Card,
    Table,
    Stack,
    Paper,
    Avatar,
    Button,
    Popover,
    Checkbox,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,
    Container,
    Typography,
    IconButton,
    TableContainer,
    TablePagination,
    Box,
    Modal,
    TextField,
} from '@mui/material';

// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import ApiClient from '../api/ApiClient';

// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
// import WALLETLIST from '../_mock/wallet';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'userID', label: 'User ID', alignRight: false },
    // { id: 'address', label: 'Address', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'create_at', label: 'Create At', alignRight: false },
    { id: 'coin', label: 'Coin', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    // { id: 'Phone', label: 'Phone', alignRight: false },

    { id: '' },
];

// ----------------------------------------------------------------------
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

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
        return filter(array, (_user) => _user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function WalletPage() {
    const [open, setOpen] = useState(null);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('email');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);


    // call api list transaction

    const [transactions, setTransactions] = useState([]);


    useEffect(() => {
        const getTransactions = async () => {
            try {
                const response = await ApiClient.get('admin/wallet/transaction', {
                    params: {
                        page: 0,
                        pageSize: 1000,
                        orderBy: 'createdAt',
                        order: 'ASC',
                        isShowInactive: true,
                        status: 'SUCCESS'
                    },
                });

                const transactionList = response?.data?.data; // Danh sách người dùng từ API
                setTransactions(transactionList);
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
            }
        };

        getTransactions();
    }, []);

    // ----------------------------------------------------------------

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = transactions.map((n) => n.email);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, email) => {
        const selectedIndex = selected.indexOf(email);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, email);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - transactions.length) : 0;

    const filteredUsers = applySortFilter(transactions, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;
    // Modal user add coint
    const [openModal, setOpenModal] = React.useState(false);
    const [value, setValue] = React.useState("");

    const [userID, setUserID] = useState("");

    const addCoin = async (userID, value) => {
        try {
            const response = await ApiClient.post(`admin/wallet/user/${userID}/deposit`, {
                amount: value.toString()
            });
            // Xử lý response từ API nếu cần
            console.log('API Response:', response.data);
        } catch (error) {
            // Xử lý error nếu có
            console.error('API Error:', error);
        }
    };

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);
    const handleChange = (event) => {
        setValue(event.target.value);
    }
    const handleChangeuserID = (event) => {
        setUserID(event.target.value);
    }
    const handleSubmit = () => {

        addCoin(userID, value);

        console.log("Submitted value:", value);
        console.log("Submitted value:", userID);

        // TODO: Handle submit logic here
        handleClose();
    }

    return (
        <>

            <Helmet>
                <title> Wallet</title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        History deposit
                    </Typography>
                    <Button onClick={handleOpen} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                        Add coin
                    </Button>
                    <Modal
                        open={openModal}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Nhập UserID:
                            </Typography>

                            <TextField
                                id="outlined-basic"
                                label="Enter userID"
                                variant="outlined"
                                value={userID}
                                onChange={handleChangeuserID}
                                sx={{ mt: 2, width: '100%' }}
                            />
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Nhập số tiền muốn nạp cho tài khoản
                            </Typography>

                            <TextField
                                id="outlined-basic"
                                label="Enter value"
                                variant="outlined"
                                value={value}
                                onChange={handleChange}
                                sx={{ mt: 2, width: '100%' }}
                            />

                            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                <Button onClick={handleClose} sx={{ mr: 2 }}>
                                    Đóng
                                </Button>

                                <Button onClick={handleSubmit} variant="contained">
                                    Xác nhận
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                </Stack>
            </Container>
            <Card>
                <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <UserListHead
                                order={order}
                                orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={transactions.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const { id, createdAt, status, avatarUrl, wallet, amount } = row;
                                    const selectedUser = selected.indexOf(userID) !== -1;
                                    const createdAtDate = new Date(Number(createdAt));

                                    return (
                                        <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, id)} />
                                            </TableCell>

                                            <TableCell component="th" scope="row" padding="none">
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    <Avatar alt={id} src={avatarUrl} />
                                                    <Typography variant="subtitle2" noWrap>
                                                        {wallet.user.id}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>

                                            <TableCell align="left">{wallet.user.email}</TableCell>

                                            <TableCell align="left">{createdAtDate.toLocaleString()}</TableCell>

                                            <TableCell align="left">+{amount}</TableCell>


                                            {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}

                                            <TableCell align="left">
                                                <Label color={(status === 'pending' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                                            </TableCell>

                                            <TableCell align="right">
                                                <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                                                    <Iconify icon={'eva:more-vertical-fill'} />
                                                </IconButton>
                                            </TableCell>
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
                                            <Paper
                                                sx={{
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <Typography variant="h6" paragraph>
                                                    Not found
                                                </Typography>

                                                <Typography variant="body2">
                                                    No results found for &nbsp;
                                                    <strong>&quot;{filterName}&quot;</strong>.
                                                    <br /> Try checking for typos or using complete words.
                                                </Typography>
                                            </Paper>
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
                    count={transactions.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        p: 1,
                        width: 140,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <MenuItem onClick={handleOpen}>
                    <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                    Deposit
                </MenuItem>
                <Modal
                    open={openModal}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Nhập số tiền muốn nạp cho tài khoản:{filteredUsers.email}
                        </Typography>

                        <TextField
                            id="outlined-basic"
                            label="Enter value"
                            variant="outlined"
                            value={value}
                            onChange={handleChange}
                            sx={{ mt: 3, width: '100%' }}
                        />

                        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                            <Button onClick={handleClose} sx={{ mr: 2 }}>
                                Đóng
                            </Button>

                            <Button onClick={handleSubmit} variant="contained">
                                Xác nhận
                            </Button>
                        </Box>
                    </Box>
                </Modal>

                <MenuItem sx={{ color: 'error.main' }}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                    Ban
                </MenuItem>
            </Popover>
        </>
    );
}
