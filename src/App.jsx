import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  MessageCircle,
  Star,
  Trash2,
  Plus,
  Minus,
  X,
  CheckCircle,
  Menu,
  Phone,
  MapPin,
  Info,
  Clock,
  Truck
} from 'lucide-react';

// URL da Logo (assumindo que o arquivo ChocoChik_logo.png está na pasta public)
const LOGO_URL = "ChocoChik_logo.png";

// --- Configuração de Dados e Cores ---
// Cores do PRD:
// Primária: #a25906 (Marrom Dourado)
// Secundária: #f44d06 (Laranja Vibrante)
// Acento: #f59e0b (Amarelo Âmbar)
// Fundo: #0f172a (Azul Escuro Slate)

const PRODUCTS = [
  {
    id: 1,
    name: "Brownie Clássico",
    description: "Nossa receita original com chocolate belga 70% e nozes crocantes.",
    price: 12.90,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600",
    rating: 4.9
  },
  {
    id: 2,
    name: "Brownie com Nutella",
    description: "O clássico coberto com uma camada generosa de avelã cremosa.",
    price: 15.90,
    image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&q=80&w=600",
    rating: 5.0
  },
  {
    id: 3,
    name: "Brownie Blondie",
    description: "Versão chocolate branco com pedaços de cranberry e pistache.",
    price: 14.50,
    image: "https://images.unsplash.com/photo-1610613222568-d05545a16511?auto=format&fit=crop&q=80&w=600",
    rating: 4.7
  },
  {
    id: 4,
    name: "Pizza de Brownie",
    description: "Ideal para compartilhar. 8 fatias com toppings variados.",
    price: 55.00,
    image: "https://images.unsplash.com/photo-1564758564527-b97d79e8a355?auto=format&fit=crop&q=80&w=600",
    rating: 4.8
  },
  {
    id: 5,
    name: "Box Degustação",
    description: "4 mini brownies de sabores sortidos em uma caixa presenteável.",
    price: 32.00,
    image: "https://images.unsplash.com/photo-1515037893149-de7f840978e2?auto=format&fit=crop&q=80&w=600",
    rating: 4.9
  },
  {
    id: 6,
    name: "Brownie de Caramelo Salgado",
    description: "Equilíbrio perfeito entre o doce do caramelo e a flor de sal.",
    price: 16.50,
    image: "https://images.unsplash.com/photo-1550952936-84c1ce71676f?auto=format&fit=crop&q=80&w=600",
    rating: 4.8
  }
];

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('form'); // form | success

  // Estado do formulário de checkout
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'pix'
  });

  // Calcular total
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // --- Funções do Carrinho ---
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  // --- Funções de Checkout e WhatsApp ---
  const handleInputChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleFinishOrder = (e) => {
    e.preventDefault();
    setCheckoutStep('success');

    // Gerar mensagem para WhatsApp
    const orderId = Math.floor(Math.random() * 10000);

    // Lista de itens detalhada com valores individuais
    // Usamos \n para quebras de linha que serão codificadas corretamente depois
    const itemsList = cart.map(item => {
      const subtotal = (item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      return `• ${item.quantity}x ${item.name} (${subtotal})`;
    }).join('\n');

    const totalFormatted = cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const pixKey = "(81) 99760-0212";

    // Construção da Mensagem Completa
    let message = `*PEDIDO NOVO #${orderId} - ChocoChik*\n\n` +
      `*👤 Cliente:* ${customer.name}\n` +
      `*📱 Telefone:* ${customer.phone}\n` +
      `*📍 Endereço:* ${customer.address}\n` +
      `*💳 Pagamento:* ${customer.paymentMethod === 'pix' ? 'PIX' : 'Cartão na Entrega'}\n\n` +
      `*🛒 RESUMO DO PEDIDO:*\n${itemsList}\n\n` +
      `*💰 VALOR TOTAL A PAGAR:* ${totalFormatted}\n`;

    // Adiciona a Chave PIX se o método for PIX
    if (customer.paymentMethod === 'pix') {
      message += `--------------------------------\n` +
                 `*🔑 DADOS PARA PAGAMENTO VIA PIX:*\n` +
                 `Chave (Celular): *${pixKey}*\n` +
                 `_Por favor, envie o comprovante para agilizar o envio._\n`;
    }

    message += `--------------------------------\n` +
      `_Aguardando confirmação e envio da nota fiscal._`;

    // encodeURIComponent garante que todos os caracteres (acentos, quebras de linha) funcionem na URL
    window.open(`https://wa.me/5581997600212?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSupportClick = () => {
    const message = "Olá! Gostaria de saber mais sobre os prazos de entrega e sabores disponíveis.";
    window.open(`https://wa.me/5581997600212?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-[#f44d06] selection:text-white pb-20 md:pb-0">

      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo Container */}
          <div className="flex items-center gap-4 py-2">
            <div className="relative h-12 w-auto aspect-[3/1] transition-transform hover:scale-105 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img
                src={LOGO_URL}
                alt="ChocoChik Logo"
                className="h-full w-full object-contain drop-shadow-md"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback caso a imagem não carregue */}
              <div className="hidden items-center gap-2 h-full">
                <div className="bg-[#a25906] p-1.5 rounded-lg">
                  <Star className="w-5 h-5 text-white fill-current" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  Choco<span className="text-[#f44d06]">Chik</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-white/5 rounded-full transition-colors group"
            >
              <ShoppingCart className="w-6 h-6 text-slate-300 group-hover:text-[#f59e0b]" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#f44d06] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                  {itemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="pt-24 pb-12 px-4 md:pt-32 md:pb-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a25906]/20 text-[#f59e0b] text-sm font-medium border border-[#a25906]/30">
              <Star className="w-3 h-3 fill-current" />
              Melhor Brownie da Cidade
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Adoce seu dia com <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f44d06] to-[#f59e0b]">
                elegância e sabor.
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-md">
              Brownies artesanais feitos com chocolate nobre. Peça agora e receba em casa com nossa entrega expressa.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#f44d06] hover:bg-[#d94105] text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-[#f44d06]/20 active:scale-95"
              >
                Ver Cardápio
              </button>
              <button
                onClick={handleSupportClick}
                className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-semibold transition-all border border-white/10 flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Falar no WhatsApp
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#a25906] to-[#f44d06] rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <img
              src="https://images.unsplash.com/photo-1514517604298-cf80e0fb7f8e?auto=format&fit=crop&q=80&w=800"
              alt="Brownie Hero"
              className="relative rounded-2xl shadow-2xl border border-white/10 rotate-2 hover:rotate-0 transition-transform duration-500 w-full object-cover h-64 md:h-96"
            />
          </div>
        </div>
      </section>

      {/* --- MENU / PRODUTOS --- */}
      <section id="menu" className="py-12 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Menu className="w-6 h-6 text-[#f59e0b]" />
              Nossos Brownies
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map(product => (
              <div key={product.id} className="bg-[#1e293b] rounded-2xl overflow-hidden border border-white/5 hover:border-[#a25906]/50 transition-all group hover:-translate-y-1 hover:shadow-xl hover:shadow-[#a25906]/10 flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 text-xs text-[#f59e0b] font-bold">
                    <Star className="w-3 h-3 fill-current" />
                    {product.rating}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-slate-400 text-sm mb-4 flex-1">{product.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold text-[#f59e0b]">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-[#a25906] hover:bg-[#8c4b05] text-white p-2.5 rounded-lg transition-colors active:scale-90"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES AUTOMATION INFO --- */}
      <section className="py-12 border-t border-white/5 bg-[#0b1120]">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="p-6 bg-[#1e293b]/50 rounded-xl border border-white/5">
            <div className="w-12 h-12 bg-[#f44d06]/20 rounded-lg flex items-center justify-center mb-4 mx-auto md:mx-0 text-[#f44d06]">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Atendimento Automático</h3>
            <p className="text-sm text-slate-400">Tire dúvidas sobre frete e sabores instantaneamente pelo nosso Bot no WhatsApp.</p>
          </div>
          <div className="p-6 bg-[#1e293b]/50 rounded-xl border border-white/5">
            <div className="w-12 h-12 bg-[#f59e0b]/20 rounded-lg flex items-center justify-center mb-4 mx-auto md:mx-0 text-[#f59e0b]">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Rastreio em Tempo Real</h3>
            <p className="text-sm text-slate-400">Receba atualizações do status do seu brownie diretamente no seu celular.</p>
          </div>
          <div className="p-6 bg-[#1e293b]/50 rounded-xl border border-white/5">
            <div className="w-12 h-12 bg-[#a25906]/20 rounded-lg flex items-center justify-center mb-4 mx-auto md:mx-0 text-[#a25906]">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Recibo Digital</h3>
            <p className="text-sm text-slate-400">Sua nota fiscal e comprovante chegam em PDF assim que o pagamento é confirmado.</p>
          </div>
        </div>
      </section>

      {/* --- CART DRAWER --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-[#1e293b] h-full shadow-2xl flex flex-col animate-slide-in-right">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#0f172a]">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#f44d06]" />
                Seu Carrinho
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-10 opacity-50 flex flex-col items-center">
                  <ShoppingCart className="w-16 h-16 mb-4 stroke-1" />
                  <p>Seu carrinho está vazio.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 bg-[#0f172a] p-3 rounded-xl border border-white/5">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-slate-800" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-medium line-clamp-1">{item.name}</h4>
                        <p className="text-[#f59e0b] font-bold">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-[#1e293b] rounded-lg border border-white/10">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-[#f44d06]"><Minus className="w-4 h-4" /></button>
                          <span className="text-sm w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-[#f44d06]"><Plus className="w-4 h-4" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-slate-500 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-5 bg-[#0f172a] border-t border-white/10 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-slate-400">Total</span>
                <span className="text-2xl font-bold text-white">
                  {cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <button
                disabled={cart.length === 0}
                onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                className="w-full bg-[#f44d06] hover:bg-[#d94105] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-[#f44d06]/20 transition-all flex items-center justify-center gap-2"
              >
                Finalizar Compra
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CHECKOUT MODAL --- */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCheckoutOpen(false)}></div>

          <div className="relative bg-[#1e293b] w-full max-w-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-white/10 bg-[#0f172a] flex justify-between items-center">
              <h2 className="text-xl font-bold">Checkout Seguro</h2>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {checkoutStep === 'form' ? (
              <form onSubmit={handleFinishOrder} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Seu Nome</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={customer.name}
                    onChange={handleInputChange}
                    placeholder="Como gostaria de ser chamado?"
                    className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-3 focus:outline-none focus:border-[#f44d06] transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">WhatsApp (com DDD)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={customer.phone}
                      onChange={handleInputChange}
                      placeholder="(11) 99999-9999"
                      className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-3 pl-10 focus:outline-none focus:border-[#f44d06] transition-colors"
                    />
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Enviaremos o recibo e status por aqui.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Endereço de Entrega</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <textarea
                      required
                      name="address"
                      value={customer.address}
                      onChange={handleInputChange}
                      placeholder="Rua, Número, Bairro, Complemento"
                      className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-3 pl-10 h-24 resize-none focus:outline-none focus:border-[#f44d06] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Forma de Pagamento</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCustomer({...customer, paymentMethod: 'pix'})}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${customer.paymentMethod === 'pix' ? 'bg-[#f44d06]/20 border-[#f44d06] text-[#f44d06]' : 'bg-[#0f172a] border-white/10 text-slate-400 hover:border-white/30'}`}
                    >
                      PIX (Instantâneo)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomer({...customer, paymentMethod: 'card'})}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${customer.paymentMethod === 'card' ? 'bg-[#f44d06]/20 border-[#f44d06] text-[#f44d06]' : 'bg-[#0f172a] border-white/10 text-slate-400 hover:border-white/30'}`}
                    >
                      Cartão na Entrega
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-[#25D366] hover:bg-[#1ebc57] text-white py-3.5 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                    <MessageCircle className="w-5 h-5" />
                    Finalizar no WhatsApp
                  </button>
                  <p className="text-center text-xs text-slate-500 mt-3">
                    Ao clicar, você será redirecionado para o WhatsApp da loja com o resumo do pedido formatado.
                  </p>
                </div>
              </form>
            ) : (
              <div className="p-8 text-center flex flex-col items-center animate-fade-in">
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Pedido Enviado!</h3>
                <p className="text-slate-400 mb-6">
                  Obrigado, {customer.name}! Se a janela do WhatsApp não abriu, verifique seu bloqueador de pop-ups.
                </p>
                <div className="bg-[#0f172a] p-4 rounded-lg border border-white/10 w-full mb-6 text-left">
                  <div className="flex items-center gap-2 text-[#f59e0b] font-bold text-sm mb-2">
                    <Info className="w-4 h-4" />
                    Próximos Passos:
                  </div>
                  <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside">
                    <li>Aguarde a confirmação do atendente.</li>
                    <li>O comprovante/recibo será enviado automaticamente no chat.</li>
                    <li>O motoboy avisará quando sair para entrega.</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setCheckoutStep('form');
                    setIsCheckoutOpen(false);
                    setCart([]);
                  }}
                  className="text-white bg-[#a25906] px-6 py-2 rounded-lg hover:bg-[#8c4b05] transition-colors"
                >
                  Fazer Novo Pedido
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- FLOATING SUPPORT BUTTON --- */}
      <button
        onClick={handleSupportClick}
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#1ebc57] text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center gap-2 group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          Dúvidas?
        </span>
      </button>

      {/* --- STYLES FOR ANIMATIONS --- */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out forwards; }
        .animate-scale-up { animation: scale-up 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
}