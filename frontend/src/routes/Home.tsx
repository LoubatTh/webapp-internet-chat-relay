import Header from '../components/Header'
import SidePanel from '../components/SidePanel'
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <div className="flex flex-col w-screen h-screen">
    <Header />
    <div className="flex flex-row h-[calc(100%-80px)]">
      <SidePanel />
      <div className="flex bg-background h-[calc(100%-20px)] w-full">
        <Outlet />
      </div>
    </div>
  </div>
  )
}

export default Home