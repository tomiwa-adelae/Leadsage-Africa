import { AIChatInterface } from "@/components/ai-chat/AIChatInterface";

interface AISearchPageProps {
  searchParams: Promise<{
    query?: string;
  }>;
}

export default async function AISearchPage({ searchParams }: AISearchPageProps) {
  const params = await searchParams;
  const query = params.query || "";

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      {/* Header Section */}
      <div className="border-b bg-card flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">AI Property Assistant</h1>
            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
              BETA
            </span>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto h-full max-w-6xl">
          <AIChatInterface initialMessage={query} />
        </div>
      </div>
    </div>
  );
}
