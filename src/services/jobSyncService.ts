import cron from 'node-cron';
import JobModel from '@/models/jobModel';
import dbConnect from '@/utils/dbConnect';
import jobFetchingService, { ExternalJob } from './jobFetchingService';

class JobSyncService {
  private isRunning = false;
  private lastSyncTime: Date | null = null;

  constructor() {
    this.setupCronJobs();
  }

  private setupCronJobs() {
    
    cron.schedule('0 */4 * * *', async () => {
      console.log('Starting scheduled job sync...');
      await this.syncJobs();
    });

    
    cron.schedule('0 2 * * *', async () => {
      console.log('Starting daily cleanup...');
      await this.cleanupOldJobs();
    });
  }

  async syncJobs(): Promise<{ success: boolean; added: number; skipped: number; errors: number }> {
    if (this.isRunning) {
      console.log('Job sync already running, skipping...');
      return { success: false, added: 0, skipped: 0, errors: 0 };
    }

    this.isRunning = true;
    let added = 0;
    let skipped = 0;
    let errors = 0;

    try {
      await dbConnect();
      console.log('Fetching jobs from external sources...');
      
      const externalJobs = await jobFetchingService.fetchAllJobs();
      console.log(`Found ${externalJobs.length} external jobs`);

      for (const externalJob of externalJobs) {
        try {
          
          const existingJob = await JobModel.findOne({
            title: externalJob.title,
            company: externalJob.company,
            link: externalJob.link
          });

          if (existingJob) {
            skipped++;
            continue;
          }

          
          if (!this.validateJobData(externalJob)) {
            errors++;
            continue;
          }

          
          const newJob = new JobModel({
            title: externalJob.title,
            company: externalJob.company,
            location: externalJob.location,
            link: externalJob.link,
            description: externalJob.description,
            type: this.normalizeJobType(externalJob.type),
            tags: this.normalizeTags(externalJob.tags),
            source: externalJob.source,
            externalPostedDate: externalJob.postedDate,
            salary: externalJob.salary,
            isExternal: true
          });

          await newJob.save();
          added++;

        } catch (error) {
          console.error(`Error saving job ${externalJob.title}:`, error);
          errors++;
        }
      }

      this.lastSyncTime = new Date();
      console.log(`Job sync completed: ${added} added, ${skipped} skipped, ${errors} errors`);

      return { success: true, added, skipped, errors };

    } catch (error) {
      console.error('Error in job sync:', error);
      return { success: false, added, skipped, errors };
    } finally {
      this.isRunning = false;
    }
  }

  private validateJobData(job: ExternalJob): boolean {
    return !!(
      job.title && 
      job.company && 
      job.link && 
      job.title.length > 3 && 
      job.company.length > 1 &&
      this.isValidUrl(job.link)
    );
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private normalizeJobType(type: string): string {
    const typeMap: { [key: string]: string } = {
      'full-time': 'Full Time',
      'fulltime': 'Full Time',
      'full_time': 'Full Time',
      'part-time': 'Part Time',
      'parttime': 'Part Time',
      'part_time': 'Part Time',
      'contract': 'Contract',
      'contractor': 'Contract',
      'freelance': 'Contract',
      'internship': 'Internship',
      'intern': 'Internship'
    };

    const normalizedType = typeMap[type.toLowerCase()] || type;
    const validTypes = ['Full Time', 'Part Time', 'Internship', 'Contract'];
    
    return validTypes.includes(normalizedType) ? normalizedType : 'Full Time';
  }

  private normalizeTags(tags: string[]): string[] {
    return tags
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0 && tag.length < 30)
      .slice(0, 10); 
  }

  async cleanupOldJobs(): Promise<void> {
    try {
      await dbConnect();
      
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 60);

      const result = await JobModel.deleteMany({
        createdAt: { $lt: cutoffDate },
        isExternal: true
      });

      console.log(`Cleaned up ${result.deletedCount} old external jobs`);

    } catch (error) {
      console.error('Error cleaning up old jobs:', error);
    }
  }

  async getLastSyncInfo(): Promise<{ lastSync: Date | null; isRunning: boolean }> {
    return {
      lastSync: this.lastSyncTime,
      isRunning: this.isRunning
    };
  }

  async forceSyncJobs(): Promise<{ success: boolean; added: number; skipped: number; errors: number }> {
    console.log('Force starting job sync...');
    return await this.syncJobs();
  }
}

const jobSyncService = new JobSyncService();
export default jobSyncService;
