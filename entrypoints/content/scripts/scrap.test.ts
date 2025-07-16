import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import {
  extractJsonListFromMarkdown,
  extractRedditCommentsFromDOM,
  extractRedditPostsFromDOM,
} from "@/entrypoints/content/scripts/scrap";

describe("extractRedditPostsFromDOM", () => {
  let mockDocument: { querySelectorAll: Mock };

  beforeEach(() => {
    mockDocument = {
      querySelectorAll: vi.fn(),
    };
    global.document = mockDocument as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.document = undefined as any;
  });

  it("should extract post data from DOM elements", () => {
    const mockPostElements = [
      {
        getAttribute: vi.fn((attr) => {
          switch (attr) {
            case "post-title":
              return "Test Post Title";
            case "permalink":
              return "/r/test/comments/123";
            case "comment-count":
              return "10";
            case "score":
              return "100";
            default:
              return null;
          }
        }),
        querySelector: vi.fn((selector) => {
          if (selector === "shreddit-post-flair a span div.flair-content") {
            return { textContent: "Test Tag" };
          } else if (
            selector === 'div[data-post-click-location="text-body"] > div'
          ) {
            return { textContent: "Test Description" };
          }
          return null;
        }),
      },
      {
        getAttribute: vi.fn((attr) => {
          switch (attr) {
            case "post-title":
              return "Another Post Title";
            case "permalink":
              return "/r/another/comments/456";
            case "comment-count":
              return "5";
            case "score":
              return "50";
            default:
              return null;
          }
        }),
        querySelector: vi.fn(() => null),
      },
    ];

    mockDocument.querySelectorAll.mockReturnValue(mockPostElements);

    const result = extractRedditPostsFromDOM();

    expect(result).toEqual([
      {
        id: 0,
        title: "Test Post Title",
        link: "https://www.reddit.com/r/test/comments/123",
        comments: "10",
        tag: "Test Tag",
        description: "Test Description",
        score: "100",
      },
      {
        id: 1,
        title: "Another Post Title",
        link: "https://www.reddit.com/r/another/comments/456",
        comments: "5",
        tag: null,
        description: null,
        score: "50",
      },
    ]);
  });

  it("should handle missing attributes", () => {
    const mockPostElements = [
      {
        getAttribute: vi.fn(() => null),
        querySelector: vi.fn(() => null),
      },
    ];

    mockDocument.querySelectorAll.mockReturnValue(mockPostElements);

    const result = extractRedditPostsFromDOM();

    expect(result).toEqual([]);
  });
});

describe("extractRedditCommentsFromDOM", () => {
  let mockDocument: { querySelectorAll: Mock; getElementById: Mock };

  beforeEach(() => {
    mockDocument = {
      querySelectorAll: vi.fn(),
      getElementById: vi.fn(),
    };
    global.document = mockDocument as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.document = undefined as any;
  });

  it("should extract comment data from DOM elements", () => {
    const mockCommentElements = [
      {
        getAttribute: vi.fn((attr) => {
          switch (attr) {
            case "author":
              return "TestAuthor";
            case "permalink":
              return "/r/test/comments/123/comment/abc";
            case "thingid":
              return "t1_abc";
            case "score":
              return "100";
            default:
              return null;
          }
        }),
      },
      {
        getAttribute: vi.fn((attr) => {
          switch (attr) {
            case "author":
              return "AnotherAuthor";
            case "permalink":
              return "/r/another/comments/456/comment/def";
            case "thingid":
              return "t1_def";
            case "score":
              return "200";
            default:
              return null;
          }
        }),
      },
    ];

    mockDocument.querySelectorAll.mockReturnValue(mockCommentElements);
    mockDocument.getElementById.mockImplementation((id) => {
      if (id === "t1_abc-post-rtjson-content") {
        return { innerText: "Test Comment Text" };
      } else if (id === "t1_def-post-rtjson-content") {
        return { innerText: "Another Comment Text" };
      }
      return null;
    });

    const result = extractRedditCommentsFromDOM();

    expect(result).toEqual([
      {
        author: "TestAuthor",
        comment: "Test Comment Text",
        permalink: "/r/test/comments/123/comment/abc",
        id: "t1_abc",
        score: "100",
      },
      {
        author: "AnotherAuthor",
        comment: "Another Comment Text",
        permalink: "/r/another/comments/456/comment/def",
        id: "t1_def",
        score: "200",
      },
    ]);
  });

  it("should handle missing comment content", () => {
    const mockCommentElements = [
      {
        getAttribute: vi.fn((attr) => {
          if (attr === "thingid") return "t1_abc";
          return null;
        }),
      },
    ];

    mockDocument.querySelectorAll.mockReturnValue(mockCommentElements);
    mockDocument.getElementById.mockReturnValue(null);

    const result = extractRedditCommentsFromDOM();

    expect(result).toEqual([]);
  });
});

describe("extractJsonListFromMarkdown", () => {
  it("should extract JSON list from markdown", () => {
    const markdown =
      '```json\n [{"title": "Post 1", "link": "link1"},{"title": "Post 2", "link": "link2"}]\n```';

    const result = extractJsonListFromMarkdown(markdown);

    expect(result).toEqual([
      { title: "Post 1", link: "link1" },
      { title: "Post 2", link: "link2" },
    ]);
  });

  it("should extract JSON list from inline json", () => {
    const markdown =
      '```json\n [{"title": "Post 1", "link": "link1"},{"title": "Post 2", "link": "link2"}]\n```';

    const result = extractJsonListFromMarkdown(markdown);

    expect(result).toEqual([
      { title: "Post 1", link: "link1" },
      { title: "Post 2", link: "link2" },
    ]);
  });

  it("should handle markdown without JSON and return empty array", () => {
    const markdown = "Some text without JSON.";
    const result = extractJsonListFromMarkdown(markdown);
    expect(result).toEqual([]);
  });

  it("should extract simple JSON", () => {
    const markdown = '```json\n[{"key": "value"}]\n```';
    const result = extractJsonListFromMarkdown(markdown);
    expect(result).toEqual([{ key: "value" }]);
  });
});
