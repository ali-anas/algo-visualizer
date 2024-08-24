import React from 'react';
import { Toaster } from 'sonner';
import MainLayout from '../layouts/MainLayout'

const Home = () => {
  return (
    <>
      <Toaster richColors position='top-center' duration={3000} />
      <MainLayout />
    </>
  )
}

export default Home