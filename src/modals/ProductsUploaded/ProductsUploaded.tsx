import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Color, DisplayingProduct } from "../../models";

import "./ProductsUploaded.scss";

interface Props {
  products: DisplayingProduct[];
  isOpen: boolean;
  toggle: () => void;
  colorList: Color[];
}

export const ProductsUploaded = (props: Props) => {
  const toggleModal = () => {
    props.toggle();
  }

  console.log(props.products)

  return (
    <Modal centered={true} isOpen={props.isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Re-uploaded Products</ModalHeader>
      <ModalBody>
        {
          props.products.map(product => (
            <div key={product.id} className="d-flex mb-2 product-item">
              <div className="product-image-wrapper me-4">
                { product.image && <img src={product.image} alt={product.name} className="img-fluid" /> }
              </div>
              <div>
                <h6>{product.name}</h6>
                <div><span className="text-muted">ID:  </span>{product.id}</div>
                <div><span className="text-muted">SKU:  </span><span className="text-danger">{product.sku}</span></div>
                <div><span className="text-muted">Color:  </span>{props.colorList.find(color => color.id == product.color)?.name}</div>
              </div>
            </div>
          ))
        }
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggleModal}>OK</Button>{' '}
      </ModalFooter>
    </Modal>
  );
}