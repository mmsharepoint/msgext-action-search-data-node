import React from "react";
import { PrimaryButton } from "@fluentui//react/lib/Button";
import { ChoiceGroup, IChoiceGroupOption } from "@fluentui/react/lib/ChoiceGroup";
import { Radio, RadioGroup, Button } from "@fluentui/react-components";
import { SelectionItemId, Skeleton, SkeletonItem } from "@fluentui/react-components";
import { List, ListItem } from "@fluentui/react-list-preview";
import { app, dialog } from "@microsoft/teams-js";
import Axios from "axios";
import IProduct from "../../Model/IProduct";

/**
 * This component is used to display the required
 * privacy statement which can be found in a link in the
 * about tab.
 */
const InitialAction: React.FC<{}> = () =>  {
  const [categories, setCategories] = React.useState<IChoiceGroupOption[]>([]);
  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [selectedItems, setSelectedItems] = React.useState<SelectionItemId[]>([]);
  const [selectedProduct, setSelectedProduct] = React.useState<IProduct | undefined>();
  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>('');

  const loadContext = async () => {
    await app.initialize();
  };

  const loadProducts = (srchStrng: string) => {
    setIsLoading(true);
    let requestUrl = `${process.env.REACT_APP_FUNC_ENDPOINT}/api/getallproducts`;
    if (srchStrng !== '') {
      requestUrl += `?category=${srchStrng}`;
    }
    Axios.get(requestUrl,{
                responseType: "json"                
    }).then(result => {
      if (result.data) {
        setProducts(result.data);
        // Extract distinct categories
        const cats: IChoiceGroupOption[] = [{ key: 'All', text: 'All' }];
        for (const p of result.data) {
          var index = cats.map(function(e) { return e.text; }).indexOf(p.Category);
          if (index < 0) {
            cats.push({ key: p.Category, text: p.Category });
          }
        }
        setCategories(cats);
      }     
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  const onCategoryChange = React.useCallback((ev: any, option: IChoiceGroupOption | undefined) => {
    setSelectedCategory(option!.key);
  }, []);

  const btnClicked  = React.useCallback(() => {
    dialog.url.submit({product: selectedProduct});
  }, [selectedProduct]);

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
            <List
              selectionMode="single"
              selectedItems={selectedItems}
              onSelectionChange={(_: any, data: any) => {
                setSelectedItems(data.selectedItems);
                if (data.selectedItems[0] === selectedItems[0]) {
                  alert("Double click!");
                }
                products.forEach(p => {
                  if (p.Id === data.selectedItems[0]) {
                    setSelectedProduct(p); // Assuming unique Ids
                  }
                });
              }}
            >
              {products.map(({ Id, Name, Category }) => (
                <ListItem key={Id} value={Id} aria-label={Name}>
                  <div className="tmCol4 listCol1">{Name}</div>
                  <div className="tmCol3">{Category}</div>
                </ListItem>
              ))}
            </List>
          </div>
          <div className="tmCol3">
            <ChoiceGroup name="DataSrc" required options={categories} defaultSelectedKey="All" onChange={onCategoryChange} />
          </div>
        </div>
        {isLoading ?? <div className="tmRow">
          <Skeleton appearance="opaque" as="div">
            <div className={"skelFirstRow"}>
              <SkeletonItem shape="circle" size={24} />
              <SkeletonItem shape="rectangle" size={16} />
            </div>
            <div className={"skelSecondThirdRow"}>
              <SkeletonItem shape="circle" size={24} />
              <SkeletonItem size={16} />
              <SkeletonItem size={16} />
              <SkeletonItem size={16} />
              <SkeletonItem size={16} />
            </div>
            <div className={"skelSecondThirdRow"}>
              <SkeletonItem shape="square" size={24} />
              <SkeletonItem size={16} />
              <SkeletonItem size={16} />
              <SkeletonItem size={16} />
              <SkeletonItem size={16} />
            </div>
          </Skeleton>
        </div>}
        <div className="tmRow">
          <div className="tmCol9">
            <div className="sbmBtn">
              <PrimaryButton text="Submit" title="Submit" disabled={selectedProduct === undefined} onClick={btnClicked}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InitialAction;
