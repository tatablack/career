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

const Timeline: React.FC<TimelineProps> = ({ onYearChange }) => {
  const [currentYear, setCurrentYear] = useState<number>(1974);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const startYear = 1974;
  const endYear = (new Date()).getFullYear();
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  const yearSpanMinHeight = 60;
  const yearSpanBottom = 100;
  const defaultMilestoneHeight = `${(years.length * (yearSpanMinHeight + yearSpanBottom))}px`;
  
  // Location data
  const locations: { [key: string]: string } = {
    "1974": "Perugia",
    "1978": "Crotone", 
    "1992": "Siena",
    "2004": "Milano",
    "2011": "Amsterdam",
    "2015": "Edinburgh"
  };

  // Use imported jobs data
  const jobs: Job[] = jobsData;

  useEffect(() => {
    resetTimelineHeight();
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollTop / maxScroll;
      const yearIndex = Math.floor(scrollProgress * (years.length - 1));
      const newYear = years[yearIndex] || startYear;
      setCurrentYear(newYear);
      onYearChange(newYear);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [years, onYearChange]);

  const getMilestoneText = (year: number): string => {
    const location = locations[year.toString()];
    return location ? (location === "Perugia" ? `Born in ${location}` : `Moved to ${location}`) : "";
  };

  const hasLocationMilestone = (year: number): boolean => {
    return false;
    //return locations.hasOwnProperty(year.toString());
  };

  const getJobMilestones = (year: number): Job[] => {
    return jobs.filter(job => parseInt(job.startYear) === year);
  };

  const groupJobsByDuration = (jobs: Job[]): { sameEndYear: Job[], differentEndYear: Job[] } => {
    const sameEndYear: Job[] = [];
    const differentEndYear: Job[] = [];
    
    // Group jobs by their end year
    const endYearGroups: { [key: string]: Job[] } = {};
    
    jobs.forEach(job => {
      const endYear = job.endYear || job.startYear;
      if (!endYearGroups[endYear]) {
        endYearGroups[endYear] = [];
      }
      endYearGroups[endYear].push(job);
    });
    
    // Separate groups with multiple jobs (same end year) from single jobs
    Object.values(endYearGroups).forEach(group => {
      if (group.length > 1) {
        sameEndYear.push(...group);
      } else {
        differentEndYear.push(...group);
      }
    });
    
    return { sameEndYear, differentEndYear };
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
          <div className="font-bold text-orange-400 text-sm">
            {job.title}
          </div>
          <div className="text-lg text-gray-300 mt-2.5">
            {job.company}
          </div>
        </div>
      );
    }
    return <div className="text-lg text-gray-300">{job.company}</div>;
  };

  const getJobYearRange = (job: Job): string => {
    if (job.endYear && job.endYear !== job.startYear) {
      return `${job.startYear} - ${job.endYear}`;
    }
    return job.startYear;
  };

  const hasJobDescriptions = (job: Job): boolean => {
    return !!(job.companyDescription || job.jobDescription);
  };

  const renderGroupedJobs = (jobs: Job[], year: number) => {
    return (
      <div 
        className={`inline-block min-w-72 bg-gradient-to-l ${
          currentYear >= parseInt(jobs[0].startYear) && currentYear <= parseInt(jobs[0].endYear) 
            ? 'from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30' 
            : 'from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600'
        } rounded-lg p-4 border border-gray-600 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl`}
        onClick={() => handleJobClick(jobs[0])}
      >
        <div className="flex items-center space-x-2 mb-2">
          <Briefcase className="w-5 h-5 text-blue-400" />
          <div className="text-lg font-bold text-white">{getJobYearRange(jobs[0])}</div>
        </div>
        <div className="space-y-3">
          {jobs.map((job, index) => (
            <div key={index} className={index > 0 ? "pt-3 border-t border-gray-600" : ""}>
              {renderJobText(job)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSeparateJobs = (jobs: Job[], year: number) => {
    return (
      <div className="flex flex-col space-y-3 min-w-72">
        {jobs.map((job, index) => {
          return (
            <div 
              key={index} 
              className={`w-full bg-gradient-to-l ${
                currentYear >= parseInt(job.startYear) && currentYear <= parseInt(job.endYear) 
                  ? 'from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30' 
                  : 'from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600'
              } rounded-lg p-4 border border-gray-600 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl`}
              onClick={() => handleJobClick(job)}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                <div className="text-lg font-bold text-white">{getJobYearRange(job)}</div>
              </div>
              <div>
                {renderJobText(job)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const getLifeStage = (currentYear: number, birthYear: number): string => {
    const age = currentYear - birthYear;
  
    if (age >= 0 && age <= 12) {
      return 'Childhood';
    } else if (age >= 13 && age <= 19) {
      return 'Adolescence';
    } else if (age >= 20) {
      return 'Adulthood';
    } else {
      return 'Invalid age';
    }
  };

  /**
   * Alternative function that calculates the minimum distance between element edges
   * @param element1 - First HTML element
   * @param element2 - Second HTML element
   * @returns The minimum distance in pixels between the edges of the two elements
   */
  function getMinDistanceBetweenElements(element1: HTMLElement, element2: HTMLElement): number {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    
    // Calculate horizontal distance
    let horizontalDistance = 0;
    if (rect1.right < rect2.left) {
      horizontalDistance = rect2.left - rect1.right;
    } else if (rect2.right < rect1.left) {
      horizontalDistance = rect1.left - rect2.right;
    }
    
    // Calculate vertical distance
    let verticalDistance = 0;
    if (rect1.bottom < rect2.top) {
      verticalDistance = rect2.top - rect1.bottom;
    } else if (rect2.bottom < rect1.top) {
      verticalDistance = rect1.top - rect2.bottom;
    }
    
    // If elements overlap, return 0
    if (horizontalDistance === 0 && verticalDistance === 0) {
      return 0;
    }
    
    // Return the distance between edges
    return Math.sqrt(horizontalDistance * horizontalDistance + verticalDistance * verticalDistance);
  };

  const getTimelineHeight = (): string => {
    const firstElement = document.querySelector("#firstYear") as HTMLElement;
    const lastElement = document.querySelector("#lastYear") as HTMLElement;

    if (firstElement && lastElement) {
      return `${getMinDistanceBetweenElements(firstElement, lastElement)}px`;
    } else {
      return defaultMilestoneHeight;
    }
  };

  const resetTimelineHeight = (): void => {
    const timeline = document.querySelector("#timeline") as HTMLElement;
    if (timeline) {
      timeline.style.height = getTimelineHeight();
    }
  }

  
  return (
    <>
      <div className="relative min-h-screen flex flex-col items-center justify-start pt-20 pb-32">
        {/* Timeline Header */}
        <div className="fixed top-20 left-24 transform -translate-x-1/2 z-30 bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700 shadow-2xl">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-orange-400" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{currentYear}</div>
              <div className="text-sm text-gray-400">{getLifeStage(currentYear, 1974)}</div>
            </div>
            <Clock className="w-6 h-6 text-silver-400" />
          </div>
        </div>

        {/* Timeline Line */}
        <div id="timeline" className="absolute left-24 w-1 bg-gradient-to-b from-silver-400 via-orange-200 to-orange-500 opacity-80" style={{ top: "7.8rem", height: getTimelineHeight() }}></div>

        {/* Timeline Items */}
        <div className="relative w-full max-w-6xl pl-8">
          {years.map((year, index) => {
            const jobMilestones = getJobMilestones(year);
            const { sameEndYear, differentEndYear } = groupJobsByDuration(jobMilestones);
            const yearId = year === startYear ? "firstYear" : (year === endYear ? "lastYear" : "")
            
            return (
              <div
                key={year}
                className="relative flex items-center mb-20"
                style={{ minHeight: `${yearSpanMinHeight}px` }}
              >
                {/* Year Node */}
                <div className="absolute left-16 transform -translate-x-1/2 z-20">
                  <div id={yearId} className={`w-6 h-6 rounded-full border-4 transition-all duration-300 ${
                    year === currentYear
                      ? 'bg-orange-500 border-orange-400 shadow-lg shadow-orange-500/50 scale-125'
                      : 'bg-gray-800 border-gray-600 hover:bg-silver-400 hover:border-silver-300'
                  }`}></div>
                </div>

                {/* Location Milestones - Left Side */}
                {hasLocationMilestone(year) && (
                  <div className="mr-auto pr-8 w-60">
                    <div className="text-right">
                      <div className={`inline-block bg-gradient-to-r ${
                        year === currentYear 
                          ? 'from-orange-600 to-orange-700 shadow-lg shadow-orange-500/30' 
                          : 'from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600'
                      } rounded-lg p-4 border border-gray-600 transition-all duration-300 cursor-pointer`}>
                        <div className="flex items-center justify-end space-x-2 mb-2">
                          <div className="text-2xl font-bold text-white">{year}</div>
                          <MapPin className="w-5 h-5 text-orange-400" />
                        </div>
                        <div className="text-sm text-gray-300">
                          {getMilestoneText(year)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Job Milestones - Right Side */}
                {jobMilestones.length > 0 && (
                  <div className="ml-auto pl-8 flex-1">
                    <div className="text-left space-y-3">
                      {/* Render jobs with same end year in a single box */}
                      {sameEndYear.length > 0 && renderGroupedJobs(sameEndYear, year)}
                      
                      {/* Render jobs with different end years in separate boxes */}
                      {differentEndYear.length > 0 && renderSeparateJobs(differentEndYear, year)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
