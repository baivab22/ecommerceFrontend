import styled from 'styled-components'
import {
  styled as materialStyled,
  TableCell,
  TableRow,
  tableCellClasses
} from '@mui/material'

import Theme from 'src/theme'

export const StyledTableRow = materialStyled(TableRow)(({theme}) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected
  }
}))

export const StyledTableCell = materialStyled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    fontWeight: 'bold',
    paddingTop: 12,
    paddingBottom: 12,
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: '#f5f5f5'
  },
  [`&.${tableCellClasses.body}`]: {
    paddingTop: 12,
    paddingBottom: 12
  }
}))

export const ActionButton = styled.div`
  cursor: pointer;
  color: ${Theme.colors.$gray700};
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${Theme.radius.$default};
  transition: color 0.2s, background-color 0.2s;

  &:hover {
    color: ${Theme.colors.$gray800};
    background-color: ${Theme.colors.$white};
  }

  &:active {
    background-color: #ffffff;
  }

  &.action-delete {
    color: ${Theme.colors.$error};
  }
`
