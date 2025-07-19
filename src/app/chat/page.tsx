import { AppHeader } from "@/components/app-header";
import ChatInterface from "@/components/chat-interface";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-dvh">
      <AppHeader title="AI Assistant" hasTitle={false} />
      <div className="flex-1 overflow-y-auto">
        <ChatInterface />
      </div>
    </div>
  );
}
