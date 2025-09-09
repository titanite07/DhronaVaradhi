import axios from 'axios';

export interface ExternalJob {
  title: string;
  company: string;
  location: string;
  link: string;
  description: string;
  type: string;
  tags: string[];
  source: string;
  postedDate?: string;
  salary?: string;
}

interface RemotiveJob {
  title: string;
  company_name: string;
  url: string;
  description?: string;
  job_type: string;
  category?: string;
  publication_date?: string;
  salary?: string;
}

class JobFetchingService {
  private readonly sources = ['remotive'];

  
  async fetchRemotiveJobs(): Promise<ExternalJob[]> {
    try {
      const apiUrl = process.env.REMOTIVE_API_URL || 'https://remotive.com/api/remote-jobs';
      
      const response = await axios.get(apiUrl, {
        params: {
          category: 'software-dev',
          limit: 50
        },
        timeout: 10000
      });

      return response.data.jobs.map((job: RemotiveJob) => ({
        title: job.title,
        company: job.company_name,
        location: 'Remote',
        link: job.url,
        description: job.description?.replace(/<[^>]*>/g, '').substring(0, 500) || '',
        type: job.job_type === 'full_time' ? 'Full Time' : 'Contract',
        tags: job.category ? [job.category, 'Remote'] : ['Remote'],
        source: 'Remotive',
        postedDate: job.publication_date,
        salary: job.salary || ''
      }));
    } catch (error) {
      console.error('Error fetching Remotive jobs:', error);
      return [];
    }
  }

  
  async fetchAllJobs(): Promise<ExternalJob[]> {
    try {
      const remotiveJobs = await this.fetchRemotiveJobs();
      
      console.log(`Fetched ${remotiveJobs.length} jobs from Remotive API`);
      return remotiveJobs;
    } catch (error) {
      console.error('Error in fetchAllJobs:', error);
      return [];
    }
  }

  
  async fetchJobsByCategory(category: string): Promise<ExternalJob[]> {
    try {
      const apiUrl = process.env.REMOTIVE_API_URL || 'https://remotive.com/api/remote-jobs';
      
      const response = await axios.get(apiUrl, {
        params: {
          category: category.toLowerCase().replace(' ', '-'),
          limit: 50
        },
        timeout: 10000
      });

      return response.data.jobs.map((job: RemotiveJob) => ({
        title: job.title,
        company: job.company_name,
        location: 'Remote',
        link: job.url,
        description: job.description?.replace(/<[^>]*>/g, '').substring(0, 500) || '',
        type: job.job_type === 'full_time' ? 'Full Time' : 'Contract',
        tags: job.category ? [job.category, 'Remote'] : ['Remote'],
        source: 'Remotive',
        postedDate: job.publication_date,
        salary: job.salary || ''
      }));
    } catch (error) {
      console.error(`Error fetching ${category} jobs:`, error);
      return [];
    }
  }
}

const jobFetchingService = new JobFetchingService();
export default jobFetchingService;
