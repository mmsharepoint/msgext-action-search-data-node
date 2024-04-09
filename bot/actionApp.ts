import {
  TeamsActivityHandler,
  CardFactory,
  TurnContext,
  MessagingExtensionAction,
  MessagingExtensionActionResponse,
} from "botbuilder";
import * as ACData from "adaptivecards-templating";
import helloWorldCard from "./adaptiveCards/helloWorldCard.json";

export class ActionApp extends TeamsActivityHandler {
  //Action
  public async handleTeamsMessagingExtensionSubmitAction(
    context: TurnContext,
    action: MessagingExtensionAction
  ): Promise<MessagingExtensionActionResponse> {
    // The user has chosen to create a card by choosing the 'Create Card' context menu command.
    const template = new ACData.Template(helloWorldCard);
    const card = template.expand({
      $root: {
        title: action.data.title ?? "",
        subTitle: action.data.subTitle ?? "",
        text: action.data.text ?? "",
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
}
