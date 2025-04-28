import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setConversation(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Here you would make the actual API call to OpenAI
      setTimeout(() => {
        setConversation(prev => [
          ...prev,
          { role: 'assistant', content: 'Это временный ответ. Необходимо интегрировать API OpenAI для получения реальных ответов.' }
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Ошибка:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-lg shadow-xl">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">AI Ассистент</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="animate-pulse">Думаю...</div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Задайте вопрос..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
              >
                Отправить
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AIAssistant;