import { useEffect, useState } from "react";
import { Container, Button, Input } from "reactstrap";
import { ProductsUploaded } from "../../modals/ProductsUploaded/ProductsUploaded";
import { Color, DisplayingProduct, Product } from "../../models";

import "./ErrorProducts.scss";

interface Props {

}

export const ErrorProducts = (props: Props) => {
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);
  const [displayingProducts, setDisplayingProducts] = useState<DisplayingProduct[]>([]);
  const [updatedProducts, setUpdatedProducts] = useState<DisplayingProduct[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const PRODUCTS_API_URL = "https://60ae0d5e80a61f00173324bc.mockapi.io/products";
  const COLORS_API_URL = "https://60ae0d5e80a61f00173324bc.mockapi.io/colors";
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchProducts();
    fetchColors();
  }, [])

  // useEffect(() => {
  //   console.log(originalProducts, displayingProducts);
  // }, [displayingProducts]);

  const fetchProducts = async () => {
    const response = await fetch(PRODUCTS_API_URL);
    const products = await response.json();
    setOriginalProducts(products);
    setDisplayingProducts(products);
  }

  const fetchColors = async () => {
    const response = await fetch(COLORS_API_URL);
    const colorList = await response.json();
    setColors(colorList);
  }

  const handleNameChange = (event: any, productId: number) => {
    const newDisplayingProducts = getInputChangedProducts(productId, "name", event.target.value);
    // console.log(displayingProducts, originalProducts);
    // setDisplayingProducts(newDisplayingProducts);
  }

  const handleSkuChange = (event: any, productId: number) => {
    const newDisplayingProducts = getInputChangedProducts(productId, "sku", event.target.value);
    setDisplayingProducts(newDisplayingProducts);
  }

  const handleColorChange = (event: any, productId: number) => {
    const newDisplayingProducts = getInputChangedProducts(productId, "color", event.target.value);
    setDisplayingProducts(newDisplayingProducts);
  }

  const getInputChangedProducts = (productId: number, field: string, newValue: any) => {
    const newDisplayingProducts = [...displayingProducts];
    const changedProductIdx = newDisplayingProducts.findIndex(product => product.id === productId);
    newDisplayingProducts[changedProductIdx].name = newValue;
    (newDisplayingProducts[changedProductIdx] as any)[field] = newValue;
    console.log(newDisplayingProducts);

    return newDisplayingProducts;
  }

  const onSubmit = () => {
    let isError = false;

    console.log(originalProducts, displayingProducts)
    for (let i = 0; i < displayingProducts.length; i++) {

      if (compareProducts(originalProducts[i], displayingProducts[i])) {
        const newUpdatedProducts = [...updatedProducts];
        const validatedProduct = getValidatedProduct(displayingProducts[i]);
        console.log(validatedProduct);

        newUpdatedProducts.push(displayingProducts[i]);

        if (validatedProduct.isError) isError = true;
        else {
          const newDisplayingProducts = [...displayingProducts].splice(i, 1, validatedProduct.validatedProduct);
          setDisplayingProducts(newDisplayingProducts);
        }
      }
    }
  }

  const getValidatedProduct = (product: DisplayingProduct) => {
    const validatedProduct = {...product};
    let isError = false;

    if (!validatedProduct.name) validatedProduct.nameError = "Product name is required";
    else if (validatedProduct.name.length > 50) validatedProduct.nameError = "Product name max length is 50";
    if (!validatedProduct.sku) validatedProduct.skuError = "Sku is required";
    else if (validatedProduct.sku.length > 20) validatedProduct.skuError = "Product sku max length is 20";

    if (validatedProduct.nameError || validatedProduct.skuError) isError = true;

    return { isError, validatedProduct };
  }

  const getUpdatedProducts = () => {

  }

  const compareProducts = (product1: Product, product2: DisplayingProduct) => {
    let isChanged = false;

    for (const key in product1) {
      if ((product1 as any)[key] != (product2 as any)[key]) {
        isChanged = true;
      }
    }

    return isChanged;
  }

  return (
    <Container>
      <div className="d-flex justify-content-between mt-5">
        <h3>Jason - Re-upload Error Products</h3>
        <Button color="primary" onClick={onSubmit}>Submit</Button>
      </div>

      <table className="w-100 mt-4 text-center">
        <colgroup>
          <col style={{ width: '5%' }} />
          <col style={{ width: '18%' }} />
          <col style={{ width: '18%' }} />
          <col style={{ width: '23%' }} />
          <col style={{ width: '18%' }} />
          <col style={{ width: '18%' }} />
        </colgroup>
        <tbody>
          <tr>
            <th>ID</th>
            <th>Error Description</th>
            <th>Product Image</th>
            <th>Product Name</th>
            <th>SKU</th>
            <th>Color</th>
          </tr>
        

          {
            displayingProducts.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.errorDescription}</td>
                <td>
                  { product.image && <img src={product.image} alt={product.name} />}
                </td>
                <td>
                  <input onChange={(event) => handleNameChange(event, product.id)} className="input mx-auto" value={product.name}/>
                  { product.nameError && <div className="text-danger"></div> }  
                </td>
                <td>
                  <input onChange={(event) => handleSkuChange(event, product.id)} className="input mx-auto" value={product.sku} />
                  { product.skuError && <div className="text-danger"></div> }  
                </td>
                <td></td>
              </tr>
            ))
          }
        </tbody>

      </table>
      {/* <ProductsUploaded products={products} /> */}
    </Container>
  );
}