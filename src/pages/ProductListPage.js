import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

// @mui
import {
    Tabs,
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
    Modal,
    TextField,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import ApiClient from '../api/ApiClient';
import menuTabList from '../components/tabs';

// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import ProductListToolbar from '../sections/@dashboard/products/ProductListToolbar';

// mock
// import PRODUCTLIST from '../_mock/productlist';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'id', label: 'Product ID', alignRight: false },

    { id: 'name', label: 'Name Product', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'createAt', label: 'Create At', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: 'price', label: 'Price', alignRight: false },
    { id: '' },
];

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
        return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}
// style
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

export default function UserPage() {
    const [open, setOpen] = useState(null);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [productID, setProductID] = useState('');

    const [name, setName] = useState('');



    const [activeTab, setActiveTab] = useState('');


    // call api product
    const [products, setProducts] = useState([]);


    const getProducts = async (status) => {
        try {
            const response = await ApiClient.get('/admin/product', {
                params: {
                    page: 0,
                    pageSize: 1000,
                    orderBy: 'createdAt',
                    order: 'ASC',
                    isShowInactive: true,
                    minPrice: 0,
                    maxPrice: 0,
                    status,
                    categoryIds: 'string',
                },
            });

            const productList = response?.data?.data; // Danh sách người dùng từ API
            setProducts(productList);
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };

    //----------------------------------------------------------------

    const handleOpenMenu = (id, name) => (event) => {
        setName(name);
        setProductID(id);
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
            const newSelecteds = products.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    // ban account 
    // https://2hand.monoinfinity.net/api/v1.0/admin/product/banned/123123
    // Modal user deposit
    const [openModal, setOpenModal] = useState(false);
    const [value, setValue] = useState("");

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);


    const handleSubmit = () => {

        banProduct(productID);

        console.log("Submitted value:", value);
        // TODO: Handle submit logic here
        handleClose();
    }

    const banProduct = async (productID) => {
        try {
            const response = await ApiClient.delete(`admin/product/banned/${productID}`);

            getProducts(activeTab);

            console.log('API Response:', response.data);
        } catch (error) {
            // Xử lý error nếu có
            console.error('API Error:', error);
        }
        // Gọi API để ban account với giá trị email và userID
        // Sử dụng biến state email và userID ở đây
    };
    const handlebanProduct = () => {
        banProduct(productID);
        console.log("Banned product:", productID);

    }
    //----------------------------------------------------------------

    const handleClick = (event, name) => {
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


    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);

        // Gọi lại API và cập nhật trạng thái sản phẩm theo giá trị newValue
        getProducts(newValue);
    };

    // Gọi fetchProducts khi cần thiết trong các sự kiện khác
    const handleOtherAction = () => {
        getProducts(activeTab);
    };

    // Sử dụng useEffect để gọi fetchProducts ban đầu
    useEffect(() => {
        getProducts(activeTab);
    }, []);


    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;

    const filteredProducts = applySortFilter(products, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredProducts.length && !!filterName;

    return (
        <>
            <Helmet>
                <title> ProductList </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Product
                    </Typography>
                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                        New Product
                    </Button>
                </Stack>

                <Card>
                    <Tabs value={activeTab} onChange={handleTabChange} aria-label="Product status tabs">
                        <Tab label="ALL" value="" />
                        <Tab label="ACTIVE" value="ACTIVE" />
                        <Tab label="INACTIVE" value="INACTIVE" />
                        <Tab label="POST" value="POST" />
                        <Tab label="BANNED" value="BANNED" />
                    </Tabs>

                    <ProductListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={products.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>

                                    {filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const { id, name, user, createdAt, status, price, imageUrl } = row;
                                        const selectedUser = selected.indexOf(name) !== -1;
                                        const createdAtDate = new Date(Number(createdAt));

                                        return (
                                            <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, id)} />
                                                </TableCell>
                                                <TableCell align="left">{id}</TableCell>


                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Avatar alt={name} src={imageUrl} />
                                                        <Typography variant="subtitle2" noWrap>
                                                            {name}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">{user.email}</TableCell>


                                                <TableCell align="left">{createdAtDate.toLocaleString()}</TableCell>

                                                <TableCell align="left">
                                                    <Label color={(status === 'sold' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                                                </TableCell>
                                                <TableCell align="left">{price}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton size="large" color="inherit" onClick={handleOpenMenu(id, name)}>
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
                        count={products.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>

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
                <MenuItem>
                    <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                    Edit
                </MenuItem>

                {/* <MenuItem onClick={handlebanProduct} sx={{ color: 'error.main' }}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                    Ban
                </MenuItem> */}


                <MenuItem onClick={handleOpen} sx={{ color: 'error.main' }}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                    Ban
                </MenuItem>
                <Modal
                    open={openModal}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Bạn có chắc chắn muốn BAN sản phẩm: {name}
                        </Typography>
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
            </Popover>
        </>
    );
}
