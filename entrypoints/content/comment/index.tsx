import { useFormData } from "@/entrypoints/hooks/formData";

import { useState } from "react";
import Markdown from "react-markdown";
import Header from "../common/header";
import { IComment, IPost } from "../scripts/scrap";
import Search from "../common/search";
import axios from "axios";
import customToast from "../common/customToast";

export default function CommentModal({
  post,
  comments,
  onRemove,
}: {
  post: IPost[];
  comments: IComment[];
  onRemove: () => void;
}) {
  const { formData } = useFormData();
  const [loading, setLoading] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState<string | null>(null);

  const handlePostClick = (comment: IComment) => {
    if (comment.permalink) {
      window.open(comment.permalink, "_blank", "noopener,noreferrer");
    }
  };

  const handleSearch = async (searchQuery: string) => {
    setLoading(true);
    setGeminiResponse(null);
    const url = `${formData?.endpoint}?key=${formData?.apiKey}`;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `
            This is the prompt: ${searchQuery} 
            This is the dataset of comments in js array: '''${JSON.stringify(
              comments
            )}'''
            This is the post dataset: '''${JSON.stringify(post[0])}'''

            Now based on this post dataset and the comment dataset and the prompt, 
            give me what it asked on the prompt. Not any other text. 
            `,
            },
          ],
        },
      ],
    };

    try {
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setGeminiResponse(data);
    } catch (error) {
      customToast({
        message: "Api error generating response",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark bg-gray-900 w-[700px]">
      <div
        id="reddit-modal"
        className="bg-card rounded-lg shadow-xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden"
      >
        <Header title="Comments" count={comments.length} onRemove={onRemove} />

        <Search handleSearch={handleSearch} />

        {loading && (
          <p className="text-center text-white text-2xl">Loading...</p>
        )}

        <div className="overflow-y-auto p-4">
          <Markdown>{geminiResponse}</Markdown>
        </div>

        <div className="px-2 flex-1 overflow-auto">
          {comments?.map((comment) => (
            <div
              key={comment.id}
              className="m-3 p-4 rounded-lg border border-border transition-all duration-200 cursor-pointer hover:shadow-md bg-card relative group dark:bg-gray-800 dark:border-gray-700"
              onClick={() => handlePostClick(comment)}
            >
              <div className="absolute top-0 right-0 w-24 h-24 opacity-5 rounded-bl-full bg-gradient-to-br from-gray-900 via-purple-900 to-black"></div>

              <div className="flex flex-col relative">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground dark:text-gray-400">
                  <span className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-medium">
                    {comment.author}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 dark:text-gray-300">
                  {comment.comment}
                </p>
                <div className="mt-3 flex items-center text-muted-foreground pt-2 border-t border-border dark:text-gray-400 dark:border-gray-700">
                  <span className="text-sm mr-4">Score: {comment.score}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
