"use client";
import CustomerNavbar from "@/components/Navbar/CustomerNavbar";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  store: string;
  category: string;
  imageUrl: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ChatbotPage() {
  // State
  const [message, setMessage] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hello! How can I help you find products in our store today?" }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<"en" | "tw">("en");
  
  // Refs
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus on input when component loads
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to chat
    setMessages(prev => [...prev, { role: "user", content: message }]);
    
    // Clear input and set loading state
    setIsLoading(true);
    const userInput = message;
    setMessage("");
    
    try {
      const res = await fetch("http://127.0.0.1:8000/chatbot/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userInput,
          language: language,
          conversation_history: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!res.ok) {
        throw new Error(`API error! Status: ${res.status}`);
      }

      const data = await res.json();
      
      // Add assistant response to chat
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.response || "No response from chatbot." 
      }]);
      
      // Update products if any were returned
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm having trouble connecting to the server. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const setLanguageWithMessage = (newLanguage: "en" | "tw") => {
    if (language === newLanguage) return; // Don't switch if already selected
    
    setLanguage(newLanguage);
    
    // Add a system message about the language change
    setMessages(prev => [
      ...prev, 
      { 
        role: "assistant", 
        content: newLanguage === "en" 
          ? "Switching to English."
          : "Switching to Twi. Mɛkasa Twi afei." 
      }
    ]);
  };

  return (
    <>
      <CustomerNavbar />
      
      {/* Language toggle buttons */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <div className="flex justify-end mb-2 space-x-2">
          <button
            onClick={() => setLanguageWithMessage("en")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full
                      transition-colors ${language === "en" 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            aria-pressed={language === "en"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span>English 🇬🇧</span>
          </button>
          
          <button
            onClick={() => setLanguageWithMessage("tw")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full
                      transition-colors ${language === "tw" 
                        ? "bg-green-600 text-white" 
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            aria-pressed={language === "tw"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM4.332 8.027c.76-1.406 2.746-2.406 5.668-2.406 2.922 0 4.908 1 5.668 2.406.348.644-.114 1.374-.869 1.173-2.476-.656-5.09-.925-5.175-.927-.101.001-2.717.27-5.175.927-.756.201-1.218-.529-.869-1.173z" />
            </svg>
            <span>Twi 🇬🇭</span>
          </button>
        </div>
      </div>
      
      {/* Main chat container */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[600px]">
          {/* Chat header */}
          <div className={`${language === "en" ? "bg-blue-600" : "bg-green-600"} text-white p-4 flex items-center gap-3`}>
            <div className="rounded-full bg-white w-10 h-10 flex items-center justify-center">
              <svg className={`w-6 h-6 ${language === "en" ? "text-blue-600" : "text-green-600"}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path>
              </svg>
            </div>
            <h1 className="text-xl font-semibold">
              {language === "en" ? "Shopping Assistant" : "Adetɔn Boafo"}
            </h1>
          </div>
          
          {/* Messages container */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
          >
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg px-4 py-2 
                  ${msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-2 max-w-[80%]">
                  <div className="flex gap-1">
                    <div className="animate-bounce">.</div>
                    <div className="animate-bounce delay-100">.</div>
                    <div className="animate-bounce delay-200">.</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Products display (if any) */}
          {products.length > 0 && (
            <div className="bg-gray-100 p-4 max-h-[180px] overflow-y-auto">
              <h2 className="text-sm font-semibold mb-2 text-gray-600">
                {language === "en" ? "Related Products" : "Nneɛma a ɛfa ho"}:
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {products.map((product) => (
                  <div key={product.id} className="bg-white p-2 rounded shadow-sm flex">
                    <div className="w-12 h-12 bg-gray-200 rounded mr-2 overflow-hidden relative">
                      <Image 
                        src={product.imageUrl || "https://via.placeholder.com/150"} 
                        alt={product.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                      <p className="text-blue-600 text-xs">{product.formattedPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Input area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={language === "en" 
                  ? "Ask about our products..." 
                  : "Bisa yɛn nneɛma ho..."
                }
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !message.trim()}
                className={`rounded-full w-10 h-10 flex items-center justify-center
                  ${isLoading || !message.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : language === "en" ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
              >
                <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              {language === "en"
                ? "Ask questions about our products and services!"
                : "Bisa nsɛm fa yɛn nneɛma ne yɛn adwumayɛ ho!"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
