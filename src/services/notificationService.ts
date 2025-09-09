import nodemailer from 'nodemailer';
import UserModel from '@/models/userModel';
import JobModel from '@/models/jobModel';

export interface EmailNotification {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class NotificationService {
  private transporter!: nodemailer.Transporter;

  constructor() {
    this.setupEmailTransporter();
  }

  private setupEmailTransporter() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(notification: EmailNotification): Promise<boolean> {
    try {
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('Email credentials not configured, skipping email');
        return false;
      }

      await this.transporter.sendMail({
        from: `"DhronaVaradhi" <${process.env.SMTP_USER}>`,
        to: notification.to,
        subject: notification.subject,
        html: notification.html,
        text: notification.text,
      });

      console.log(`Email sent successfully to ${notification.to}`);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendJobAlert(userId: string, jobs: Array<{
    _id: string;
    title: string;
    company: string;
    location: string;
    link: string;
    description: string;
    tags: string[];
  }>): Promise<boolean> {
    try {
      const user = await UserModel.findById(userId);
      if (!user || !user.notifications.email.jobAlerts) {
        return false;
      }

      const jobsHtml = jobs.map(job => `
        <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <h3 style="margin: 0 0 8px 0; color: #1a202c;">
            <a href="${job.link}" style="color: #3182ce; text-decoration: none;">${job.title}</a>
          </h3>
          <p style="margin: 4px 0; color: #4a5568;"><strong>${job.company}</strong> • ${job.location}</p>
          <p style="margin: 8px 0; color: #718096;">${job.description.substring(0, 200)}...</p>
          <div style="margin-top: 8px;">
            ${job.tags.map((tag: string) => `<span style="background: #f7fafc; color: #4a5568; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-right: 4px;">${tag}</span>`).join('')}
          </div>
        </div>
      `).join('');

      const html = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">Job Alert</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0;">Found ${jobs.length} new jobs matching your preferences</p>
          </div>
          <div style="background: white; padding: 24px;">
            <p style="color: #4a5568; margin: 0 0 24px 0;">Hi ${user.name},</p>
            <p style="color: #4a5568; margin: 0 0 24px 0;">We found some exciting new job opportunities that match your preferences:</p>
            ${jobsHtml}
            <div style="text-align: center; margin-top: 32px;">
              <a href="${process.env.APP_URL}" style="background: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View All Jobs</a>
            </div>
          </div>
          <div style="background: #f7fafc; padding: 16px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="color: #718096; font-size: 14px; margin: 0;">
              You're receiving this because you enabled job alerts. 
              <a href="${process.env.APP_URL}/settings" style="color: #3182ce;">Manage preferences</a>
            </p>
          </div>
        </div>
      `;

      return await this.sendEmail({
        to: user.email,
        subject: `Job Alert: ${jobs.length} New Job${jobs.length > 1 ? 's' : ''} Matching Your Preferences`,
        html,
      });
    } catch (error) {
      console.error('Error sending job alert:', error);
      return false;
    }
  }

  async sendWeeklyDigest(userId: string): Promise<boolean> {
    try {
      const user = await UserModel.findById(userId);
      if (!user || !user.notifications.email.weeklyDigest) {
        return false;
      }

      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const newJobsCount = await JobModel.countDocuments({
        createdAt: { $gte: weekAgo }
      });

      const topCompanies = await JobModel.aggregate([
        { $match: { createdAt: { $gte: weekAgo } } },
        { $group: { _id: '$company', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);

      const html = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">Weekly Job Market Update</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0;">Your weekly digest of opportunities</p>
          </div>
          <div style="background: white; padding: 24px;">
            <p style="color: #4a5568; margin: 0 0 24px 0;">Hi ${user.name},</p>
            <p style="color: #4a5568; margin: 0 0 24px 0;">Here's what happened in the job market this week:</p>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2d3748; margin: 0 0 16px 0;">Stats</h3>
              <p style="color: #4a5568; margin: 8px 0;"><strong>${newJobsCount}</strong> new jobs posted</p>
            </div>

            ${topCompanies.length > 0 ? `
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2d3748; margin: 0 0 16px 0;">Top Hiring Companies</h3>
              ${topCompanies.map(company => `
                <p style="color: #4a5568; margin: 4px 0;">${company._id} (${company.count} jobs)</p>
              `).join('')}
            </div>
            ` : ''}

            <div style="text-align: center; margin-top: 32px;">
              <a href="${process.env.APP_URL}" style="background: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Explore Opportunities</a>
            </div>
          </div>
          <div style="background: #f7fafc; padding: 16px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="color: #718096; font-size: 14px; margin: 0;">
              <a href="${process.env.APP_URL}/settings" style="color: #3182ce;">Manage email preferences</a>
            </p>
          </div>
        </div>
      `;

      return await this.sendEmail({
        to: user.email,
        subject: 'Weekly Job Market Digest',
        html,
      });
    } catch (error) {
        console.error('Error sending weekly digest:', error);
      return false;
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;

