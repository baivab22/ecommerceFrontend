import {useState, useImperativeHandle, forwardRef, useEffect} from 'react'

import {BsThreeDotsVertical} from 'react-icons/bs'
import {Box, Dropdown, Menu} from '..'

export const Tab = forwardRef(
  (
    {
      initialIndex,
      panes,
      onTabChange,
      activeUserProp,
      rightComponent,
      tabLimit = 5,
      gotoFirst,
      showIndicator,
      titleContentGap,
    }: Com.TabProps,
    ref,
  ) => {
    const [activeIndex, setActiveIndex] = useState(() =>
      initialIndex ? +initialIndex : 0,
    )

    const [activeTab, setActiveTab] = useState<Com.PanesProps | null>(null)
    const [moreActiveName, setMoreActiveName] = useState('')

    useEffect(() => {
      gotoFirst &&
        gotoFirst(() => {
          setActiveIndex(() => (initialIndex ? +initialIndex : 0))
        })
    }, [gotoFirst])

    useImperativeHandle(ref, () => ({
      activateIndex: (index: number) => {
        setActiveIndex(index)
      },
    }))

    useEffect(() => {
      setActiveTab(panes[activeIndex])
    }, [activeIndex, panes, initialIndex])

    useEffect(() => {
      onTabChange && onTabChange(activeIndex)
    }, [activeIndex, onTabChange])

    useEffect(() => {
      activeUserProp && setActiveIndex(1)
    }, [activeUserProp])

    const getSubmitedStatus = (color?: Com.PanesProps['submittedStatus']) => {
      switch (color) {
        case 'red':
          return 'notsubmitted'
        case 'green':
          return 'submitted'
        case 'orange':
          return 'cantbeentered'
        case 'yellow':
          return 'tempsubmitted'

        default:
          return ''
      }
    }

    return (
      <div className="tab" style={{gap: titleContentGap}}>
        <div className="tab-title">
          <div className="tab-title-left">
            {panes
              .slice(0, tabLimit)
              .map(
                (
                  {title, onClick, submittedStatus, badge, style},
                  index: number,
                ) => {
                  return (
                    <div
                      key={index}
                      onClick={
                        onClick
                          ? () => {
                              onClick(activeIndex)
                            }
                          : () => {
                              setActiveIndex(index)
                              setMoreActiveName('')
                            }
                      }
                      className={`tab-item ${
                        activeIndex === index ? 'active' : ''
                      } ${
                        showIndicator ? getSubmitedStatus(submittedStatus) : ''
                      }`}
                      style={style}
                    >
                      {title}
                      {(showIndicator || badge) && (
                        <div
                          className={`tab-item-indicator${
                            badge ? '-badge' : ''
                          } ${submittedStatus}`}
                        >
                          {badge}
                        </div>
                      )}
                    </div>
                  )
                },
              )}
            {panes?.length > tabLimit ? (
              <Dropdown
                placement="bottomleft"
                style={{
                  top: 0,
                }}
                inDismiss
                trigger={() => (
                  <Box flexBox alCenter style={{cursor: 'pointer'}}>
                    {moreActiveName ? (
                      <div
                        className={'tab-item active'}
                        style={{marginRight: -10}}
                      >{`${moreActiveName}`}</div>
                    ) : (
                      <></>
                    )}
                    <BsThreeDotsVertical
                      style={{position: 'relative', top: 2}}
                    />
                  </Box>
                )}
              >
                <Menu.Container>
                  {panes.slice(tabLimit).map(({title, onClick}, index) => {
                    return (
                      <div key={index}>
                        <Menu.Item
                          onClick={
                            onClick
                              ? () => {
                                  onClick(activeIndex)
                                }
                              : () => {
                                  setActiveIndex(index + tabLimit)
                                  setMoreActiveName(title)
                                }
                          }
                          style={{
                            backgroundColor:
                              activeIndex === index + tabLimit
                                ? '#297fd6'
                                : 'white',
                            color:
                              activeIndex === index + tabLimit
                                ? 'white'
                                : '#353535',
                            width: '100%',
                            textAlign: 'left',
                          }}
                          className="menuItem"
                        >
                          {title}
                        </Menu.Item>
                        <Menu.Separator />
                      </div>
                    )
                  })}
                </Menu.Container>
              </Dropdown>
            ) : null}
          </div>
          {rightComponent && (
            <div className="tab-title-right">{rightComponent}</div>
          )}
        </div>
        {activeTab && <div className="tab-content">{activeTab?.render()}</div>}
      </div>
    )
  },
)
