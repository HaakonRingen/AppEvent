import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import translations, {getEventCategories} from "../translations";

interface EventFilterProps {
  onFilterChange: (filters: { date: string; place: string; category: string; search: string }) => void;
}

const EventFilter: React.FC<EventFilterProps> = ({ onFilterChange }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const eventCategories = getEventCategories(language);

  const [filters, setFilters] = useState({ date: "", place: "", category: "", search: "" });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = { date: "", place: "", category: "", search: "" };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md w-[300px]">
      <h2 className="text-lg font-semibold mb-2">{t.filterEvents}</h2>
      
      <label className="block mb-2">
        {t.date}:
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </label>
      
      <label className="block mb-2">
        {t.place}:
        <input
          type="text"
          name="place"
          value={filters.place}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </label>
      
      <label className="block mb-2">
        {t.category}:
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">{t.selectCategory}</option>
          {eventCategories.map((category: string, index: number) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="block mb-2">
        {t.search}:
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder={t.searchPlaceholder}
        />
      </label>

      <button 
        onClick={handleReset} 
        className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        {t.resetFilters}
      </button>
    </div>
  );
};

export default EventFilter;
