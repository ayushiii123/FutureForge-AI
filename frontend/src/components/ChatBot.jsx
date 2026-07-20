import { useState, useRef, useEffect } from "react";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I am TechRevive AI. How can I help you today?",
    },
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const quickReplies = [
    "💻 Laptops",
    "📱 Mobiles",
    "♻️ Refurbished",
    "📦 My Orders",
    "❤️ Wishlist",
  ];

 const sendMessage = async (text = message) => {
  if (!text.trim()) return;

  const userMessage = {
    sender: "user",
    text,
  };

  setMessages((prev) => [...prev, userMessage]);
  setMessage("");
  setLoading(true);

  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      "https://futureforge-ai-server.onrender.com",
      {
        message: text,
      },
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      }
    );

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: res.data.reply,
        products: res.data.products || [],
      },
    ]);
  
      
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: error.response?.data?.message || "❌ AI is unavailable.",
      },
    ]);
  }

  setLoading(false);
};

  return (
    <>
      {/* Floating Button */}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-indigo-600 text-white shadow-xl flex items-center justify-center hover:scale-110 transition"
      >
        {open ? (
          <FaTimes size={25} />
        ) : (
          <FaRobot size={28} />
        )}
      </button>

      <AnimatePresence>

        {open && (

          <motion.div
            initial={{
              opacity: 0,
              y: 100,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 100,
            }}
            className="fixed bottom-24 right-6 w-[360px] h-[560px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border-2 border-violet-500"
          >

            {/* Header */}

            <div className="bg-indigo-600 text-white p-4 flex items-center gap-3">

              <FaRobot size={24} />

              <div>

                <h2 className="font-bold">
                  TechRevive AI
                </h2>

                <p className="text-xs">
                  Online
                </p>

              </div>

            </div>

            {/* Messages */}

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">

              {messages.map((msg, index) => (

                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-xl text-sm ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-white shadow"
                    }`}
                  >
                    {msg.text}
                    {msg.products && msg.products.length > 0 && (
  <div className="mt-3 space-y-2">
    {msg.products.slice(0, 3).map((item) => (
      <div
        key={item._id}
        className="border rounded-lg p-2 bg-white shadow"
      >
        <img
          src={`https://futureforge-ai-server.onrender.com/uploads/${item.image}`}
          alt={item.name}
          className="w-full h-28 object-cover rounded"
        />

        <h3 className="font-semibold mt-2">
          {item.name}
        </h3>

        <p className="text-green-600 font-bold">
          ₹{item.price}
        </p>

        <p>
          ⭐ {item.rating}
        </p>
      </div>
    ))}
  </div>
)}
                  </div>

                </div>

              ))}

              {loading && (

                <div className="text-sm text-gray-500">
                  🤖 Typing...
                </div>

              )}

              <div ref={bottomRef}></div>

            </div>

            {/* Quick Replies */}

            <div className="px-3 py-2 flex gap-2 overflow-x-auto">

              {quickReplies.map((item) => (

                <button
                  key={item}
                  onClick={() => sendMessage(item)}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs whitespace-nowrap"
                >
                  {item}
                </button>

              ))}

            </div>

            {/* Input */}

            <div className="flex p-3 border-t">

              <input
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                placeholder="Type your message..."
                className="flex-1 border-2 border-violet-300 rounded-full px-4 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              />

              <button
                onClick={() => sendMessage()}
                className="ml-2 bg-indigo-600 text-white w-11 h-11 rounded-full flex justify-center items-center"
              >
                <FaPaperPlane />
              </button>

            </div>

          </motion.div>

        )}

      </AnimatePresence>
    </>
  );
};

export default ChatBot;