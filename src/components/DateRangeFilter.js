// components/DateRangeFilter.js
export default function DateRangeFilter({ dateFilter, setDateFilter }) {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setDateFilter(prev => ({ ...prev, [name]: value }));
    };
  
    const clearFilters = () => {
      setDateFilter({ startDate: '', endDate: '' });
    };
  
    return (
      <div className="flex items-center space-x-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            From
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={dateFilter.startDate}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded"
          />
        </div>
        
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            To
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={dateFilter.endDate}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded"
          />
        </div>
        
        {(dateFilter.startDate || dateFilter.endDate) && (
          <button
            onClick={clearFilters}
            className="mt-5 text-sm text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        )}
      </div>
    );
  }
  
 