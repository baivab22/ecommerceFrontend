// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './_hotSelling.scss'
// import { BASE_URL, FILE_URL } from 'src/config';

// const HotSellingProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [hotSellingProducts, setHotSellingProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const [message, setMessage] = useState({ type: '', text: '' });

//   // Update this with your actual API base URL and file URL
//   // const API_BASE_URL = 'https://abhushangallery.com/api'; // Change to your backend URL
//   // const FILE_URL = 'http://localhost:8000'; // Change to match your FILE_URL from config

//   // Fetch all products with pagination
//   const fetchProducts = async (page = 1, search = '') => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${BASE_URL}/product`, {
//         params: {
//           page,
//           limit: 12, // Show 12 products per page
//           search: search || undefined
//         }
//       });
      
//       console.log('Products Response:', response.data);
      
//       setProducts(response.data.data || []);
      
//       // Handle pagination data
//       if (response.data.pagination) {
//         setTotalPages(response.data.pagination.totalPages || 1);
//         setCurrentPage(response.data.pagination.currentPage || page);
//         setTotalProducts(response.data.pagination.totalProducts || 0);
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       showMessage('error', 'Failed to fetch products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch current hot selling products
//   const fetchHotSellingProducts = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/products/hot-selling`);
//       console.log('Hot Selling Products:', response.data);
//       setHotSellingProducts(response.data.data || []);
//     } catch (error) {
//       console.error('Error fetching hot selling products:', error);
//     }
//   };

//   // Add product to hot selling
//   const addToHotSelling = async (productId) => {
//     try {
//       const response = await axios.post(`${BASE_URL}/products/hot-selling`, {
//         productId
//       });
      
//       showMessage('success', response.data.message || 'Product added to hot selling!');
//       fetchHotSellingProducts();
//       fetchProducts(currentPage, searchTerm);
//     } catch (error) {
//       console.error('Error adding to hot selling:', error);
//       showMessage('error', error.response?.data?.error || 'Failed to add product');
//     }
//   };

//   // Remove product from hot selling
//   const removeFromHotSelling = async (productId) => {
//     try {
//       const response = await axios.delete(`${BASE_URL}/products/hot-selling/${productId}`);
      
//       showMessage('success', response.data.message || 'Product removed from hot selling!');
//       fetchHotSellingProducts();
//       fetchProducts(currentPage, searchTerm);
//     } catch (error) {
//       console.error('Error removing from hot selling:', error);
//       showMessage('error', error.response?.data?.error || 'Failed to remove product');
//     }
//   };

//   // Show message helper
//   const showMessage = (type, text) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//   };

//   // Handle search with debounce
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setCurrentPage(1);
//       fetchProducts(1, searchTerm);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // Initial load
//   useEffect(() => {
//     fetchProducts();
//     fetchHotSellingProducts();
//   }, []);

//   // Handle page change
//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       fetchProducts(page, searchTerm);
//     }
//   };

//   const isHotSelling = (productId) => {
//     return hotSellingProducts.some(p => p._id === productId || p.id === productId);
//   };

//   // Get product image URL
//   const getProductImage = (product) => {
//     if (product?.images && product.images.length > 0) {
//       const firstImage = product.images[0];
//       if (firstImage?.coloredImage) {
//         return `${FILE_URL}/products/${firstImage.coloredImage}`;
//       }
//     }
//     return '/assets/images/defaultProduct.jpeg'; // Fallback image
//   };

//   // Calculate discount percentage
//   const getDiscountPercentage = (product) => {
//     if (product?.originalPrice && product?.discountedPrice) {
//       return Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100);
//     }
//     return 0;
//   };

//   return (
//     <div className="hot-selling-container">
//       {/* <div className="page-header">
//         <h1 className="page-title">🔥 Manage Hot Selling Products</h1>
//         <p className="page-subtitle">Select products to feature as hot selling items on your store</p>
//       </div> */}

//       {/* Message Alert */}
//       {message.text && (
//         <div className={`alert alert-${message.type}`}>
//           <div className="alert-content">
//             {message.type === 'success' ? '✓' : '⚠'} {message.text}
//           </div>
//         </div>
//       )}

//       {/* Current Hot Selling Products Section */}
//       <div className="hot-selling-section">
//         <div className="section-header">
//           <h2>Current Hot Selling Products</h2>
//           <span className="count-badge">{hotSellingProducts.length} Products</span>
//         </div>
        
//         <div className="hot-selling-grid">
//           {hotSellingProducts.length === 0 ? (
//             <div className="empty-state">
//               <div className="empty-icon">🔥</div>
//               <p className="empty-title">No hot selling products yet</p>
//               <p className="empty-subtitle">Start by selecting products from the list below</p>
//             </div>
//           ) : (
//             hotSellingProducts.map(product => (
//               <div key={product._id || product.id} className="hot-product-card">
//                 <div className="product-image-container">
//                   <img 
//                     src={getProductImage(product)} 
//                     alt={product.name}
//                     onError={(e) => {
//                       (e.target as any).src = '/assets/images/defaultProduct.jpeg';
//                     }}
//                   />
//                   {getDiscountPercentage(product) > 0 && (
//                     <div className="discount-badge">
//                       -{getDiscountPercentage(product)}%
//                     </div>
//                   )}
//                   <div className="hot-badge-overlay">HOT</div>
//                 </div>
                
//                 <div className="product-details">
//                   <h3 className="product-name" title={product.name}>
//                     {product.name}
//                   </h3>
                  
//                   {product.category?.name && (
//                     <span className="product-category">{product.category.name}</span>
//                   )}
                  
//                   <div className="price-container">
//                     <span className="current-price">
//                       Rs. {product.discountedPrice?.toFixed(2)?.toLocaleString()|| product.originalPrice?.toLocaleString().toFixed(2)}
//                     </span>
//                     {product.originalPrice > product.discountedPrice && (
//                       <span className="original-price">
//                         Rs. {product.originalPrice?.toFixed(2)?.toLocaleString()}
//                       </span>
//                     )}
//                   </div>

//                   {product.stockQuantity !== undefined && (
//                     <div className="stock-info">
//                       {product.stockQuantity > 0 ? (
//                         <span className="in-stock">In Stock: {product.stockQuantity}</span>
//                       ) : (
//                         <span className="out-of-stock">Out of Stock</span>
//                       )}
//                     </div>
//                   )}
                  
//                   <button 
//                     className="btns btns-remove"
//                     onClick={() => removeFromHotSelling(product._id || product.id)}
//                   >
//                     Remove from Hot Selling
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* All Products Section */}
//       <div className="all-products-section">
//         <div className="section-header">
//           <h2>All Products</h2>
//           <span className="count-badge">{totalProducts} Total</span>
//         </div>
        
//         {/* Search Bar */}
//         <div className="search-container">
//           <div className="search-wrapper">
//             <svg className="search-icons" width="20" height="20" viewBox="0 0 20 20" fill="none">
//               <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//             <input
//               type="text"
//               placeholder="Search products by name..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="search-input"
//             />
//             {searchTerm && (
//               <button 
//                 className="search-clear"
//                 onClick={() => setSearchTerm('')}
//               >
//                 ✕
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Products Grid */}
//         {loading ? (
//           <div className="loading-state">
//             <div className="spinner"></div>
//             <p>Loading products...</p>
//           </div>
//         ) : (
//           <>
//             <div className="products-grid">
//               {products.length === 0 ? (
//                 <div className="empty-state">
//                   <div className="empty-icon">📦</div>
//                   <p className="empty-title">No products found</p>
//                   <p className="empty-subtitle">Try adjusting your search criteria</p>
//                 </div>
//               ) : (
//                 products.map(product => {
//                   const productId = product._id || product.id;
//                   const isHot = isHotSelling(productId);
                  
//                   return (
//                     <div key={productId} className={`product-card ${isHot ? 'is-hot' : ''}`}>
//                       <div className="product-image-container">
//                         <img 
//                           src={getProductImage(product)} 
//                           alt={product.name}
//                           onError={(e) => {
//                             (e.target as any).src = '/assets/images/defaultProduct.jpeg';
//                           }}
//                         />
                        
//                         {getDiscountPercentage(product) > 0 && (
//                           <div className="discount-badge">
//                             -{getDiscountPercentage(product)}%
//                           </div>
//                         )}
                        
//                         {isHot && (
//                           <div className="hot-badge-overlay">HOT</div>
//                         )}
//                       </div>
                      
//                       <div className="product-details">
//                         <h3 className="product-name" title={product.name}>
//                           {product.name}
//                         </h3>
                        
//                         {product.category?.name && (
//                           <span className="product-category">{product.category.name}</span>
//                         )}
                        
//                         <div className="price-container">
//                           <span className="current-price">
//                             Rs. {product.discountedPrice?.toLocaleString() || product.originalPrice?.toLocaleString()}
//                           </span>
//                           {product.originalPrice > product.discountedPrice && (
//                             <span className="original-price">
//                               Rs. {product.originalPrice?.toLocaleString()}
//                             </span>
//                           )}
//                         </div>

//                         {product.stockQuantity !== undefined && (
//                           <div className="stock-info">
//                             {product.stockQuantity > 0 ? (
//                               <span className="in-stock">Stock: {product.stockQuantity}</span>
//                             ) : (
//                               <span className="out-of-stock">Out of Stock</span>
//                             )}
//                           </div>
//                         )}
                        
//                         <button 
//                           className={`btns ${isHot ? 'btns-remove' : 'btns-add'}`}
//                           onClick={() => 
//                             isHot 
//                               ? removeFromHotSelling(productId)
//                               : addToHotSelling(productId)
//                           }
//                         >
//                           {isHot ? '✕ Remove' : '+ Add to Hot Selling'}
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="pagination-container">
//                 <button 
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="pagination-btn"
//                 >
//                   <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//                     <path d="M12.5 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   </svg>
//                   Previous
//                 </button>
                
//                 <div className="pagination-pages">
//                   {[...Array(totalPages)].map((_, index) => {
//                     const page = index + 1;
                    
//                     // Show first, last, current, and adjacent pages
//                     if (
//                       page === 1 || 
//                       page === totalPages || 
//                       (page >= currentPage - 1 && page <= currentPage + 1)
//                     ) {
//                       return (
//                         <button
//                           key={page}
//                           onClick={() => handlePageChange(page)}
//                           className={`pagination-page ${currentPage === page ? 'active' : ''}`}
//                         >
//                           {page}
//                         </button>
//                       );
//                     } else if (page === currentPage - 2 || page === currentPage + 2) {
//                       return <span key={page} className="pagination-dots">...</span>;
//                     }
//                     return null;
//                   })}
//                 </div>

//                 <button 
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="pagination-btn"
//                 >
//                   Next
//                   <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//                     <path d="M7.5 15l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   </svg>
//                 </button>
//               </div>
//             )}

//             <div className="pagination-info">
//               Showing {((currentPage - 1) * 12) + 1} - {Math.min(currentPage * 12, totalProducts)} of {totalProducts} products
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HotSellingProducts;

// HotSellingProducts.jsx
import React, { useState, useEffect, useCallback } from 'react';
// import Image from 'next/image';
import axios from 'axios';
import './_hotSelling.scss';
import { BASE_URL, FILE_URL } from 'src/config';

const HotSellingProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [featuredProduct, setFeaturedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch all products with pagination
  const fetchProducts = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/product`, {
        params: {
          page,
          limit: 12,
          search: search || undefined
        }
      });
      
      setProducts(response.data.data || []);
      if (response.data.pagination) {
        setTotalPages(response.data.pagination.totalPages || 1);
        setCurrentPage(response.data.pagination.currentPage || page);
        setTotalProducts(response.data.pagination.totalProducts || 0);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showMessage('error', 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch current featured product (only one)
  const fetchFeaturedProduct = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products/hot-selling`);
      const featuredProducts = response.data.data || [];
      // Get the first (and should be only) featured product
      setFeaturedProduct(featuredProducts.length > 0 ? featuredProducts[0] : null);
    } catch (error) {
      console.error('Error fetching featured product:', error);
    }
  }, []);

  // Set product as featured - First remove existing, then add new
  const setAsFeatured = async (productId) => {
    setActionLoading(productId);
    try {
      // If there's already a featured product, remove it first
      if (featuredProduct) {
        const existingProductId = (featuredProduct as any)._id || (featuredProduct as any).id;
        await axios.delete(`${BASE_URL}/products/hot-selling/${existingProductId}`);
      }
      
      // Then add the new product as featured
      const response = await axios.post(`${BASE_URL}/products/hot-selling`, { productId });
      
      showMessage('success', response.data.message || '✨ Product set as featured!');
      await Promise.all([fetchFeaturedProduct(), fetchProducts(currentPage, searchTerm)]);
    } catch (error) {
      console.error('Error setting featured product:', error);
      showMessage('error', error.response?.data?.error || 'Failed to set featured product');
    } finally {
      setActionLoading(null);
    }
  };

  // Remove featured product
  const removeFeatured = async (productId) => {
    setActionLoading(productId);
    try {
      const response = await axios.delete(`${BASE_URL}/products/hot-selling/${productId}`);
      showMessage('success', response.data.message || 'Featured product removed!');
      await Promise.all([fetchFeaturedProduct(), fetchProducts(currentPage, searchTerm)]);
    } catch (error) {
      console.error('Error removing featured product:', error);
      showMessage('error', error.response?.data?.error || 'Failed to remove featured product');
    } finally {
      setActionLoading(null);
    }
  };

  // Show message helper
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts(1, searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchProducts]);

  // Initial load
  useEffect(() => {
    fetchProducts();
    fetchFeaturedProduct();
  }, [fetchProducts, fetchFeaturedProduct]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchProducts(page, searchTerm);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isFeatured = useCallback((productId) => {
    const featured = featuredProduct as any
    return featured && (featured._id === productId || featured.id === productId);
  }, [featuredProduct]);

  // Get product image URL
  const getProductImage = (product) => {
    if (product?.images && product.images.length > 0) {
      const firstImage = product.images[0];
      if (firstImage?.coloredImage) {
        return `${FILE_URL}/products/${firstImage.coloredImage}`;
      }
    }
    return '/assets/images/defaultProduct.jpeg';
  };

  // Calculate discount percentage
  const getDiscountPercentage = (product) => {
    if (product?.originalPrice && product?.discountedPrice && product.originalPrice > product.discountedPrice) {
      return Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100);
    }
    return 0;
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  return (
    <div className="hot-selling-container">
      {/* Toast Notification */}
      {message.text && (
        <div className={`toast-notification ${message.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {message.type === 'success' ? '✓' : '⚠'}
            </span>
            <span className="toast-text">{message.text}</span>
          </div>
          <button className="toast-close" onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-icon">🔥</div>
          <div className="header-text">
            <h1>Hot Selling Manager</h1>
            <p>Manage your featured product - Only one product can be featured at a time</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-label">Featured Status</span>
            <span className="stat-value">{featuredProduct ? 'Active' : 'None'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Products</span>
            <span className="stat-value">{totalProducts}</span>
          </div>
        </div>
      </div>

      {/* Current Featured Product Section */}
      <div className="featured-section">
        <div className="section-header">
          <div className="section-title">
            <span className="title-icon">⭐</span>
            <h2>Current Hot Selling Product</h2>
          </div>
          {featuredProduct && (
            <span className="featured-badge">🔥 HOT</span>
          )}
        </div>
        
        {!featuredProduct ? (
          <div className="empty-featured">
            <div className="empty-illustration">🔥</div>
            <h3>No hot selling product selected</h3>
            <p>Browse the product catalog below and click "Set as Hot Selling" to showcase your best product</p>
          </div>
        ) : (
          <div className="featured-product-showcase">
            <div className="featured-card-large">
              <div className="featured-image-wrapper" style={{ position: 'relative' }}>
                <img
                  src={getProductImage(featuredProduct) || '/assets/images/defaultProduct.jpeg'}
                  alt={featuredProduct.name}
                  width={800}
                  height={600}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  onError={(e) => { (e.target as any).src = '/assets/images/defaultProduct.jpeg' }}
                />
                {getDiscountPercentage(featuredProduct) > 0 && (
                  <div className="discount-badge-large">
                    -{getDiscountPercentage(featuredProduct)}%
                  </div>
                )}
                <div className="hot-badge-large">
                  🔥 HOT SELLING
                </div>
              </div>
              <div className="featured-details">
                <h3 className="featured-name">{featuredProduct.name}</h3>
                {featuredProduct.category?.name && (
                  <span className="featured-category">{featuredProduct.category.name}</span>
                )}
                <div className="featured-price">
                  <span className="current-price-large">
                    {formatPrice(featuredProduct.discountedPrice || featuredProduct.originalPrice)}
                  </span>
                  {featuredProduct.originalPrice > featuredProduct.discountedPrice && (
                    <span className="original-price-large">
                      {formatPrice(featuredProduct.originalPrice)}
                    </span>
                  )}
                </div>
                {featuredProduct.stockQuantity !== undefined && (
                  <div className="featured-stock">
                    {featuredProduct.stockQuantity > 0 ? (
                      <span className="in-stock">✓ In Stock: {featuredProduct.stockQuantity}</span>
                    ) : (
                      <span className="out-of-stock">✗ Out of Stock</span>
                    )}
                  </div>
                )}
                <button 
                  className="btn-remove-featured"
                  onClick={() => removeFeatured(featuredProduct._id || featuredProduct.id)}
                  disabled={actionLoading === (featuredProduct._id || featuredProduct.id)}
                >
                  {actionLoading === (featuredProduct._id || featuredProduct.id) ? (
                    <span className="spinner-small"></span>
                  ) : (
                    '✕ Remove from Hot Selling'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* All Products Section */}
      <div className="all-products-section">
        <div className="section-header">
          <div className="section-title">
            <span className="title-icon">📦</span>
            <h2>All Products</h2>
          </div>
          <div className="catalog-controls">
            <div className="search-container">
              <div className="search-wrapper">
                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button className="clear-search" onClick={() => setSearchTerm('')}>×</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {products.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <p className="empty-title">No products found</p>
                  <p className="empty-subtitle">Try adjusting your search criteria</p>
                </div>
              ) : (
                products.map(product => {
                  const productId = product._id || product.id;
                  const isCurrentlyFeatured = featuredProduct && (featuredProduct._id === productId || featuredProduct.id === productId);
                  
                  return (
                    <div key={productId} className={`product-card ${isCurrentlyFeatured ? 'is-featured' : ''}`}>
                      <div className="product-image-container" style={{ position: 'relative' }}>
                        <img
                          src={getProductImage(product) || '/assets/images/defaultProduct.jpeg'}
                          alt={product.name}
                          width={300}
                          height={300}
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                          onError={(e) => { (e.target as any).src = '/assets/images/defaultProduct.jpeg' }}
                        />
                        {getDiscountPercentage(product) > 0 && (
                          <div className="discount-badge">
                            -{getDiscountPercentage(product)}%
                          </div>
                        )}
                        {isCurrentlyFeatured && (
                          <div className="hot-badge-overlay">HOT</div>
                        )}
                      </div>
                      
                      <div className="product-details">
                        <h3 className="product-name" title={product.name}>
                          {product.name}
                        </h3>
                        
                        {product.category?.name && (
                          <span className="product-category">{product.category.name}</span>
                        )}
                        
                        <div className="price-container">
                          <span className="current-price">
                            {formatPrice(product.discountedPrice || product.originalPrice)}
                          </span>
                          {product.originalPrice > product.discountedPrice && (
                            <span className="original-price">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        {product.stockQuantity !== undefined && (
                          <div className="stock-info">
                            {product.stockQuantity > 0 ? (
                              <span className="in-stock">Stock: {product.stockQuantity}</span>
                            ) : (
                              <span className="out-of-stock">Out of Stock</span>
                            )}
                          </div>
                        )}
                        
                        <button 
                          className={`btn ${isCurrentlyFeatured ? 'btn-remove' : 'btn-add'}`}
                          onClick={() => 
                            isCurrentlyFeatured 
                              ? removeFeatured(productId)
                              : setAsFeatured(productId)
                          }
                          disabled={actionLoading === productId}
                        >
                          {actionLoading === productId ? (
                            <span className="spinner-small"></span>
                          ) : isCurrentlyFeatured ? (
                            '✕ Remove from Hot Selling'
                          ) : (
                            '🔥 Set as Hot Selling'
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                  Previous
                </button>
                
                <div className="pagination-pages">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    
                    if (page >= 1 && page <= totalPages) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                        >
                          {page}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </div>
            )}

            <div className="pagination-info">
              Showing {((currentPage - 1) * 12) + 1} - {Math.min(currentPage * 12, totalProducts)} of {totalProducts} products
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HotSellingProducts;