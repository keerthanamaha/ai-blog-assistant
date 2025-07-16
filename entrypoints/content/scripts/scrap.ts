export interface IPost {
  title: string;
  link: string;
  comments: string | null;
  tag: string | null;
  description: string | null;
  score: string | null;
  id: number;
}

export interface IComment {
  author: string;
  comment: string;
  permalink: string;
  id: string;
  score: string;
}

export function extractRedditPostsFromDOM() {
  const postElements = document.querySelectorAll("shreddit-post");
  const postData: IPost[] = [];

  postElements.forEach((postElement, key) => {
    const title = postElement.getAttribute("post-title")?.trim();
    const permalink = postElement.getAttribute("permalink");
    const fullLink = permalink ? `https://www.reddit.com${permalink}` : null;
    const commentCount = postElement.getAttribute("comment-count");
    const tagElement = postElement.querySelector(
      "shreddit-post-flair a span div.flair-content"
    );
    const tag =
      tagElement && tagElement.textContent
        ? tagElement.textContent.trim()
        : null;
    const descriptionElement = postElement.querySelector(
      'div[data-post-click-location="text-body"] > div'
    );
    const description =
      descriptionElement && descriptionElement.textContent
        ? descriptionElement.textContent.trim()
        : null;

    const scoreElement = postElement.getAttribute("score");
    const score = scoreElement ? scoreElement : null;

    if (title && fullLink) {
      postData.push({
        id: key,
        title: title,
        link: fullLink,
        comments: commentCount,
        tag: tag,
        description: description,
        score: score,
      });
    }
  });

  return postData;
}

export function extractRedditCommentsFromDOM(): IComment[] {
  const commentElements = document.querySelectorAll("shreddit-comment");

  const comments: IComment[] = [];

  commentElements.forEach((commentElement, key) => {
    const author = commentElement.getAttribute("author") || "";
    const permalink = commentElement.getAttribute("permalink") || "";
    const thingId = commentElement.getAttribute("thingid");
    const commentContentDiv = document.getElementById(
      `${thingId}-post-rtjson-content`
    );
    const score = commentElement.getAttribute(`score`) || "";

    if (commentContentDiv) {
      const commentText = commentContentDiv.innerText || "";
      comments.push({
        author,
        comment: commentText,
        permalink,
        id: thingId || key.toString(),
        score,
      });
    } else {
      console.warn(`Comment content not found for thingId: ${thingId}`);
    }
  });

  return comments;
}

export function extractJsonListFromMarkdown(markdownText: string): IPost[] {
  const jsonRegex = /```(?:json|javascript)?\n([\s\S]*?)\n```|`({[\s\S]*?})`/g;
  const jsonLists = [];
  let match;

  while ((match = jsonRegex.exec(markdownText)) !== null) {
    try {
      const jsonString = match[1] || match[2];
      if (jsonString) {
        const parsedJson = JSON.parse(jsonString);
        if (Array.isArray(parsedJson)) {
          jsonLists.push(parsedJson);
        }
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }

  return jsonLists[0] || [];
}
