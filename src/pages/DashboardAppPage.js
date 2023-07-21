import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import { useEffect, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import ApiClient from '../api/ApiClient';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const [countProducts, setCountProducts] = useState("")
  const [countSoldProducts, setSoldCountProducts] = useState("")
  const [countUsers, setCountUsers] = useState("");
  const [boostRankReport, setBoostRankReport] = useState("");

  console.log("boot rank", boostRankReport)
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await ApiClient.get('/admin/product', {
          params: {
            page: 0,
            pageSize: 5,
            orderBy: 'createdAt',
            order: 'ASC',
            isShowInactive: true,
            minPrice: 0,
            maxPrice: 0,
            categoryIds: 'string',
          },
        });
        const countProduct = response?.data; // Danh sách người dùng từ API
        setCountProducts(countProduct);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };
    getProducts();

    const getUsers = async () => {
      try {
        const response = await ApiClient.get('/admin/users', {
          params: {
            isShowInactive: true,
          },
        });
        const countUser = response?.data?.count; // Danh sách người dùng từ API
        setCountUsers(countUser);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    getUsers(); // Gọi API khi component được render lần đầu tiên

    const getItemSoldProducts = async () => {
      try {
        const response = await ApiClient.get('/admin/product', {
          params: {
            isShowInactive: true,
            status: "ACTIVE"
          },
        });
        const countSoldProduct = response?.data?.count; // Danh sách người dùng từ API
        setSoldCountProducts(countSoldProduct);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };
    getItemSoldProducts();


    const getBoostRankReport = async () => {
      try {

        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        const endDay = `${year}-${month}-${day}`;
        const response = await ApiClient.post('/wallet/boost-rank-report',
          {
            startDate: '2023-04-19',
            endDate: endDay,
          }
        );
        if (response.data) {
          setBoostRankReport(response?.data);
        } else {
          console.error('Dữ liệu từ API không tồn tại');
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };
    getBoostRankReport();
  }, []);





  return (
    <>
      <Helmet>
        <title> Dashboard  </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Weekly Post" total={countProducts?.count} icon={'ant-design:calendar-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="New Users" total={countUsers} color="info" icon={'ant-design:apple-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Access Times" total={1253} color="warning" icon={'ant-design:windows-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Item Sold" total={countSoldProducts} color="error" icon={'ant-design:bug-filled'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {boostRankReport && boostRankReport.package1 && boostRankReport.package2 && boostRankReport.package3 ? (
              <AppCurrentVisits
                title="The Number Of Use Push Posts"
                chartData={[
                  { label: '1 day', value: boostRankReport.package1 },
                  { label: '3 days', value: boostRankReport.package2 },
                  { label: '7 days', value: boostRankReport.package3 },
                ]}
                chartColors={[
                  theme.palette.primary.main,
                  // theme.palette.info.main,
                  theme.palette.success.main,
                  theme.palette.error.main,
                ]}
              />
            ) : (
              <p>Loading...</p> // Hoặc thông báo khác nếu không có dữ liệu
            )}
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            {countProducts?.data && countProducts.data.length > 0 ? (
              <AppNewsUpdate
                title="News Update"
                list={countProducts.data.map((product) => ({
                  id: product.id,
                  title: product.name.charAt(0).toUpperCase() + product.name.slice(1),
                  description: product.description,
                  image: product.imageUrls[0],
                  postedAt: faker.date.recent(),
                }))}
              />
            ) : null}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 1213,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Instagram',
                  value: 427,
                  icon: <Iconify icon={'skill-icons:instagram'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Tiktok',
                  value: 1532,
                  icon: <Iconify icon={'logos:tiktok-icon'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 0,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
