import React from "react";
const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 to-stone-900 text-amber-100 pt-24 pb-12">
      <div className="container mx-auto px-4 space-y-12">
      
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-serif font-bold">
            About&nbsp;
            <span className="text-amber-400">Culturology</span>
          </h1>
          <p className="text-lg text-amber-100/80 max-w-2xl mx-auto">
          This site was created with love—so anyone can explore the cultures and traditions of the world without leaving home.
          </p>
        </div>

       
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="mx-auto h-40 w-40 overflow-hidden rounded-full border-4 border-amber-500 shadow-lg">
            <img
              src="/assets/me.jpeg"    
              className="h-full w-full object-cover"
            />
          </div>
          <h2 className="text-3xl font-semibold text-amber-200">Бекнур У.</h2>
          <p className="text-amber-100/80">
          Hi! I’m Beknur, a full-stack developer and the creator of this project. 
          I wanted to share the stories of different cultures through firsthand accounts and multimedia. 
          Here, you’ll find traditions, quizzes, and a handy AI assistant to chat with.
          </p>
          <p className="text-amber-100/80">
          Thanks for stopping by! I hope Culturology brings you new knowledge and warm feelings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
