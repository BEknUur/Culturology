import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [year] = useState(new Date().getFullYear());
  
  return (
    <footer className="relative overflow-hidden border-t border-amber-800/30 bg-stone-900 py-12 text-amber-100/80">
      
      <div className="absolute -top-12 -left-12 h-24 w-24 rounded-full border border-amber-700/20"></div>
      <div className="absolute -bottom-16 right-1/4 h-32 w-32 rounded-full border border-amber-700/20"></div>
      
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center">
              <div className="mr-3 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-amber-700">
                <div className="h-6 w-6 rounded-full bg-stone-800 p-1">
                  <div className="h-full w-full rounded-full bg-amber-400"></div>
                </div>
              </div>
              <span className="font-serif text-xl font-bold text-amber-400">Culturology</span>
            </div>
            <p className="mb-4 max-w-md text-sm leading-relaxed">
              Dedicated to preserving and sharing the stories, traditions, and heritage of 
              indigenous peoples from around the world. We invite you to explore, learn, and 
              appreciate the rich cultural diversity that makes our world so beautiful.
            </p>
            <div className="flex space-x-4">
  <a href="https://t.me/bergty" className="text-amber-400 hover:text-amber-300" aria-label="Telegram">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.25 1.58-1.32 5.41-1.87 7.19-.14.44-.41.58-.67.58-.34 0-.53-.26-.82-.51-.45-.39-1.39-1.18-2.15-1.85-.3-.26-.6-.29-.87-.29-.32 0-.83.16-1.22.3-.41.15-.78.22-1.25.22-.76 0-1.36-.22-1.87-.63-.54-.44-.91-1.11-1.19-1.89-1.18-3.54-.69-5.75.51-6.7.33-.26.75-.39 1.19-.39.28 0 .56.07.81.11.63.12 1.03.26 1.5.52.73.4 1.15.45 1.57.45.38 0 .96-.1 1.87-.4.77-.25 1.41-.36 1.93-.36.5 0 .9.1 1.17.3.4.29.56.7.66 1.24z"/>
    </svg>
  </a>
  <a href="https://www.linkedin.com/in/beknur-ualikhanuly-039704245/" className="text-amber-400 hover:text-amber-300" aria-label="LinkedIn">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
    </svg>
  </a>
  <a href="https://github.com/BEknUur" className="text-amber-400 hover:text-amber-300" aria-label="GitHub">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
    </svg>
  </a>
</div>
          </div>
          
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold text-amber-400">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-amber-300">Home</Link>
              </li>
              <li>
                <Link to="/cultures" className="hover:text-amber-300">Explore Cultures</Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-amber-300">Cultural Map</Link>
              </li>
              <li>
                <Link to="/media" className="hover:text-amber-300">Media</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-300">About Us</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold text-amber-400">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>ualihanulybeknur@gmail.com</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Islam Karimova 70.<br />Almaty</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col items-center border-t border-amber-800/30 pt-6 text-center">
          
          <div className="flex space-x-4 text-xs">
            <Link to="/privacy" className="hover:text-amber-300">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-amber-300">Terms of Service</Link>
            <span>•</span>
            <Link to="/sitemap" className="hover:text-amber-300">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;