import React, { useEffect, useState } from "react";
import { Container, Button, Input, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { ProductsUploaded } from "../../modals/ProductsUploaded/ProductsUploaded";
import { Color, DisplayingProduct, Product } from "../../models";

import "./ErrorProducts.scss";

export const ErrorProducts = () => {
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);
  const [displayingProducts, setDisplayingProducts] = useState<DisplayingProduct[]>([]);
  const [updatedProducts, setUpdatedProducts] = useState<DisplayingProduct[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState(false);

  const PRODUCTS_API_URL = "https://60ae0d5e80a61f00173324bc.mockapi.io/products";
  const COLORS_API_URL = "https://60ae0d5e80a61f00173324bc.mockapi.io/colors";
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchProducts();
    fetchColors();
  }, [])


  const fetchProducts = async () => {
    const response = await fetch(PRODUCTS_API_URL);
    const products = await response.json();
    setOriginalProducts(JSON.parse(JSON.stringify(products)));
    setDisplayingProducts(JSON.parse(JSON.stringify(products)));
  }

  const fetchColors = async () => {
    const response = await fetch(COLORS_API_URL);
    const colorList = await response.json();
    setColors(colorList);
  }

  const handleNameChange = (event: any, productId: number) => {
    const newDisplayingProducts = getInputChangedProducts(productId, "name", event.target.value);
    setDisplayingProducts(newDisplayingProducts);
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
    const newDisplayingProducts = JSON.parse(JSON.stringify(displayingProducts));
    const changedProductIdx = newDisplayingProducts.findIndex((product: any) => product.id === productId);
    (newDisplayingProducts[changedProductIdx] as any)[field] = newValue;

    return newDisplayingProducts;
  }

  const onSubmit = () => {
    const newUpdatedProducts = [];
    const newDisplayingProducts = JSON.parse(JSON.stringify(displayingProducts));
    let isError = false;

    for (let i = 0; i < displayingProducts.length; i++) {
      const validatedProduct = getValidatedProduct(displayingProducts[i]);
      newDisplayingProducts.splice(i, 1, validatedProduct.validatedProduct);
      if (validatedProduct.isError) isError = true;
      if (compareProducts(originalProducts[i], displayingProducts[i])) {
        newUpdatedProducts.push(displayingProducts[i]);
      }
    }


    setUpdatedProducts(newUpdatedProducts);
    setDisplayingProducts(newDisplayingProducts);

    if (!isError) {
      setModal(true);
    }
  }

  const getValidatedProduct = (product: DisplayingProduct) => {
    const validatedProduct = {...product};
    let isError = false;

    if (!validatedProduct.name) validatedProduct.nameError = "Product name is required";
    else if (validatedProduct.name.length > 50) validatedProduct.nameError = "Product name max length is 50";
    else validatedProduct.nameError = "";

    if (!validatedProduct.sku) validatedProduct.skuError = "Sku is required";
    else if (validatedProduct.sku.length > 20) validatedProduct.skuError = "Product sku max length is 20";
    else validatedProduct.skuError = "";

    if (validatedProduct.nameError || validatedProduct.skuError) isError = true;

    return { isError, validatedProduct };
  }

  const compareProducts = (product1: Product, product2: DisplayingProduct) => {
    const errorKeys = ["skuError", "nameError"];
    let isChanged = false;

    for (const key in product2) {
      if (errorKeys.includes(key)) continue;
      if ((product1 as any)[key] !== (product2 as any)[key]) {
        isChanged = true;
      }
    }

    return isChanged;
  }

  const toggleModal = () => {
    setModal(!modal);
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
            displayingProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE).map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.errorDescription}</td>
                <td>
                  { product.image && <img src={product.image} alt={product.name} />}
                </td>
                <td>
                  <Input onChange={(event) => handleNameChange(event, product.id)} className="input mx-auto" value={product.name}/>
                  { product.nameError && <div className="text-danger">{ product.nameError }</div> }  
                </td>
                <td>
                  <Input onChange={(event) => handleSkuChange(event, product.id)} className="input mx-auto" value={product.sku} />
                  { product.skuError && <div className="text-danger">{ product.skuError }</div> }  
                </td>
                <td>
                  <Input type="select" onChange={(event) => handleColorChange(event, product.id)} value={product.color} >
                    <option></option>
                    {colors.map(color => (
                      <option value={color.id} key={color.id} >{color.name}</option>
                    ))}
                  </Input>
                </td>
              </tr>
            ))
          }
        </tbody>

      </table>
      <ProductsUploaded products={updatedProducts} colorList={colors} isOpen={ modal } toggle={() => {toggleModal()}} />

      <Pagination aria-label="Page navigation" className="mt-5 mx-auto">
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink previous/>
        </PaginationItem>
        {
          [...Array(Math.ceil(displayingProducts.length / ITEMS_PER_PAGE))].map((page, i) => (
            <PaginationItem onClick={() => { setCurrentPage(i + 1) }}>
              <PaginationLink>
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))
        }
        <PaginationItem disabled={currentPage === Math.ceil(displayingProducts.length / ITEMS_PER_PAGE)}>
          <PaginationLink next />
        </PaginationItem>
      </Pagination>
    </Container>
  );
}