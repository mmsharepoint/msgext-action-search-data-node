import React from "react";
import { Button, Radio, RadioGroup } from "@fluentui/react-components";
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { DetailsList, DetailsRow, IColumn, IDetailsRowProps, IDetailsRowStyles } from '@fluentui/react/lib/DetailsList';

import Axios from "axios";
import IProduct from "../../Model/IProduct";

/**
 * This component is used to display the required
 * privacy statement which can be found in a link in the
 * about tab.
 */
const InitialAction: React.FC<{}> = () =>  {
  const [options, setOptions] = React.useState<IDropdownOption[]>([]);
  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [selectedproduct, setSelectedProduct] = React.useState<IProduct>();

  const columns = [
    { key: 'column1', name: 'Name', fieldName: 'Name', minWidth: 60, maxWidth: 120, isResizable: true },
    { key: 'column2', name: 'Category', fieldName: 'Category', minWidth: 150, maxWidth: 150, isResizable: true },
  ];

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

  const renderRow = (props: IDetailsRowProps | undefined) => {
    const customStyles: Partial<IDetailsRowStyles> = {};
    if (props) {
      const prod: IProduct = props.item;
      
      return <DetailsRow {...props} styles={customStyles} />;
    }
    return null;
  };

  const renderItemColumn = (item: IProduct | undefined, index: number | undefined, column: IColumn | undefined) => {
    if (item && column) {
      const fieldContent = item![column.fieldName as keyof IProduct] as string;
      switch (column!.key) {
        // Pre-Icons, Bold e.g.
        default:
          return <span>{fieldContent}</span>;
      }
    }
    
    return <span></span>;
  };

  const docSelected = (item: any): void => {    
    // if (props.isTeamsMessagingExtension) {
    //   props.teamsContext.teamsJs.tasks.submitTask(item);
    // }
    console.log(item.name);
  };

  React.useEffect(() => {
    loadProducts();
  }, []);

  React.useEffect(() => {
    const opts: IDropdownOption[] = [];
    console.log(products);
    products.forEach((p) => {
      opts.push(
        { key: p.Id, text: p.Name }
      )
    });
    setOptions(opts);
  }, [products]);

  return (
    <div>
      <div className="tmContainer tmContainer-md tmContainer-sm">
        <div className="tmRow">
          <div className="tmCol9">
            <Dropdown options={options}>                 
                
            </Dropdown>
            <DetailsList
              items={products}
              columns={columns}
              onRenderItemColumn={renderItemColumn}
              // eslint-disable-next-line react/jsx-no-bind            
              onRenderRow={renderRow}
              onItemInvoked={docSelected}
            />
            <Button appearance="primary" disabled>Submit Order</Button>
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
              
          </div>
        </div>
      </div>
    </div>
  );
}

export default InitialAction;
