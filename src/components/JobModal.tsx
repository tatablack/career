import React, { useEffect, useState } from 'react';
import { X, Briefcase, Building } from 'lucide-react';

interface Job {
  company: string;
  companyDescription?: string;
  title: string;
  jobDescription?: string;
  startYear: string;
  endYear: string;
}

interface JobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

const JobModal: React.FC<JobModalProps> = ({ job, isOpen, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const modal = document.getElementById('job-modal');
      if (modal && !modal.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      setIsAnimating(true);
      window.addEventListener('keydown', handleKeyPress);
      window.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !job) return null;

  const getJobYearRange = (job: Job): string => {
    if (job.endYear && job.endYear !== job.startYear) {
      return `${job.startYear} - ${job.endYear}`;
    }
    return job.startYear;
  };

  const hasDescriptions = job.companyDescription || job.jobDescription;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div 
        id="job-modal"
        className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-600 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 border-b border-gray-600 rounded-t-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Briefcase className="w-6 h-6 text-blue-200" />
              <div>
                <div className="text-xl font-bold text-white">{getJobYearRange(job)}</div>
                {job.title && (
                  <div className="text-lg font-semibold text-blue-200 mt-1">
                    {job.title}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-blue-200 hover:text-white transition-colors p-1 rounded-full hover:bg-blue-600/50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Company Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-orange-400" />
              <h3 className="text-xl font-bold text-white">{job.company}</h3>
            </div>
            
            {job.companyDescription && (
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <p className="text-gray-300 leading-relaxed">
                  {job.companyDescription}
                </p>
              </div>
            )}
          </div>

          {/* Job Description Section */}
          {job.jobDescription && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-orange-400">Role Description</h3>
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {job.jobDescription}
                </p>
              </div>
            </div>
          )}

          {/* No descriptions message */}
          {!hasDescriptions && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-lg">
                No additional details available for this position.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-800/90 backdrop-blur-sm p-4 border-t border-gray-600 rounded-b-lg">
          <div className="text-center text-sm text-gray-400">
            Press <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Esc</kbd> or click outside to close
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobModal;