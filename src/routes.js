import { Navigate, Route, Router, Routes, useRoutes } from 'react-router-dom';
import { RequireAuth, useIsAuthenticated } from 'react-auth-kit'

// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import ProductListPage from './pages/ProductListPage';
import DashboardAppPage from './pages/DashboardAppPage';
import WalletPage from './pages/WalletPage';


// ----------------------------------------------------------------------

// export default function Router() {

//   const routes = useRoutes([
//     {
//       path: '/dashboard',
//       element:
//         <RequireAuth loginPath="/login">
//           <DashboardLayout />
//         </RequireAuth>,
//       children: [
//         { element: <Navigate to="/dashboard/app" />, index: true },
//         { path: 'app', element: <DashboardAppPage /> },
//         { path: 'user', element: <UserPage /> },
//         { path: 'products', element: <ProductsPage /> },
//         { path: 'productlist', element: <ProductListPage /> },
//         { path: 'blog', element: <BlogPage /> },
//         { path: 'wallet', element: <WalletPage /> },
//       ],
//     },
//     {
//       path: 'login',
//       element: <LoginPage />,
//     },
//     {
//       element: <SimpleLayout />,
//       children: [
//         { element: <Navigate to="/login" />, index: true },
//         { path: '404', element: <Page404 /> },
//         { path: '*', element: <Navigate to="/404" /> },
//       ],
//     },
//     {
//       path: '*',
//       element: <Navigate to="/404" replace />,
//     },
//   ]);

//   return routes;
// }


// Import các component của bạn



export default function routes() {

  return (
    <Routes>
      <Route path="/dashboard" element={<RequireAuth loginPath="/login"><DashboardLayout /></RequireAuth>}>
        <Route index element={<Navigate to="/dashboard/app" replace />} />
        <Route path="app" element={<DashboardAppPage />} />
        <Route path="user" element={<UserPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="productlist" element={<ProductListPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="wallet" element={<WalletPage />} />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route element={<SimpleLayout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="404" element={<Page404 />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
