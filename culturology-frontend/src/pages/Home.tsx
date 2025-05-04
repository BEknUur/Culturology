import { Link } from "react-router-dom";

const Home = () => (
   
  <>
    
    <section className="mx-auto flex max-w-5xl flex-col items-center py-16 text-center">
      <h1 className="mb-6 text-4xl font-bold md:text-5xl">
        Discover the World’s Hidden Cultures
      </h1>
      <p className="mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
        Explore traditions, stories and languages of indigenous peoples across the globe.
        Chat with an AI representative, view photo galleries and test your knowledge in quizzes.
      </p>
      <Link
        to="/cultures"
        className="rounded bg-primary-500 px-6 py-3 font-semibold text-white shadow hover:bg-primary-600 focus:outline-none"
      >
        Explore Cultures
      </Link>
    </section>
  </>
);
export default Home;