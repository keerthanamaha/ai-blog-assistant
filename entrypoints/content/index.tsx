import ReactDOM from "react-dom/client";
import { ContentScriptContext } from "wxt/client";
import "../popup/style.css";
import CommentModal from "./comment";
import { CreateContentElement } from "./common";
import PostModal from "./posts";
import {
  extractRedditCommentsFromDOM,
  extractRedditPostsFromDOM,
} from "./scripts/scrap";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    chrome.runtime.onMessage.addListener(
      async (message, sender, sendResponse) => {
        switch (message.action) {
          case "post":
            const ui = await CreateUi(ctx, "posts");
            ui.mount();
            break;

          case "comment":
            const commentui = await CreateUi(ctx, "comment");
            commentui.mount();
            break;

          default:
            break;
        }
      }
    );
  },
});

const CreateUi = async (
  ctx: ContentScriptContext,
  type: "posts" | "comment"
) => {
  return createShadowRootUi(ctx, {
    name: "post-element",
    position: "inline",
    onMount: (uiContainer, shadow, shadowContainer) => {
      return CreateContentElement(uiContainer, shadowContainer, (root) => {
        const onRemove = () => {
          root?.unmount();
          shadowContainer.style.visibility = "hidden";
        };

        const posts = extractRedditPostsFromDOM();

        switch (type) {
          case "posts":
            return <PostModal posts={posts} onRemove={onRemove} />;

          case "comment":
            const comments = extractRedditCommentsFromDOM();

            return (
              <CommentModal
                post={posts}
                comments={comments}
                onRemove={onRemove}
              />
            );

          default:
            return "";
        }
      }) as ReactDOM.Root;
    },
    onRemove(root) {
      root?.unmount();
    },
  });
};
