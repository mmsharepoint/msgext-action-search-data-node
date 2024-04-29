import { AzureNamedKeyCredential, TableClient, odata } from "@azure/data-tables";
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import IProduct from "../../Model/IProduct";

export async function getAllProducts(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  // Initialize response.
  const res: HttpResponseInit = {
    status: 200
  };
  const body = Object();

  const accountName: string = process.env.AZURE_TABLE_ACCOUNTNAME!;
  const storageAccountKey: string = process.env.AZURE_TABLE_KEY!;
  const storageUrl = `https://${accountName}.table.core.windows.net/`;
  const tableClient = new TableClient(storageUrl, "Products2", new AzureNamedKeyCredential(accountName, storageAccountKey));
  const products: IProduct[] = [];

  let productEntities: any;
  if (req.query.size === 0 || req.query.get('category') === 'All') {
    productEntities = await tableClient.listEntities<IProduct>();
  }
  else {
    const srchStr = req.query.get('category');
    productEntities = await tableClient.listEntities<IProduct>({
      queryOptions: { filter: odata`Category ge ${srchStr}` }
    });
  }

  let i = 1;
  for await (const p of productEntities) {
    const product = {
      Id: p.partitionKey,
      Name: p.rowKey,
      Orders: p.Orders as number,
      Category: p.Category as string
    }
    products.push(product);      
    i++;
  }
  res.body = JSON.stringify(products);
  return res; 
}

app.http("getAllProducts", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: getAllProducts
});
