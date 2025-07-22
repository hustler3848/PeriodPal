import ChatInterface from "@/components/chat-interface";
import { AppHeader } from "@/components/app-header";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-dvh">
      <AppHeader title="AI Assistant" />
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}

    