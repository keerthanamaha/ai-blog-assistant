import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import background from "@/entrypoints/background";

describe("background script", () => {
  let mockChrome: any;

  beforeEach(() => {
    mockChrome = {
      runtime: {
        onInstalled: {
          addListener: vi.fn(),
        },
      },
      contextMenus: {
        create: vi.fn(),
        onClicked: {
          addListener: vi.fn(),
        },
      },
      tabs: {
        sendMessage: vi.fn(),
      },
    };
    global.chrome = mockChrome as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.chrome = undefined as any;
  });

  it("should create context menus on install", () => {
    background.main();
    expect(mockChrome.runtime.onInstalled.addListener).toHaveBeenCalled();
    const onInstalledCallback =
      mockChrome.runtime.onInstalled.addListener.mock.calls[0][0];
    onInstalledCallback();

    expect(mockChrome.contextMenus.create).toHaveBeenCalledTimes(2);
    expect(mockChrome.contextMenus.create).toHaveBeenCalledWith({
      id: "post",
      title: "Posts Insight",
      contexts: ["all"],
    });
    expect(mockChrome.contextMenus.create).toHaveBeenCalledWith({
      id: "comment",
      title: "Comment Insights",
      contexts: ["all"],
    });
  });

  it("should send message to tab when post context menu is clicked", async () => {
    background.main();

    const onClickedCallback =
      mockChrome.contextMenus.onClicked.addListener.mock.calls[0][0];

    const mockInfo = { menuItemId: "post" };
    const mockTab = { id: 123 };
    await onClickedCallback(mockInfo, mockTab);

    expect(mockChrome.tabs.sendMessage).toHaveBeenCalledWith(
      123,
      { action: "post" },
      expect.any(Function)
    );
  });

  it("should send message to tab when comment context menu is clicked", async () => {
    background.main();

    const onClickedCallback =
      mockChrome.contextMenus.onClicked.addListener.mock.calls[0][0];

    const mockInfo = { menuItemId: "comment" };
    const mockTab = { id: 456 };
    await onClickedCallback(mockInfo, mockTab);

    expect(mockChrome.tabs.sendMessage).toHaveBeenCalledWith(
      456,
      { action: "comment" },
      expect.any(Function)
    );
  });
});
