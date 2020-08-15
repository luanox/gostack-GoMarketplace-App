import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      // console.log(products);
      // await AsyncStorage.removeItem('@GoMarketplace:product');
      const getProduct = await AsyncStorage.getItem(
        '@GoMarketplace:product'
      )

      if(getProduct){
        setProducts([...JSON.parse(getProduct)]);
        //   console.log('---------------------------------------------------');
        // console.log(JSON.parse(getProduct));
      }

    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async product => {
    // TODO ADD A NEW ITEM TO THE CART

    const existProduct = products.filter(prod => prod.id === product.id)

    if(!!existProduct[0]){
      setProducts(
        products.map(prod => prod.id === product.id ? {...product, quantity: prod.quantity + 1} : prod )
      )
    }else{

      setProducts([...products, { ...product, quantity: 1 }]);
    }

    await AsyncStorage.setItem('@GoMarketplace:product', JSON.stringify(products))

  }, [products]);

  const increment = useCallback(async id => {
    // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
  }, []);

  const decrement = useCallback(async id => {
    // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
  }, []);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
