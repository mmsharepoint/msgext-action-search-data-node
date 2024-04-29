import React from "react";
import { PrimaryButton } from "@fluentui//react/lib/Button";
import { ChoiceGroup, IChoiceGroupOption } from "@fluentui/react/lib/ChoiceGroup";
import { DetailsList, DetailsRow, IColumn, IDetailsRowProps, IDetailsRowStyles, Selection } from '@fluentui/react/lib/DetailsList';
import { app, dialog } from "@microsoft/teams-js";
import Axios from "axios";
import IProduct from "../../Model/IProduct";

/**
 * This component is used to display the required
 * privacy statement which can be found in a link in the
 * about tab.
 */
const InitialAction: React.FC<{}> = () =>  {
  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [selectedproduct, setSelectedProduct] = React.useState<IProduct | undefined>();
  const [selectedProductKey, setSelectedProductKey] = React.useState<number | undefined>();
  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>('');

  let selection: Selection = new Selection({
    onSelectionChanged: () => { setSelectedProductKey(selection.getSelectedCount()) 
  }
  });

  const columns = [
    { key: 'column1', name: 'Name', fieldName: 'Name', minWidth: 60, maxWidth: 120, isResizable: true },
    { key: 'column2', name: 'Category', fieldName: 'Category', minWidth: 150, maxWidth: 150, isResizable: true },
  ];

  const options: IChoiceGroupOption[] = [
    { key: 'All', text: 'All' },
    { key: 'Merch', text: 'Merch' },
    { key: 'Electronics', text: 'Electronics' },
    { key: 'D', text: 'Option D', disabled: true },
  ];

  const loadContext = async () => {
    await app.initialize();
    const context = await app.getContext();
  };

  const loadProducts = (srchStrng: string) => {
    let requestUrl = `${process.env.REACT_APP_FUNC_ENDPOINT}/api/getallproducts`;
    if (srchStrng !== '') {
      requestUrl += `?category=${srchStrng}`;
    }
    Axios.get(requestUrl,{
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

  const docExecuted = (item: any): void => {    
    const product: IProduct = { Id: item.Id, Name: item.Name, Category: item.Category, Orders: item.Orders };
    setSelectedProduct(product);
    dialog.url.submit({product: product});
  };

  const onCategoryChange = React.useCallback((ev: any, option: IChoiceGroupOption | undefined) => {
    setSelectedCategory(option!.key);
  }, []);

  React.useEffect(() => {
    loadContext();
    loadProducts('');
  }, []);

  React.useEffect(() => {
    loadProducts(selectedCategory!);
  }, [selectedCategory]);

  return (
    <div>
      <div className="tmContainer">
        <div className="tmRow">
          <div className="tmCol9">
            <DetailsList
              items={products}
              columns={columns}
              onRenderItemColumn={renderItemColumn}
              // eslint-disable-next-line react/jsx-no-bind
              onRenderRow={renderRow}
              onItemInvoked={docExecuted}
              selection={selection}
            />        
          </div>
          <div className="tmCol3">
            <ChoiceGroup name="DataSrc" required options={options} onChange={onCategoryChange} >
            
            </ChoiceGroup>
  
          </div>
        </div>
        <div className="tmRow">
          <div className="tmCol9">
            <div className="sbmBtn">
              <PrimaryButton text="Submit" title="Submit" disabled={selectedProductKey!>0} onClick={docExecuted}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InitialAction;
