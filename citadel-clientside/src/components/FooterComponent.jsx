import { Footer } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

const FooterComponent = () => {
  return (
    <Footer container className=' border border-t-8 border-teal-500'>
      <div className=" max-w-7xl mx-auto w-full">
        <div className=" w-full grid justify-between sm:flex md:grid-cols-1">
          <div className=" w-[50px]">
            <Link className=" flex flex-col items-center">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP9AonzRpCljbE5zQq1CCKFm-lKlMlvDkZjBlvA74cEA&s" alt="logo" className=' w-9 h-9 rounded-full self-center' />
              <p className=' text-[10px] font-bold mt-1'>CITADEL</p>
            </Link>
          </div>
          <div className=" grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title='About' />
              <Footer.LinkGroup col>
                <Footer.Link href='/about' rel='noopener noreferrer' target='_blank'>
                  Our App
                </Footer.Link>
              </Footer.LinkGroup>
              <Footer.LinkGroup col>
                <Footer.Link href='/about' rel='noopener noreferrer' target='_blank'>
                  Services
                </Footer.Link>
              </Footer.LinkGroup>

            </div>
            <div>
              <Footer.Title title='Activites' />
              <Footer.LinkGroup col>
                <Footer.Link href='/activities'>
                  Upcomings
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Legal' />
              <Footer.LinkGroup col>
                <Footer.Link href='#'>
                  Privacy
                </Footer.Link>
              </Footer.LinkGroup>
              <Footer.LinkGroup col>
                <Footer.Link href='#'>
                  Terms and Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className=" w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href='#' by="IDK Team" year={new Date().getFullYear()} />
          <p className=' mt-4 sm:mt-0 text-[12px] font-bold text-gray-700'>NO FAILURE, NO DEFEAT</p>
        </div>
      </div>
    </Footer>
  )
}

export default FooterComponent