import { useEffect, useState } from 'react';
import axios from 'axios';

interface Course {
  crn: string;
  course_id: string;
  course_name: string;
  section: string;
}

interface AddClassProps {
  user: {
    first_name: string;
    last_name: string;
    roster: string;
  } | null;
}

const AddClass = ({ user }: AddClassProps) => {
  const [allClasses, setAllClasses] = useState<Course[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addedCrns, setAddedCrns] = useState<Set<string>>(new Set());

  // Load all available classes
  useEffect(() => {
    axios.get('http://localhost:8000/api/classes/')
      .then((res) => {
        setAllClasses(res.data);
        setFilteredClasses(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch courses:', err);
      });
  }, []);

  // Load user's classes and mark them as added
  useEffect(() => {
    if (!user) return;

    axios.get('http://localhost:8000/api/users/get_user_classes/', {
      params: {
        roster: user.roster,
      },
    }).then((res) => {
      const crns = new Set(res.data.classes.map((cls: Course) => cls.crn));
      setAddedCrns(crns);
    }).catch((err) => {
      console.error("Failed to load user's classes:", err);
    });
  }, [user]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = allClasses.filter((c) =>
      `${c.course_id} - ${c.course_name}`.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredClasses(filtered);
  };

  const handleAddClass = async (crn: string) => {
    if (!user || addedCrns.has(crn)) return;

    try {
      await axios.post('http://localhost:8000/api/users/add_classes_to_user/', {
        roster: user.roster,
        crn_list: [crn],
      });
      setAddedCrns(new Set([...Array.from(addedCrns), crn]));
    } catch (err) {
      console.error('❌ Failed to add class:', err);
      alert('Could not add class. Check console for details.');
    }
  };

  const handleRemoveClass = async (crn: string) => {
    if (!user || !addedCrns.has(crn)) return;

    try {
      await axios.delete('http://localhost:8000/api/users/delete_user_classes/', {
        data: {
          roster: user.roster,
          crn_list: [crn],
        },
      });

      const newSet = new Set(addedCrns);
      newSet.delete(crn);
      setAddedCrns(newSet);
    } catch (err) {
      console.error('❌ Failed to remove class:', err);
      alert('Could not remove class. Check console for details.');
    }
  };

  return (
  <div className="fixed inset-0 bg-gradient-to-br from-purple-100 via-purple-200 to-yellow-100 overflow-y-auto">
  <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8">

    <div className="min-h-screen w-full pt-16 bg-gradient-to-br from-purple-100 via-purple-200 to-yellow-100 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Add a Class</h1>

        <input
          type="text"
          placeholder="Search for a class..."
          className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchQuery}
          onChange={handleSearch}
        />

        <div className="space-y-3">
          {filteredClasses.map((course, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 bg-white shadow rounded-lg"
            >
              <span className="text-gray-800 font-medium">
                {course.course_id} - {course.course_name} - {course.section}
              </span>
              {addedCrns.has(course.crn) ? (
                <button
                  onClick={() => handleRemoveClass(course.crn)}
                  className="px-3 py-1 text-sm rounded-lg font-bold bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={() => handleAddClass(course.crn)}
                  className="px-3 py-1 text-sm rounded-lg font-bold bg-sky-500 text-white hover:bg-blue-600 transition"
                >
                  Add
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  </div>
  );
};

export default AddClass;
