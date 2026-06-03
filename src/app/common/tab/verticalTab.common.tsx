import {useState, useImperativeHandle, forwardRef, useEffect} from 'react'
import {FaChild} from 'react-icons/fa'
import {RiBankFill} from 'react-icons/ri'

import {colors} from 'src/modules'

export const VerticalTab = forwardRef(
  ({panes, onTabChange, activeUserProp}: Com.VerticalTabProps, ref) => {
    const [activeIndex, setActiveIndex] = useState<number>(0)
    const [activeTab, setActiveTab] = useState<Com.VerticalPanesProps | null>(
      null,
    )
    const [moreActiveName, setMoreActiveName] = useState('')

    useImperativeHandle(ref, () => ({
      activateIndex: (index: number) => {
        setActiveIndex(index)
      },
    }))

    useEffect(() => {
      setActiveTab(panes[activeIndex])
    }, [activeIndex, panes])

    useEffect(() => {
      onTabChange && onTabChange(activeIndex)
    }, [activeIndex, onTabChange])

    useEffect(() => {
      activeUserProp && setActiveIndex(1)
    }, [activeUserProp])

    return (
      <div className="vertical-tab">
        <div className="vertical-tab-titles">
          {panes.map(
            ({title, onClick, isFinanced, isMinor, style}, index: number) => {
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
                  className={
                    activeIndex === index ? 'tab-item active' : 'tab-item'
                  }
                  style={style}
                >
                  {title}
                  {!!isFinanced && (
                    <RiBankFill
                      style={{
                        marginLeft: 5,
                        position: 'absolute',
                        top: 10,
                        right: 10,
                      }}
                    />
                  )}
                  {!!isMinor && (
                    <FaChild
                      style={{
                        marginLeft: 5,
                        position: 'absolute',
                        top: 10,
                        right: 10,
                      }}
                      color={colors.green}
                      size={20}
                    />
                  )}
                </div>
              )
            },
          )}
        </div>
        <div className="vertical-tab-body">
          {activeTab && <div>{activeTab.render()}</div>}
        </div>
      </div>
    )
  },
)
