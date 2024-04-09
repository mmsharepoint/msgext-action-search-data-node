import React from "react";
import { Button, Radio, RadioGroup } from "@fluentui/react-components";
import Axios from "axios";
import IProduct from "../../Model/IProduct";

/**
 * This component is used to display the required
 * privacy statement which can be found in a link in the
 * about tab.
 */
const InitialAction: React.FC<{}> = () =>  {
  
  const [products, setProducts] = React.useState<IProduct>();

  const loadProducts = () => {
    Axios.get(`${process.env.REACT_APP_FUNC_ENDPOINT}/api/getallproducts/`,{
                responseType: "json"                
    }).then(result => {
      if (result.data) {
        setProducts(result.data);
      }     
    })
    .catch((error) => {
      console.log(error);
    })
  };

  React.useEffect(() => {
    loadProducts();
  }, []);

  React.useEffect(() => {
    console.log(products);
  }, [products]);

return (
  <div>
    <div className="tmContainer tmContainer-md tmContainer-sm">
      <div className="tmRow">
        <div className="tmCol9">
          {/* <Dropdown>                 
              {this.options.map((option) => (
                <Option key={option} disabled={option === "Ferret"}>
                  {option}
                </Option>
        </Dropdown> */}
        </div>
        <div className="tmCol3">
          <RadioGroup name="DataSrc" layout="horizontal" required >
            <Radio value="all" label="All" />
            <Radio value="onsale" label="On sale" />
            <Radio value="bestseller" label="Bestseller" />
            <Radio value="lowstock" label="Low stock" />
          </RadioGroup>

          <p>
            <label id="prodName"
                    className="hiddenLabel"
                    aria-hidden="true"
                    data-name="@SelectedItem?.Name"
                    data-prodid="@SelectedItem?.Id"
                    data-orders="@SelectedItem?.Orders"
                    data-orderable="@SelectedItem?.Orderable"></label>
          </p>
            <Button appearance="primary" disabled>Submit Order</Button>
        </div>
      </div>
    </div>
</div>
  );
}

export default InitialAction;
