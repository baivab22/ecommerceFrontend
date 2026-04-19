import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {useAuth} from '../routing'
import {getCookie} from 'src/helpers'
import {BASE_URL} from 'src/config'
import {getNprPrice} from 'src/helpers/nprPrice.helper'

export const MyProfile = () => {
  const {loginData} = useAuth()
  const userId = getCookie('userId')
  const userNameFromCookie = String(getCookie('userName') || '').trim()

  const isValidDisplayName = (value: any) => {
    const safe = String(value || '').trim()
    if (!safe) return false
    if (safe.toLowerCase() === 'undefined undefined') return false
    if (safe.toLowerCase() === 'undefined') return false
    if (safe.toLowerCase() === 'null') return false
    return true
  }

  const pickFirstValidText = (...values: any[]) => {
    for (const value of values) {
      const safe = String(value || '').trim()
      if (isValidDisplayName(safe)) return safe
    }
    return ''
  }

  const toSafeList = (value: any): any[] => {
    if (Array.isArray(value)) return value
    if (value && typeof value === 'object') return Object.values(value)
    return []
  }

  const takeFirst = (value: any, count: number): any[] => {
    const list = toSafeList(value)
    const max = Math.max(0, Number(count || 0))
    const result: any[] = []
    for (let i = 0; i < list.length && i < max; i += 1) {
      result.push(list[i])
    }
    return result
  }

  const [orders, setOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false)
  const [trackingOrder, setTrackingOrder] = useState<any | null>(null)
  const [trackingLoading, setTrackingLoading] = useState<boolean>(false)
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null)

  const fetchMyOrders = useCallback(async () => {
    if (!userId) return
    setLoadingOrders(true)
    try {
      const response = await fetch(`${BASE_URL}/order/user/${userId}?includeNcm=true`)
      const json = await response.json()
      if (!response.ok) {
        throw new Error(json?.error || 'Failed to fetch orders')
      }
      setOrders(Array.isArray(json?.orders) ? json.orders : [])
    } catch (_error) {
      setOrders([])
    } finally {
      setLoadingOrders(false)
    }
  }, [userId])

  useEffect(() => {
    fetchMyOrders()
  }, [fetchMyOrders])

  useEffect(() => {
    const poll = setInterval(() => {
      fetchMyOrders()
    }, 45 * 1000)
    return () => clearInterval(poll)
  }, [fetchMyOrders])

  const openTracking = useCallback(async (orderId: string) => {
    setActiveTrackingOrderId(orderId)
    setTrackingLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/order/${orderId}/tracking`)
      const json = await response.json()
      if (!response.ok) {
        throw new Error(json?.error || 'Failed to fetch tracking details')
      }
      setTrackingOrder(json)
    } catch (_error) {
      setTrackingOrder({
        order: null,
        ncm: {details: null, statuses: [], comments: []},
      })
    } finally {
      setTrackingLoading(false)
    }
  }, [])

  const latestOrders = useMemo(() => takeFirst(orders, 10), [orders])

  const derivedOrderUser = useMemo(() => {
    for (const item of latestOrders) {
      const user = item?.userId
      if (!user || typeof user !== 'object') continue

      const candidateName = pickFirstValidText(user?.name, user?.fullName, user?.fullname)
      const candidateEmail = String(user?.email || '').trim()

      if (candidateName || candidateEmail) {
        return {
          name: candidateName,
          email: candidateEmail,
        }
      }
    }

    return {name: '', email: ''}
  }, [latestOrders])

  const profileData = {
    name:
      pickFirstValidText(
        loginData?.user?.name,
        loginData?.name,
        userNameFromCookie,
        derivedOrderUser?.name
      ) || 'Not set',
    email: String(loginData?.user?.email || loginData?.email || derivedOrderUser?.email || 'user123@gmail.com').trim(),
    role: loginData?.userRoles || 'User'
  }

  const formatDateTime = (value: any) => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return String(value)
    return date.toLocaleString()
  }

  const getStatusTone = (status: string) => {
    const normalized = String(status || '').toLowerCase()
    if (normalized.includes('delivered')) {
      return {
        backgroundColor: '#dcfce7',
        color: '#166534',
        border: '1px solid #86efac',
      }
    }
    if (normalized.includes('cancel') || normalized.includes('return') || normalized.includes('failed')) {
      return {
        backgroundColor: '#fee2e2',
        color: '#b91c1c',
        border: '1px solid #fecaca',
      }
    }
    if (normalized.includes('transit') || normalized.includes('dispatch') || normalized.includes('pickup')) {
      return {
        backgroundColor: '#dbeafe',
        color: '#1d4ed8',
        border: '1px solid #bfdbfe',
      }
    }
    return {
      backgroundColor: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fde68a',
    }
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.avatarCircle}>
              <svg style={styles.avatarIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h1 style={styles.headerName}>{profileData.name}</h1>
            <p style={styles.headerRole}>{profileData.role}</p>
          </div>

          <div style={styles.detailsSection}>
            <h2 style={styles.sectionTitle}>Profile Information</h2>

            <div style={styles.fieldContainer}>
              <label style={styles.fieldLabel}>Full Name</label>
              <p style={styles.fieldValue}>{profileData.name}</p>
            </div>

            <div style={styles.fieldContainer}>
              <label style={styles.fieldLabel}>Email Address</label>
              <p style={styles.fieldValue}>{profileData.email}</p>
            </div>

            <div style={styles.fieldContainerLast}>
              <label style={styles.fieldLabel}>User Role</label>
              <span style={styles.roleBadge}>{profileData.role}</span>
            </div>
          </div>

          <div style={styles.orderSection}>
            <div style={styles.orderSectionHeader}>
              <h3 style={styles.orderSectionTitle}>My Orders & Delivery Status</h3>
              <button style={styles.refreshBtn} onClick={fetchMyOrders} disabled={loadingOrders}>
                {loadingOrders ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {loadingOrders ? (
              <div style={styles.infoText}>Loading orders...</div>
            ) : latestOrders.length === 0 ? (
              <div style={styles.infoText}>No orders found.</div>
            ) : (
              <div style={styles.orderList}>
                {latestOrders.map((order) => {
                  const latestNcmStatus =
                    order?.ncmLiveStatus?.status ||
                    order?.ncmLastStatus ||
                    (order?.isConfirmed ? 'Confirmed' : 'Pending Confirmation')
                  const statusTone = getStatusTone(latestNcmStatus)
                  return (
                    <div key={order._id} style={styles.orderRow}>
                      <div style={styles.orderLeft}>
                        <div style={styles.orderId}>{order.productOrderId || order._id}</div>
                        <div style={styles.orderGrid}>
                          <div style={styles.metaBlock}>
                            <div style={styles.metaLabel}>Reference</div>
                            <div style={styles.metaValue}>{order.productOrderId || order.ncmVendorRefId || '-'}</div>
                          </div>
                          <div style={styles.metaBlock}>
                            <div style={styles.metaLabel}>Tracking ID</div>
                            <div style={styles.metaValue}>{order.ncmOrderId || '-'}</div>
                          </div>
                          <div style={styles.metaBlock}>
                            <div style={styles.metaLabel}>Ordered At</div>
                            <div style={styles.metaValue}>{order.OrderedAt || '-'}</div>
                          </div>
                          <div style={styles.metaBlock}>
                            <div style={styles.metaLabel}>Total</div>
                            <div style={styles.orderAmount}>{getNprPrice(order.totalAmount || 0)}</div>
                          </div>
                        </div>
                      </div>
                      <div style={styles.orderRight}>
                        <span style={{...styles.statusPill, ...statusTone}}>{latestNcmStatus}</span>
                        <button style={styles.trackBtn} onClick={() => openTracking(order._id)}>
                          View Tracking
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {trackingOrder && (
        <div style={styles.modalOverlay} onClick={() => setTrackingOrder(null)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={{margin: 0}}>Order Tracking</h3>
              <div style={styles.modalActions}>
                <button
                  style={styles.refreshTrackingBtn}
                  onClick={() => activeTrackingOrderId && openTracking(activeTrackingOrderId)}
                  disabled={trackingLoading || !activeTrackingOrderId}
                >
                  {trackingLoading ? 'Refreshing...' : 'Refresh'}
                </button>
                <button style={styles.closeBtn} onClick={() => setTrackingOrder(null)}>×</button>
              </div>
            </div>

            {trackingLoading ? (
              <div style={styles.infoText}>Loading tracking...</div>
            ) : (
              <>
                <div style={styles.trackingSummaryCard}>
                  <div style={styles.summaryItem}>
                    <div style={styles.metaLabel}>Order</div>
                    <div style={styles.summaryValue}>{trackingOrder?.order?.productOrderId || trackingOrder?.order?._id || 'N/A'}</div>
                  </div>
                  <div style={styles.summaryItem}>
                    <div style={styles.metaLabel}>Tracking ID</div>
                    <div style={styles.summaryValue}>{trackingOrder?.ncm?.summary?.ncmOrderId || trackingOrder?.order?.ncmOrderId || '-'}</div>
                  </div>
                  <div style={styles.summaryItem}>
                    <div style={styles.metaLabel}>Total</div>
                    <div style={styles.summaryValue}>{getNprPrice(trackingOrder?.order?.totalAmount || 0)}</div>
                  </div>
                  <div style={styles.summaryItem}>
                    <div style={styles.metaLabel}>Pickup Created</div>
                    <div style={styles.summaryValue}>{formatDateTime(trackingOrder?.ncm?.summary?.pickupCreatedAt || trackingOrder?.order?.ncmPickupCreatedAt)}</div>
                  </div>
                  <div style={styles.summaryItem}>
                    <div style={styles.metaLabel}>Destination Branch</div>
                    <div style={styles.summaryValue}>{trackingOrder?.ncm?.summary?.destinationBranch || trackingOrder?.order?.ncmDestinationBranch || '-'}</div>
                  </div>
                </div>

                <div style={styles.quickFactsRow}>
                  <div style={styles.factPill}>Pickup: {trackingOrder?.ncm?.summary?.pickupCompleted ? 'Completed' : 'Pending'}</div>
                  <div style={styles.factPill}>Delivered: {trackingOrder?.ncm?.summary?.delivered ? 'Yes' : 'No'}</div>
                </div>

                {(trackingOrder?.order?.latitude && trackingOrder?.order?.longitude) && (
                  <a
                    href={`https://www.google.com/maps?q=${trackingOrder.order.latitude},${trackingOrder.order.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.mapLink}
                  >
                    Open delivery location in Google Maps
                  </a>
                )}

                <div style={styles.blockTitle}>Latest Delivery Status</div>
                <div style={styles.timelineList}>
                  {takeFirst(trackingOrder?.ncm?.statuses, 5).map((item: any, index: number) => (
                    <div key={index} style={styles.timelineItem}>
                      <div style={styles.timelineTopRow}>
                        <div style={{...styles.timelineStatus, ...getStatusTone(item?.status || 'Unknown')}}>{item?.status || 'Unknown'}</div>
                      </div>
                      <div style={styles.timelineTime}>{item?.added_time || '-'}</div>
                    </div>
                  ))}
                  {toSafeList(trackingOrder?.ncm?.statuses).length === 0 && (
                    <div style={styles.infoText}>No live delivery timeline yet.</div>
                  )}
                </div>

                <div style={styles.blockTitle}>Latest Comments</div>
                <div style={styles.timelineList}>
                  {takeFirst(trackingOrder?.ncm?.comments, 4).map((item: any, index: number) => (
                    <div key={index} style={styles.timelineItem}>
                      <div style={styles.timelineStatus}>{item?.comments || '-'}</div>
                      <div style={styles.timelineTime}>{item?.addedBy || 'NCM'} • {item?.added_time || '-'}</div>
                    </div>
                  ))}
                  {toSafeList(trackingOrder?.ncm?.comments).length === 0 && (
                    <div style={styles.infoText}>No comments yet.</div>
                  )}
                </div>

              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
    padding: '48px 16px',
  },
  cardContainer: {
    maxWidth: '860px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
  },
  header: {
    background:'rgba(252,231,238)',
    padding: '24px 16px',
    textAlign: 'center' as const,
  },
  avatarCircle: {
    width: '96px',
    height: '96px',
    margin: '0 auto 16px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  avatarIcon: {
    width: '48px',
    height: '48px',
    color: '#2563eb',
  },
  headerName: {
    fontSize: '30px',
    fontWeight: '700',
    color: 'black',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  headerRole: {
    color: 'black',
    fontSize: '14px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    margin: 0,
  },
  detailsSection: {
    padding: '32px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '24px',
    marginTop: 0,
  },
  fieldContainer: {
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '16px',
    marginBottom: '24px',
  },
  fieldContainerLast: {
    paddingBottom: '16px',
  },
  fieldLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: '8px',
  },
  fieldValue: {
    fontSize: '18px',
    color: '#111827',
    fontWeight: '500',
    margin: 0,
  },
  fieldWithIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  fieldIcon: {
    width: '20px',
    height: '20px',
    color: '#9ca3af',
  },
  roleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
  },
  footer: {
    padding: '24px 32px',
    backgroundColor: '#f9fafb',
    borderTop: '1px solid #e5e7eb',
  },
  editButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
    color: '#ffffff',
    fontWeight: '600',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s',
  },
  orderSection: {
    padding: '24px 32px',
    borderTop: '1px solid #e5e7eb',
    background: 'linear-gradient(180deg, #fbfdff 0%, #f8fafc 100%)',
  },
  orderSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  orderSectionTitle: {
    margin: 0,
    fontSize: '20px',
    color: '#1f2937',
    letterSpacing: '-0.01em',
  },
  refreshBtn: {
    border: '1px solid #c7d2fe',
    backgroundColor: '#eef2ff',
    color: '#3730a3',
    borderRadius: '8px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  orderList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  orderRow: {
    border: '1px solid #dbe4f0',
    borderRadius: '14px',
    padding: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    boxShadow: '0 4px 10px rgba(15, 23, 42, 0.04)',
  },
  orderLeft: {
    flex: 1,
    minWidth: 0,
  },
  orderGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '8px',
    marginTop: '6px',
  },
  metaBlock: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '8px 10px',
  },
  metaLabel: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
    marginBottom: '3px',
  },
  metaValue: {
    fontSize: '13px',
    color: '#0f172a',
    fontWeight: 500,
    wordBreak: 'break-word' as const,
  },
  orderAmount: {
    fontSize: '14px',
    color: '#0f172a',
    fontWeight: 700,
  },
  orderId: {
    fontFamily: 'monospace',
    fontWeight: 700,
    fontSize: '14px',
    marginBottom: '4px',
    color: '#0f172a',
  },
  orderMeta: {
    fontSize: '12px',
    color: '#6b7280',
  },
  orderRight: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'column',
    gap: '10px',
    marginLeft: '12px',
  },
  statusPill: {
    borderRadius: '9999px',
    padding: '5px 11px',
    fontSize: '12px',
    fontWeight: 700,
    whiteSpace: 'nowrap' as const,
  },
  trackBtn: {
    border: '1px solid #7dd3fc',
    background: 'linear-gradient(180deg, #ecfeff 0%, #e0f2fe 100%)',
    color: '#075985',
    borderRadius: '8px',
    padding: '7px 12px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  infoText: {
    fontSize: '13px',
    color: '#6b7280',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1200,
    padding: '16px',
  },
  modalCard: {
    width: '100%',
    maxWidth: '760px',
    maxHeight: '85vh',
    overflowY: 'auto',
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '18px',
    boxShadow: '0 20px 40px rgba(2, 6, 23, 0.28)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '8px',
  },
  modalActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  refreshTrackingBtn: {
    border: '1px solid #bae6fd',
    backgroundColor: '#ecfeff',
    color: '#0c4a6e',
    borderRadius: '8px',
    padding: '6px 10px',
    fontSize: '12px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  closeBtn: {
    border: '1px solid #ddd',
    background: '#f8fafc',
    borderRadius: '999px',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    fontSize: '18px',
    lineHeight: 1,
  },
  blockTitle: {
    fontWeight: 700,
    color: '#0f172a',
    marginTop: '14px',
    marginBottom: '8px',
    fontSize: '15px',
    letterSpacing: '-0.01em',
  },
  trackingSummaryCard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '8px',
    padding: '10px',
    border: '1px solid #dbe4f0',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    marginBottom: '12px',
  },
  summaryItem: {
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    backgroundColor: '#fff',
    padding: '8px 10px',
  },
  summaryValue: {
    fontSize: '13px',
    color: '#0f172a',
    fontWeight: 600,
    wordBreak: 'break-word' as const,
  },
  quickFactsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '12px',
  },
  factPill: {
    border: '1px solid #dbeafe',
    backgroundColor: '#f8fafc',
    color: '#334155',
    borderRadius: '9999px',
    padding: '5px 10px',
    fontSize: '12px',
    fontWeight: 600,
  },
  mapLink: {
    display: 'inline-flex',
    marginBottom: '10px',
    fontSize: '12px',
    color: '#0c4a6e',
    textDecoration: 'none',
    border: '1px solid #bae6fd',
    backgroundColor: '#ecfeff',
    borderRadius: '8px',
    padding: '6px 10px',
    fontWeight: 700,
  },
  timelineList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  timelineItem: {
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '10px 12px',
    backgroundColor: '#f8fafc',
  },
  timelineTopRow: {
    display: 'flex',
    alignItems: 'center',
  },
  timelineStatus: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '4px',
    borderRadius: '9999px',
    padding: '3px 10px',
    display: 'inline-flex',
    width: 'fit-content',
  },
  timelineTime: {
    fontSize: '12px',
    color: '#64748b',
  },
};