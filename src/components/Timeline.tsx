import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Briefcase } from 'lucide-react';
import JobModal from './JobModal';
import jobsData from '../data/jobs.json';

interface TimelineProps {
  onYearChange: (year: number) => void;
}

interface Job {
  company: string;
  companyDescription?: string;
  title: string;
  jobDescription?: string;
  startYear: string;
  endYear: string;
}

interface Decade {
  name: string;
  startYear: number;
  endYear: number;
  displayName: string;
}

const Timeline: React.FC<TimelineProps> = ({ onYearChange }) => {
  const [selectedDecade, setSelectedDecade] = useState<string>('20s');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const decades: Decade[] = [
    { name: '80s', startYear: 1980, endYear: 1989, displayName: "80's" },
    { name: '90s', startYear: 1990, endYear: 1999, displayName: "90's" },
    { name: '00s', startYear: 2000, endYear: 2009, displayName: "00's" },
    { name: '10s', startYear: 2010, endYear: 2019, displayName: "10's" },
    { name: '20s', startYear: 2020, endYear: 2029, displayName: "20's" }
  ];

  // Use imported jobs data
  const jobs: Job[] = jobsData;

  // Location data
  const locations: { [key: string]: string } = {
    "1974": "Perugia",
    "1978": "Crotone", 
    "1992": "Siena",
    "2004": "Milano",
    "2011": "Amsterdam",
    "2015": "Edinburgh"
  };

  useEffect(() => {
    // Set current year based on selected decade
    const decade = decades.find(d => d.name === selectedDecade);
    if (decade) {
      const currentYear = Math.min(decade.endYear, new Date().getFullYear());
      onYearChange(currentYear);
    }
  }, [selectedDecade, onYearChange]);

  const getJobsForDecade = (decadeName: string): Job[] => {
    const decade = decades.find(d => d.name === decadeName);
    if (!decade) return [];

    return jobs.filter(job => {
      const startYear = parseInt(job.startYear);
      const endYear = job.endYear ? parseInt(job.endYear) : new Date().getFullYear();
      
      // Job overlaps with decade if it starts before decade ends and ends after decade starts
      return startYear <= decade.endYear && endYear >= decade.startYear;
    });
  };

  const getLocationMilestonesForDecade = (decadeName: string): Array<{year: string, location: string}> => {
    const decade = decades.find(d => d.name === decadeName);
    if (!decade) return [];

    return Object.entries(locations)
      .filter(([year]) => {
        const yearNum = parseInt(year);
        return yearNum >= decade.startYear && yearNum <= decade.endYear;
      })
      .map(([year, location]) => ({ year, location }));
  };

  const handleDecadeClick = (decadeName: string) => {
    setSelectedDecade(decadeName);
  };

  const handleJobClick = (job: Job) => {
    if (job.companyDescription || job.jobDescription) {
      setSelectedJob(job);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const renderJobText = (job: Job) => {
    if (job.title) {
      return (
        <div>
          <div className="font-bold text-orange-400 text-xs">
            {job.title}
          </div>
          <div className="text-sm text-gray-300 mt-1">
            {job.company}
          </div>
        </div>
      );
    }
    return <div className="text-sm text-gray-300">{job.company}</div>;
  };

  const getJobYearRange = (job: Job): string => {
    if (job.endYear && job.endYear !== job.startYear) {
      return `${job.startYear} - ${job.endYear}`;
    }
    return job.startYear;
  };

  const selectedDecadeData = decades.find(d => d.name === selectedDecade);
  const currentDecadeJobs = getJobsForDecade(selectedDecade);
  const currentDecadeLocations = getLocationMilestonesForDecade(selectedDecade);

  return (
    <>
      <div className="relative min-h-screen flex pt-20 pb-32">
        {/* Timeline Header */}
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-30 bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700 shadow-2xl">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-orange-400" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{selectedDecadeData?.displayName}</div>
              <div className="text-sm text-gray-400">{selectedDecadeData?.startYear} - {selectedDecadeData?.endYear}</div>
            </div>
            <Clock className="w-6 h-6 text-silver-400" />
          </div>
        </div>

        {/* Left Side - Timeline with Decades */}
        <div className="w-80 flex-shrink-0 pl-8 pr-8">
          <div className="relative h-[calc(100vh-12rem)] flex flex-col">
            {/* Timeline Line */}
            <div className="absolute left-16 top-0 bottom-0 w-1 bg-gradient-to-b from-silver-400 via-orange-200 to-orange-500 opacity-80"></div>

            {/* Decade Rectangles */}
            <div className="relative flex flex-col justify-between h-full py-8">
              {decades.map((decade, index) => (
                <div key={decade.name} className="relative flex items-center">
                  {/* Decade Rectangle */}
                  <div 
                    className={`absolute left-12 w-8 h-16 rounded cursor-pointer transition-all duration-300 ${
                      selectedDecade === decade.name
                        ? 'bg-blue-500 opacity-100 border-2 border-blue-300 shadow-lg shadow-blue-500/50 scale-110'
                        : 'bg-blue-400 opacity-50 hover:opacity-75 hover:scale-105'
                    }`}
                    onClick={() => handleDecadeClick(decade.name)}
                  />
                  
                  {/* Decade Label */}
                  <div className="ml-24">
                    <div className={`text-lg font-bold transition-colors duration-300 ${
                      selectedDecade === decade.name ? 'text-blue-300' : 'text-gray-400'
                    }`}>
                      {decade.displayName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {decade.startYear} - {decade.endYear}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Content for Selected Decade */}
        <div className="flex-1 pr-8">
          <div className="space-y-6">
            {/* Location Milestones */}
            {currentDecadeLocations.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-orange-400 mb-4">Locations</h3>
                <div className="grid gap-3">
                  {currentDecadeLocations.map(({ year, location }) => (
                    <div key={year} className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-3 border border-gray-600">
                      <div className="flex items-center space-x-2 mb-1">
                        <MapPin className="w-4 h-4 text-orange-400" />
                        <div className="text-lg font-bold text-white">{year}</div>
                      </div>
                      <div className="text-sm text-gray-300">
                        {location === "Perugia" ? `Born in ${location}` : `Moved to ${location}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Job Milestones */}
            {currentDecadeJobs.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Career</h3>
                <div className="grid gap-3 max-w-2xl">
                  {currentDecadeJobs.map((job, index) => (
                    <div 
                      key={index} 
                      className="bg-gradient-to-l from-blue-600 to-blue-700 rounded-lg p-3 border border-gray-600 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl"
                      onClick={() => handleJobClick(job)}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Briefcase className="w-4 h-4 text-blue-400" />
                        <div className="text-sm font-bold text-white">{getJobYearRange(job)}</div>
                      </div>
                      <div>
                        {renderJobText(job)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {currentDecadeJobs.length === 0 && currentDecadeLocations.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">
                  No milestones recorded for the {selectedDecadeData?.displayName}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Detail Modal */}
      <JobModal 
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
};

export default Timeline;