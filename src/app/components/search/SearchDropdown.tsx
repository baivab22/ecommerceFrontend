import React, { useRef, useEffect } from 'react';
import './searchDropdown.scss';
import { FILE_URL } from 'src/config/api.config';

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
  products?: Product[];
  suggestedProducts?: Product[];
  searchValue?: string;
  onProductClick?: (product: Product) => void;
}

export const SearchDropdown = ({ onClose, products = [], suggestedProducts = [], searchValue = '', onProductClick }: SearchDropdownProps) => {
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

  // Helper: Levenshtein distance
  function levenshtein(a: string, b: string): number {
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
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[bn][an];
  }

  // If there is a searched product, show it at the top (almost exact match)
  let searchedProduct: Product | undefined = undefined;
  // Helper: normalize string for robust matching (lowercase, remove whitespace, remove special chars, normalize unicode)
  function normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '') // remove accents/diacritics
      .replace(/[^\p{L}\p{N}]/gu, '') // remove all non-letter/number chars
      .replace(/\s+/g, ''); // remove whitespace
  }

  if (searchValue && suggestedProducts.length > 0) {
    const normalizedSearch = normalizeString(searchValue);
    searchedProduct = suggestedProducts.find(
      (p) => {
        const normalizedName = normalizeString(p.name);
        return (
          normalizedName.startsWith(normalizedSearch) ||
          levenshtein(normalizedName, normalizedSearch) <= 2
        );
      }
    );
  }
  // Remove the searched product from the similar list if present
  const similarProducts = searchedProduct
    ? suggestedProducts.filter((p) => p.id !== searchedProduct!.id)
    : suggestedProducts;

  return (
    <div className="search-dropdown" ref={ref}>
      {searchedProduct && (
        <div>
          <div className="search-section-title">Searched Product</div>
          <div className="recommended-list">
            <div className="recommended-item" key={searchedProduct.id} onClick={() => onProductClick?.(searchedProduct!)}>
              <span className="icon">
                {searchedProduct.images && searchedProduct.images[0]?.coloredImage ? (
                  <img src={`${FILE_URL}/products/${searchedProduct.images[0].coloredImage}`} alt={searchedProduct.name} style={{ width: 36, height: 36, borderRadius: '50%' }} />
                ) : (
                  searchedProduct.name[0]
                )}
              </span>
              <span className="product-details">
                <span className="name">{searchedProduct.name}</span>
                {searchedProduct.discountedPrice && (
                  <span className="price">${searchedProduct.discountedPrice}</span>
                )}
              </span>
            </div>
          </div>
        </div>
      )}
      {similarProducts.length > 0 && (
        <div>
          <div className="search-section-title">Similar Products</div>
          <div className="recommended-list">
            {similarProducts.map((item) => (
              <div className="recommended-item" key={item.id} onClick={() => onProductClick?.(item)}>
                <span className="icon">
                  {item.images && item.images[0]?.coloredImage ? (
                    <img src={`${FILE_URL}/products/${item.images[0].coloredImage}`} alt={item.name} style={{ width: 36, height: 36, borderRadius: '50%' }} />
                  ) : (
                    item.name[0]
                  )}
                </span>
                <span className="product-details">
                  <span className="name">{item.name}</span>
                  {item.discountedPrice && (
                    <span className="price">${item.discountedPrice}</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        <div className="search-section-title">Popular Products</div>
        <div className="popular-list">
          {products.map((item) => (
            <div className="popular-item" key={item.id} onClick={() => onProductClick?.(item)}>
              {item.images && item.images[0]?.coloredImage ? (
                <img className="image" src={`${FILE_URL}/products/${item.images[0].coloredImage}`} alt={item.name} />
              ) : (
                <div className="image" style={{ background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.name[0]}</div>
              )}
              <span className="product-details">
                <span className="name">{item.name}</span>
                {item.discountedPrice && (
                  <span className="price">${item.discountedPrice}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
