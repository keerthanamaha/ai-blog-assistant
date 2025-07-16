import { useFormData } from "@/entrypoints/hooks/formData";
import axios from "axios";
import customToast from "../common/customToast";
import Header from "../common/header";
import Search from "../common/search";
import { extractJsonListFromMarkdown, IPost } from "../scripts/scrap";

export default function PostModal({
  posts,
  onRemove,
}: {
  posts: IPost[];
  onRemove: () => void;
}) {
  const { formData } = useFormData();
  const [loading, setLoading] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState<IPost[]>([]);

  const handlePostClick = (post: IPost) => {
    if (post.link) {
      window.open(post.link, "_blank", "noopener,noreferrer");
    }
  };

  const handleSearch = async (searchQuery: string) => {
    setLoading(true);
    setGeminiResponse([]);
    const url = `${formData?.endpoint}?key=${formData?.apiKey}`;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `
            This is the prompt: ${searchQuery} 
            This is the dataset of posts in js array: '''${JSON.stringify(
              posts
            )}'''
           
            Now based on this post dataset and and the prompt, 
            give me all the related posts match matched with what prompt asked. 
            Use, description, title, tag, score, comments, for matching most relevant posts.
            Give me the list of posts with the same format as I have given you.
            Don't give me any extra text even if you failed to find any post. 
            Just give me empty array if not match found. And if found give me the list of posts with the same data format.
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
      const extractData = extractJsonListFromMarkdown(
        data as string
      ) as IPost[];
      console.info(extractData);
      setGeminiResponse(extractData);
    } catch (error) {
      customToast({
        message: "Api error generating response",
        status: "error",
      });
      setGeminiResponse([]);
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
        <Header
          title="Posts"
          count={geminiResponse?.length || posts?.length}
          onRemove={onRemove}
        />

        <Search handleSearch={handleSearch} />

        {loading && (
          <p className="text-center text-white text-2xl">Loading...</p>
        )}

        <div className="px-2 flex-1 overflow-auto">
          {(geminiResponse?.length ? geminiResponse : posts)?.map((post) => (
            <div
              key={post.id}
              className="m-3 p-4 rounded-lg border border-border transition-all duration-200 cursor-pointer hover:shadow-md bg-card relative group dark:bg-gray-800 dark:border-gray-700"
              onClick={() => handlePostClick(post)}
            >
              <div className="absolute top-0 right-0 w-24 h-24 opacity-5 rounded-bl-full bg-gradient-to-br from-gray-900 via-purple-900 to-black"></div>

              <div className="flex flex-col relative">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground dark:text-gray-400">
                  <span className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-medium">
                    {post.tag}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-foreground dark:text-white">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 dark:text-gray-300">
                  {post.description}
                </p>
                <div className="mt-3 flex items-center text-muted-foreground pt-2 border-t border-border dark:text-gray-400 dark:border-gray-700">
                  <span className="text-sm mr-4">Score: {post.score}</span>
                  <span className="text-sm">{post.comments} comments</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
