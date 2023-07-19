import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import { Container, Stack, Typography } from '@mui/material';
// components
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
// mock
import PRODUCTS from '../_mock/products';
import ApiClient from '../api/ApiClient';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };
  const [products, setProducts] = useState([]);
  const getProducts = async (status) => {
    try {
      const response = await ApiClient.get('/admin/product', {
        params: {
          page: 0,
          pageSize: 20,
          orderBy: 'createdAt',
          order: 'ASC',
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
  getProducts();


  return (
    <>
      <Helmet>
        <title> Dashboard: Products | Minimal UI </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Products
        </Typography>

        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList products={products} />
        <ProductCartWidget />
      </Container>
    </>
  );
}
