import React, {useState} from 'react'
import {FaMinus, FaPlus} from 'react-icons/fa'
import {RiArrowDropDownLine} from 'react-icons/ri'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {HStack} from 'src/app/common'
import Theme from 'src/theme'
import styled from 'styled-components'

const SidebarLink = styled.div`
  display: flex;
  color: #e1e9fc;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 60px;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    background: rgb(112 46 111);
    border-left: 4px solid #632ce4;
    cursor: pointer;
  }
`

const SidebarLabel = styled.span`
  margin-left: 16px;
  width: auto;
`

const DropdownLink = styled.a`
  background: rgb(87 4 86);
  height: 60px;
  padding-left: 3.5rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f5f5f5;
  font-size: 18px;

  &:hover {
    background: #632ce4;
    cursor: pointer;
  }
`

const DrawerMenu = ({item, handleClose}) => {
  const [subnav, setSubnav] = useState(false)

  const showSubnav = () => setSubnav(!subnav)
  const router = useRouter()

  console.log(showSubnav, 'showsubnav')

  return (
    <>
      <SidebarLink onClick={item.subNav && showSubnav}>
        <HStack
          gap="$3"
          align="center"
          justify="space-between"
          style={{
            width: '100%',
            borderBottom: '2px solid white',
            paddingBottom: '8px'
          }}
        >
          {/* {item?.icon} */}

          <SidebarLabel
            onClick={() => {
              handleClose()
              router.push(`/products?categoryId=${item.id}&categoryname=${item.title}`)
              // dispatch(
              //   getProductListAction({
              //     onSuccess: () => {},
              //     query: {
              //       categoryId: menu.id
              //     }
              //   })
              // )
            }}
          >
            {item.title}
          </SidebarLabel>

          {item?.subNav && subnav ? (
            <FaMinus size={18} />
          ) : (
            <FaPlus size={18}></FaPlus>
          )}
        </HStack>
        <div>
          {item.subNav && subnav
            ? item?.iconOpened
            : item?.subNav
            ? item?.iconClosed
            : null}
        </div>
      </SidebarLink>
      {subnav &&
        item?.subNav?.map((item, index) => {
          console.log('subnav', item)
          return (
            <Link href={`/products?subCategoryId=${item.id}`} key={index} legacyBehavior>
              <DropdownLink
                onClick={() => {
                  handleClose()
                }}
              >
                {item?.icon}
                <SidebarLabel>{item.title}</SidebarLabel>
              </DropdownLink>
            </Link>
          )
        })}
    </>
  )
}

export default DrawerMenu
