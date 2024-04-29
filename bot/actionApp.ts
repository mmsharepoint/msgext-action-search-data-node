import {
  TeamsActivityHandler,
  CardFactory,
  TurnContext,
  MessagingExtensionAction,
  MessagingExtensionActionResponse,
  AdaptiveCardInvokeResponse,
  AdaptiveCardInvokeValue,
  MessageFactory,
} from "botbuilder";
import * as ACData from "adaptivecards-templating";
import DisplayProductOrder from "./adaptiveCards/DisplayProductOrder.json";
import OderCard from "./adaptiveCards/OrderForm.json";

export class ActionApp extends TeamsActivityHandler {
  //Action
  public async handleTeamsMessagingExtensionSubmitAction(
    context: TurnContext,
    action: MessagingExtensionAction
  ): Promise<MessagingExtensionActionResponse> {
    
    const template = new ACData.Template(OderCard);
    const card = template.expand({
      $root: {
        Id: action.data.product.Id ?? "",
        Name: action.data.product.Name ?? "",
        Orders: action.data.product.Orders ?? "",
      },
    });
    const attachment = CardFactory.adaptiveCard(card);
    return {
      composeExtension: {
        type: "result",
        attachmentLayout: "list",
        attachments: [attachment],
      },
    };
  }

  public async handleTeamsMessagingExtensionFetchTask(_context: TurnContext, _action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse> {
    // const taskModuleUrl = `${process.env.BOT_ENDPOINT}:53000/index.html#/initialaction`;
    const taskModuleUrl = "https://localhost:53000/index.html#/initialaction";
    const resp: MessagingExtensionActionResponse = {
      task: {
        type: 'continue',
        value: {
          width: "large",
          height: "medium",
          title: "Select a Product",
          url: taskModuleUrl
        }
      }
    }

    return resp;
  }
  public async onAdaptiveCardInvoke(_context: TurnContext, _invokeValue: AdaptiveCardInvokeValue): Promise<AdaptiveCardInvokeResponse> {      
    let item = JSON.stringify(_invokeValue.action.data);
    console.log(item);

    const prodId = new String(_invokeValue.action.data.Id ?? "");
    const prodName = new String(_invokeValue.action.data.Name ?? "");
    const prodOrders: Number = new Number(_invokeValue.action.data.Orders ?? 0);
    const prodAddOrders1: Number = new Number(_invokeValue.action.data.orderId ?? 0);
    const prodAddOrders2: Number = new Number(_invokeValue.action.data.orderId1 ?? 0);
    const prodAddOrders3: Number = new Number(_invokeValue.action.data.orderId2 ?? 0);
    const prodAddOrders4: Number = new Number(_invokeValue.action.data.orderId3 ?? 0);
    const prodAddOrders5: Number = new Number(_invokeValue.action.data.orderId4 ?? 0);
    const newProduductOders = prodOrders.valueOf() + 
                              prodAddOrders1.valueOf() + 
                              prodAddOrders2.valueOf() +
                              prodAddOrders3.valueOf() +
                              prodAddOrders4.valueOf() +
                              prodAddOrders5.valueOf();
    // const verb: string = _invokeValue.action.verb;
    
        // Update Orders
        // ProductController productCtrl = new ProductController(_config);
        // Product resultProduct = productCtrl.UpdateProductOrders(actionData);

    const template = new ACData.Template(OderCard);
    const card = template.expand({
      $root: {
        Id: prodId,
        Name: prodName,
        Orders: newProduductOders.toString()
      },
    });
    const attachment = CardFactory.adaptiveCard(card);
    var messageActivity = MessageFactory.attachment(attachment);
    await _context.sendActivity(messageActivity);

    const resp: AdaptiveCardInvokeResponse = {
      statusCode: 200,
      value: null,
      type: "result"
    }
    return Promise.resolve(resp);
  }
}
