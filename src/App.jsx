import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './page/Home'
import Login from './page/Login'
import AdminManage from './page/AdminManage'
import CreateAccount from './page/CreateAccount'
import AccountManage from './page/AccountManage'
import CustomerManage from './page/CustomerManage'
import ServiceManage from './page/ServiceManage'
import BlogManage from './page/BlogManage'
import BlogEdit from './page/BlogEdit'
import NewBlog from './page/NewBlog'
import { GoogleOAuthProvider } from '@react-oauth/google';

const App = () => {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-manage" element={<AdminManage />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/account-manage" element={<AccountManage />} />
      <Route path="/customer-manage" element={<CustomerManage />} />
      <Route path="/service-manage" element={<ServiceManage />} />
      <Route path="/blog-manage" element={<BlogManage />} />
      <Route path="/blog-edit" element={<BlogEdit />} />
      <Route path="/new-blog" element={<NewBlog />} />
    </Routes>
</GoogleOAuthProvider>
  )
}

export default App