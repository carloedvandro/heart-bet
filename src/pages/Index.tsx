import HeartGrid from "@/components/HeartGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-heart-pink to-heart-purple">
            Loteria dos Corações
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Escolha até 5 corações coloridos para sua aposta. Cada cor representa um número
            secreto que será revelado no sorteio.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <HeartGrid />
        </div>
      </div>
    </div>
  );
};

export default Index;