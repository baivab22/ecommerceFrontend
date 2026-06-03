import React, { useRef, useEffect, useMemo } from 'react';
import './searchDropdown.scss';
import { FILE_URL } from 'src/config/api.config';
import { OptimizedImage } from 'src/app/common/OptimizedImage/OptimizedImage.component'

interface Product {
  id: string;
  name: string;
  description?: string;
  discountedPrice?: number;
  originalPrice?: number;
  images?: Array<{ coloredImage: string }>;
}

interface SearchDropdownProps {
  onClose?: () => void;
  suggestedProducts?: Product[];
  searchValue?: string;
  onProductClick?: (product: Product) => void;
  isLoading?: boolean;
}

export const SearchDropdown = ({ 
  onClose, 
  suggestedProducts = [], 
  searchValue = '', 
  onProductClick,
  isLoading = false 
}: SearchDropdownProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose?.();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Levenshtein distance for fuzzy matching
  const calculateLevenshtein = (a: string, b: string): number => {
    const an = a ? a.length : 0;
    const bn = b ? b.length : 0;
    if (an === 0) return bn;
    if (bn === 0) return an;
    const matrix = Array.from({ length: bn + 1 }, (_, i) => [i]);
    for (let j = 0; j <= an; j++) matrix[0][j] = j;
    for (let i = 1; i <= bn; i++) {
      for (let j = 1; j <= an; j++) {
        if (b[i - 1] === a[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[bn][an];
  };

  // Normalize string for consistent matching
  const normalizeString = (str: string): string => {
    return str
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^\p{L}\p{N}]/gu, '')
      .replace(/\s+/g, '');
  };

  // Find best matched product
  const searchedProduct = useMemo(() => {
    if (!searchValue.trim() || suggestedProducts.length === 0) return undefined;
    const normalizedSearch = normalizeString(searchValue);
    return suggestedProducts.find((p) => {
      const normalizedName = normalizeString(p.name);
      return (
        normalizedName.startsWith(normalizedSearch) ||
        calculateLevenshtein(normalizedName, normalizedSearch) <= 2
      );
    });
  }, [searchValue, suggestedProducts]);

  // Filter similar products (exclude the best match)
  const similarProducts = useMemo(() => {
    return searchedProduct
      ? suggestedProducts.filter((p) => p.id !== searchedProduct.id)
      : [];
  }, [searchedProduct, suggestedProducts]);

  // Primary search results should always show at the top.
  const searchResults = useMemo(() => {
    return searchedProduct ? [searchedProduct] : suggestedProducts;
  }, [searchedProduct, suggestedProducts]);

  const formatPrice = (price?: number) => {
    if (!price) return '';
    return `रू. ${price.toFixed(2)}`;
  };

  // Render product item helper
  const renderProductItem = (item: Product, className: string) => (
    <div
      key={item.id}
      className={className}
      onClick={() => {
        onProductClick?.(item);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onProductClick?.(item);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${item.name} - ${formatPrice(item.discountedPrice || item.originalPrice || 0)}`}
    >
      <span className="icon">
        {item.images && item.images[0]?.coloredImage ? (
          <OptimizedImage
            src={`${FILE_URL}/products/${item.images[0].coloredImage}`}
            alt={item.name}
            width={36}
            height={36}
            style={{ width: 36, height: 36, borderRadius: '50%' }}
            loading="lazy"
          />
        ) : (
          <span className="placeholder-icon">{item.name[0]?.toUpperCase() || '?'}</span>
        )}
      </span>
      <span className="product-details">
        <span className="name">{item.name}</span>
        {(item.discountedPrice || item.originalPrice) && (
          <span className="price">
            {formatPrice(item.discountedPrice || item.originalPrice)}
          </span>
        )}
      </span>
    </div>
  );

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="search-feedback-state" style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ fontSize: '14px', color: '#999' }}>Searching...</div>
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="search-feedback-state" style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ fontSize: '14px', color: '#999' }}>
        No products found
      </div>
    </div>
  );

  return (
    <div className="search-dropdown" ref={ref} role="listbox">
      {isLoading && <LoadingSkeleton />}

      {!isLoading && searchValue.trim() && suggestedProducts.length === 0 && <EmptyState />}

      {!isLoading && searchResults.length > 0 && (
        <div className="search-section">
          <div className="search-section-title">Search Results</div>
          <div className="recommended-list">
            {searchResults.map((item) => renderProductItem(item, 'recommended-item'))}
          </div>
        </div>
      )}

      {!isLoading && similarProducts.length > 0 && (
        <div className="search-section">
          <div className="search-section-title">Similar Results</div>
          <div className="recommended-list">
            {similarProducts.map((item) =>
              renderProductItem(item, 'recommended-item')
            )}
          </div>
        </div>
      )}
    </div>
  );
};
