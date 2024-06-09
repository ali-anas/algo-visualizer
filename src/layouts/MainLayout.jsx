import React from 'react'
import Grid from '../components/Grid/Grid';
import Controller from '../components/controller/controller';
import Header from '../components/Header';

const MainLayout = () => {
  return (
    <>
      <Header />
      <Controller />
      <Grid />
    </>
  )
}

export default MainLayout