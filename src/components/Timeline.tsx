import React, { useState } from 'react';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string[];
  type: 'job' | 'education' | 'project';
}

interface Location {
  id: number;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface TimelineProps {
  jobs: Job[];
  locations: Location[];
}

const Timeline: React.FC<TimelineProps> = ({ jobs, locations }) => {
  const [selectedDecade, setSelectedDecade] = useState('20s');

  const decades = [
    { id: '80s', label: "80's", range: [1980, 1989] },
    { id: '90s', label: "90's", range: [1990, 1999] },
    { id: '00s', label: "00's", range: [2000, 2009] },
    { id: '10s', label: "10's", range: [2010, 2019] },
    { id: '20s', label: "20's", range: [2020, 2029] }
  ];

  const getDecadeFromDate = (dateString: string) => {
    const year = new Date(dateString).getFullYear();
    if (year >= 1980 && year <= 1989) return '80s';
    if (year >= 1990 && year <= 1999) return '90s';
    if (year >= 2000 && year <= 2009) return '00s';
    if (year >= 2010 && year <= 2019) return '10s';
    if (year >= 2020 && year <= 2029) return '20s';
    return '20s';
  };

  const filteredJobs = jobs.filter(job => getDecadeFromDate(job.startDate) === selectedDecade);
  const filteredLocations = locations.filter(location => getDecadeFromDate(location.startDate) === selectedDecade);

  return (
    <div className="flex h-screen">
      {/* Fixed Timeline */}
      <div className="fixed left-0 top-0 w-80 h-screen bg-gray-900 z-20 flex flex-col items-center justify-center p-8">
        {/* Vertical Line */}
        <div className="relative h-96 w-1 bg-gray-600">
          {/* Decade Rectangles */}
          {decades.map((decade, index) => (
            <button
              key={decade.id}
              onClick={() => setSelectedDecade(decade.id)}
              className={`absolute left-1/2 transform -translate-x-1/2 w-16 h-12 rounded transition-all duration-200 ${
                selectedDecade === decade.id
                  ? 'bg-blue-400 opacity-100 border-2 border-blue-300 shadow-lg scale-110'
                  : 'bg-blue-400 opacity-50 hover:opacity-75'
              }`}
              style={{
                top: `${index * 20}%`,
              }}
            >
              <span className="text-white text-xs font-semibold">{decade.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="ml-80 flex-1 overflow-y-auto h-screen p-8">
        <div className="space-y-6">
          {/* Location Milestones */}
          {filteredLocations.map((location) => (
            <div key={location.id} className="bg-purple-100 border-l-4 border-purple-500 p-4 rounded-r">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <h3 className="text-sm font-semibold text-purple-800">
                  {location.city}, {location.country}
                </h3>
              </div>
              <p className="text-xs text-purple-600 mb-1">
                {location.startDate} - {location.endDate}
              </p>
              <p className="text-xs text-purple-700">{location.description}</p>
            </div>
          ))}

          {/* Job Milestones */}
          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-2 min-w-36">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <h3 className="text-sm font-semibold text-gray-800">{job.title}</h3>
                </div>
                <p className="text-xs text-gray-600 mb-1">{job.company}</p>
                <p className="text-xs text-gray-500 mb-1">
                  {job.startDate} - {job.endDate}
                </p>
                <p className="text-xs text-gray-700 mb-2">{job.description}</p>
                <div className="flex flex-wrap gap-1">
                  {job.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-1 py-0.5 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;