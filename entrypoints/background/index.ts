export default defineBackground({
  main() {
    chrome.runtime.onInstalled.addListener(() => {
      chrome.contextMenus.create({
        id: "post",
        title: "Posts Insight",
        contexts: ["all"],
      });
      chrome.contextMenus.create({
        id: "comment",
        title: "Comment Insights",
        contexts: ["all"],
      });
    });

    chrome.contextMenus.onClicked.addListener(async (info, tab) => {
      if (info.menuItemId === "post") {
        chrome.tabs.sendMessage(
          tab?.id!,
          { action: "post" },
          function (response) {
            console.info("response", response);
          }
        );
      }
      if (info.menuItemId === "comment") {
        chrome.tabs.sendMessage(
          tab?.id!,
          { action: "comment" },
          function (response) {
            console.info("response", response);
          }
        );
      }
    });
  },
});
