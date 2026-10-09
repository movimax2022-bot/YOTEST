import React, { useState } from 'react';
import {
  X,
  Headphones,
  Phone,
  MessageCircle,
  HelpCircle,
  Send,
  Bot,
  User,
  Sparkles,
} from 'lucide-react';
import { useBarber } from '../../context/BarberContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

export const SupportModal: React.FC = () => {
  const { supportModalOpen, setSupportModalOpen, language, user } = useBarber();

  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'agent',
      text:
        language === 'en'
          ? `Hello ${user.name}! Welcome to Barbería Madrid Support. How can we assist you with your appointment or cuts today?`
          : language === 'fr'
          ? `Bonjour ${user.name} ! Bienvenue au support Barbería Madrid. Comment pouvons-nous vous aider aujourd'hui ?`
          : language === 'pt'
          ? `Olá ${user.name}! Bem-vindo ao suporte da Barbería Madrid. Como podemos te ajudar hoje?`
          : `¡Hola ${user.name}! Bienvenido a la atención al cliente de Barbería Madrid Gran Vía. ¿En qué podemos ayudarte con tus citas o consultas hoy?`,
      time: 'Ahora',
    },
  ]);

  if (!supportModalOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: userText,
        time: nowTime,
      },
    ]);
    setInputMsg('');

    // Automated intelligent multilingual response
    setTimeout(() => {
      let botResponse = '¡Gracias por contactarnos! Tu consulta ha sido registrada y un recepcionista te responderá en breve.';
      const lower = userText.toLowerCase();

      if (lower.includes('cita') || lower.includes('cancel') || lower.includes('hora')) {
        botResponse = 'Puedes gestionar, modificar o cancelar tus citas directamente desde la sección "Mis citas" de la aplicación en cualquier momento.';
      } else if (lower.includes('barbero') || lower.includes('carlos') || lower.includes('mateo')) {
        botResponse = 'Nuestros barberos están disponibles de Lunes a Sábado de 9:00 a 21:00 en Calle Gran Vía 123. Puedes marcar a tu favorito desde Mi Perfil.';
      } else if (lower.includes('precio') || lower.includes('pago') || lower.includes('tarjeta')) {
        botResponse = 'Aceptamos Tarjeta de crédito/débito, Apple Pay, Google Pay, Bizum y efectivo en mostrador con total seguridad.';
      } else if (language === 'en') {
        botResponse = 'Thank you for reaching out! You can easily book or manage your appointments anytime, or call us directly at +34 912 345 678.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'agent',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 800);
  };

  const handleCall = () => {
    window.open('tel:+34912345678', '_self');
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/34912345678', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#10151f] border border-[#232f42] rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[650px] max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1c2738] flex items-center justify-between bg-[#0c1017]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="text-base font-black text-white">Centro de Soporte Multilingüe</h3>
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Agentes disponibles en directo (ES • EN • FR • PT)
              </p>
            </div>
          </div>

          <button
            onClick={() => setSupportModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Contact Buttons Row */}
        <div className="p-3 bg-[#151c27] border-b border-[#202c3e] flex gap-2">
          <button
            onClick={handleCall}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>Llamar al +34 912 345 678</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800/50 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chatear por WhatsApp</span>
          </button>
        </div>

        {/* Live Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-left">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 max-w-[85%] ${
                m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  m.sender === 'user'
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-slate-800 text-amber-400 border border-slate-700'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div>
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-amber-500 text-black font-medium rounded-tr-none'
                      : 'bg-[#18212e] text-slate-200 border border-[#253245] rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block px-1">
                  {m.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Field */}
        <form onSubmit={handleSend} className="p-3 border-t border-[#1c2738] bg-[#0c1017] flex gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Escribe tu mensaje o consulta de soporte..."
            className="flex-1 bg-[#16202e] border border-[#263447] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
