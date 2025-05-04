// src/pages/Cultures.tsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import { getCultures, searchCultures } from "@/api";
import { Culture } from "@/types";
import CultureCard from "@/components/CultureCard";
import SearchBar from "@/components/SearchBar";

const Cultures = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Функция загрузки (с учётом фильтров)
  const loadCultures = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Запрос API:", query ? `поиск: ${query}` : "все культуры", region ? `регион: ${region}` : "");
      
      const data = query || region
        ? await searchCultures(query, region)
        : await getCultures();
      
      console.log("Ответ API:", data);
      
      // Проверка ответа
      if (!data) {
        console.error("API вернул пустой ответ");
        setError("Не удалось загрузить данные: пустой ответ");
        setCultures([]);
        return;
      }
      
      // защищаемся от некорректного ответа
      if (Array.isArray(data)) {
        console.log(`Получено ${data.length} записей культур`);
        setCultures(data);
      } else {
        console.error("API вернул не массив:", data);
        setError("Неверный формат данных от сервера");
        setCultures([]);
      }
    } catch (error) {
      console.error("Ошибка загрузки культур:", error);
      setError(`Ошибка: ${error instanceof Error ? error.message : String(error)}`);
      setCultures([]);
    } finally {
      setLoading(false);
    }
  };

  // Вызывать при монтировании и каждый раз при изменении query/region
  useEffect(() => {
    // Загружаем культуры, только если пользователь вошел в систему
    if (isLoaded && isSignedIn) {
      loadCultures();
    }
  }, [query, region, isLoaded, isSignedIn]);

  // Условный рендеринг ПОСЛЕ всех хуков
  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/signin" replace />;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <SearchBar onSearch={setQuery} onRegionChange={setRegion} />

      {loading ? (
        <p className="text-center py-8">Загрузка культур...</p>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
          <button 
            onClick={loadCultures}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Попробовать снова
          </button>
        </div>
      ) : cultures.length === 0 ? (
        <p className="text-center py-8">Культуры не найдены.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cultures.map((c) => (
            <CultureCard key={c.id} culture={c} />
          ))}
        </div>
      )}
      
    
    
    </div>
  );
};

export default Cultures;