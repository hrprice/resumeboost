import { z } from 'zod';

export const JobDescriptionParsingSchema = z
  .object({
    jobTitle: z.string().describe('Job title'),
    companyName: z.string().describe('Company name'),
    location: z.string().describe('Location of the job (e.g., city, state, or remote)'),
    employmentType: z
      .string()
      .describe('Type of employment (e.g., Full-time, Part-time, Contract, Internship, etc.)')
      .nullable()
      .optional(),
    responsibilities: z
      .array(z.string().describe('Responsibility or task associated with the role'))
      .nullable()
      .optional()
      .describe('List of key responsibilities for the role'),
    requirements: z
      .array(z.string().describe('Requirement for the role (e.g., skills, qualifications)'))
      .nullable()
      .optional()
      .describe('List of minimum qualifications required for the role'),
    preferredQualifications: z
      .array(z.string().describe('Preferred but not mandatory qualifications'))
      .nullable()
      .optional()
      .describe('List of additional qualifications that are desirable but not required'),
    benefits: z
      .array(z.string().describe('Benefit provided by the employer (e.g., salary, perks)'))
      .nullable()
      .optional()
      .describe('List of benefits associated with the role'),
    keywords: z
      .array(z.string().describe('Keyword extracted from the job description'))
      .nullable()
      .optional()
      .describe('List of keywords associated with the role')
  })
  .describe('Schema for a structured job description extracted from unstructured data');
