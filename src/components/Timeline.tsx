import React, { useState, useEffect } from 'react';
import { Calendar, Briefcase } from 'lucide-react';
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
    { name: '20s', startYear: 2020, endYear: 2029, displayName: "20's" },
  ];

  const jobs: Job[] = jobsData;

  useEffect(() => {
    // Set current year to the middle of the selected decade
    const decade = decades.find(d => d.name === selectedDecade);
    if (decade) {
      const midYear = Math.floor((decade.startYear + decade.endYear) / 2);
      onYearChange(midYear);
    }
  }, [selectedDecade, onYearChange]);

  const handleDecadeClick = (decadeName: string) => {
    setSelectedDecade(decadeName);
  };

  const getJobsForDecade = (decadeName: string): Job[] => {
    const decade = decades.find(d => d.name === decadeName);
    if (!decade) return [];

    return jobs.filter(job => {
      const jobStartYear = parseInt(job.startYear);
      const jobEndYear = job.endYear ? parseInt(job.endYear) : jobStartYear;
      
      // Job overlaps with decade if it starts before decade ends and ends after decade starts
      return jobStartYear <= decade.endYear && jobEndYear >= decade.startYear;
    });
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

  const selectedDecadeJobs = getJobsForDecade(selectedDecade);
  const currentDecade = decades.find(d => d.name === selectedDecade);

  return (
    <>
      <div className="relative min-h-screen flex">
        {/* Timeline Header */}
        <div className="fixed top-20 left-24 transform -translate-x-1/2 z-30 bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700 shadow-2xl">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-orange-400" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{currentDecade?.displayName}</div>
              <div className="text-sm text-gray-400">Career Timeline</div>
            </div>
          </div>
        </div>

        {/* Left Side - Timeline with Decades */}
        <div className="w-64 flex flex-col items-center">
          {/* Timeline Line */} 
          <div className="relative w-1 bg-gradient-to-b from-silver-400 via-orange-200 to-orange-500 opacity-80">
            {/* Decade Rectangles */}
            {decades.map((decade, index) => (
              <div
                key={decade.name}
                className={`absolute w-8 h-16 rounded cursor-pointer transition-all duration-300 transform -translate-x-1/2 ${
                  selectedDecade === decade.name
                    ? 'bg-blue-500/80 border-2 border-blue-400 shadow-lg shadow-blue-500/30 scale-110'
                    : 'bg-blue-400/50 border border-blue-300 hover:bg-blue-400/70 hover:scale-105'
                }`}
                style={{
                  top: `${(index * (64 + 8)) + 8}px`, // 64px height + 8px padding
                  left: '50%'
                }}
                onClick={() => handleDecadeClick(decade.name)}
                title={decade.displayName}
              >
                <div className="flex items-center justify-center h-full">
                  <span className="text-white text-xs font-bold transform -rotate-90 whitespace-nowrap">
                    {decade.displayName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Job Milestones */}
        <div className="flex-1 pt-40 pb-20 pr-8">
          <div className="max-w-4xl">
            <h2 className="text-xl font-bold text-white mb-6">
              Jobs in the {currentDecade?.displayName}
            </h2>
            
            {selectedDecadeJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedDecadeJobs.map((job, index) => (
                  <div
                    key={`${job.company}-${job.startYear}-${index}`}
                    className="bg-gradient-to-l from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-lg p-3 border border-gray-600 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl"
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
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">
                  No jobs recorded for the {currentDecade?.displayName}
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