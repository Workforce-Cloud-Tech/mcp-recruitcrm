import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod/v4";

import { loadConfig, type AppConfig } from "./config.js";
import { RecruitCrmApiError } from "./errors.js";
import { RecruitCrmClient } from "./recruitcrm/client.js";
import {
  filterCandidateCustomFields,
  mapCandidateCustomFieldDetail,
  mapCandidateCustomFieldSummary,
  validateCustomFieldFilters,
} from "./recruitcrm/custom-fields.js";
import type { HttpTransport } from "./recruitcrm/http.js";
import {
  mapCandidateHiringStagesResult,
  mapJobStatusesResult,
  mapCandidateJobAssignmentHiringStageHistoryResult,
  mapCreateCandidateResult,
  mapCreateCallLogResult,
  mapCreateHotlistResult,
  mapCreatedCompanyResult,
  mapCreatedContactResult,
  mapCreatedJobResult,
  mapCreateMeetingResult,
  mapCreateNoteResult,
  mapCreateTaskResult,
  mapJobAssignedCandidatesResult,
  mapListCallTypesResult,
  mapListCandidateQuestionsResult,
  mapListContactStagesResult,
  mapListCurrenciesResult,
  mapListHiringPipelinesResult,
  mapListLanguagesAndProficienciesResult,
  mapListMeetingTypesResult,
  mapListNoteTypesResult,
  mapListOffLimitStatusesResult,
  mapListPitchStagesResult,
  mapListQualificationsResult,
  mapListTeamsResult,
  mapListTaskTypesResult,
  mapListUsersResult,
  mapListXmlJobboardsResult,
  mapMarkCandidateOffLimitResult,
  mapMarkCompanyOffLimitResult,
  mapMarkContactOffLimitResult,
  mapMarkRecordsAvailableResult,
  mapSearchCallLogsResult,
  mapSearchCandidatesResult,
  mapSearchCompaniesResult,
  mapSearchContactsResult,
  mapSearchHotlistsResult,
  mapSearchJobsResult,
  mapSearchMeetingsResult,
  mapSearchNotesResult,
  mapSearchTasksResult,
  mapAssignCandidateToJobResult,
  mapPitchCandidateToContactResult,
  mapPitchHistoryResult,
  mapPitchedRecordsResult,
  mapUpdateCandidatePitchStageResult,
  mapUpdateCandidateHiringStageResult,
} from "./recruitcrm/mappers.js";
import {
  type AddRecordsToHotlistInput,
  type AddRecordsToHotlistResult,
  type PrepareClientBriefActivitySummary,
  type PrepareClientBriefCompany,
  type PrepareClientBriefContact,
  type PrepareClientBriefError,
  type PrepareClientBriefInput,
  type PrepareClientBriefJob,
  type PrepareClientBriefJobContact,
  type PrepareClientBriefJobPipelineSummary,
  type PrepareClientBriefResult,
  type PrepareClientBriefWaitingCandidate,
  type AnalyzeJobPipelineActivity,
  type AnalyzeJobPipelineBottleneck,
  type AnalyzeJobPipelineError,
  type AnalyzeJobPipelineIdleCandidate,
  type AnalyzeJobPipelineInput,
  type AnalyzeJobPipelineResult,
  type AnalyzeJobPipelineStageGroup,
  type AnalyzeJobPipelineTimeMetrics,
  type AnalyzeJobPipelineTimeToHire,
  type AnalyzeJobPipelineTimeToHirePlacement,
  type AnalyzeJobPipelineTimeToStageEntry,
  type AnalyzeJobPipelineTimeToFirstAction,
  type AssignedCandidateSummary,
  type CandidateHiringStagesResult,
  type JobStatusesResult,
  type CallLogRelatedToType,
  type CreateCallLogInput,
  type CreateCallLogResult,
  type CreateCompanyInput,
  type CreateCompanyResult,
  type ListCallTypesResult,
  type ListCandidateQuestionsResult,
  type ListCurrenciesResult,
  type ListHiringPipelinesResult,
  type ListLanguagesAndProficienciesResult,
  type ListQualificationsResult,
  type ListTeamsInput,
  type ListTeamsResult,
  type ListXmlJobboardsResult,
  type SearchCallLogsInput,
  type SearchCallLogsResult,
  type CandidateJobAssignmentHiringStageHistoryResult,
  type CandidateHistoryCreateResponse,
  type CreateHotlistInput,
  type CreateHotlistResult,
  type CreateJobInput,
  type CreateJobResult,
  type CreateCandidateHistoryError,
  type CreateCandidateInput,
  type CreateCandidateResult,
  type CreatedCandidate,
  type CreateMeetingInput,
  type CreateMeetingResult,
  type CreateNoteInput,
  type CreateNoteResult,
  type CreateTaskInput,
  type CreateTaskResult,
  CUSTOM_FIELD_FILTER_TYPES,
  type CandidateCustomFieldDetail,
  type CandidateCustomFieldListResult,
  type CustomFieldDetail,
  type CustomFieldListResult,
  type GetCustomFieldDetailsInput,
  type ListCustomFieldsInput,
  type CandidateDetail,
  type CandidateDetailsError,
  type CandidateDetailsResult,
  type CompanyDetail,
  type CompanyDetailsError,
  type CompanyDetailsResult,
  type ContactDetail,
  type ContactDetailsError,
  type ContactDetailsResult,
  type GetCandidateDetailsInput,
  type GetCompanyDetailsInput,
  type GetContactDetailsInput,
  type GetJobDetailsInput,
  type GetJobAssignedCandidatesInput,
  type JobAssignedCandidatesResult,
  type JobDetail,
  type JobDetailsError,
  type JobDetailsResult,
  type ListCandidatesInput,
  type ListCompaniesInput,
  type ListContactsInput,
  type ListJobsInput,
  type ListMeetingTypesResult,
  type ListNoteTypesResult,
  type ListOffLimitStatusesResult,
  type ListPitchStagesResult,
  type ListTaskTypesResult,
  type ListUsersInput,
  type ListUsersResult,
  type MarkCandidateOffLimitInput,
  type MarkCandidateOffLimitResult,
  type MarkCompanyOffLimitInput,
  type MarkCompanyOffLimitResult,
  type MarkContactOffLimitInput,
  type MarkContactOffLimitResult,
  type MarkRecordsAvailableInput,
  type MarkRecordsAvailableResult,
  type RecruitCrmMeetingType,
  type RecruitCrmNoteType,
  type RecruitCrmTaskType,
  type SearchCandidatesInput,
  type SearchCompaniesInput,
  type SearchCompaniesResult,
  type SearchContactsInput,
  type SearchContactsResult,
  type SearchHotlistsInput,
  type SearchHotlistsResult,
  type SearchJobsInput,
  type SearchJobsResult,
  type SearchMeetingsInput,
  type SearchMeetingsResult,
  type SearchNotesInput,
  type SearchNotesResult,
  type SearchCandidatesResult,
  type SearchTasksInput,
  type SearchTasksResult,
  type RecruitCrmCandidateJobAssignmentHiringStageHistoryItem,
  type CustomFieldDependenciesOutput,
  type AssignCandidateToJobInput,
  type AssignCandidateToJobResult,
  type ContactStageSummary,
  type CreateContactInput,
  type CreateContactResult,
  type ListCandidateHiringStagesInput,
  type ListContactStagesResult,
  type PitchCandidateToContactInput,
  type PitchCandidateToContactResult,
  type PitchEntityType,
  type PitchHistoryResult,
  type PitchedRecordsResult,
  type RecruitCrmJob,
  type RecruitCrmJobSearchResponse,
  type UpdateCandidatePitchStageInput,
  type UpdateCandidatePitchStageResult,
  type UpdateCandidateHiringStageInput,
  type UpdateCandidateHiringStageResult,
  type UpdateCallLogInput,
  type UpdateCandidateInput,
  type UpdateCompanyInput,
  type UpdateContactInput,
  type UpdateJobInput,
  type UpdateMeetingInput,
  type UpdateNoteInput,
  type UpdateTaskInput,
} from "./recruitcrm/types.js";

const booleanLikeSchema = z
  .union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("1"), z.literal("0"), z.literal(1), z.literal(0)])
  .transform((value) => value === true || value === "true" || value === "1" || value === 1);

const textFilterSchema = z.string().trim().min(1);
const offLimitEndDateSchema = z
  .string()
  .trim()
  .regex(/^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/, "Use DD-MM-YYYY, for example 29-06-2026.");
const statusIdFilterSchema = z
  .union([z.coerce.number().int().positive(), textFilterSchema])
  .transform((value) => String(value));
const customFieldFilterValueSchema = z.union([z.string().trim().min(1), z.number()]);
const customFieldFilterTypeSchema = z.enum(CUSTOM_FIELD_FILTER_TYPES);
const binaryNumberSchema = z
  .union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("0"), z.literal("1"), z.literal(0), z.literal(1)])
  .transform((value) => (value === true || value === "true" || value === "1" || value === 1 ? 1 : 0) as 0 | 1);
const jobTypeInputSchema = z
  .enum(["Part Time", "Full Time", "Contract", "Contract to Permanent"])
  .transform((v) => (({ "Part Time": 1, "Full Time": 2, "Contract": 3, "Contract to Permanent": 4 } as const)[v]));

const taskRelatedToTypeSchema = z.enum(["candidate", "company", "contact", "job", "deal"]);
const meetingRelatedToTypeSchema = z.enum(["candidate", "company", "contact", "job", "deal"]);
const noteRelatedToTypeSchema = z.enum(["candidate", "company", "contact", "job", "deal"]);
const callLogRelatedToTypeSchema = z.enum(["candidate", "contact", "company"]);
const markRecordsAvailableRecordTypeSchema = z.enum(["candidate", "contact", "company"]);
const pitchEntityTypeSchema = z.enum(["candidate", "contact"]);

const searchCandidatesInputSchema = {
  page: z.coerce.number().int().min(1).optional().describe("Page number."),
  limit: z.coerce.number().int().min(1).max(100).optional().describe("Records per page (max 100, default 100)."),
  created_from: textFilterSchema.optional().describe("Created from date."),
  created_to: textFilterSchema.optional().describe("Created to date."),
  email: textFilterSchema.optional().describe("Candidate email."),
  first_name: textFilterSchema.optional().describe("Candidate first name."),
  last_name: textFilterSchema.optional().describe("Candidate last name."),
  linkedin: textFilterSchema.optional().describe("Candidate LinkedIn URL."),
  marked_as_off_limit: booleanLikeSchema.optional().describe("Filter candidates by off-limit status."),
  owner_email: textFilterSchema.optional().describe("Candidate owner email."),
  owner_id: textFilterSchema.optional().describe("Candidate owner id. Use this for 'my' candidate requests after resolving the Recruit CRM user id."),
  owner_name: textFilterSchema.optional().describe("Candidate owner name."),
  state: textFilterSchema.optional().describe("Candidate state."),
  updated_from: textFilterSchema.optional().describe("Updated from date."),
  updated_to: textFilterSchema.optional().describe("Updated to date."),
  candidate_slug: textFilterSchema.optional().describe("Candidate slug. Other filters are ignored when provided."),
  contact_number: textFilterSchema.optional().describe("Candidate contact number."),
  country: textFilterSchema.optional().describe("Candidate country."),
  exact_search: booleanLikeSchema.optional().describe("Use exact search instead of partial match."),
  sort_by: z.enum(["createdon", "updatedon"]).optional().describe("Sort field."),
  sort_order: z.enum(["asc", "desc"]).optional().describe("Sort order."),
  custom_fields: z
    .array(
      z.object({
        field_id: z.coerce.number().int().positive().describe("Candidate custom field id."),
        filter_type: customFieldFilterTypeSchema.describe("Custom field filter type."),
        filter_value: customFieldFilterValueSchema.optional().describe("Value for filter types that require it."),
      }),
    )
    .optional()
    .describe("Candidate custom field filters. Use field ids from the metadata tools."),
  include_contact_info: booleanLikeSchema
    .optional()
    .describe(
      "Opt-in flag (default false). When true, each result also includes email, contact_number, and linkedin. Leave off for most requests; enable only when the user explicitly needs contact details, because it increases response size and exposes PII.",
    ),
};

const listCandidatesInputSchema = {
  limit: z.coerce.number().int().min(1).max(100).optional().describe("Records per page (max 100, default 100)."),
  page: z.coerce.number().int().min(1).optional().describe("Page number (default 1)."),
  sort_by: z.enum(["createdon", "updatedon"]).optional().describe("Sort field (default updatedon)."),
  sort_order: z.enum(["asc", "desc"]).optional().describe("Sort order (default desc)."),
  include_contact_info: booleanLikeSchema
    .optional()
    .describe(
      "Opt-in flag (default false). When true, each result also includes email, contact_number, and linkedin. Leave off for most requests; enable only when the user explicitly needs contact details, because it increases response size and exposes PII.",
    ),
};

const createCandidateScalarSchema = z.union([z.string().trim().min(1), z.number()]);
const createCandidateCustomFieldValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.union([z.string(), z.number(), z.boolean()])),
]);
const createCandidateGenderIdSchema = z
  .union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
  .describe("Gender id: 0 not available, 1 male, 2 female, 3 non-binary, 4 prefer not to say.");
const createCandidateWorkHistoryInputSchema = z.object({
  title: textFilterSchema.optional().describe("Work title."),
  work_company_name: textFilterSchema.optional().describe("Company name for this work history row."),
  employment_type: z.coerce.number().int().positive().optional().describe("Recruit CRM employment type id."),
  industry_id: z.coerce.number().int().positive().optional().describe("Recruit CRM industry id."),
  work_location: textFilterSchema.optional().describe("Work location."),
  salary: createCandidateScalarSchema.optional().describe("Salary for this work history row."),
  is_currently_working: binaryNumberSchema.optional().describe("Current role flag: true if currently working, false if past role."),
  work_start_date: z.coerce.number().int().nonnegative().optional().describe("Work start date as Unix seconds."),
  work_end_date: z.coerce.number().int().nonnegative().optional().describe("Work end date as Unix seconds."),
  work_description: textFilterSchema.optional().describe("Work description."),
});
const createCandidateEducationHistoryInputSchema = z.object({
  institute_name: textFilterSchema.optional().describe("Institute name."),
  educational_qualification: textFilterSchema.optional().describe("Educational qualification."),
  educational_specialization: textFilterSchema.optional().describe("Educational specialization."),
  grade: textFilterSchema.optional().describe("Grade."),
  education_location: textFilterSchema.optional().describe("Education location."),
  education_start_date: z.coerce.number().int().nonnegative().optional().describe("Education start date as Unix seconds."),
  education_end_date: z.coerce.number().int().nonnegative().optional().describe("Education end date as Unix seconds."),
  education_description: textFilterSchema.optional().describe("Education description."),
});
const candidateMutationFieldsInputSchema = {
  first_name: textFilterSchema.optional().describe("Candidate first name. At least one of first_name or last_name is required."),
  last_name: textFilterSchema.optional().describe("Candidate last name. At least one of first_name or last_name is required."),
  email: textFilterSchema.optional().describe("Candidate email."),
  contact_number: textFilterSchema.optional().describe("Candidate contact number."),
  avatar: textFilterSchema.optional().describe("Candidate avatar URL."),
  gender_id: createCandidateGenderIdSchema.optional(),
  work_ex_year: z.coerce.number().nonnegative().optional().describe("Total work experience in years."),
  currency_id: z.coerce.number().int().positive().optional().describe("Recruit CRM currency id."),
  candidate_dob: textFilterSchema.optional().describe("Candidate date of birth, preferably YYYY-MM-DD."),
  profile_updated_on: textFilterSchema.optional().describe("Profile updated date, preferably YYYY-MM-DD."),
  current_salary: createCandidateScalarSchema.optional().describe("Current salary."),
  salary_expectation: createCandidateScalarSchema.optional().describe("Salary expectation."),
  willing_to_relocate: binaryNumberSchema.optional().describe("Relocation flag: 1 willing, 0 not willing."),
  current_organization: textFilterSchema.optional().describe("Current organization name."),
  current_organization_slug: textFilterSchema
    .optional()
    .describe("Current organization company slug."),
  current_status: textFilterSchema.optional().describe("Current candidate status."),
  notice_period: z.coerce.number().int().nonnegative().optional().describe("Notice period in days."),
  facebook: textFilterSchema.optional().describe("Facebook URL."),
  twitter: textFilterSchema.optional().describe("Twitter/X URL."),
  linkedin: textFilterSchema.optional().describe("LinkedIn URL."),
  github: textFilterSchema.optional().describe("GitHub URL."),
  xing: textFilterSchema.optional().describe("Xing URL."),
  city: textFilterSchema.optional().describe("City."),
  locality: textFilterSchema.optional().describe("Locality."),
  state: textFilterSchema.optional().describe("State."),
  country: textFilterSchema.optional().describe("Country."),
  postal_code: textFilterSchema.optional().describe("Postal code."),
  address: textFilterSchema.optional().describe("Street address."),
  relevant_experience: z.coerce.number().nonnegative().optional().describe("Relevant experience in years."),
  position: textFilterSchema.optional().describe("Candidate position/title."),
  available_from: textFilterSchema.optional().describe("Available-from date, preferably YYYY-MM-DD."),
  salary_type: z.coerce.number().int().positive().optional().describe("Recruit CRM salary type id."),
  source: textFilterSchema.optional().describe("Candidate source (e.g. 'Claude', 'LinkedIn')."),
  language_skills: z
    .array(
      z.object({
        language_id: z.coerce.number().int().positive().describe("Recruit CRM language id."),
        proficiency_id: z.coerce.number().int().positive().describe("Recruit CRM language proficiency id."),
      }),
    )
    .optional()
    .describe("Candidate language skills."),
  skill: textFilterSchema.optional().describe("Comma-separated candidate skills."),
  resume: textFilterSchema.optional().describe("Resume file. Accepts a publicly accessible HTTPS direct download URL or a base64-encoded file string. Max file size 16 MB."),
  owner_id: z.coerce.number().int().positive().optional().describe("Candidate owner user ID. Required when creating."),
  created_by: z.coerce.number().int().positive().optional().describe("Creating user ID. Required when creating."),
  updated_by: z.coerce.number().int().positive().optional().describe("Updating user ID. Required when updating. Defaults to created_by on create if omitted."),
  custom_fields: z
    .array(
      z.object({
        field_id: z.coerce.number().int().positive().describe("Candidate custom field id."),
        value: createCandidateCustomFieldValueSchema.describe(
          "Custom field value. File-type custom fields accept a publicly accessible HTTPS direct download URL only; the API fetches and stores the file from that URL (base64 is not supported for custom file fields). Dropdown and multiselect fields require a value matching the options returned by get_custom_field_details.",
        ),
      }),
    )
    .optional()
    .describe("Candidate custom field values. Dropdown and multiselect fields require a value matching the options returned by get_custom_field_details."),
  candidate_summary: z.string().trim().min(1).optional().describe("Candidate summary. Supports basic HTML/rich text."),
  work_history: z
    .array(createCandidateWorkHistoryInputSchema)
    .max(10)
    .optional()
    .describe("Latest work history rows to create after the candidate is created or updated. Max 10 rows."),
  education_history: z
    .array(createCandidateEducationHistoryInputSchema)
    .max(10)
    .optional()
    .describe("Latest education history rows to create after the candidate is created or updated. Max 10 rows."),
};

const createCandidateInputSchema = {
  ...candidateMutationFieldsInputSchema,
  allow_duplicate: booleanLikeSchema
    .optional()
    .describe("Set true to create a candidate even if a duplicate exists."),
};

const updateCandidateInputSchema = {
  candidate_slug: textFilterSchema.describe("Existing candidate slug to update."),
  ...candidateMutationFieldsInputSchema,
  updated_by: z.coerce.number().int().positive().describe("Recruit CRM user id updating the candidate."),
};

const listJobsInputSchema = {
  limit: z.coerce.number().int().min(1).max(100).optional().describe("Records per page (max 100, default 100)."),
  page: z.coerce.number().int().min(1).optional().describe("Page number (default 1)."),
  sort_by: z.enum(["createdon", "updatedon"]).optional().describe("Sort field (default updatedon)."),
  sort_order: z.enum(["asc", "desc"]).optional().describe("Sort order (default desc)."),
};

const metadataListInputSchema = {
  page: z.coerce.number().int().min(1).optional().describe("Page number. Pagination is applied by this MCP server because the Recruit CRM metadata endpoint returns all rows."),
  limit: z.coerce.number().int().min(1).max(500).optional().describe("Records per page (max 500, default 100)."),
};

const listTeamsInputSchema = {
  ...metadataListInputSchema,
  expand: z.enum(["user"]).optional().describe("Optional expansion. Use user to return user summaries instead of user IDs."),
  include_user_contact_info: booleanLikeSchema.optional().describe("When true and expand=user, include user email, contact_number, and avatar. Defaults to false."),
};

const salaryTypeInputSchema = z
  .union([
    z.literal("1"),
    z.literal("2"),
    z.literal("3"),
    z.literal("4"),
    z.literal("5"),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ])
  .transform((value) => Number(value) as 1 | 2 | 3 | 4 | 5);
const jobLocationTypeInputSchema = z
  .union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal(0), z.literal(1), z.literal(2)])
  .transform((value) => Number(value) as 0 | 1 | 2);
const showCompanyLogoInputSchema = z
  .union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal(0), z.literal(1), z.literal(2)])
  .transform((value) => Number(value) as 0 | 1 | 2);
const createJobSlugListSchema = z.array(textFilterSchema).min(1).max(25);
const createJobCollaboratorIdsSchema = z.array(z.coerce.number().int().positive()).min(1).max(25);
const jobCustomFieldInputSchema = z.object({
  field_id: z.coerce.number().int().positive().describe("Job custom field ID."),
  value: z.string().trim().min(1).describe("Custom field value."),
});
const jobXmlFeedsInputSchema = z.object({
  default: textFilterSchema.optional().describe("Comma-separated default XML feed board IDs."),
  custom: textFilterSchema.optional().describe("Comma-separated custom XML feed board IDs."),
});

const jobMutationOptionalFieldsInputSchema = {
  job_status: z.coerce.number().int().nonnegative().optional().describe("Job status ID. Built-ins: 0 Closed, 1 Open, 2 On-Hold, 3 Cancelled."),
  number_of_openings: z.coerce.number().int().positive().optional().describe("Number of open positions."),
  secondary_contact_slugs: createJobSlugListSchema.optional().describe("Secondary contact slugs. Requires company_slug. Sent as a comma-separated API field."),
  job_description_file: textFilterSchema.optional().describe("Public direct download URL for a job description file. Base64 is not supported."),
  minimum_experience: z.coerce.number().nonnegative().optional().describe("Minimum experience."),
  maximum_experience: z.coerce.number().nonnegative().optional().describe("Maximum experience."),
  salary_type: salaryTypeInputSchema.optional().describe("Salary type: 1 Monthly, 2 Annual, 3 Weekly, 4 Daily, 5 Hourly."),
  min_annual_salary: z.coerce.number().nonnegative().optional().describe("Minimum annual salary."),
  max_annual_salary: z.coerce.number().nonnegative().optional().describe("Maximum annual salary."),
  pay_rate: z.coerce.number().nonnegative().optional().describe("Pay rate."),
  bill_rate: z.coerce.number().nonnegative().optional().describe("Bill rate."),
  qualification_id: z.coerce.number().int().positive().optional().describe("Qualification ID."),
  specialization: textFilterSchema.optional().describe("Specialization."),
  job_skill: textFilterSchema.optional().describe("Job skill."),
  job_type: jobTypeInputSchema.optional().describe("Job type."),
  job_category: textFilterSchema.optional().describe("Job category."),
  city: textFilterSchema.optional().describe("City."),
  locality: textFilterSchema.optional().describe("Locality."),
  state: textFilterSchema.optional().describe("State."),
  country: textFilterSchema.optional().describe("Country."),
  address: textFilterSchema.optional().describe("Full address."),
  postal_code: textFilterSchema.optional().describe("Postal code."),
  job_location_type: jobLocationTypeInputSchema.optional().describe("Job location type: 0 On-Site, 1 Remote, 2 Hybrid."),
  collaborator_user_ids: createJobCollaboratorIdsSchema.optional().describe("Collaborator user IDs. Max 25. Sent as a comma-separated API field."),
  collaborator_team_ids: createJobCollaboratorIdsSchema.optional().describe("Collaborator team IDs. Max 25."),
  enable_auto_populate_teams: booleanLikeSchema.optional().describe("When true, Recruit CRM auto-assigns teams based on created_by. Defaults to true for create_job."),
  show_company_logo: showCompanyLogoInputSchema.optional().describe("Logo setting: 1 job company logo, 0 account logo, 2 no logo."),
  job_questions: textFilterSchema.optional().describe("Candidate question IDs/configuration."),
  note_for_candidates: z.string().trim().min(1).optional().describe("Note for candidates."),
  hiring_pipeline_id: z.coerce.number().int().positive().optional().describe("Hiring pipeline ID."),
  xml_feeds: jobXmlFeedsInputSchema.optional().describe("XML feed board IDs."),
  targetcompanies: createJobSlugListSchema.optional().describe("Target company slugs. Sent as a comma-separated API field."),
  updated_by: z.coerce.number().int().positive().optional().describe("Updating user ID."),
  custom_fields: z.array(jobCustomFieldInputSchema).min(1).optional().describe("Job custom field values."),
};

const createJobInputSchema = {
  name: textFilterSchema.describe("Job title."),
  company_slug: textFilterSchema.describe("Company slug."),
  contact_slug: textFilterSchema.describe("Primary contact slug."),
  job_description_text: z.string().min(1).optional().describe("Job description. Supports rich text HTML and is sent as-is. Live API verification showed this is optional on create."),
  currency_id: z.coerce.number().int().nonnegative().optional().describe("Currency ID. Live API verification showed this is optional on create and defaults server-side when omitted."),
  enable_job_application_form: binaryNumberSchema.describe("Job application form flag. Use 0 unless the user explicitly wants the form enabled."),
  owner_id: z.coerce.number().int().positive().describe("Job owner user ID."),
  created_by: z.coerce.number().int().positive().describe("Creating user ID."),
  ...jobMutationOptionalFieldsInputSchema,
};

const updateJobInputSchema = {
  job_slug: textFilterSchema.describe("Slug of the job to update."),
  name: textFilterSchema.optional().describe("Job title."),
  company_slug: textFilterSchema.optional().describe("Company slug."),
  contact_slug: textFilterSchema.optional().describe("Primary contact slug."),
  job_description_text: z.string().min(1).optional().describe("Job description. Supports rich text HTML and is sent as-is."),
  currency_id: z.coerce.number().int().nonnegative().optional().describe("Currency ID."),
  enable_job_application_form: binaryNumberSchema.optional().describe("Job application form flag. Use 0 unless the user explicitly wants the form enabled."),
  owner_id: z.coerce.number().int().positive().optional().describe("Job owner user ID."),
  created_by: z.coerce.number().int().positive().optional().describe("Creating user ID."),
  ...jobMutationOptionalFieldsInputSchema,
  updated_by: z.coerce.number().int().positive().describe("Recruit CRM user id updating the job."),
};

const listCompaniesInputSchema = {
  limit: z.coerce.number().int().min(1).max(100).optional().describe("Records per page (max 100, default 100)."),
  page: z.coerce.number().int().min(1).optional().describe("Page number (default 1)."),
  sort_by: z.enum(["createdon", "updatedon"]).optional().describe("Sort field (default updatedon)."),
  sort_order: z.enum(["asc", "desc"]).optional().describe("Sort order (default desc)."),
};

const companyCustomFieldInputSchema = z.object({
  field_id: z.coerce.number().int().positive().describe("Company custom field ID."),
  value: z.string().trim().min(1).describe("Custom field value."),
});

const companyMutationOptionalFieldsInputSchema = {
  about_company: z.string().trim().min(1).max(5000).optional().describe("Company description. Maximum 5000 characters."),
  city: textFilterSchema.optional().describe("City."),
  locality: textFilterSchema.optional().describe("Locality."),
  state: textFilterSchema.optional().describe("State."),
  country: textFilterSchema.optional().describe("Country."),
  postal_code: textFilterSchema.optional().describe("Postal code."),
  address: z.string().trim().min(1).optional().describe("Full address."),
  industry_id: z.coerce.number().int().nonnegative().optional().describe("Industry ID."),
  logo: textFilterSchema.optional().describe("Logo URL."),
  website: textFilterSchema.optional().describe("Website URL."),
  facebook: textFilterSchema.optional().describe("Facebook profile."),
  twitter: textFilterSchema.optional().describe("Twitter/X profile."),
  linkedin: textFilterSchema.optional().describe("LinkedIn profile."),
  custom_fields: z
    .array(companyCustomFieldInputSchema)
    .min(1)
    .optional()
    .describe("Company custom field values."),
};

const createCompanyInputSchema = {
  company_name: textFilterSchema.describe("Company name."),
  owner_id: z.coerce.number().int().positive().describe("Company owner user ID."),
  created_by: z.coerce.number().int().positive().describe("Creating user ID."),
  updated_by: z.coerce.number().int().positive().optional().describe("Updating user ID."),
  ...companyMutationOptionalFieldsInputSchema,
  allow_duplicate: booleanLikeSchema
    .optional()
    .describe("Set true to create a company even if a duplicate exists."),
};

const updateCompanyInputSchema = {
  company_slug: textFilterSchema.describe("Slug of the company to update."),
  company_name: textFilterSchema.optional().describe("Company name."),
  owner_id: z.coerce.number().int().positive().optional().describe("Company owner user ID."),
  created_by: z.coerce.number().int().positive().optional().describe("Creating user ID."),
  updated_by: z.coerce.number().int().positive().describe("Recruit CRM user id updating the company."),
  ...companyMutationOptionalFieldsInputSchema,
};

const listContactsInputSchema = {
  limit: z.coerce.number().int().min(1).max(100).optional().describe("Records per page (max 100, default 100)."),
  page: z.coerce.number().int().min(1).optional().describe("Page number (default 1)."),
  sort_by: z.enum(["createdon", "updatedon"]).optional().describe("Sort field (default updatedon)."),
  sort_order: z.enum(["asc", "desc"]).optional().describe("Sort order (default desc)."),
  include_contact_info: booleanLikeSchema
    .optional()
    .describe(
      "Opt-in flag (default false). When true, each result also includes email, contact_number, and linkedin. Leave off for most requests; enable only when the user explicitly needs contact details, because it increases response size and exposes PII.",
    ),
};

const contactMutationOptionalFieldsInputSchema = {
  email: textFilterSchema.optional().describe("Contact email."),
  contact_number: textFilterSchema.optional().describe("Contact phone number."),
  company_slug: textFilterSchema.optional().describe("Comma-separated company slugs."),
  avatar: textFilterSchema.optional().describe("Avatar URL."),
  city: textFilterSchema.optional().describe("City."),
  locality: textFilterSchema.optional().describe("Locality."),
  state: textFilterSchema.optional().describe("State."),
  country: textFilterSchema.optional().describe("Country."),
  postal_code: textFilterSchema.optional().describe("Postal code."),
  address: textFilterSchema.optional().describe("Full street address."),
  designation: textFilterSchema.optional().describe("Designation (title)."),
  facebook: textFilterSchema.optional().describe("Facebook profile URL."),
  twitter: textFilterSchema.optional().describe("Twitter/X profile URL."),
  linkedin: textFilterSchema.optional().describe("LinkedIn profile URL."),
  stage_id: z.coerce.number().int().positive().optional().describe("Contact stage ID."),
  updated_by: z.coerce.number().int().positive().optional().describe("Updating user ID."),
  custom_fields: z
    .array(
      z.object({
        field_id: z.coerce.number().int().positive().describe("Contact custom field ID."),
        value: z.string().trim().min(1).describe("Custom field value."),
      }),
    )
    .optional()
    .describe("Contact custom field values."),
};

const createContactInputSchema = {
  first_name: textFilterSchema.describe("Contact first name. Required."),
  last_name: textFilterSchema.describe("Contact last name. Required."),
  owner_id: z.coerce.number().int().positive().describe("Contact owner user ID."),
  created_by: z.coerce.number().int().positive().describe("Creating user ID."),
  ...contactMutationOptionalFieldsInputSchema,
  allow_duplicate: booleanLikeSchema
    .optional()
    .describe("Set true to create a contact even if a duplicate exists."),
};

const updateContactInputSchema = {
  contact_slug: textFilterSchema.describe("Slug of the contact to update."),
  first_name: textFilterSchema.optional().describe("Contact first name."),
  last_name: textFilterSchema.optional().describe("Contact last name."),
  owner_id: z.coerce.number().int().positive().optional().describe("Contact owner user ID."),
  created_by: z.coerce.number().int().positive().optional().describe("Creating user ID."),
  ...contactMutationOptionalFieldsInputSchema,
};

const offLimitSlugListSchema = z.array(textFilterSchema).min(1).max(25);

const markCandidateOffLimitInputSchema = {
  candidate_slugs: offLimitSlugListSchema.describe("Candidate slugs to mark off-limit. Max 25."),
  status_id: z.coerce.number().int().positive().describe("Off-limit status ID. Resolve with list_off_limit_statuses."),
  end_date: offLimitEndDateSchema.describe("Off-limit end date in DD-MM-YYYY format."),
  reason: z.string().trim().min(1).optional().describe("Off-limit reason."),
};

const markContactOffLimitInputSchema = {
  contact_slugs: offLimitSlugListSchema.describe("Contact slugs to mark off-limit. Max 25."),
  status_id: z.coerce.number().int().positive().describe("Off-limit status ID. Resolve with list_off_limit_statuses."),
  end_date: offLimitEndDateSchema.describe("Off-limit end date in DD-MM-YYYY format."),
  reason: z.string().trim().min(1).optional().describe("Off-limit reason."),
};

const markCompanyOffLimitInputSchema = {
  company_slugs: offLimitSlugListSchema.describe("Company slugs to mark off-limit. Max 25."),
  status_id: z.coerce.number().int().positive().describe("Off-limit status ID. Resolve with list_off_limit_statuses."),
  end_date: offLimitEndDateSchema.describe("Off-limit end date in DD-MM-YYYY format."),
  reason: z.string().trim().min(1).optional().describe("Off-limit reason."),
  mark_contact_off_limit: booleanLikeSchema.describe(
    "Whether Recruit CRM should also mark related contacts off-limit.",
  ),
  mark_candidate_off_limit: booleanLikeSchema.describe(
    "Whether Recruit CRM should also mark related candidates off-limit.",
  ),
};

const markRecordsAvailableInputSchema = {
  record_type: markRecordsAvailableRecordTypeSchema.describe("Record type to mark available."),
  slugs: offLimitSlugListSchema.describe("Record slugs to mark available. Max 25."),
  mark_contact_available: booleanLikeSchema
    .optional()
    .describe("For record_type=company, whether Recruit CRM should also mark related contacts available."),
  mark_candidate_available: booleanLikeSchema
    .optional()
    .describe("For record_type=company, whether Recruit CRM should also mark related candidates available."),
};

const listUsersInputSchema = {
  include_teams: booleanLikeSchema
    .optional()
    .describe("Opt-in flag (default false). When true, each user includes team memberships."),
  include_contact_info: booleanLikeSchema
    .optional()
    .describe(
      "Opt-in flag (default false). When true, each user also includes email and contact_number. Leave off unless the user explicitly needs contact details.",
    ),
};

const searchTasksInputSchema = {
  page: z.coerce.number().int().min(1).optional().describe("Page number."),
  created_from: textFilterSchema.optional().describe("Task created-on date range start."),
  created_to: textFilterSchema.optional().describe("Task created-on date range end."),
  owner_email: textFilterSchema.optional().describe("Task owner email."),
  owner_id: textFilterSchema.optional().describe("Task owner id. Use this for 'my' task requests after resolving the Recruit CRM user id."),
  owner_name: textFilterSchema.optional().describe("Task owner name."),
  related_to: textFilterSchema.optional().describe("Related entity slug or id. Must be used with related_to_type."),
  related_to_type: taskRelatedToTypeSchema.optional().describe("Related entity type. Must be used with related_to."),
  starting_from: textFilterSchema.optional().describe("Task due-date range start."),
  starting_to: textFilterSchema.optional().describe("Task due-date range end."),
  title: textFilterSchema.optional().describe("Task title."),
  updated_from: textFilterSchema.optional().describe("Task updated-on date range start."),
  updated_to: textFilterSchema.optional().describe("Task updated-on date range end."),
};

const searchJobsInputSchema = {
  page: z.coerce.number().int().min(1).optional().describe("Page number."),
  city: textFilterSchema.optional().describe("City."),
  company_name: textFilterSchema.optional().describe("Company name."),
  company_slug: textFilterSchema.optional().describe("Company slug."),
  contact_email: textFilterSchema.optional().describe("Primary contact email."),
  contact_name: textFilterSchema.optional().describe("Primary contact name."),
  contact_number: textFilterSchema.optional().describe("Primary contact number."),
  contact_slug: textFilterSchema.optional().describe("Primary contact slug."),
  country: textFilterSchema.optional().describe("Country."),
  created_from: textFilterSchema.optional().describe("Created-on date range start."),
  created_to: textFilterSchema.optional().describe("Created-on date range end."),
  enable_job_application_form: binaryNumberSchema.optional().describe("Filter by job application form enabled flag."),
  exact_search: booleanLikeSchema.optional().describe("Use exact search instead of partial match."),
  full_address: textFilterSchema.optional().describe("Full address."),
  job_category: textFilterSchema.optional().describe("Job category."),
  job_skill: textFilterSchema.optional().describe("Job skill."),
  job_slug: textFilterSchema.optional().describe("Job slug. Other filters are ignored when provided."),
  job_status: z.coerce.number().int().optional().describe("Job status id."),
  job_type: jobTypeInputSchema.optional().describe("Job type."),
  limit: z.coerce.number().int().min(1).max(100).optional().describe("Results per page. Max 100."),
  locality: textFilterSchema.optional().describe("Locality."),
  name: textFilterSchema.optional().describe("Job name."),
  note_for_candidates: textFilterSchema.optional().describe("Note for candidates."),
  owner_email: textFilterSchema.optional().describe("Job owner email."),
  owner_id: textFilterSchema.optional().describe("Job owner id. Use this for 'my' job requests after resolving the Recruit CRM user id."),
  owner_name: textFilterSchema.optional().describe("Job owner name."),
  secondary_contact_email: textFilterSchema.optional().describe("Secondary contact email."),
  secondary_contact_name: textFilterSchema.optional().describe("Secondary contact name."),
  secondary_contact_number: textFilterSchema.optional().describe("Secondary contact number."),
  secondary_contact_slug: textFilterSchema.optional().describe("Secondary contact slug."),
  sort_by: z.enum(["createdon", "updatedon"]).optional().describe("Sort field."),
  sort_order: z.enum(["asc", "desc"]).optional().describe("Sort order."),
  updated_from: textFilterSchema.optional().describe("Updated-on date range start."),
  updated_to: textFilterSchema.optional().describe("Updated-on date range end."),
  custom_fields: z
    .array(
      z.object({
        field_id: z.coerce.number().int().positive().describe("Job custom field id."),
        filter_type: customFieldFilterTypeSchema.describe("Custom field filter type."),
        filter_value: customFieldFilterValueSchema.optional().describe("Value for filter types that require it."),
      }),
    )
    .optional()
    .describe("Job custom field filters. Use field ids from the metadata tools."),
};

const getJobAssignedCandidatesInputSchema = {
  job_slug: textFilterSchema.describe("Job slug."),
  page: z.coerce.number().int().min(1).optional().describe("Page number."),
  limit: z.coerce.number().int().min(1).optional().describe("Results per page. Max 100."),
  status_id: statusIdFilterSchema
    .optional()
    .describe("Hiring stage id filter. Accepts a single id or comma-separated ids like 8 or 8,12."),
};

const listCandidateHiringStagesInputSchema = {
  hiring_pipeline_id: z.coerce
    .number()
    .int()
    .min(0)
    .optional()
    .describe(
      "Hiring pipeline id. Defaults to 0 for the Master Hiring Pipeline, which can be used when only a hiring stage ID is needed and no job context is required.",
    ),
};

const updateCandidateHiringStageInputSchema = {
  candidate_slug: textFilterSchema.describe("Candidate slug."),
  job_slug: textFilterSchema.describe("Job slug."),
  status_id: z.coerce
    .number()
    .int()
    .positive()
    .describe(
      "Candidate hiring stage id. Resolve with list_candidate_hiring_stages; use hiring_pipeline_id 0 for master stages or the job's hiring_pipeline_id for job-specific stages.",
    ),
  remark: textFilterSchema.optional().describe("Remark. Supports basic HTML/rich text."),
  stage_date: textFilterSchema.describe("Updated date/time, preferably ISO 8601."),
  updated_by: z.coerce.number().int().positive().describe("Recruit CRM user id updating the hiring stage."),
  create_placement: booleanLikeSchema
    .optional()
    .describe("Create placement flag. Defaults to false; set true only when the user explicitly wants a placement created."),
};

const assignCandidateToJobInputSchema = {
  candidate_slug: textFilterSchema.describe("Candidate slug."),
  job_slug: textFilterSchema.describe("Job slug."),
  updated_by: z.coerce.number().int().positive().describe("Recruit CRM user id assigning the candidate to the job."),
};

const pitchCandidateToContactInputSchema = {
  candidate_slug: textFilterSchema.describe("Candidate slug."),
  contact_slug: textFilterSchema.describe("Contact slug."),
  created_by: z.coerce.number().int().positive().describe("Recruit CRM user id recording the pitch."),
  allow_duplicate: z
    .boolean()
    .optional()
    .describe("When true, create another pitch row even if this candidate is already pitched to this contact."),
};

const updateCandidatePitchStageInputSchema = {
  candidate_slug: textFilterSchema.describe("Candidate slug."),
  contact_slug: textFilterSchema.describe("Contact slug."),
  status_id: z.coerce.number().int().positive().describe("Pitch status id. Resolve with list_pitch_stages."),
  stage_date: textFilterSchema.describe("Updated pitch stage date/time, preferably ISO 8601."),
  updated_by: z.coerce.number().int().positive().describe("Recruit CRM user id updating the pitch stage."),
  remark: textFilterSchema.optional().describe("Remark text."),
};

const pitchEntityLookupInputSchema = {
  entity_type: pitchEntityTypeSchema.describe("Entity type for the pitch lookup."),
  entity_slug: textFilterSchema.describe("Candidate slug when entity_type=candidate, or contact slug when entity_type=contact."),
};

const searchCompaniesInputSchema = {
  page: z.coerce.number().int().min(1).optional().describe("Page number."),
  limit: z.coerce.number().int().min(1).max(100).optional().describe("Records per page (max 100, default 100)."),
  company_name: textFilterSchema.optional().describe("Company name."),
  created_from: textFilterSchema.optional().describe("Created-on date range start."),
  created_to: textFilterSchema.optional().describe("Created-on date range end."),
  marked_as_off_limit: booleanLikeSchema.optional().describe("Filter by off-limit status."),
  owner_email: textFilterSchema.optional().describe("Company owner email."),
  owner_id: z.coerce.number().int().optional().describe("Company owner id. Use this for 'my' company requests after resolving the Recruit CRM user id."),
  owner_name: textFilterSchema.optional().describe("Company owner name."),
  updated_from: textFilterSchema.optional().describe("Updated-on date range start."),
  updated_to: textFilterSchema.optional().describe("Updated-on date range end."),
  company_slug: textFilterSchema.optional().describe("Company slug. Other filters are ignored when provided."),
  exact_search: booleanLikeSchema.optional().describe("Use exact search instead of partial match."),
  sort_by: z.enum(["createdon", "updatedon"]).optional().describe("Sort field."),
  sort_order: z.enum(["asc", "desc"]).optional().describe("Sort order."),
  custom_fields: z
    .array(
      z.object({
        field_id: z.coerce.number().int().positive().describe("Company custom field id."),
        filter_type: customFieldFilterTypeSchema.describe("Custom field filter type."),
        filter_value: customFieldFilterValueSchema.optional().describe("Value for filter types that require it."),
      }),
    )
    .optional()
    .describe("Company custom field filters. Use field ids from the metadata tools."),
};

const searchContactsInputSchema = {
  page: z.coerce.number().int().min(1).optional().describe("Page number."),
  limit: z.coerce.number().int().min(1).max(100).optional().describe("Records per page (max 100, default 100)."),
  created_from: textFilterSchema.optional().describe("Created-on date range start."),
  created_to: textFilterSchema.optional().describe("Created-on date range end."),
  email: textFilterSchema.optional().describe("Contact email."),
  first_name: textFilterSchema.optional().describe("Contact first name."),
  last_name: textFilterSchema.optional().describe("Contact last name."),
  linkedin: textFilterSchema.optional().describe("Contact LinkedIn URL."),
  marked_as_off_limit: booleanLikeSchema.optional().describe("Filter contacts by off-limit status."),
  owner_email: textFilterSchema.optional().describe("Contact owner email."),
  owner_id: textFilterSchema.optional().describe("Contact owner id. Use this for 'my' contact requests after resolving the Recruit CRM user id."),
  owner_name: textFilterSchema.optional().describe("Contact owner name."),
  updated_from: textFilterSchema.optional().describe("Updated-on date range start."),
  updated_to: textFilterSchema.optional().describe("Updated-on date range end."),
  company_slug: textFilterSchema.optional().describe("Company slug."),
  contact_number: textFilterSchema.optional().describe("Contact number."),
  contact_slug: textFilterSchema.optional().describe("Contact slug. Other filters are ignored when provided."),
  exact_search: booleanLikeSchema.optional().describe("Use exact search instead of partial match."),
  sort_by: z.enum(["createdon", "updatedon"]).optional().describe("Sort field."),
  sort_order: z.enum(["asc", "desc"]).optional().describe("Sort order."),
  include_contact_info: booleanLikeSchema
    .optional()
    .describe(
      "Opt-in flag (default false). When true, each result also includes email, contact_number, and linkedin. Leave off for most requests; enable only when the user explicitly needs contact details, because it increases response size and exposes PII.",
    ),
  custom_fields: z
    .array(
      z.object({
        field_id: z.coerce.number().int().positive().describe("Contact custom field id."),
        filter_type: customFieldFilterTypeSchema.describe("Custom field filter type."),
        filter_value: customFieldFilterValueSchema.optional().describe("Value for filter types that require it."),
      }),
    )
    .optional()
    .describe("Contact custom field filters. Use field ids from the metadata tools."),
};

const searchHotlistsInputSchema = {
  page: z.coerce.number().int().min(1).optional().describe("Page number."),
  name: textFilterSchema.optional().describe("Hotlist name."),
  shared: binaryNumberSchema.optional().describe("Shared with team flag. true for team-shared hotlists, false for private."),
  related_to_type: z
    .enum(["candidate", "company", "contact", "job"])
    .describe("Associated entity type for the hotlist."),
};

const createHotlistInputSchema = {
  name: textFilterSchema.describe("Hotlist name."),
  related_to_type: z
    .enum(["candidate", "company", "contact", "job"])
    .describe("Associated entity type for the hotlist."),
  shared: binaryNumberSchema.describe("Shared with team flag. true for team-shared hotlists, false for private."),
  created_by: z.coerce.number().int().positive().describe("Recruit CRM user id creating the hotlist."),
};

const searchMeetingsInputSchema = {
  page: z.coerce.number().int().min(1).optional().describe("Page number."),
  created_from: textFilterSchema.optional().describe("Meeting created-on date range start."),
  created_to: textFilterSchema.optional().describe("Meeting created-on date range end."),
  owner_email: textFilterSchema.optional().describe("Meeting owner email."),
  owner_id: textFilterSchema.optional().describe("Meeting owner id. Use this for 'my' meeting requests after resolving the Recruit CRM user id."),
  owner_name: textFilterSchema.optional().describe("Meeting owner name."),
  related_to: textFilterSchema.optional().describe("Related entity slug or id. Must be used with related_to_type."),
  related_to_type: meetingRelatedToTypeSchema.optional().describe("Related entity type. Must be used with related_to."),
  starting_from: textFilterSchema.optional().describe("Meeting start date/time range start."),
  starting_to: textFilterSchema.optional().describe("Meeting start date/time range end."),
  title: textFilterSchema.optional().describe("Meeting title."),
  updated_from: textFilterSchema.optional().describe("Meeting updated-on date range start."),
  updated_to: textFilterSchema.optional().describe("Meeting updated-on date range end."),
};

const taskReminderSchema = z
  .union([
    z.literal("-1"),
    z.literal("0"),
    z.literal("15"),
    z.literal("30"),
    z.literal("60"),
    z.literal("1440"),
    z.literal(-1),
    z.literal(0),
    z.literal(15),
    z.literal(30),
    z.literal(60),
    z.literal(1440),
  ])
  .transform((value) => Number(value) as -1 | 0 | 15 | 30 | 60 | 1440);
const createTaskAssociatedSlugsSchema = z.array(textFilterSchema).min(1).max(25);
const createTaskCollaboratorIdsSchema = z.array(z.coerce.number().int().positive()).min(1).max(25);

const createTaskInputSchema = {
  task_type_id: z.coerce
    .number()
    .int()
    .positive()
    .describe("Recruit CRM task type id."),
  title: textFilterSchema.describe("Task title."),
  description: z
    .string()
    .min(1)
    .describe("Task description. Supports basic HTML/rich text and is sent to Recruit CRM as-is."),
  reminder: taskReminderSchema.describe(
    "Reminder ID: -1 No Reminder, 0 0 Min Before, 15 15 Min Before, 30 30 Min Before, 60 1 Hour Before, 1440 1 Day Before.",
  ),
  start_date: textFilterSchema.describe("Task start date/time, preferably ISO 8601."),
  owner_id: z.coerce
    .number()
    .int()
    .positive()
    .describe("Recruit CRM user id assigned to own the task."),
  created_by: z.coerce
    .number()
    .int()
    .positive()
    .describe("Recruit CRM user id creating the task. Often the same as owner_id."),
  related_to: textFilterSchema.optional().describe("Associated entity slug. Must be used with related_to_type."),
  related_to_type: taskRelatedToTypeSchema.optional().describe("Associated entity type. Must be used with related_to."),
  updated_by: z.coerce.number().int().positive().optional().describe("Recruit CRM user id updating the task."),
  associated_candidates: createTaskAssociatedSlugsSchema
    .optional()
    .describe("Additional associated candidate slugs. Max 25. Sent as a comma-separated API field."),
  associated_companies: createTaskAssociatedSlugsSchema
    .optional()
    .describe("Additional associated company slugs. Max 25. Sent as a comma-separated API field."),
  associated_contacts: createTaskAssociatedSlugsSchema
    .optional()
    .describe("Additional associated contact slugs. Max 25. Sent as a comma-separated API field."),
  associated_jobs: createTaskAssociatedSlugsSchema
    .optional()
    .describe("Additional associated job slugs. Max 25. Sent as a comma-separated API field."),
  associated_deals: createTaskAssociatedSlugsSchema
    .optional()
    .describe("Additional associated deal slugs. Max 25. Sent as a comma-separated API field."),
  collaborator_user_ids: createTaskCollaboratorIdsSchema
    .optional()
    .describe("Collaborator user IDs. Max 25. Sent to the Recruit CRM tasks API as the comma-separated collaborators field."),
  collaborator_team_ids: createTaskCollaboratorIdsSchema
    .optional()
    .describe("Collaborator team IDs. Max 25. Sent as a comma-separated API field."),
  enable_auto_populate_teams: booleanLikeSchema
    .optional()
    .describe("When true, Recruit CRM auto-populates teams for the owner_id user/account owner unless collaborator_team_ids is provided."),
};

const updateTaskInputSchema = {
  task_id: z.coerce.number().int().positive().describe("Recruit CRM task id to update."),
  task_type_id: createTaskInputSchema.task_type_id.optional(),
  title: createTaskInputSchema.title.optional(),
  description: createTaskInputSchema.description.optional(),
  reminder: createTaskInputSchema.reminder.optional(),
  start_date: createTaskInputSchema.start_date.optional(),
  owner_id: createTaskInputSchema.owner_id.optional(),
  updated_by: z.coerce.number().int().positive().describe("Recruit CRM user id updating the task."),
  related_to: createTaskInputSchema.related_to,
  related_to_type: createTaskInputSchema.related_to_type,
  associated_candidates: createTaskInputSchema.associated_candidates,
  associated_companies: createTaskInputSchema.associated_companies,
  associated_contacts: createTaskInputSchema.associated_contacts,
  associated_jobs: createTaskInputSchema.associated_jobs,
  associated_deals: createTaskInputSchema.associated_deals,
  collaborator_user_ids: createTaskInputSchema.collaborator_user_ids,
  collaborator_team_ids: createTaskInputSchema.collaborator_team_ids,
  enable_auto_populate_teams: createTaskInputSchema.enable_auto_populate_teams,
};

const searchNotesInputSchema = {
  page: z.coerce.number().int().min(1).optional().describe("Page number."),
  added_from: textFilterSchema.optional().describe("Note added-on date range start."),
  added_to: textFilterSchema.optional().describe("Note added-on date range end."),
  related_to: textFilterSchema.optional().describe("Related entity slug. Must be used with related_to_type."),
  related_to_type: noteRelatedToTypeSchema.optional().describe("Related entity type. Must be used with related_to."),
  updated_from: textFilterSchema.optional().describe("Note updated-on date range start."),
  updated_to: textFilterSchema.optional().describe("Note updated-on date range end."),
};

const createNoteAssociatedSlugsSchema = z.array(textFilterSchema).min(1).max(25);
const createNoteCollaboratorIdsSchema = z.array(z.coerce.number().int().positive()).min(1).max(25);

const createNoteInputSchema = {
  note_type_id: z.coerce.number()
    .int()
    .positive()
    .describe("Recruit CRM note type id."),
  description: z
    .string()
    .min(1)
    .describe("Note description. Supports basic HTML/rich text and is sent to Recruit CRM as-is."),
  related_to: textFilterSchema.describe("Associated entity slug."),
  related_to_type: noteRelatedToTypeSchema.describe("Associated entity type."),
  created_by: z.coerce.number()
    .int()
    .positive()
    .describe("Recruit CRM user id creating the note."),
  updated_by: z.coerce.number().int().positive().optional().describe("Recruit CRM user id updating the note."),
  associated_candidates: createNoteAssociatedSlugsSchema
    .optional()
    .describe("Additional associated candidate slugs. Max 25. Sent as a comma-separated API field."),
  associated_companies: createNoteAssociatedSlugsSchema
    .optional()
    .describe("Additional associated company slugs. Max 25. Sent as a comma-separated API field."),
  associated_contacts: createNoteAssociatedSlugsSchema
    .optional()
    .describe("Additional associated contact slugs. Max 25. Sent as a comma-separated API field."),
  associated_jobs: createNoteAssociatedSlugsSchema
    .optional()
    .describe("Additional associated job slugs. Max 25. Sent as a comma-separated API field."),
  associated_deals: createNoteAssociatedSlugsSchema
    .optional()
    .describe("Additional associated deal slugs. Max 25. Sent as a comma-separated API field."),
  collaborator_user_ids: createNoteCollaboratorIdsSchema
    .optional()
    .describe("Collaborator user IDs. Max 25. Sent as a comma-separated API field."),
  collaborator_team_ids: createNoteCollaboratorIdsSchema
    .optional()
    .describe("Collaborator team IDs. Max 25. Sent as a comma-separated API field."),
  enable_auto_populate_teams: booleanLikeSchema
    .optional()
    .describe("When true, Recruit CRM auto-populates teams for the created_by user/account owner unless collaborator_team_ids is provided."),
};

const updateNoteInputSchema = {
  note_id: z.coerce.number().int().positive().describe("Recruit CRM note id to update."),
  note_type_id: createNoteInputSchema.note_type_id.optional(),
  description: createNoteInputSchema.description.optional(),
  related_to: createNoteInputSchema.related_to.optional(),
  related_to_type: createNoteInputSchema.related_to_type.optional(),
  updated_by: z.coerce.number().int().positive().describe("Recruit CRM user id updating the note."),
  associated_candidates: createNoteInputSchema.associated_candidates,
  associated_companies: createNoteInputSchema.associated_companies,
  associated_contacts: createNoteInputSchema.associated_contacts,
  associated_jobs: createNoteInputSchema.associated_jobs,
  associated_deals: createNoteInputSchema.associated_deals,
  collaborator_user_ids: createNoteInputSchema.collaborator_user_ids,
  collaborator_team_ids: createNoteInputSchema.collaborator_team_ids,
  enable_auto_populate_teams: createNoteInputSchema.enable_auto_populate_teams,
};

const searchCallLogsInputSchema = {
  page: z.coerce.number().int().min(1).optional().describe("Page number."),
  call_type: z.enum(["CALL_OUTGOING", "CALL_INCOMING"]).optional().describe("Call direction filter."),
  related_to: textFilterSchema.optional().describe("Related entity slug. Must be used with related_to_type."),
  related_to_type: callLogRelatedToTypeSchema.optional().describe("Related entity type. Must be used with related_to."),
  starting_from: textFilterSchema.optional().describe("Call started-on date/time range start."),
  starting_to: textFilterSchema.optional().describe("Call started-on date/time range end."),
  updated_from: textFilterSchema.optional().describe("Call log updated-on date range start."),
  updated_to: textFilterSchema.optional().describe("Call log updated-on date range end."),
};

const nullableStringSchema = z.union([z.string(), z.null()]);
const nullableNumberSchema = z.union([z.number(), z.null()]);
const nullableBooleanSchema = z.union([z.boolean(), z.null()]);
const nullableStringOrNumberSchema = z.union([z.string(), z.number(), z.null()]);
const detailIdentifierSchema = z.union([z.string(), z.number(), z.null()]).optional();
const recruitCrmServerInstructions =
  "Recruit CRM records use different identifiers across workflows: candidates, jobs, companies, and contacts use slugs for exact follow-up actions, while users, teams, statuses, types, currencies, qualifications, pipelines, questions, and custom fields use numeric IDs. Recruit CRM app URL formats are https://app.recruitcrm.io/candidate/{slug}, https://app.recruitcrm.io/company/{slug}, https://app.recruitcrm.io/contact/{slug}, https://app.recruitcrm.io/job/{slug}, and https://app.recruitcrm.io/deal/{slug}. User-facing summary fields are names, labels, statuses, dates, recruiter/user names, and complete Recruit CRM app URLs when available. Candidate, contact, company, job, and deal names can be paired with their complete Recruit CRM app URLs as links when the corresponding slug is available. Slugs, numeric IDs, and URL templates are technical references for tool calls, exact disambiguation, troubleshooting, and auditability. Search and list tools return compact summaries; detail tools provide fuller records after a slug is known. Self-referential user scopes identify the authenticated Recruit CRM user, including I, me, my, mine, myself, assigned to me, owned by me, created by me, and updated by me. Group scopes such as we, our, us, and team depend on explicit supported team or user fields.";
const myRecordsOwnerFilterGuidance =
  "Filter by owner_id to scope results to a specific user; resolve user IDs with list_users.";
const unsupportedOwnerFilterGuidance =
  "Does not support owner filtering.";

const candidateSummarySchema = z.object({
  slug: z.string(),
  first_name: nullableStringSchema,
  last_name: nullableStringSchema,
  position: nullableStringSchema,
  current_organization: nullableStringSchema,
  current_status: nullableStringSchema,
  city: nullableStringSchema,
  updated_on: nullableStringSchema,
  email: nullableStringSchema.optional(),
  contact_number: nullableStringSchema.optional(),
  linkedin: nullableStringSchema.optional(),
});

const searchCandidatesOutputSchema = {
  page: z.number().int().min(1),
  returned_count: z.number().int().min(0),
  has_more: z.boolean(),
  candidates: z.array(candidateSummarySchema),
};

const createCandidateHistoryOperationOutputSchema = z.object({
  requested_count: z.number().int().min(0),
  successful: z.boolean(),
  status_code: nullableNumberSchema,
  message: nullableStringSchema,
});

const createCandidateHistoryErrorOutputSchema = z.object({
  source: z.enum(["work_history", "education_history"]),
  error: z.string(),
  status_code: nullableNumberSchema,
});

const createCandidateOutputSchema = {
  action: z.enum(["created", "updated"]),
  candidate_slug: z.string(),
  candidate_id: nullableNumberSchema,
  first_name: nullableStringSchema,
  last_name: nullableStringSchema,
  position: nullableStringSchema,
  current_organization: nullableStringSchema,
  current_status: nullableStringSchema,
  owner: nullableNumberSchema,
  created_on: nullableStringSchema,
  updated_on: nullableStringSchema,
  view_url: nullableStringSchema,
  work_history: createCandidateHistoryOperationOutputSchema,
  education_history: createCandidateHistoryOperationOutputSchema,
  errors: z.array(createCandidateHistoryErrorOutputSchema),
};

const jobStatusSummarySchema = z.object({
  id: nullableNumberSchema,
  label: nullableStringSchema,
});

const jobSummarySchema = z.object({
  id: nullableNumberSchema,
  slug: nullableStringSchema,
  name: nullableStringSchema,
  company_slug: nullableStringSchema,
  contact_slug: nullableStringSchema,
  secondary_contact_slugs: z.array(z.string()),
  job_status: z.union([jobStatusSummarySchema, z.null()]),
  note_for_candidates: nullableStringSchema,
  number_of_openings: nullableNumberSchema,
  minimum_experience: nullableNumberSchema,
  maximum_experience: nullableNumberSchema,
  min_annual_salary: nullableNumberSchema,
  max_annual_salary: nullableNumberSchema,
  pay_rate: nullableNumberSchema,
  bill_rate: nullableNumberSchema,
  salary_type: nullableStringSchema,
  job_type: nullableStringSchema,
  job_category: nullableStringSchema,
  job_skill: nullableStringSchema,
  city: nullableStringSchema,
  locality: nullableStringSchema,
  state: nullableStringSchema,
  country: nullableStringSchema,
  enable_job_application_form: nullableBooleanSchema,
  application_form_url: nullableStringSchema,
  owner: nullableNumberSchema,
  created_on: nullableStringSchema,
  updated_on: nullableStringSchema,
  hiring_pipeline_id: nullableNumberSchema,
});

const searchJobsOutputSchema = {
  page: z.number().int().min(1),
  returned_count: z.number().int().min(0),
  has_more: z.boolean(),
  jobs: z.array(jobSummarySchema),
};

const createJobOutputSchema = {
  action: z.enum(["created", "updated"]),
  job_slug: z.string(),
  job_id: nullableNumberSchema,
  name: nullableStringSchema,
  company_slug: nullableStringSchema,
  contact_slug: nullableStringSchema,
  job_status: z.union([jobStatusSummarySchema, z.null()]),
  owner: nullableNumberSchema,
  enable_job_application_form: nullableBooleanSchema,
  application_form_url: nullableStringSchema,
  created_on: nullableStringSchema,
  updated_on: nullableStringSchema,
  view_url: nullableStringSchema,
};

const companyOffLimitSummarySchema = z.object({
  status_id: nullableNumberSchema,
  status_label: nullableStringSchema,
  reason: nullableStringSchema,
  end_date: nullableStringSchema,
});

const companySummarySchema = z.object({
  id: nullableNumberSchema,
  slug: nullableStringSchema,
  company_name: nullableStringSchema,
  website: nullableStringSchema,
  city: nullableStringSchema,
  locality: nullableStringSchema,
  state: nullableStringSchema,
  country: nullableStringSchema,
  postal_code: nullableStringSchema,
  address: nullableStringSchema,
  owner: nullableNumberSchema,
  contact_slugs: z.array(z.string()),
  is_child_company: nullableBooleanSchema,
  is_parent_company: nullableBooleanSchema,
  child_company_slugs: z.array(z.string()),
  parent_company_slug: nullableStringSchema,
  marked_as_off_limit: z.boolean(),
  off_limit: z.union([companyOffLimitSummarySchema, z.null()]),
  created_on: nullableStringSchema,
  updated_on: nullableStringSchema,
});

const searchCompaniesOutputSchema = {
  page: z.number().int().min(1),
  returned_count: z.number().int().min(0),
  has_more: z.boolean(),
  companies: z.array(companySummarySchema),
};

const createCompanyOutputSchema = {
  action: z.enum(["created", "updated"]),
  company_slug: z.string(),
  company_id: nullableNumberSchema,
  company_name: nullableStringSchema,
  website: nullableStringSchema,
  owner: nullableNumberSchema,
  created_on: nullableStringSchema,
  updated_on: nullableStringSchema,
  view_url: nullableStringSchema,
};

const contactSummarySchema = z.object({
  slug: z.string(),
  first_name: nullableStringSchema,
  last_name: nullableStringSchema,
  designation: nullableStringSchema,
  company_slug: nullableStringSchema,
  additional_company_slugs: z.array(z.string()),
  city: nullableStringSchema,
  locality: nullableStringSchema,
  updated_on: nullableStringSchema,
  email: nullableStringSchema.optional(),
  contact_number: nullableStringSchema.optional(),
  linkedin: nullableStringSchema.optional(),
});

const searchContactsOutputSchema = {
  page: z.number().int().min(1),
  returned_count: z.number().int().min(0),
  has_more: z.boolean(),
  contacts: z.array(contactSummarySchema),
};

const createContactOutputSchema = {
  action: z.enum(["created", "updated"]),
  contact_slug: z.string(),
  contact_id: nullableNumberSchema,
  first_name: nullableStringSchema,
  last_name: nullableStringSchema,
  designation: nullableStringSchema,
  company_slug: nullableStringSchema,
  owner: nullableNumberSchema,
  created_on: nullableStringSchema,
  updated_on: nullableStringSchema,
  view_url: nullableStringSchema,
};

const hotlistSummarySchema = z.object({
  id: nullableNumberSchema,
  name: nullableStringSchema,
  related_to_type: nullableStringSchema,
  shared: nullableBooleanSchema,
  created_by: nullableNumberSchema,
  related_count: z.number().int().min(0),
  related_slugs: z.array(z.string()).optional(),
});

const searchHotlistsOutputSchema = {
  page: z.number().int().min(1),
  returned_count: z.number().int().min(0),
  has_more: z.boolean(),
  hotlists: z.array(hotlistSummarySchema),
};

const userTeamSummarySchema = z.object({
  team_id: nullableNumberSchema,
  team_name: nullableStringSchema,
});

const userSummarySchema = z.object({
  id: nullableNumberSchema,
  first_name: nullableStringSchema,
  last_name: nullableStringSchema,
  status: nullableStringSchema,
  teams: z.array(userTeamSummarySchema).optional(),
  email: nullableStringSchema.optional(),
  contact_number: nullableStringSchema.optional(),
});

const listUsersOutputSchema = {
  returned_count: z.number().int().min(0),
  users: z.array(userSummarySchema),
};

const paginatedMetadataOutputFields = {
  page: z.number().int().min(1),
  returned_count: z.number().int().min(0),
  total_count: z.number().int().min(0),
  has_more: z.boolean(),
};

const teamUserSummarySchema = z.object({
  id: nullableNumberSchema,
  first_name: nullableStringSchema,
  last_name: nullableStringSchema,
  email: nullableStringSchema.optional(),
  contact_number: nullableStringSchema.optional(),
  avatar: nullableStringSchema.optional(),
});

const teamSummarySchema = z.object({
  team_id: nullableNumberSchema,
  team_name: nullableStringSchema,
  users: z.array(z.union([z.number(), teamUserSummarySchema])),
});

const listTeamsOutputSchema = {
  ...paginatedMetadataOutputFields,
  teams: z.array(teamSummarySchema),
};

const candidateQuestionSummarySchema = z.object({
  id: nullableNumberSchema,
  question: nullableStringSchema,
});

const listCandidateQuestionsOutputSchema = {
  ...paginatedMetadataOutputFields,
  candidate_questions: z.array(candidateQuestionSummarySchema),
};

const hiringPipelineSummarySchema = z.object({
  hiring_pipeline_id: nullableNumberSchema,
  name: nullableStringSchema,
});

const listHiringPipelinesOutputSchema = {
  ...paginatedMetadataOutputFields,
  hiring_pipelines: z.array(hiringPipelineSummarySchema),
};

const languageSummarySchema = z.object({
  language_id: nullableNumberSchema,
  code: nullableStringSchema,
  language_name: nullableStringSchema,
});

const languageProficiencySummarySchema = z.object({
  proficiency_id: z.number().int().positive(),
  label: z.string(),
});

const listLanguagesAndProficienciesOutputSchema = {
  ...paginatedMetadataOutputFields,
  languages: z.array(languageSummarySchema),
  proficiencies: z.array(languageProficiencySummarySchema),
};

const currencySummarySchema = z.object({
  currency_id: nullableNumberSchema,
  code: nullableStringSchema,
  country: nullableStringSchema,
  currency: nullableStringSchema,
  symbol: nullableStringSchema,
});

const listCurrenciesOutputSchema = {
  ...paginatedMetadataOutputFields,
  currencies: z.array(currencySummarySchema),
};

const qualificationSummarySchema = z.object({
  qualification_id: nullableNumberSchema,
  label: nullableStringSchema,
});

const listQualificationsOutputSchema = {
  ...paginatedMetadataOutputFields,
  qualifications: z.array(qualificationSummarySchema),
};

const xmlJobboardSummarySchema = z.object({
  id: nullableNumberSchema,
  label: nullableStringSchema,
});

const listXmlJobboardsOutputSchema = {
  default_xml_feeds: z.array(xmlJobboardSummarySchema),
  custom_xml_feeds: z.array(xmlJobboardSummarySchema),
};

const createHotlistOutputSchema = {
  hotlist_id: nullableNumberSchema,
  name: nullableStringSchema,
  related_to_type: nullableStringSchema,
  shared: nullableBooleanSchema,
  created_by: nullableNumberSchema,
};

const addRecordsToHotlistInputSchema = {
  hotlist_id: z.coerce.number().int().positive().describe("Hotlist id to modify."),
  related_slugs: z
    .array(textFilterSchema)
    .min(1)
    .max(10)
    .describe("Record slugs to add. Max 10 per call. Duplicates are ignored."),
};

const addRecordsToHotlistOutputSchema = {
  hotlist_id: z.number().int().positive(),
  requested_count: z.number().int().min(0),
  successful_count: z.number().int().min(0),
  failed_count: z.number().int().min(0),
  added_slugs: z.array(z.string()),
  errors: z.array(
    z.object({
      slug: z.string(),
      error: z.string(),
      status_code: z.union([z.number().int(), z.null()]),
    }),
  ),
};

const taskTypeSummarySchema = z.object({
  id: nullableStringOrNumberSchema,
  label: nullableStringSchema,
});

const activityRelatedSummarySchema = z.object({
  first_name: nullableStringSchema.optional(),
  last_name: nullableStringSchema.optional(),
  company_name: nullableStringSchema.optional(),
  name: nullableStringSchema.optional(),
});

const taskSummarySchema = z.object({
  id: nullableNumberSchema,
  related_to: nullableStringSchema,
  task_type: z.union([z.array(taskTypeSummarySchema), z.null()]),
  related_to_type: nullableStringSchema,
  related_to_name: nullableStringSchema,
  related: z.union([activityRelatedSummarySchema, z.null()]),
  description: nullableStringSchema,
  title: nullableStringSchema,
  status: nullableNumberSchema,
  start_date: nullableStringSchema,
  reminder_date: nullableStringSchema,
  reminder: nullableNumberSchema,
  owner: nullableNumberSchema,
  created_on: nullableStringSchema,
  updated_on: nullableStringSchema,
  created_by: nullableNumberSchema,
  updated_by: nullableNumberSchema,
});

const searchTasksOutputSchema = {
  page: z.number().int().min(1),
  returned_count: z.number().int().min(0),
  has_more: z.boolean(),
  tasks: z.array(taskSummarySchema),
};

const listTaskTypesOutputSchema = {
  returned_count: z.number().int().min(0),
  task_types: z.array(taskTypeSummarySchema),
};

const taskCollaboratorSummarySchema = z.object({
  attendee_type: nullableStringSchema,
  attendee_id: nullableStringSchema,
  display_name: nullableStringSchema,
});

const taskCollaboratorUserSummarySchema = z.object({
  id: nullableNumberSchema,
  first_name: nullableStringSchema,
  last_name: nullableStringSchema,
});

const taskCollaboratorTeamSummarySchema = z.object({
  team_id: nullableNumberSchema,
  team_name: nullableStringSchema,
});

const createTaskOutputSchema = {
  task_id: nullableNumberSchema,
  title: nullableStringSchema,
  task_type: z.union([taskTypeSummarySchema, z.null()]),
  description: nullableStringSchema,
  reminder: nullableNumberSchema,
  start_date: nullableStringSchema,
  reminder_date: nullableStringSchema,
  related_to: nullableStringSchema,
  related_to_type: nullableStringSchema,
  related_to_name: nullableStringSchema,
  related_to_view_url: nullableStringSchema,
  status: nullableStringOrNumberSchema,
  owner: nullableNumberSchema,
  associated_candidates: z.array(z.string()),
  associated_companies: z.array(z.string()),
  associated_contacts: z.array(z.string()),
  associated_jobs: z.array(z.string()),
  associated_deals: z.array(z.string()),
  created_on: nullableStringSchema,
  updated_on: nullableStringSchema,
  created_by: nullableNumberSchema,
  updated_by: nullableNumberSchema,
  collaborators: z.array(taskCollaboratorSummarySchema),
  collaborator_users: z.array(taskCollaboratorUserSummarySchema),
  collaborator_teams: z.array(taskCollaboratorTeamSummarySchema),
};

const meetingTypeSummarySchema = z.object({
  id: nullableStringOrNumberSchema,
  label: nullableStringSchema,
});

const meetingSummarySchema = z.object({
  id: nullableNumberSchema,
  title: nullableStringSchema,
  meeting_type: z.union([z.array(meetingTypeSummarySchema), z.null()]),
  description: nullableStringSchema,
  address: nullableStringSchema,
  reminder: nullableNumberSchema,
  start_date: nullableStringSchema,
  end_date: nullableStringSchema,
  related_to: nullableStringSchema,
  related_to_type: nullableStringSchema,
  related: z.union([activityRelatedSummarySchema, z.null()]),
  do_not_send_calendar_invites: nullableBooleanSchema,
  status: nullableStringOrNumberSchema,
  reminder_date: nullableStringSchema,
  all_day: nullableBooleanSchema,
  owner: nullableNumberSchema,
  created_on: nullableStringSchema,
  updated_on: nullableStringSchema,
  created_by: nullableNumberSchema,
  updated_by: nullableNumberSchema,
});

const searchMeetingsOutputSchema = {
  page: z.number().int().min(1),
  returned_count: z.number().int().min(0),
  has_more: z.boolean(),
  meetings: z.array(meetingSummarySchema),
};

const listMeetingTypesOutputSchema = {
  returned_count: z.number().int().min(0),
  meeting_types: z.array(meetingTypeSummarySchema),
};

const meetingReminderSchema = z
  .union([
    z.literal("-1"),
    z.literal("0"),
    z.literal("15"),
    z.literal("30"),
    z.literal("60"),
    z.literal("120"),
    z.literal("1440"),
    z.literal(-1),
    z.literal(0),
    z.literal(15),
    z.literal(30),
    z.literal(60),
    z.literal(120),
    z.literal(1440),
  ])
  .transform((value) => Number(value) as -1 | 0 | 15 | 30 | 60 | 120 | 1440);
const createMeetingAssociatedSlugsSchema = z.array(textFilterSchema).min(1).max(25);
const createMeetingCollaboratorIdsSchema = z.array(z.coerce.number().int().positive()).min(1).max(25);
const createMeetingInputSchema = {
  title: textFilterSchema.describe("Meeting title."),
  reminder: meetingReminderSchema.describe(
    "Reminder ID: -1 No Reminder, 0 0 Min Before, 15 15 Min Before, 30 30 Min Before, 60 1 Hour Before, 120 2 Hours Before, 1440 1 Day Before.",
  ),
  start_date: textFilterSchema.describe("Meeting start date/time, preferably ISO 8601 (e.g. 2026-05-08T10:00:00.000000Z)."),
  end_date: textFilterSchema.describe("Meeting end date/time, preferably ISO 8601 (e.g. 2026-05-08T11:00:00.000000Z)."),
  owner_id: z.coerce
    .number()
    .int()
    .positive()
    .describe("Recruit CRM user id assigned to own the meeting."),
  created_by: z.coerce
    .number()
    .int()
    .positive()
    .describe("Recruit CRM user id creating the meeting. Often the same as owner_id."),
  meeting_type_id: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .describe("Recruit CRM meeting type id."),
  description: z.string().min(1).optional().describe("Meeting description."),
  address: z.string().min(1).optional().describe("Meeting address or video call link."),
  related_to: textFilterSchema.optional().describe("Associated entity slug. Must be used with related_to_type."),
  related_to_type: meetingRelatedToTypeSchema.optional().describe("Associated entity type. Must be used with related_to."),
  attendee_contacts: createMeetingAssociatedSlugsSchema
    .optional()
    .describe("Contact slugs attending the meeting. Max 25. Sent as a comma-separated API field."),
  attendee_candidates: createMeetingAssociatedSlugsSchema
    .optional()
    .describe("Candidate slugs attending the meeting. Max 25. Sent as a comma-separated API field."),
  attendee_users: createMeetingCollaboratorIdsSchema
    .optional()
    .describe("User IDs attending the meeting. Max 25. Sent as a comma-separated API field."),
  updated_by: z.coerce.number().int().positive().optional().describe("Recruit CRM user id updating the meeting."),
  associated_candidates: createMeetingAssociatedSlugsSchema
    .optional()
    .describe("Additional associated candidate slugs. Max 25. Sent as a comma-separated API field."),
  associated_companies: createMeetingAssociatedSlugsSchema
    .optional()
    .describe("Additional associated company slugs. Max 25. Sent as a comma-separated API field."),
  associated_contacts: createMeetingAssociatedSlugsSchema
    .optional()
    .describe("Additional associated contact slugs. Max 25. Sent as a comma-separated API field."),
  associated_jobs: createMeetingAssociatedSlugsSchema
    .optional()
    .describe("Additional associated job slugs. Max 25. Sent as a comma-separated API field."),
  associated_deals: createMeetingAssociatedSlugsSchema
    .optional()
    .describe("Additional associated deal slugs. Max 25. Sent as a comma-separated API field."),
  do_not_send_calendar_invites: booleanLikeSchema
    .optional()
    .describe("When true (default), calendar invites are not sent to attendees. Set to false to send external calendar invites."),
  enable_auto_populate_teams: booleanLikeSchema
    .optional()
    .describe("When true (default), Recruit CRM auto-populates teams for the owner_id user/account owner unless collaborator_team_ids is provided."),
  collaborator_user_ids: createMeetingCollaboratorIdsSchema
    .optional()
    .describe("Collaborator user IDs. Max 25. Sent as a comma-separated API field."),
  collaborator_team_ids: createMeetingCollaboratorIdsSchema
    .optional()
    .describe("Collaborator team IDs. Max 25. Sent as a comma-separated API field."),
};

const updateMeetingInputSchema = {
  meeting_id: z.coerce.number().int().positive().describe("Recruit CRM meeting id to update."),
  title: createMeetingInputSchema.title.optional(),
  reminder: createMeetingInputSchema.reminder.optional(),
  start_date: createMeetingInputSchema.start_date.optional(),
  end_date: createMeetingInputSchema.end_date.optional(),
  owner_id: createMeetingInputSchema.owner_id.optional(),
  meeting_type_id: createMeetingInputSchema.meeting_type_id,
  description: createMeetingInputSchema.description,
  address: createMeetingInputSchema.address,
  related_to: createMeetingInputSchema.related_to,
  related_to_type: createMeetingInputSchema.related_to_type,
  attendee_contacts: createMeetingInputSchema.attendee_contacts,
  attendee_candidates: createMeetingInputSchema.attendee_candidates,
  attendee_users: createMeetingInputSchema.attendee_users,
  updated_by: z.coerce.number().int().positive().describe("Recruit CRM user id updating the meeting."),
  associated_candidates: createMeetingInputSchema.associated_candidates,
  associated_companies: createMeetingInputSchema.associated_companies,
  associated_contacts: createMeetingInputSchema.associated_contacts,
  associated_jobs: createMeetingInputSchema.associated_jobs,
  associated_deals: createMeetingInputSchema.associated_deals,
  do_not_send_calendar_invites: createMeetingInputSchema.do_not_send_calendar_invites,
  enable_auto_populate_teams: createMeetingInputSchema.enable_auto_populate_teams,
  collaborator_user_ids: createMeetingInputSchema.collaborator_user_ids,
  collaborator_team_ids: createMeetingInputSchema.collaborator_team_ids,
};

const createMeetingOutputSchema = {
  meeting_id: nullableNumberSchema,
  title: nullableStringSchema,
  meeting_type: z.union([meetingTypeSummarySchema, z.null()]),
  description: nullableStringSchema,
  address: nullableStringSchema,
  reminder: nullableNumberSchema,
  start_date: nullableStringSchema,
  end_date: nullableStringSchema,
  related_to: nullableStringSchema,
  related_to_type: nullableStringSchema,
  related_to_view_url: nullableStringSchema,
  associated_candidates: z.array(z.string()),
  associated_companies: z.array(z.string()),
  associated_contacts: z.array(z.string()),
  associated_jobs: z.array(z.string()),
  associated_deals: z.array(z.string()),
  owner: nullableNumberSchema,
  created_on: nullableStringSchema,
  updated_on: nullableStringSchema,
  created_by: nullableNumberSchema,
  updated_by: nullableNumberSchema,
  collaborator_users: z.array(z.number()),
  collaborator_teams: z.array(z.number()),
};

const noteTypeSummarySchema = z.object({
  id: nullableStringOrNumberSchema,
  label: nullableStringSchema,
});

const noteSummarySchema = z.object({
  id: nullableNumberSchema,
  note_type: z.union([z.array(noteTypeSummarySchema), z.null()]),
  description: nullableStringSchema,
  related_to: nullableStringSchema,
  related_to_type: nullableStringSchema,
  related: z.union([activityRelatedSummarySchema, z.null()]),
  resource_url: nullableStringSchema,
  created_on: nullableStringSchema,
  updated_on: nullableStringSchema,
  created_by: nullableNumberSchema,
  updated_by: nullableNumberSchema,
});

const searchNotesOutputSchema = {
  page: z.number().int().min(1),
  returned_count: z.number().int().min(0),
  has_more: z.boolean(),
  notes: z.array(noteSummarySchema),
};

const listNoteTypesOutputSchema = {
  returned_count: z.number().int().min(0),
  note_types: z.array(noteTypeSummarySchema),
};

const noteCollaboratorUserSummarySchema = z.object({
  id: nullableNumberSchema,
  first_name: nullableStringSchema,
  last_name: nullableStringSchema,
});

const noteCollaboratorTeamSummarySchema = z.object({
  team_id: nullableNumberSchema,
  team_name: nullableStringSchema,
});

const createNoteOutputSchema = {
  note_id: nullableNumberSchema,
  note_type: z.union([noteTypeSummarySchema, z.null()]),
  description: nullableStringSchema,
  related_to: nullableStringSchema,
  related_to_type: nullableStringSchema,
  related_to_view_url: nullableStringSchema,
  associated_candidates: z.array(z.string()),
  associated_companies: z.array(z.string()),
  associated_contacts: z.array(z.string()),
  associated_jobs: z.array(z.string()),
  associated_deals: z.array(z.string()),
  created_on: nullableStringSchema,
  updated_on: nullableStringSchema,
  created_by: nullableNumberSchema,
  updated_by: nullableNumberSchema,
  collaborator_users: z.array(noteCollaboratorUserSummarySchema),
  collaborator_teams: z.array(noteCollaboratorTeamSummarySchema),
};

const callLogTypeSummarySchema = z.object({
  id: nullableStringOrNumberSchema,
  label: nullableStringSchema,
});

const callLogSummarySchema = z.object({
  id: nullableNumberSchema,
  call_type: nullableStringSchema,
  custom_call_type: z.union([z.array(callLogTypeSummarySchema), z.null()]),
  call_started_on: nullableStringSchema,
  contact_number: nullableStringSchema,
  call_notes: nullableStringSchema,
  related_to: nullableStringSchema,
  related_to_type: nullableStringSchema,
  related: z.union([activityRelatedSummarySchema, z.null()]),
  duration: nullableStringOrNumberSchema,
  created_on: nullableStringSchema,
  updated_on: nullableStringSchema,
  created_by: nullableNumberSchema,
  updated_by: nullableNumberSchema,
});

const searchCallLogsOutputSchema = {
  page: z.number().int().min(1),
  returned_count: z.number().int().min(0),
  has_more: z.boolean(),
  call_logs: z.array(callLogSummarySchema),
};

const listCallTypesOutputSchema = {
  returned_count: z.number().int().min(0),
  call_types: z.array(callLogTypeSummarySchema),
};

const createCallLogAssociatedSlugsSchema = z.array(textFilterSchema).min(1).max(25);
const createCallLogCollaboratorIdsSchema = z.array(z.coerce.number().int().positive()).min(1).max(25);

const createCallLogInputSchema = {
  call_type: z.enum(["CALL_OUTGOING", "CALL_INCOMING"]).describe("Call direction: CALL_OUTGOING or CALL_INCOMING."),
  custom_call_type_id: z.coerce.number().int().positive().describe("Recruit CRM custom call type id."),
  call_started_on: textFilterSchema.describe("Call start date-time, preferably ISO 8601 (e.g. 2026-05-20T10:30:00.000000Z)."),
  related_to_type: callLogRelatedToTypeSchema.describe("Associated entity type. Must be candidate, contact, or company. Must be used with related_to."),
  created_by: z.coerce.number().int().positive().describe("Recruit CRM user id creating the call log."),
  updated_by: z.coerce.number().int().positive().describe("Recruit CRM user id updating the call log. Often the same as created_by."),
  contact_number: textFilterSchema.optional().describe("Contact phone number for the call."),
  call_notes: z.string().min(1).optional().describe("Notes from the call."),
  related_to: textFilterSchema.optional().describe("Associated entity slug. Must be used with related_to_type."),
  duration: textFilterSchema.optional().describe("Call duration. Supported formats: '1h 2m 10s', '1hr 20min 30sec', '5:30:50', or total seconds (e.g. '3020'). Response always returns duration in seconds."),
  associated_candidates: createCallLogAssociatedSlugsSchema.optional().describe("Additional associated candidate slugs. Max 25. Sent as a comma-separated API field."),
  associated_contacts: createCallLogAssociatedSlugsSchema.optional().describe("Additional associated contact slugs. Max 25. Sent as a comma-separated API field."),
  associated_companies: createCallLogAssociatedSlugsSchema.optional().describe("Additional associated company slugs. Max 25. Sent as a comma-separated API field."),
  associated_jobs: createCallLogAssociatedSlugsSchema.optional().describe("Additional associated job slugs. Max 25. Sent as a comma-separated API field."),
  associated_deals: createCallLogAssociatedSlugsSchema.optional().describe("Additional associated deal slugs. Max 25. Sent as a comma-separated API field."),
  collaborator_user_ids: createCallLogCollaboratorIdsSchema.optional().describe("Collaborator user IDs. Max 25. Sent as a comma-separated API field."),
  collaborator_team_ids: createCallLogCollaboratorIdsSchema.optional().describe("Collaborator team IDs. Max 25. Sent as a comma-separated API field."),
  enable_auto_populate_teams: booleanLikeSchema.optional().describe("When true, Recruit CRM auto-populates teams for the created_by user/account owner unless collaborator_team_ids is provided."),
};

const updateCallLogInputSchema = {
  call_log_id: z.coerce.number().int().positive().describe("Recruit CRM call log id to update."),
  call_type: createCallLogInputSchema.call_type.optional(),
  custom_call_type_id: createCallLogInputSchema.custom_call_type_id.optional(),
  call_started_on: createCallLogInputSchema.call_started_on.optional(),
  related_to_type: createCallLogInputSchema.related_to_type.optional(),
  updated_by: z.coerce.number().int().positive().describe("Recruit CRM user id updating the call log."),
  contact_number: createCallLogInputSchema.contact_number,
  call_notes: createCallLogInputSchema.call_notes,
  related_to: createCallLogInputSchema.related_to,
  duration: createCallLogInputSchema.duration,
  associated_candidates: createCallLogInputSchema.associated_candidates,
  associated_contacts: createCallLogInputSchema.associated_contacts,
  associated_companies: createCallLogInputSchema.associated_companies,
  associated_jobs: createCallLogInputSchema.associated_jobs,
  associated_deals: createCallLogInputSchema.associated_deals,
  collaborator_user_ids: createCallLogInputSchema.collaborator_user_ids,
  collaborator_team_ids: createCallLogInputSchema.collaborator_team_ids,
  enable_auto_populate_teams: createCallLogInputSchema.enable_auto_populate_teams,
};

const createCallLogOutputSchema = {
  call_log_id: nullableNumberSchema,
  call_type: nullableStringSchema,
  custom_call_type: z.union([callLogTypeSummarySchema, z.null()]),
  call_started_on: nullableStringSchema,
  contact_number: nullableStringSchema,
  call_notes: nullableStringSchema,
  related_to: nullableStringSchema,
  related_to_type: nullableStringSchema,
  related_to_view_url: nullableStringSchema,
  duration: nullableStringOrNumberSchema,
  associated_candidates: z.array(z.string()),
  associated_contacts: z.array(z.string()),
  associated_companies: z.array(z.string()),
  associated_jobs: z.array(z.string()),
  associated_deals: z.array(z.string()),
  created_on: nullableStringSchema,
  updated_on: nullableStringSchema,
  created_by: nullableNumberSchema,
  updated_by: nullableNumberSchema,
  collaborator_users: z.array(z.number()),
  collaborator_teams: z.array(z.number()),
};

const candidateJobAssignmentHiringStageHistoryItemSchema = z.object({
  job_slug: nullableStringSchema,
  job_name: nullableStringSchema,
  company_slug: nullableStringSchema,
  company_name: nullableStringSchema,
  job_status_id: nullableNumberSchema,
  job_status_label: nullableStringSchema,
  candidate_status_id: nullableNumberSchema,
  candidate_status: nullableStringSchema,
  remark: nullableStringSchema,
  updated_by: nullableNumberSchema,
  updated_on: nullableStringSchema,
});

const candidateJobAssignmentHiringStageHistoryOutputSchema = {
  candidate_slug: z.string(),
  returned_count: z.number().int().min(0),
  history: z.array(candidateJobAssignmentHiringStageHistoryItemSchema),
};

const assignedCandidateSummarySchema = z.object({
  candidate_slug: z.string(),
  first_name: nullableStringSchema,
  last_name: nullableStringSchema,
  position: nullableStringSchema,
  current_organization: nullableStringSchema,
  current_status: nullableStringSchema,
  city: nullableStringSchema,
  country: nullableStringSchema,
  updated_on: nullableStringSchema,
  stage_date: nullableStringSchema,
  status_id: nullableNumberSchema,
  status_label: nullableStringSchema,
});

const getJobAssignedCandidatesOutputSchema = {
  job_slug: z.string(),
  page: z.number().int().min(1),
  returned_count: z.number().int().min(0),
  has_more: z.boolean(),
  assigned_candidates: z.array(assignedCandidateSummarySchema),
};

const hiringStageSummarySchema = z.object({
  stage_id: nullableNumberSchema,
  label: nullableStringSchema,
});

const listCandidateHiringStagesOutputSchema = {
  returned_count: z.number().int().min(0),
  stages: z.array(hiringStageSummarySchema),
};

const pitchStageSummarySchema = z.object({
  status_id: nullableNumberSchema,
  label: nullableStringSchema,
});

const listPitchStagesOutputSchema = {
  returned_count: z.number().int().min(0),
  stages: z.array(pitchStageSummarySchema),
};

const listJobStatusesOutputSchema = {
  returned_count: z.number().int().min(0),
  statuses: z.array(jobStatusSummarySchema),
};

const listContactStagesOutputSchema = {
  returned_count: z.number().int().min(0),
  stages: z.array(
    z.object({
      stage_id: nullableNumberSchema,
      label: nullableStringSchema,
    }),
  ),
};

const listOffLimitStatusesOutputSchema = {
  returned_count: z.number().int().min(0),
  statuses: z.array(
    z.object({
      id: nullableNumberSchema,
      label: nullableStringSchema,
      sequence_no: nullableNumberSchema,
      default: z.union([z.boolean(), z.null()]),
    }),
  ),
};

const markCandidateOffLimitOutputSchema = {
  candidate_slugs: z.array(z.string()),
  requested_count: z.number().int().min(0),
  status_id: nullableNumberSchema,
  end_date: nullableStringSchema,
  reason: nullableStringSchema,
  remark: nullableStringSchema,
};

const markContactOffLimitOutputSchema = {
  contact_slugs: z.array(z.string()),
  requested_count: z.number().int().min(0),
  status_id: nullableNumberSchema,
  end_date: nullableStringSchema,
  reason: nullableStringSchema,
  remark: nullableStringSchema,
};

const markCompanyOffLimitOutputSchema = {
  company_slugs: z.array(z.string()),
  requested_count: z.number().int().min(0),
  status_id: nullableNumberSchema,
  end_date: nullableStringSchema,
  reason: nullableStringSchema,
  remark: nullableStringSchema,
};

const markRecordsAvailableOutputSchema = {
  record_type: markRecordsAvailableRecordTypeSchema,
  slugs: z.array(z.string()),
  requested_count: z.number().int().min(0),
  mark_contact_available: z.union([z.boolean(), z.null()]),
  mark_candidate_available: z.union([z.boolean(), z.null()]),
  remark: nullableStringSchema,
};

const updateCandidateHiringStageOutputSchema = {
  candidate_slug: nullableStringSchema,
  job_slug: nullableStringSchema,
  status_id: nullableNumberSchema,
  status_label: nullableStringSchema,
  remark: nullableStringSchema,
  stage_date: nullableStringSchema,
  visibility: nullableNumberSchema,
  shared_list_url: nullableStringSchema,
  updated_on: nullableStringSchema,
  updated_by: nullableNumberSchema,
};

const assignCandidateToJobOutputSchema = updateCandidateHiringStageOutputSchema;

const pitchActionOutputSchema = {
  candidate_slug: nullableStringSchema,
  contact_slug: nullableStringSchema,
  status_id: nullableNumberSchema,
  status_label: nullableStringSchema,
  remark: nullableStringSchema,
  stage_date: nullableStringSchema,
  created_on: nullableStringSchema,
  created_by: nullableNumberSchema,
  updated_on: nullableStringSchema,
  updated_by: nullableNumberSchema,
};

const pitchRecordSummarySchema = z.object({
  candidate_slug: nullableStringSchema,
  contact_slug: nullableStringSchema,
  status_id: nullableNumberSchema,
  status_label: nullableStringSchema,
  remark: nullableStringSchema,
  stage_date: nullableStringSchema,
  contact_title: nullableStringSchema,
  contact_name: nullableStringSchema,
  candidate_name: nullableStringSchema,
  candidate_position: nullableStringSchema,
  created_on: nullableStringSchema,
  created_by: nullableNumberSchema,
  updated_on: nullableStringSchema,
  updated_by: nullableNumberSchema,
});

const pitchHistoryRecordSummarySchema = pitchRecordSummarySchema.omit({
  created_by: true,
});

const pitchHistoryOutputSchema = {
  entity_type: pitchEntityTypeSchema,
  entity_slug: z.string(),
  returned_count: z.number().int().min(0),
  history: z.array(pitchHistoryRecordSummarySchema),
};

const pitchedRecordsOutputSchema = {
  entity_type: pitchEntityTypeSchema,
  entity_slug: z.string(),
  returned_count: z.number().int().min(0),
  records: z.array(pitchRecordSummarySchema),
};

const candidateDetailOutputSchema = z
  .object({
    id: detailIdentifierSchema,
    slug: detailIdentifierSchema,
    custom_fields: z.array(z.unknown()).optional(),
    work_history: z.array(z.unknown()).optional(),
    education_history: z.array(z.unknown()).optional(),
  })
  .passthrough();
const companyDetailOutputSchema = z
  .object({
    id: detailIdentifierSchema,
    slug: detailIdentifierSchema,
    custom_fields: z.array(z.unknown()).optional(),
  })
  .passthrough();
const contactDetailOutputSchema = z
  .object({
    id: detailIdentifierSchema,
    slug: detailIdentifierSchema,
    company_slug: detailIdentifierSchema,
    custom_fields: z.array(z.unknown()).optional(),
  })
  .passthrough();
const jobDetailOutputSchema = z
  .object({
    id: detailIdentifierSchema,
    slug: detailIdentifierSchema,
    company_slug: detailIdentifierSchema,
    contact_slug: detailIdentifierSchema,
    secondary_contact_slugs: z.array(z.unknown()).nullish(),
    job_questions: z.array(z.unknown()).optional(),
    custom_fields: z.array(z.unknown()).optional(),
    targetcompanies: z.array(z.unknown()).optional(),
    collaborator_users: z.array(z.unknown()).optional(),
    collaborator_teams: z.array(z.unknown()).optional(),
    xml_feeds: z.array(z.unknown()).optional(),
  })
  .passthrough();

const getCandidateDetailsInputSchema = {
  candidate_slugs: z
    .array(textFilterSchema)
    .min(1)
    .max(10)
    .describe("Candidate slugs to fetch. Max 10 per call. Duplicates are ignored."),
};

const getCompanyDetailsInputSchema = {
  company_slugs: z
    .array(textFilterSchema)
    .min(1)
    .max(10)
    .describe("Company slugs to fetch. Max 10 per call. Duplicates are ignored."),
};

const getContactDetailsInputSchema = {
  contact_slugs: z
    .array(textFilterSchema)
    .min(1)
    .max(10)
    .describe("Contact slugs to fetch. Max 10 per call. Duplicates are ignored."),
};

const getJobDetailsInputSchema = {
  job_slugs: z
    .array(textFilterSchema)
    .min(1)
    .max(10)
    .describe("Job slugs to fetch. Max 10 per call. Duplicates are ignored."),
};

const candidateDetailsOutputSchema = {
  requested_count: z.number().int().min(0),
  successful_count: z.number().int().min(0),
  failed_count: z.number().int().min(0),
  candidates: z.array(candidateDetailOutputSchema),
  errors: z.array(
    z.object({
      slug: z.string(),
      error: z.string(),
      status_code: z.union([z.number().int(), z.null()]),
    }),
  ),
};

const companyDetailsOutputSchema = {
  requested_count: z.number().int().min(0),
  successful_count: z.number().int().min(0),
  failed_count: z.number().int().min(0),
  companies: z.array(companyDetailOutputSchema),
  errors: z.array(
    z.object({
      slug: z.string(),
      error: z.string(),
      status_code: z.union([z.number().int(), z.null()]),
    }),
  ),
};

const contactDetailsOutputSchema = {
  requested_count: z.number().int().min(0),
  successful_count: z.number().int().min(0),
  failed_count: z.number().int().min(0),
  contacts: z.array(contactDetailOutputSchema),
  errors: z.array(
    z.object({
      slug: z.string(),
      error: z.string(),
      status_code: z.union([z.number().int(), z.null()]),
    }),
  ),
};

const jobDetailsOutputSchema = {
  requested_count: z.number().int().min(0),
  successful_count: z.number().int().min(0),
  failed_count: z.number().int().min(0),
  jobs: z.array(jobDetailOutputSchema),
  errors: z.array(
    z.object({
      slug: z.string(),
      error: z.string(),
      status_code: z.union([z.number().int(), z.null()]),
    }),
  ),
};

const candidateCustomFieldSummarySchema = z.object({
  field_id: z.number().int().positive(),
  field_name: z.string(),
  field_type: z.string(),
  searchable: z.boolean(),
  supported_filter_types: z.array(customFieldFilterTypeSchema),
  filter_value_required_for: z.array(customFieldFilterTypeSchema),
  option_count: z.number().int().min(0),
  options_preview: z.array(z.string()),
});

const listCandidateCustomFieldsOutputSchema = {
  returned_count: z.number().int().min(0),
  fields: z.array(candidateCustomFieldSummarySchema),
};

const listCustomFieldsOutputSchema = listCandidateCustomFieldsOutputSchema;

const candidateCustomFieldDetailOutputSchema = {
  field_id: z.number().int().positive(),
  field_name: z.string(),
  field_type: z.string(),
  searchable: z.boolean(),
  supported_filter_types: z.array(customFieldFilterTypeSchema),
  filter_value_required_for: z.array(customFieldFilterTypeSchema),
  option_values: z.union([z.array(z.string()), z.null()]),
};

const customFieldDetailOutputSchema = candidateCustomFieldDetailOutputSchema;

const customFieldDependencyEntrySchema = z.object({
  parent_field_id: z.number().int().positive(),
  parent_field_name: z.string(),
  parent_field_type: z.string(),
  child_field_id: z.number().int().positive(),
  child_field_name: z.string(),
  child_field_type: z.string(),
  dependency_type: z.enum(["value_filter", "visibility"]),
  parent_option_to_child_options: z.record(z.string(), z.array(z.string())).optional(),
  visible_when_parent_is: z.array(z.string()).optional(),
});

const getCustomFieldDependenciesOutputSchema = {
  entity_type: z.string(),
  dependency_count: z.number().int().min(0),
  dependencies: z.array(customFieldDependencyEntrySchema),
};

const prepareClientBriefInputSchema = {
  contact_slug: textFilterSchema
    .optional()
    .describe("Client contact slug to prepare for. Provide contact_slug, company_slug, or both."),
  company_slug: textFilterSchema
    .optional()
    .describe("Client company slug to prepare for. Provide company_slug, contact_slug, or both."),
  lookback_days: z.coerce
    .number()
    .int()
    .min(1)
    .max(365)
    .optional()
    .describe("Activity lookback window in days. Default 30."),
  max_open_jobs: z.coerce
    .number()
    .int()
    .min(1)
    .max(10)
    .optional()
    .describe("Maximum open jobs to include. Default 5."),
  max_related_contacts: z.coerce
    .number()
    .int()
    .min(1)
    .max(25)
    .optional()
    .describe("Maximum related company/job contacts to resolve. Default 15."),
  max_assigned_candidates_per_job: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .describe("Maximum assigned candidates to inspect per included job. Default 50."),
  feedback_wait_days_threshold: z.coerce
    .number()
    .int()
    .min(1)
    .max(90)
    .optional()
    .describe("Days in a client-facing stage before flagging a candidate as waiting on client feedback. Default 3."),
  include_activity: booleanLikeSchema
    .optional()
    .describe("Include notes / meetings / tasks / call-log activity summaries. Default true."),
  include_pipeline_summary: booleanLikeSchema
    .optional()
    .describe("Include assigned-candidate pipeline summaries for each open job. Default true."),
  include_contact_info: booleanLikeSchema
    .optional()
    .describe(
      "Opt-in flag. When true, contact summaries can include email, contact_number, and linkedin. Default false.",
    ),
};

const prepareClientBriefCompanySchema = z.object({
  slug: nullableStringSchema,
  name: nullableStringSchema,
  owner: nullableNumberSchema,
  owner_name: nullableStringSchema,
  city: nullableStringSchema,
  state: nullableStringSchema,
  country: nullableStringSchema,
  website: nullableStringSchema,
  marked_as_off_limit: nullableBooleanSchema,
  view_url: nullableStringSchema,
});

const prepareClientBriefJobContactSchema = z.object({
  slug: z.string(),
  name: nullableStringSchema,
  designation: nullableStringSchema,
  company_slug: nullableStringSchema,
  owner: nullableNumberSchema,
  owner_name: nullableStringSchema,
  view_url: z.string(),
  email: nullableStringSchema.optional(),
  contact_number: nullableStringSchema.optional(),
  linkedin: nullableStringSchema.optional(),
});

const prepareClientBriefContactSchema = prepareClientBriefJobContactSchema.extend({
  relationships: z.array(z.string()),
  job_slugs: z.array(z.string()),
  last_activity_at: nullableStringSchema,
});

const prepareClientBriefActivitySchema = z.object({
  entity_type: z.enum(["company", "contact", "job"]),
  entity_slug: z.string(),
  notes_count: z.number().int().min(0),
  meetings_count: z.number().int().min(0),
  tasks_count: z.number().int().min(0),
  call_logs_count: z.number().int().min(0),
  last_note_at: nullableStringSchema,
  last_meeting_at: nullableStringSchema,
  last_call_at: nullableStringSchema,
  next_task_due_at: nullableStringSchema,
  last_touch_at: nullableStringSchema,
});

const prepareClientBriefPitchRecordSchema = z.object({
  candidate_slug: nullableStringSchema,
  contact_slug: nullableStringSchema,
  status_id: nullableNumberSchema,
  status_label: nullableStringSchema,
  remark: nullableStringSchema,
  stage_date: nullableStringSchema,
  contact_title: nullableStringSchema,
  contact_name: nullableStringSchema,
  candidate_name: nullableStringSchema,
  candidate_position: nullableStringSchema,
  created_on: nullableStringSchema,
  created_by: nullableNumberSchema,
  updated_on: nullableStringSchema,
  updated_by: nullableNumberSchema,
});

const prepareClientBriefPipelineSchema = z.object({
  assigned_count: z.number().int().min(0),
  active_count: z.number().int().min(0),
  terminal_count: z.number().int().min(0),
  stage_counts: z.array(
    z.object({
      stage_id: nullableNumberSchema,
      label: z.string(),
      count: z.number().int().min(0),
      median_days_in_stage: nullableNumberSchema,
    }),
  ),
  bottleneck: z.union([
    z.object({
      stage_label: z.string(),
      count: z.number().int().min(0),
      median_days_in_stage: nullableNumberSchema,
      reason: z.string(),
    }),
    z.null(),
  ]),
  candidates_waiting_on_client: z.array(
    z.object({
      candidate_slug: z.string(),
      name: nullableStringSchema,
      current_stage: nullableStringSchema,
      days_in_current_stage: nullableNumberSchema,
      last_activity_at: nullableStringSchema,
    }),
  ),
  has_more_assigned_candidates: z.boolean(),
});

const prepareClientBriefJobSchema = z.object({
  slug: z.string(),
  name: nullableStringSchema,
  status_label: nullableStringSchema,
  days_open: nullableNumberSchema,
  number_of_openings: nullableNumberSchema,
  owner: nullableNumberSchema,
  owner_name: nullableStringSchema,
  company_slug: nullableStringSchema,
  contact_slug: nullableStringSchema,
  secondary_contact_slugs: z.array(z.string()),
  hiring_pipeline_id: nullableNumberSchema,
  view_url: z.string(),
  primary_contact: z.union([prepareClientBriefJobContactSchema, z.null()]),
  secondary_contacts: z.array(prepareClientBriefJobContactSchema),
  pipeline_summary: z.union([prepareClientBriefPipelineSchema, z.null()]),
  activity: z.union([prepareClientBriefActivitySchema, z.null()]),
  risks: z.array(z.string()),
  talking_points: z.array(z.string()),
});

const prepareClientBriefOutputSchema = {
  brief_type: z.literal("client"),
  scope: z.object({
    input_contact_slug: nullableStringSchema,
    input_company_slug: nullableStringSchema,
    resolved_company_slug: nullableStringSchema,
    lookback_days: z.number().int().min(1),
    generated_at: z.string(),
  }),
  client: z.object({
    company: z.union([prepareClientBriefCompanySchema, z.null()]),
    primary_contact: z.union([prepareClientBriefContactSchema, z.null()]),
    related_contacts: z.array(prepareClientBriefContactSchema),
  }),
  account_health: z.object({
    open_jobs_count: z.number().int().min(0),
    jobs_returned: z.number().int().min(0),
    active_candidates_count: z.number().int().min(0),
    candidates_waiting_on_client_count: z.number().int().min(0),
    last_touch_at: nullableStringSchema,
    next_task_due_at: nullableStringSchema,
    relationship_risk: z.enum(["low", "medium", "high"]),
    relationship_risk_reasons: z.array(z.string()),
  }),
  jobs: z.array(prepareClientBriefJobSchema),
  pitched_candidates: z.union([
    z.object({
      returned_count: z.number().int().min(0),
      records: z.array(prepareClientBriefPitchRecordSchema),
    }),
    z.null(),
  ]),
  activity: z.array(prepareClientBriefActivitySchema),
  suggested_talking_points: z.array(z.string()),
  recommended_followups: z.array(
    z.object({
      action: z.enum(["create_task", "create_note", "review_pipeline"]),
      reason: z.string(),
      related_to_type: z.enum(["company", "contact", "job"]),
      related_to: z.string(),
    }),
  ),
  coverage: z.object({
    jobs_checked: z.number().int().min(0),
    jobs_truncated: z.boolean(),
    related_contacts_checked: z.number().int().min(0),
    activity_entities_checked: z.number().int().min(0),
    assigned_candidate_pages_checked: z.number().int().min(0),
    assignments_truncated: z.boolean(),
    included_contact_info: z.boolean(),
  }),
  errors: z.array(
    z.object({
      source: z.enum(["contact", "company", "contacts", "jobs", "assignments", "activity", "pitch", "users"]),
      slug: z.string().optional(),
      message: z.string(),
      status_code: nullableNumberSchema,
    }),
  ),
};

const ANALYZE_JOB_PIPELINE_DEFAULTS = {
  startPage: 1,
  idleDaysThreshold: 14,
  maxActiveCandidates: 25,
  maxPlacedCandidates: 25,
  terminalStageLabels: ["Placed", "Rejected", "Offer Declined", "Withdrawn"],
  hireStageLabels: ["Placed"],
  intakeStageLabels: ["Assigned", "Applied"],
} as const;

const analyzeJobPipelineInputSchema = {
  job_slug: textFilterSchema.describe(
    "Job slug to analyze (e.g. 16734937272590003vEM). Resolve from search_jobs if only a job name is available.",
  ),
  start_page: z.coerce
    .number()
    .int()
    .min(1)
    .optional()
    .describe(
      `First assignment page in the 3-page window (~300 candidates) analyzed by this call. Default ${ANALYZE_JOB_PIPELINE_DEFAULTS.startPage}. Pass next_window.start_page from a prior response to analyze the next batch.`,
    ),
  idle_days_threshold: z.coerce
    .number()
    .int()
    .min(1)
    .optional()
    .describe(
      `Days since a candidate's last hiring-stage movement before flagging as idle. Default ${ANALYZE_JOB_PIPELINE_DEFAULTS.idleDaysThreshold}.`,
    ),
  max_active_candidates: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .describe(
      `Cap on active candidates whose stage history is fetched when include_time_metrics is true (each costs one /candidates/{slug}/history call). Default ${ANALYZE_JOB_PIPELINE_DEFAULTS.maxActiveCandidates}. Ignored when include_time_metrics is false (no active histories fetched).`,
    ),
  max_placed_candidates: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .describe(
      `Cap on Placed (terminal) candidates whose stage history is fetched when include_time_metrics is true (each costs one /candidates/{slug}/history call). Default ${ANALYZE_JOB_PIPELINE_DEFAULTS.maxPlacedCandidates}. Ignored when include_time_metrics is false.`,
    ),
  terminal_stage_labels: z
    .array(textFilterSchema)
    .optional()
    .describe(
      `Stage labels treated as terminal (excluded from active analysis). Default ${JSON.stringify(ANALYZE_JOB_PIPELINE_DEFAULTS.terminalStageLabels)}. Override only when the account uses non-standard pipeline labels.`,
    ),
  include_activity: booleanLikeSchema
    .optional()
    .describe(
      "Include notes / meetings / tasks counts tied to this job (3 extra parallel calls). Default true. Auto-skipped when start_page > 1 to avoid redundant calls on follow-up windows.",
    ),
  include_time_metrics: booleanLikeSchema
    .optional()
    .describe(
      "Compute time-to-hire, time-to-stage, and time-to-first-action metrics. Default false. When false, relies on stage_date for days_in_current_stage (~7 API calls). When true, fetches per-candidate history for capped active and Placed candidates (typically +25–55 extra calls), populating the time_metrics block.",
    ),
};

const analyzeJobPipelineStageCandidateSchema = z.object({
  candidate_slug: z.string(),
  name: nullableStringSchema,
  days_in_current_stage: nullableNumberSchema,
});

const analyzeJobPipelineStageGroupSchema = z.object({
  stage_id: nullableNumberSchema,
  label: z.string(),
  count: z.number().int().min(0),
  candidates: z.array(analyzeJobPipelineStageCandidateSchema),
});

const analyzeJobPipelineOutputSchema = {
  job: z.object({
    slug: z.string(),
    name: nullableStringSchema,
    status_label: nullableStringSchema,
    owner: nullableNumberSchema,
    owner_name: nullableStringSchema,
    company_slug: nullableStringSchema,
    created_on: nullableStringSchema,
    days_open: nullableNumberSchema,
    number_of_openings: nullableNumberSchema,
    view_url: z.string(),
    hiring_pipeline_id: nullableNumberSchema,
  }),
  pipeline: z.object({
    window: z.object({
      start_page: z.number().int().min(1),
      end_page: z.number().int().min(1),
      analyzed_count: z.number().int().min(0),
    }),
    next_window: z.union([z.object({ start_page: z.number().int().min(1) }), z.null()]),
    total_assigned_in_window: z.number().int().min(0),
    active_count: z.number().int().min(0),
    terminal_count: z.number().int().min(0),
    terminal_stages_summary: z.record(z.string(), z.number().int().min(0)),
    stages: z.array(analyzeJobPipelineStageGroupSchema),
  }),
  bottleneck: z.union([
    z.object({
      stage_label: z.string(),
      count: z.number().int().min(0),
      median_days_in_stage: z.number(),
      reason: z.string(),
    }),
    z.null(),
  ]),
  idle_candidates: z.array(
    z.object({
      candidate_slug: z.string(),
      name: nullableStringSchema,
      current_stage: nullableStringSchema,
      days_in_current_stage: z.number().int().min(0),
    }),
  ),
  activity: z.union([
    z.object({
      notes_30d: z.number().int().min(0),
      meetings_30d: z.number().int().min(0),
      tasks_total: z.number().int().min(0),
      next_task_due_at: nullableStringSchema,
      last_note_at: nullableStringSchema,
      last_meeting_at: nullableStringSchema,
    }),
    z.null(),
  ]),
  time_metrics: z.union([
    z.object({
      time_to_hire: z.union([
        z.object({
          first_days: z.number(),
          avg_days: z.number(),
          sample_size: z.number().int().min(0),
          placements: z.array(
            z.object({
              candidate_slug: z.string(),
              name: nullableStringSchema,
              days_to_hire: z.number(),
            }),
          ),
        }),
        z.null(),
      ]),
      time_to_stage: z.record(
        z.string(),
        z.object({
          first_days: z.number(),
          avg_days: z.number(),
          sample_size: z.number().int().min(0),
        }),
      ),
      time_to_first_action: z.union([
        z.object({
          avg_days: nullableNumberSchema,
          stuck_in_intake: z.number().int().min(0),
          sample_size: z.number().int().min(0),
        }),
        z.null(),
      ]),
      coverage: z.object({
        active_history_fetched: z.number().int().min(0),
        active_total: z.number().int().min(0),
        placed_history_fetched: z.number().int().min(0),
        placed_total: z.number().int().min(0),
      }),
    }),
    z.null(),
  ]),
  truncated: z.object({
    assignments: z.literal(true).optional(),
    active_candidates: z.literal(true).optional(),
    placed_candidates: z.literal(true).optional(),
  }),
  errors: z.array(
    z.object({
      source: z.enum(["stage_history", "placed_history", "activity", "assignments"]),
      slug: z.string().optional(),
      message: z.string(),
      status_code: z.union([z.number().int(), z.null()]),
    }),
  ),
  suggested_actions: z.array(z.string()),
};

export type ServerDependencies = {
  config?: AppConfig;
  transport?: HttpTransport;
  serverMeta?: {
    icons?: Array<{ src: string; mimeType?: string; sizes?: string[] }>;
    websiteUrl?: string;
  };
};

export function createRecruitCrmServer(dependencies: ServerDependencies = {}): McpServer {
  const config = dependencies.config ?? loadConfig();
  const client = new RecruitCrmClient(config, dependencies.transport);
  const server = new McpServer(
    {
      name: "Recruit CRM",
      version: "0.8.0",
      icons: dependencies.serverMeta?.icons,
      websiteUrl: dependencies.serverMeta?.websiteUrl,
    },
    {
      instructions: recruitCrmServerInstructions,
    },
  );

  server.registerTool(
    "search_candidates",
    {
      title: "Search Candidates",
      description:
        `Search Recruit CRM candidates and return compact summaries designed for large result sets. ${myRecordsOwnerFilterGuidance} Returns candidate slug values that can be used with get_candidate_details or to open Recruit CRM app links like https://app.recruitcrm.io/candidate/{slug}.`,
      inputSchema: searchCandidatesInputSchema,
      outputSchema: searchCandidatesOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeSearchCandidates(client, args)),
  );

  server.registerTool(
    "list_candidates",
    {
      title: "List Candidates",
      description:
        "Lists all candidates in the account, most-recently updated first. Returns compact summaries with slug values for candidate detail lookup. Use search_candidates for filtered queries.",
      inputSchema: listCandidatesInputSchema,
      outputSchema: searchCandidatesOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeListCandidates(client, args)),
  );

  server.registerTool(
    "create_candidate",
    {
      title: "Create Candidate",
      description:
        "Creates one Recruit CRM candidate, then optionally creates up to 10 work history rows and 10 education history rows. Requires at least one of first_name or last_name, plus owner_id and created_by. Checks duplicates by email, contact_number, or linkedin unless allow_duplicate=true; duplicate errors include candidate_slug and candidate_id when available. Resolve user IDs with list_users, currency_id with list_currencies, language_skills with list_languages_and_proficiencies, company slugs with search_companies, and custom field IDs with list_custom_fields. The resume field accepts a publicly accessible HTTPS direct download URL or a base64-encoded file string. File-type custom fields accept a direct download URL only. Returns a compact summary with the candidate slug and partial-success details for history operations.",
      inputSchema: createCandidateInputSchema,
      outputSchema: createCandidateOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeCreateCandidate(client, args as CreateCandidateInput)),
  );

  server.registerTool(
    "update_candidate",
    {
      title: "Update Candidate",
      description:
        "Updates one existing Recruit CRM candidate by candidate_slug, then optionally creates up to 10 work history rows and 10 education history rows. Requires candidate_slug, updated_by, and at least one of first_name or last_name. Resolve user IDs with list_users, currency_id with list_currencies, language_skills with list_languages_and_proficiencies, company slugs with search_companies, and custom field IDs with list_custom_fields. The resume field accepts a publicly accessible HTTPS direct download URL or a base64-encoded file string. File-type custom fields accept a direct download URL only. Returns a compact summary with the candidate slug and partial-success details for history operations.",
      inputSchema: updateCandidateInputSchema,
      outputSchema: createCandidateOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeUpdateCandidate(client, args as UpdateCandidateInput)),
  );

  server.registerTool(
    "search_jobs",
    {
      title: "Search Jobs",
      description:
        `Search Recruit CRM jobs and return compact summaries designed for large result sets. ${myRecordsOwnerFilterGuidance} Returns slug, company_slug, contact_slug, and hiring_pipeline_id values; use hiring_pipeline_id with list_candidate_hiring_stages for job-specific stage lookup. Slugs can be used to open Recruit CRM app URLs like https://app.recruitcrm.io/job/{slug}, https://app.recruitcrm.io/company/{company_slug}, and https://app.recruitcrm.io/contact/{contact_slug}.`,
      inputSchema: searchJobsInputSchema,
      outputSchema: searchJobsOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeSearchJobs(client, args)),
  );

  server.registerTool(
    "list_jobs",
    {
      title: "List Jobs",
      description:
        "Lists all jobs in the account, most-recently updated first. Returns compact summaries with slug, company_slug, contact_slug, and hiring_pipeline_id. Use search_jobs for filtered queries; use hiring_pipeline_id with list_candidate_hiring_stages for job-specific stage lookup.",
      inputSchema: listJobsInputSchema,
      outputSchema: searchJobsOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeListJobs(client, args)),
  );

  server.registerTool(
    "create_job",
    {
      title: "Create Job",
      description:
        "Creates one Recruit CRM job. Requires name, company_slug, contact_slug, enable_job_application_form, owner_id, and created_by. job_description_text and currency_id are optional per live API verification. Use list_users for user IDs, search_companies or list_companies for company slugs, search_contacts or list_contacts for contact slugs, list_job_statuses for job status IDs, list_currencies for currency_id, list_qualifications for qualification_id, list_teams for collaborator_team_ids, list_candidate_questions for job_questions, list_xml_jobboards for xml_feeds, list_hiring_pipelines for hiring_pipeline_id, and list_custom_fields for entity_type=jobs. Defaults enable_auto_populate_teams to true and show_company_logo to 2. Returns a compact summary with the job slug.",
      inputSchema: createJobInputSchema,
      outputSchema: createJobOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: true,
      },
    },
    async (args) => formatResult(await executeCreateJob(client, args as CreateJobInput)),
  );

  server.registerTool(
    "update_job",
    {
      title: "Update Job",
      description:
        "Updates one existing Recruit CRM job by job_slug. Requires job_slug, updated_by, and at least one field to update. Use list_users for user IDs, search_companies or list_companies for company slugs, search_contacts or list_contacts for contact slugs, list_job_statuses for job status IDs, list_currencies for currency_id, list_qualifications for qualification_id, list_teams for collaborator_team_ids, list_candidate_questions for job_questions, list_xml_jobboards for xml_feeds, list_hiring_pipelines for hiring_pipeline_id, and list_custom_fields for entity_type=jobs. Returns a compact summary with the job slug.",
      inputSchema: updateJobInputSchema,
      outputSchema: createJobOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: true,
      },
    },
    async (args) => formatResult(await executeUpdateJob(client, args as UpdateJobInput)),
  );

  server.registerTool(
    "search_companies",
    {
      title: "Search Companies",
      description:
        `Search Recruit CRM companies and return compact summaries designed for large result sets. ${myRecordsOwnerFilterGuidance} Returns company slug values for Recruit CRM company links like https://app.recruitcrm.io/company/{slug} and contact_slugs values for contact links like https://app.recruitcrm.io/contact/{contact_slug}.`,
      inputSchema: searchCompaniesInputSchema,
      outputSchema: searchCompaniesOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeSearchCompanies(client, args)),
  );

  server.registerTool(
    "list_companies",
    {
      title: "List Companies",
      description:
        "Lists all companies in the account, most-recently updated first. Returns compact summaries with slug and contact_slugs values. Use search_companies for filtered queries.",
      inputSchema: listCompaniesInputSchema,
      outputSchema: searchCompaniesOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeListCompanies(client, args)),
  );

  server.registerTool(
    "create_company",
    {
      title: "Create Company",
      description:
        "Creates one Recruit CRM company. Requires company_name, owner_id, and created_by. Checks duplicates by company_name unless allow_duplicate=true. Resolve user IDs with list_users and custom field IDs with list_custom_fields for entity_type=companies. Returns a compact summary with the company slug.",
      inputSchema: createCompanyInputSchema,
      outputSchema: createCompanyOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeCreateCompany(client, args as CreateCompanyInput)),
  );

  server.registerTool(
    "update_company",
    {
      title: "Update Company",
      description:
        "Updates one existing Recruit CRM company by company_slug. Requires company_slug and updated_by. Resolve user IDs with list_users and custom field IDs with list_custom_fields for entity_type=companies. Returns a compact summary with the company slug.",
      inputSchema: updateCompanyInputSchema,
      outputSchema: createCompanyOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeUpdateCompany(client, args as UpdateCompanyInput)),
  );

  server.registerTool(
    "search_contacts",
    {
      title: "Search Contacts",
      description:
        `Search Recruit CRM contacts with filters and return compact summaries for large result sets. ${myRecordsOwnerFilterGuidance} At least one real filter is required; sort_by, sort_order, page, exact_search, and include_contact_info do not count independently.`,
      inputSchema: searchContactsInputSchema,
      outputSchema: searchContactsOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeSearchContacts(client, args)),
  );

  server.registerTool(
    "list_contacts",
    {
      title: "List Contacts",
      description:
        "Lists all contacts in the account, most-recently updated first. Returns compact summaries with slug values for contact detail lookup. Use search_contacts for filtered queries.",
      inputSchema: listContactsInputSchema,
      outputSchema: searchContactsOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeListContacts(client, args)),
  );

  server.registerTool(
    "create_contact",
    {
      title: "Create Contact",
      description:
        "Creates one Recruit CRM contact. Requires first_name, last_name, owner_id, and created_by. Resolve user IDs with list_users, company slugs with search_companies or list_companies, stage IDs with list_contact_stages, and custom field IDs with list_custom_fields for entity_type=contacts. Returns a compact summary with the contact slug.",
      inputSchema: createContactInputSchema,
      outputSchema: createContactOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeCreateContact(client, args as CreateContactInput)),
  );

  server.registerTool(
    "update_contact",
    {
      title: "Update Contact",
      description:
        "Updates one existing Recruit CRM contact by contact_slug. Requires contact_slug and at least one field to update. Resolve user IDs with list_users, company slugs with search_companies or list_companies, stage IDs with list_contact_stages, and custom field IDs with list_custom_fields for entity_type=contacts. Returns a compact summary with the contact slug.",
      inputSchema: updateContactInputSchema,
      outputSchema: createContactOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeUpdateContact(client, args as UpdateContactInput)),
  );

  server.registerTool(
    "list_users",
    {
      title: "List Users",
      description:
        "Lists all Recruit CRM users and returns compact summaries of each user's id, first_name, last_name, and status. User IDs from this tool are used as owner_id, created_by, updated_by, attendee_users, and collaborator_user_ids on candidates, jobs, companies, contacts, tasks, meetings, notes, and call logs. Enable include_teams to include team memberships per user; enable include_contact_info to also include email and contact_number. Returns all users in a single response with no pagination.",
      inputSchema: listUsersInputSchema,
      outputSchema: listUsersOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeListUsers(client, args)),
  );

  server.registerTool(
    "list_teams",
    {
      title: "List Teams",
      description:
        "Lists Recruit CRM teams with MCP-side pagination. By default returns team IDs, names, and user IDs. Pass expand=user to return user summaries; include_user_contact_info=true adds user email, contact_number, and avatar.",
      inputSchema: listTeamsInputSchema,
      outputSchema: listTeamsOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeListTeams(client, args)),
  );

  server.registerTool(
    "list_candidate_questions",
    {
      title: "List Candidate Questions",
      description:
        "Lists Recruit CRM candidate questions with MCP-side pagination. Returns compact id and question rows for resolving candidate question IDs.",
      inputSchema: metadataListInputSchema,
      outputSchema: listCandidateQuestionsOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeListCandidateQuestions(client, args)),
  );

  server.registerTool(
    "list_hiring_pipelines",
    {
      title: "List Hiring Pipelines",
      description:
        "Lists Recruit CRM hiring pipelines with MCP-side pagination. Returns hiring_pipeline_id and name rows for selecting a job hiring pipeline or listing candidate hiring stages.",
      inputSchema: metadataListInputSchema,
      outputSchema: listHiringPipelinesOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeListHiringPipelines(client, args)),
  );

  server.registerTool(
    "list_languages_and_proficiencies",
    {
      title: "List Languages And Proficiencies",
      description:
        "Lists Recruit CRM languages with MCP-side pagination and returns the standard proficiency IDs. Use language_id and proficiency_id for candidate language_skills.",
      inputSchema: metadataListInputSchema,
      outputSchema: listLanguagesAndProficienciesOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeListLanguagesAndProficiencies(client, args)),
  );

  server.registerTool(
    "list_currencies",
    {
      title: "List Currencies",
      description:
        "Lists Recruit CRM currencies with MCP-side pagination. Returns currency_id, code, country, currency, and symbol rows for candidate and job currency_id fields.",
      inputSchema: metadataListInputSchema,
      outputSchema: listCurrenciesOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeListCurrencies(client, args)),
  );

  server.registerTool(
    "list_qualifications",
    {
      title: "List Qualifications",
      description:
        "Lists Recruit CRM qualifications with MCP-side pagination. Returns qualification_id and label rows for job qualification_id fields.",
      inputSchema: metadataListInputSchema,
      outputSchema: listQualificationsOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeListQualifications(client, args)),
  );

  server.registerTool(
    "list_xml_jobboards",
    {
      title: "List XML Jobboards",
      description:
        "Lists Recruit CRM XML job boards for jobs. Returns default_xml_feeds and custom_xml_feeds rows with id and label for job xml_feeds.",
      inputSchema: {},
      outputSchema: listXmlJobboardsOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async () => formatResult(await executeListXmlJobboards(client)),
  );

  server.registerTool(
    "search_hotlists",
    {
      title: "Search Hotlists",
      description:
        `Search Recruit CRM hotlists by related_to_type and optional name/shared filters. related_to_type is required. ${unsupportedOwnerFilterGuidance} Broad searches return compact hotlist summaries with related_count only. When name is provided, results also include related_slugs for follow-up workflows.`,
      inputSchema: searchHotlistsInputSchema,
      outputSchema: searchHotlistsOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeSearchHotlists(client, args)),
  );

  server.registerTool(
    "create_hotlist",
    {
      title: "Create Hotlist",
      description:
        "Creates one Recruit CRM hotlist. Requires name, related_to_type, shared (true for team-shared, false for private), and created_by user id. Resolve user IDs with list_users.",
      inputSchema: createHotlistInputSchema,
      outputSchema: createHotlistOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeCreateHotlist(client, args)),
  );

  server.registerTool(
    "add_records_to_hotlist",
    {
      title: "Add Records to Hotlist",
      description:
        "Adds up to 10 Recruit CRM record slugs to an existing hotlist. Duplicate input slugs are ignored. Returns partial-success details with added_slugs and an errors array for any failed additions.",
      inputSchema: addRecordsToHotlistInputSchema,
      outputSchema: addRecordsToHotlistOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeAddRecordsToHotlist(client, args)),
  );

  server.registerTool(
    "search_tasks",
    {
      title: "Search Tasks",
      description:
        `Search Recruit CRM tasks and return compact summaries designed for large result sets. ${myRecordsOwnerFilterGuidance} Returns related_to and related_to_type values that can be used to open related entities in Recruit CRM app URLs like https://app.recruitcrm.io/{related_to_type}/{related_to}.`,
      inputSchema: searchTasksInputSchema,
      outputSchema: searchTasksOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeSearchTasks(client, args)),
  );

  server.registerTool(
    "list_task_types",
    {
      title: "List Task Types",
      description:
        "Lists Recruit CRM task types, returning compact id/label rows. Use task_type_id in create_task.",
      inputSchema: {},
      outputSchema: listTaskTypesOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async () => formatResult(await executeListTaskTypes(client)),
  );

  server.registerTool(
    "create_task",
    {
      title: "Create Task",
      description:
        "Creates one Recruit CRM task. Requires task_type_id, title, description, reminder, start_date, owner_id, and created_by. Resolve task type IDs with list_task_types and user IDs with list_users. Description supports basic HTML/rich text. Returns a compact task summary.",
      inputSchema: createTaskInputSchema,
      outputSchema: createTaskOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeCreateTask(client, args)),
  );

  server.registerTool(
    "update_task",
    {
      title: "Update Task",
      description:
        "Updates one existing Recruit CRM task by task_id. Requires task_id, updated_by, and at least one field to update. Resolve task type IDs with list_task_types and user IDs with list_users. Description supports basic HTML/rich text. Returns a compact task summary.",
      inputSchema: updateTaskInputSchema,
      outputSchema: createTaskOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeUpdateTask(client, args as UpdateTaskInput)),
  );

  server.registerTool(
    "search_meetings",
    {
      title: "Search Meetings",
      description:
        `Search Recruit CRM meetings and return compact summaries designed for large result sets. ${myRecordsOwnerFilterGuidance} Returns related_to and related_to_type values that can be used to open related entities in Recruit CRM app URLs like https://app.recruitcrm.io/{related_to_type}/{related_to}.`,
      inputSchema: searchMeetingsInputSchema,
      outputSchema: searchMeetingsOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeSearchMeetings(client, args)),
  );

  server.registerTool(
    "list_meeting_types",
    {
      title: "List Meeting Types",
      description:
        "Lists Recruit CRM meeting types, returning compact id/label rows. Use meeting_type_id in create_meeting.",
      inputSchema: {},
      outputSchema: listMeetingTypesOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async () => formatResult(await executeListMeetingTypes(client)),
  );

  server.registerTool(
    "create_meeting",
    {
      title: "Create Meeting",
      description:
        "Creates one Recruit CRM meeting. Requires title, reminder, start_date, end_date, owner_id, and created_by. Resolve meeting type IDs with list_meeting_types and user IDs with list_users. Calendar invites are not sent by default; set do_not_send_calendar_invites to false to send external calendar invites to attendees. Returns a compact meeting summary.",
      inputSchema: createMeetingInputSchema,
      outputSchema: createMeetingOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: true,
      },
    },
    async (args) => formatResult(await executeCreateMeeting(client, args)),
  );

  server.registerTool(
    "update_meeting",
    {
      title: "Update Meeting",
      description:
        "Updates one existing Recruit CRM meeting by meeting_id. Requires meeting_id, updated_by, and at least one field to update. Resolve meeting type IDs with list_meeting_types and user IDs with list_users. Calendar invites are not sent by default; set do_not_send_calendar_invites to false to send external calendar invites to attendees. Returns a compact meeting summary.",
      inputSchema: updateMeetingInputSchema,
      outputSchema: createMeetingOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: true,
      },
    },
    async (args) => formatResult(await executeUpdateMeeting(client, args as UpdateMeetingInput)),
  );

  server.registerTool(
    "search_notes",
    {
      title: "Search Notes",
      description:
        `Search Recruit CRM notes and return compact summaries designed for large result sets. ${unsupportedOwnerFilterGuidance} Returns related_to and related_to_type values that can be used to open related entities in Recruit CRM app URLs like https://app.recruitcrm.io/{related_to_type}/{related_to}.`,
      inputSchema: searchNotesInputSchema,
      outputSchema: searchNotesOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeSearchNotes(client, args)),
  );

  server.registerTool(
    "list_note_types",
    {
      title: "List Note Types",
      description:
        "Lists Recruit CRM note types, returning compact id/label rows. Use note_type_id in create_note.",
      inputSchema: {},
      outputSchema: listNoteTypesOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async () => formatResult(await executeListNoteTypes(client)),
  );

  server.registerTool(
    "create_note",
    {
      title: "Create Note",
      description:
        "Creates one Recruit CRM note. Requires note_type_id, description, related_to, related_to_type, and created_by user id. Resolve note type IDs with list_note_types and user IDs with list_users. Description supports basic HTML/rich text. Returns a compact note summary.",
      inputSchema: createNoteInputSchema,
      outputSchema: createNoteOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeCreateNote(client, args)),
  );

  server.registerTool(
    "update_note",
    {
      title: "Update Note",
      description:
        "Updates one existing Recruit CRM note by note_id. Requires note_id, updated_by, and at least one field to update. Resolve note type IDs with list_note_types and user IDs with list_users. Description supports basic HTML/rich text. Returns a compact note summary.",
      inputSchema: updateNoteInputSchema,
      outputSchema: createNoteOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeUpdateNote(client, args as UpdateNoteInput)),
  );

  server.registerTool(
    "search_call_logs",
    {
      title: "Search Call Logs",
      description:
        `Search Recruit CRM call logs and return compact summaries designed for large result sets. ${unsupportedOwnerFilterGuidance} Returns related_to and related_to_type values that can be used to open related entities in Recruit CRM app URLs like https://app.recruitcrm.io/{related_to_type}/{related_to}.`,
      inputSchema: searchCallLogsInputSchema,
      outputSchema: searchCallLogsOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeSearchCallLogs(client, args)),
  );

  server.registerTool(
    "list_call_types",
    {
      title: "List Call Types",
      description:
        "Lists Recruit CRM custom call types, returning compact id/label rows. Use custom_call_type_id in create_call_log.",
      inputSchema: {},
      outputSchema: listCallTypesOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async () => formatResult(await executeListCallTypes(client)),
  );

  server.registerTool(
    "create_call_log",
    {
      title: "Create Call Log",
      description:
        "Creates one Recruit CRM call log. Requires call_type, custom_call_type_id, call_started_on, related_to_type, created_by, and updated_by. Resolve call type IDs with list_call_types and user IDs with list_users. related_to_type must be candidate, contact, or company. Returns a compact call log summary with duration in seconds.",
      inputSchema: createCallLogInputSchema,
      outputSchema: createCallLogOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeCreateCallLog(client, args as CreateCallLogInput)),
  );

  server.registerTool(
    "update_call_log",
    {
      title: "Update Call Log",
      description:
        "Updates one existing Recruit CRM call log by call_log_id. Requires call_log_id, updated_by, and at least one field to update. Resolve call type IDs with list_call_types and user IDs with list_users. related_to_type must be candidate, contact, or company. Returns a compact call log summary with duration in seconds.",
      inputSchema: updateCallLogInputSchema,
      outputSchema: createCallLogOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeUpdateCallLog(client, args as UpdateCallLogInput)),
  );

  server.registerTool(
    "get_candidate_details",
    {
      title: "Get Candidate Details",
      description:
        "Fetches full details for up to 10 candidates in parallel by slug. Suitable for retrieving specific candidate records after slug resolution from search_candidates. Not intended for bulk database scans. Returns partial results: failures are reported in the errors array with status_code.",
      inputSchema: getCandidateDetailsInputSchema,
      outputSchema: candidateDetailsOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeGetCandidateDetails(client, args)),
  );

  server.registerTool(
    "get_job_details",
    {
      title: "Get Job Details",
      description:
        "Fetches full details for up to 10 Recruit CRM jobs in parallel by slug. Suitable for retrieving specific job records after slug resolution from search_jobs. Returns full Recruit CRM job payloads with partial results: failures are reported in the errors array with status_code.",
      inputSchema: getJobDetailsInputSchema,
      outputSchema: jobDetailsOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeGetJobDetails(client, args)),
  );

  server.registerTool(
    "get_company_details",
    {
      title: "Get Company Details",
      description:
        "Fetches full details for up to 10 companies in parallel by slug. Suitable for retrieving specific company records after slug resolution from search_companies. Not intended for bulk database scans. Returns partial results: failures are reported in the errors array with status_code.",
      inputSchema: getCompanyDetailsInputSchema,
      outputSchema: companyDetailsOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeGetCompanyDetails(client, args)),
  );

  server.registerTool(
    "get_contact_details",
    {
      title: "Get Contact Details",
      description:
        "Fetches full details for up to 10 contacts in parallel by slug. Suitable for retrieving specific contact records after slug resolution from search_contacts. Not intended for bulk database scans. Returns partial results: failures are reported in the errors array with status_code.",
      inputSchema: getContactDetailsInputSchema,
      outputSchema: contactDetailsOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeGetContactDetails(client, args)),
  );

  server.registerTool(
    "get_job_assigned_candidates",
    {
      title: "Get Job Assigned Candidates",
      description:
        "Fetches assigned candidates for one Recruit CRM job and returns compact assignment summaries. Filter by status_id to narrow to a specific hiring stage; resolve stage IDs with list_candidate_hiring_stages (use the job's hiring_pipeline_id for job-specific stages, or 0 for global stages). Returns candidate_slug values for Recruit CRM candidate links like https://app.recruitcrm.io/candidate/{candidate_slug}.",
      inputSchema: getJobAssignedCandidatesInputSchema,
      outputSchema: getJobAssignedCandidatesOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async ({ job_slug, page, limit, status_id }) =>
      formatResult(await executeGetJobAssignedCandidates(client, job_slug, { page, limit, status_id })),
  );

  server.registerTool(
    "list_candidate_hiring_stages",
    {
      title: "List Candidate Hiring Stages",
      description:
        "Lists Recruit CRM candidate hiring stages for a hiring pipeline, returning compact stage rows for resolving labels to stage IDs. Pass hiring_pipeline_id 0 (default) for the Master Hiring Pipeline; for job-specific stages, use the hiring_pipeline_id returned by search_jobs or list_jobs. Stage IDs are used by get_job_assigned_candidates.status_id and update_candidate_hiring_stage.status_id.",
      inputSchema: listCandidateHiringStagesInputSchema,
      outputSchema: listCandidateHiringStagesOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeListCandidateHiringStages(client, args)),
  );

  server.registerTool(
    "list_pitch_stages",
    {
      title: "List Pitch Stages",
      description:
        "Lists Recruit CRM pitch pipeline stages with status_id and label values for resolving stage names used by update_candidate_pitch_stage.",
      inputSchema: {},
      outputSchema: listPitchStagesOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async () => formatResult(await executeListPitchStages(client)),
  );

  server.registerTool(
    "pitch_candidate_to_contact",
    {
      title: "Pitch Candidate To Contact",
      description:
        "Marks one Recruit CRM candidate as pitched to one contact. Requires candidate_slug, contact_slug, and created_by. Checks existing candidate/contact pitch records unless allow_duplicate=true. This records the pitch in Recruit CRM; the API does not send an email to the candidate or contact.",
      inputSchema: pitchCandidateToContactInputSchema,
      outputSchema: pitchActionOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executePitchCandidateToContact(client, args as PitchCandidateToContactInput)),
  );

  server.registerTool(
    "update_candidate_pitch_stage",
    {
      title: "Update Candidate Pitch Stage",
      description:
        "Updates the pitch stage for one candidate/contact pitch record. Requires candidate_slug, contact_slug, status_id, stage_date, and updated_by. Resolve status_id with list_pitch_stages. remark is optional text.",
      inputSchema: updateCandidatePitchStageInputSchema,
      outputSchema: pitchActionOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeUpdateCandidatePitchStage(client, args as UpdateCandidatePitchStageInput)),
  );

  server.registerTool(
    "get_pitch_history",
    {
      title: "Get Pitch History",
      description:
        "Fetches pitch history for one Recruit CRM candidate or contact by slug. Set entity_type to candidate for candidate pitch history, or contact for contact pitch history. Returns compact pitch entries without email, phone, resume, or profile image fields.",
      inputSchema: pitchEntityLookupInputSchema,
      outputSchema: pitchHistoryOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async ({ entity_type, entity_slug }) =>
      formatResult(await executeGetPitchHistory(client, entity_type as PitchEntityType, entity_slug)),
  );

  server.registerTool(
    "get_pitched_records",
    {
      title: "Get Pitched Records",
      description:
        "Fetches contacts where a candidate is pitched or candidates pitched to a contact. Set entity_type to candidate to return contacts for a candidate slug, or contact to return candidates for a contact slug. Returns compact records without email, phone, resume, or profile image fields.",
      inputSchema: pitchEntityLookupInputSchema,
      outputSchema: pitchedRecordsOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async ({ entity_type, entity_slug }) =>
      formatResult(await executeGetPitchedRecords(client, entity_type as PitchEntityType, entity_slug)),
  );

  server.registerTool(
    "assign_candidate_to_job",
    {
      title: "Assign Candidate To Job",
      description:
        "Assigns one Recruit CRM candidate to one job at the default Assigned hiring stage. Requires candidate_slug, job_slug, and updated_by. Does not support remarks, explicit stage selection, stage_date, or create_placement; use update_candidate_hiring_stage afterward when a non-default stage or remark is needed.",
      inputSchema: assignCandidateToJobInputSchema,
      outputSchema: assignCandidateToJobOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeAssignCandidateToJob(client, args)),
  );

  server.registerTool(
    "update_candidate_hiring_stage",
    {
      title: "Update Candidate Hiring Stage",
      description:
        "Updates one candidate's hiring stage for a specific Recruit CRM job. Requires candidate_slug, job_slug, status_id, stage_date, and updated_by. By default this only changes the hiring stage. When create_placement=true, Recruit CRM also creates a placement record in the dedicated placements section. Resolve status_id with list_candidate_hiring_stages (use hiring_pipeline_id 0 for master stages, or the job's hiring_pipeline_id for job-specific stages). remark supports basic HTML/rich text.",
      inputSchema: updateCandidateHiringStageInputSchema,
      outputSchema: updateCandidateHiringStageOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeUpdateCandidateHiringStage(client, args)),
  );

  server.registerTool(
    "list_job_statuses",
    {
      title: "List Job Statuses",
      description:
        "Lists Recruit CRM job pipeline statuses (e.g. Open, Closed, On Hold, plus any custom statuses configured for the account). Returns compact rows with id and label for resolving a status name to the numeric job_status_id used in search_jobs.job_status.",
      inputSchema: {},
      outputSchema: listJobStatusesOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async () => formatResult(await executeListJobStatuses(client)),
  );

  server.registerTool(
    "list_contact_stages",
    {
      title: "List Contact Stages",
      description:
        "Lists Recruit CRM contact pipeline stages (the sales pipeline). Returns compact rows with stage_id and label for resolving a stage name to the numeric stage_id used in create_contact and update_contact.",
      inputSchema: {},
      outputSchema: listContactStagesOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async () => formatResult(await executeListContactStages(client)),
  );

  server.registerTool(
    "list_off_limit_statuses",
    {
      title: "List Off-Limit Statuses",
      description:
        "Lists Recruit CRM off-limit statuses configured for the account. Returns compact rows with id, label, sequence_no, and default for resolving status_id values used by the off-limit mark tools.",
      inputSchema: {},
      outputSchema: listOffLimitStatusesOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async () => formatResult(await executeListOffLimitStatuses(client)),
  );

  server.registerTool(
    "mark_candidate_off_limit",
    {
      title: "Mark Candidate Off-Limit",
      description:
        "Marks up to 25 Recruit CRM candidates as off-limit. Requires candidate_slugs, status_id, and end_date in DD-MM-YYYY format; reason is optional. Returns the updated slug list, status_id, end_date, reason, and API remark.",
      inputSchema: markCandidateOffLimitInputSchema,
      outputSchema: markCandidateOffLimitOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeMarkCandidateOffLimit(client, args as MarkCandidateOffLimitInput)),
  );

  server.registerTool(
    "mark_contact_off_limit",
    {
      title: "Mark Contact Off-Limit",
      description:
        "Marks up to 25 Recruit CRM contacts as off-limit. Requires contact_slugs, status_id, and end_date in DD-MM-YYYY format; reason is optional. Returns the updated slug list, status_id, end_date, reason, and API remark.",
      inputSchema: markContactOffLimitInputSchema,
      outputSchema: markContactOffLimitOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeMarkContactOffLimit(client, args as MarkContactOffLimitInput)),
  );

  server.registerTool(
    "mark_company_off_limit",
    {
      title: "Mark Company Off-Limit",
      description:
        "Marks up to 25 Recruit CRM companies as off-limit. Requires company_slugs, status_id, end_date in DD-MM-YYYY format, mark_contact_off_limit, and mark_candidate_off_limit; reason is optional. The mark_contact_off_limit and mark_candidate_off_limit booleans control whether Recruit CRM also marks related records off-limit. Returns the updated slug list, status_id, end_date, reason, and API remark.",
      inputSchema: markCompanyOffLimitInputSchema,
      outputSchema: markCompanyOffLimitOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeMarkCompanyOffLimit(client, args as MarkCompanyOffLimitInput)),
  );

  server.registerTool(
    "mark_records_available",
    {
      title: "Mark Records Available",
      description:
        "Marks Recruit CRM candidates, contacts, or companies as available, which removes their off-limit state. Requires record_type and up to 25 slugs. For record_type=company, mark_contact_available and mark_candidate_available are required and control whether Recruit CRM also marks related contacts or candidates available. Returns record_type, updated slugs, requested_count, cascade flags when returned by the API, and API remark.",
      inputSchema: markRecordsAvailableInputSchema,
      outputSchema: markRecordsAvailableOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executeMarkRecordsAvailable(client, args as MarkRecordsAvailableInput)),
  );

  server.registerTool(
    "get_candidate_job_assignment_hiring_stage_history",
    {
      title: "Get Candidate Hiring Stage History",
      description:
        "Fetch one candidate's job assignment hiring stage history by candidate slug. Returns compact entries with job, company, stage, remark, and update metadata.",
      inputSchema: {
        candidate_slug: textFilterSchema.describe("Candidate slug."),
      },
      outputSchema: candidateJobAssignmentHiringStageHistoryOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async ({ candidate_slug }) =>
      formatResult(await executeGetCandidateJobAssignmentHiringStageHistory(client, candidate_slug)),
  );

  server.registerTool(
    "list_custom_fields",
    {
      title: "List Custom Fields",
      description:
        "List curated custom field metadata for a specific entity type (candidates, contacts, companies, jobs, deals). " +
        "Returns searchable fields by default; set include_non_searchable=true to also include non-searchable types.",
      inputSchema: {
        entity_type: z
          .enum(["candidates", "contacts", "companies", "jobs", "deals"])
          .describe("Entity type to fetch custom fields for."),
        include_non_searchable: booleanLikeSchema
          .optional()
          .describe("Include custom fields that cannot be used in search (e.g. file, user, company fields)."),
      },
      outputSchema: listCustomFieldsOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async ({ entity_type, include_non_searchable }) =>
      formatResult(await executeListCustomFields(client, entity_type, include_non_searchable ?? false)),
  );

  server.registerTool(
    "get_custom_field_details",
    {
      title: "Get Custom Field Details",
      description:
        "Fetch curated details for one custom field by field_id and entity_type, including dropdown or multiselect option values.",
      inputSchema: {
        field_id: z.coerce.number().int().positive().describe("Custom field id."),
        entity_type: z
          .enum(["candidates", "contacts", "companies", "jobs", "deals"])
          .describe("Entity type the field belongs to."),
      },
      outputSchema: customFieldDetailOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async ({ field_id, entity_type }) => formatResult(await executeGetCustomFieldDetails(client, field_id, entity_type)),
  );

  server.registerTool(
    "get_custom_field_dependencies",
    {
      title: "Get Custom Field Dependencies",
      outputSchema: getCustomFieldDependenciesOutputSchema,
      description:
        "Fetches parent-child dependency relationships for custom fields of a given entity type " +
        "(candidates, contacts, companies, jobs, deals). " +
        "Optionally narrow to a specific field's subtree via field_id (pass the parent or child field_id). " +
        "When setting a child custom field, the parent field_id and its value must also be included in the custom_fields array.",
      inputSchema: {
        entity_type: z
          .enum(["candidates", "contacts", "companies", "jobs", "deals"])
          .describe("Entity type to fetch custom field dependencies for."),
        field_id: z.coerce
          .number()
          .int()
          .positive()
          .optional()
          .describe(
            "Optional: narrow results to the dependency subtree for a specific field ID (parent or child). Omit to fetch all dependencies for the entity type.",
          ),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async ({ entity_type, field_id }) =>
      formatResult(await executeGetCustomFieldDependencies(client, entity_type, field_id)),
  );

  server.registerTool(
    "prepare_client_brief",
    {
      title: "Prepare Client Brief",
      description:
        "Prepares a client/account briefing for recruiters before a client call, client meeting, hiring-manager check-in, account review, business-development outreach, or client follow-up. Produces talking points, account health, open jobs, primary and secondary client contacts, assigned-candidate pipeline status, client-feedback blockers, candidates waiting on feedback, recent notes / meetings / tasks / call logs, pitched candidates for the contact, relationship risks, and recommended follow-ups. Inputs are exact Recruit CRM contact_slug or company_slug; display names are not accepted as slug values. Returns summaries and recommended follow-ups only.",
      inputSchema: prepareClientBriefInputSchema,
      outputSchema: prepareClientBriefOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => formatResult(await executePrepareClientBrief(client, args as PrepareClientBriefInput)),
  );

  server.registerTool(
    "analyze_job_pipeline",
    {
      title: "Analyze Job Pipeline",
      description:
        "Diagnoses a single Recruit CRM job's hiring pipeline: stage-by-stage candidate distribution, days_in_current_stage per active candidate (sourced from assignment-level stage_date — ~7 API calls), idle and at-risk candidates, bottleneck stage verdict, recent notes / meetings / tasks tied to the job, and suggested next actions. Set include_time_metrics=true to add time-to-hire, time-to-stage, and time-to-first-action metrics (fetches per-candidate history for capped active and Placed candidates, typically +25–55 extra calls). Requires a job_slug; resolve from search_jobs if only a job name is available. Candidate slugs in the response can be linked as https://app.recruitcrm.io/candidate/{candidate_slug}. Call logs are not included because the Recruit CRM API does not support filtering call logs by job.",
      inputSchema: analyzeJobPipelineInputSchema,
      outputSchema: analyzeJobPipelineOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) =>
      formatResult(await executeAnalyzeJobPipeline(client, args as AnalyzeJobPipelineInput)),
  );

  return server;
}

export async function executeSearchCandidates(
  client: RecruitCrmClient,
  args: SearchCandidatesInput,
): Promise<SearchCandidatesResult> {
  if (!args.candidate_slug && args.custom_fields && args.custom_fields.length > 0) {
    const customFields = await client.getCandidateCustomFields();
    validateCustomFieldFilters(args.custom_fields, customFields);
  }

  const result = await client.searchCandidates({
    page: args.page ?? 1,
    limit: args.limit,
    created_from: args.created_from,
    created_to: args.created_to,
    email: args.email,
    first_name: args.first_name,
    last_name: args.last_name,
    linkedin: args.linkedin,
    marked_as_off_limit: args.marked_as_off_limit,
    owner_email: args.owner_email,
    owner_id: args.owner_id,
    owner_name: args.owner_name,
    state: args.state,
    updated_from: args.updated_from,
    updated_to: args.updated_to,
    candidate_slug: args.candidate_slug,
    contact_number: args.contact_number,
    country: args.country,
    exact_search: args.exact_search,
    sort_by: args.sort_by ?? "updatedon",
    sort_order: args.sort_order ?? "desc",
    custom_fields: args.custom_fields,
  });

  return mapSearchCandidatesResult(result, {
    includeContactInfo: args.include_contact_info ?? false,
  });
}

export async function executeListCandidates(
  client: RecruitCrmClient,
  args: ListCandidatesInput,
): Promise<SearchCandidatesResult> {
  const result = await client.listCandidates({
    limit: args.limit ?? 100,
    page: args.page ?? 1,
    sort_by: args.sort_by ?? "updatedon",
    sort_order: args.sort_order ?? "desc",
  });

  return mapSearchCandidatesResult(result, {
    includeContactInfo: args.include_contact_info ?? false,
  });
}

const CANDIDATE_URL_FIELDS = ["avatar", "facebook", "twitter", "linkedin", "github", "xing", "resume"] as const;

// Matches strings composed entirely of base64 characters; used to detect encoded file content.
const BASE64_CONTENT_REGEX = /^[A-Za-z0-9+/]+=*$/;

function normalizeCandidateUrlField(value: string | undefined): string | undefined {
  if (!value) return value;
  if (/^https?:\/\//i.test(value)) return value;
  // Long strings of pure base64 characters are encoded file content, not bare URLs.
  // Prepending "https://" to them would corrupt the payload and cause the API to reject it.
  if (value.length > 50 && BASE64_CONTENT_REGEX.test(value)) return value;
  return `https://${value}`;
}

export async function executeCreateCandidate(
  client: RecruitCrmClient,
  args: CreateCandidateInput,
): Promise<CreateCandidateResult> {
  if (!args.first_name && !args.last_name) {
    throw new RecruitCrmApiError("Either first_name or last_name is required to create a candidate.");
  }

  args = normalizeCandidateMutationUrls(args);

  if (!args.owner_id) {
    throw new RecruitCrmApiError("owner_id is required when creating a candidate. Use list_users to resolve the current user ID.");
  }
  if (!args.created_by) {
    throw new RecruitCrmApiError("created_by is required when creating a candidate. Use list_users to resolve the current user ID.");
  }
  if (!args.updated_by) {
    args = { ...args, updated_by: args.created_by };
  }

  if (!args.allow_duplicate) {
    await assertNoCreateCandidateDuplicates(client, args);
  }

  const candidate = await client.createCandidate(args);
  return executeCandidateHistoryAndMap(client, candidate, "created", args);
}

export async function executeUpdateCandidate(
  client: RecruitCrmClient,
  args: UpdateCandidateInput,
): Promise<CreateCandidateResult> {
  if (!args.first_name && !args.last_name) {
    throw new RecruitCrmApiError("Either first_name or last_name is required to update a candidate.");
  }
  if (!args.updated_by) {
    throw new RecruitCrmApiError("updated_by is required when updating a candidate. Use list_users to resolve the current user ID.");
  }

  args = normalizeCandidateMutationUrls(args);

  const candidate = await client.updateCandidate(args.candidate_slug, args);
  return executeCandidateHistoryAndMap(client, candidate, "updated", args);
}

function normalizeCandidateMutationUrls<T extends CreateCandidateInput | UpdateCandidateInput>(args: T): T {
  let normalizedArgs = args;
  for (const field of CANDIDATE_URL_FIELDS) {
    const val = normalizedArgs[field];
    if (val) {
      normalizedArgs = { ...normalizedArgs, [field]: normalizeCandidateUrlField(val) };
    }
  }
  return normalizedArgs;
}

async function executeCandidateHistoryAndMap(
  client: RecruitCrmClient,
  candidate: CreatedCandidate,
  action: "created" | "updated",
  args: CreateCandidateInput | UpdateCandidateInput,
): Promise<CreateCandidateResult> {
  const candidateSlug = candidate.slug;

  if (!candidateSlug) {
    throw new RecruitCrmApiError("Recruit CRM candidate response did not include a candidate slug.");
  }

  const errors: CreateCandidateHistoryError[] = [];
  const workHistoryRequestedCount = args.work_history?.length ?? 0;
  const educationHistoryRequestedCount = args.education_history?.length ?? 0;
  let workHistoryResponse: CandidateHistoryCreateResponse | null = null;
  let educationHistoryResponse: CandidateHistoryCreateResponse | null = null;

  if (workHistoryRequestedCount > 0 && args.work_history) {
    try {
      workHistoryResponse = await client.createCandidateWorkHistory(candidateSlug, args.work_history);
    } catch (error) {
      errors.push(mapCreateCandidateHistoryError("work_history", error));
    }
  }

  if (educationHistoryRequestedCount > 0 && args.education_history) {
    try {
      educationHistoryResponse = await client.createCandidateEducationHistory(candidateSlug, args.education_history);
    } catch (error) {
      errors.push(mapCreateCandidateHistoryError("education_history", error));
    }
  }

  return mapCreateCandidateResult(
    candidate,
    action,
    workHistoryRequestedCount,
    workHistoryResponse,
    educationHistoryRequestedCount,
    educationHistoryResponse,
    errors,
  );
}

export async function executeListJobs(client: RecruitCrmClient, args: ListJobsInput): Promise<SearchJobsResult> {
  const result = await client.listJobs({
    limit: args.limit ?? 100,
    page: args.page ?? 1,
    sort_by: args.sort_by ?? "updatedon",
    sort_order: args.sort_order ?? "desc",
  });

  return mapSearchJobsResult(result);
}

export async function executeListCompanies(
  client: RecruitCrmClient,
  args: ListCompaniesInput,
): Promise<SearchCompaniesResult> {
  const result = await client.listCompanies({
    limit: args.limit ?? 100,
    page: args.page ?? 1,
    sort_by: args.sort_by ?? "updatedon",
    sort_order: args.sort_order ?? "desc",
  });

  return mapSearchCompaniesResult(result);
}

export async function executeListContacts(
  client: RecruitCrmClient,
  args: ListContactsInput,
): Promise<SearchContactsResult> {
  const result = await client.listContacts({
    limit: args.limit ?? 100,
    page: args.page ?? 1,
    sort_by: args.sort_by ?? "updatedon",
    sort_order: args.sort_order ?? "desc",
  });

  return mapSearchContactsResult(result, {
    includeContactInfo: args.include_contact_info ?? false,
  });
}

export async function executeListUsers(client: RecruitCrmClient, args: ListUsersInput): Promise<ListUsersResult> {
  const result = await client.listUsers({
    include_teams: args.include_teams ?? false,
  });

  return mapListUsersResult(result, {
    includeTeams: args.include_teams ?? false,
    includeContactInfo: args.include_contact_info ?? false,
  });
}

export async function executeListTeams(client: RecruitCrmClient, args: ListTeamsInput): Promise<ListTeamsResult> {
  const result = await client.listTeams({
    expand: args.expand,
  });

  return mapListTeamsResult(result, {
    page: args.page ?? 1,
    limit: args.limit ?? 100,
    includeUserContactInfo: args.include_user_contact_info ?? false,
  });
}

export async function executeListCandidateQuestions(
  client: RecruitCrmClient,
  args: { page?: number; limit?: number },
): Promise<ListCandidateQuestionsResult> {
  const result = await client.listCandidateQuestions();

  return mapListCandidateQuestionsResult(result, {
    page: args.page ?? 1,
    limit: args.limit ?? 100,
  });
}

export async function executeListHiringPipelines(
  client: RecruitCrmClient,
  args: { page?: number; limit?: number },
): Promise<ListHiringPipelinesResult> {
  const result = await client.listHiringPipelines();

  return mapListHiringPipelinesResult(result, {
    page: args.page ?? 1,
    limit: args.limit ?? 100,
  });
}

export async function executeListLanguagesAndProficiencies(
  client: RecruitCrmClient,
  args: { page?: number; limit?: number },
): Promise<ListLanguagesAndProficienciesResult> {
  const result = await client.listLanguages();

  return mapListLanguagesAndProficienciesResult(result, {
    page: args.page ?? 1,
    limit: args.limit ?? 100,
  });
}

export async function executeListCurrencies(
  client: RecruitCrmClient,
  args: { page?: number; limit?: number },
): Promise<ListCurrenciesResult> {
  const result = await client.listCurrencies();

  return mapListCurrenciesResult(result, {
    page: args.page ?? 1,
    limit: args.limit ?? 100,
  });
}

export async function executeListQualifications(
  client: RecruitCrmClient,
  args: { page?: number; limit?: number },
): Promise<ListQualificationsResult> {
  const result = await client.listQualifications();

  return mapListQualificationsResult(result, {
    page: args.page ?? 1,
    limit: args.limit ?? 100,
  });
}

export async function executeListXmlJobboards(client: RecruitCrmClient): Promise<ListXmlJobboardsResult> {
  const result = await client.listXmlJobboards();

  return mapListXmlJobboardsResult(result);
}

export async function executeSearchJobs(client: RecruitCrmClient, args: SearchJobsInput): Promise<SearchJobsResult> {
  if (!args.job_slug && args.custom_fields && args.custom_fields.length > 0) {
    const customFields = await client.getEntityCustomFields("job");
    validateCustomFieldFilters(args.custom_fields, customFields, "job");
  }

  const result = await client.searchJobs({
    page: args.page ?? 1,
    city: args.city,
    company_name: args.company_name,
    company_slug: args.company_slug,
    contact_email: args.contact_email,
    contact_name: args.contact_name,
    contact_number: args.contact_number,
    contact_slug: args.contact_slug,
    country: args.country,
    created_from: args.created_from,
    created_to: args.created_to,
    enable_job_application_form: args.enable_job_application_form,
    exact_search: args.exact_search,
    full_address: args.full_address,
    job_category: args.job_category,
    job_skill: args.job_skill,
    job_slug: args.job_slug,
    job_status: args.job_status,
    job_type: args.job_type,
    limit: args.limit ?? 100,
    locality: args.locality,
    name: args.name,
    note_for_candidates: args.note_for_candidates,
    owner_email: args.owner_email,
    owner_id: args.owner_id,
    owner_name: args.owner_name,
    secondary_contact_email: args.secondary_contact_email,
    secondary_contact_name: args.secondary_contact_name,
    secondary_contact_number: args.secondary_contact_number,
    secondary_contact_slug: args.secondary_contact_slug,
    sort_by: args.sort_by ?? "updatedon",
    sort_order: args.sort_order ?? "desc",
    updated_from: args.updated_from,
    updated_to: args.updated_to,
    custom_fields: args.custom_fields,
  });

  return mapSearchJobsResult(result);
}

export async function executeCreateJob(
  client: RecruitCrmClient,
  args: CreateJobInput,
): Promise<CreateJobResult> {
  validateJobMutationInput(args);

  const job = await client.createJob({
    ...args,
    enable_auto_populate_teams: args.enable_auto_populate_teams ?? true,
    show_company_logo: args.show_company_logo ?? 2,
  });

  return mapCreatedJobResult(job, "created");
}

export async function executeUpdateJob(
  client: RecruitCrmClient,
  args: UpdateJobInput,
): Promise<CreateJobResult> {
  validateJobMutationInput(args);
  validateUpdateJobHasFields(args);

  const job = await client.updateJob(args.job_slug, args);

  return mapCreatedJobResult(job, "updated");
}

export async function executeSearchCompanies(
  client: RecruitCrmClient,
  args: SearchCompaniesInput,
): Promise<SearchCompaniesResult> {
  if (!args.company_slug && args.custom_fields && args.custom_fields.length > 0) {
    const customFields = await client.getEntityCustomFields("company");
    validateCustomFieldFilters(args.custom_fields, customFields, "company");
  }

  const result = await client.searchCompanies({
    page: args.page ?? 1,
    limit: args.limit,
    company_name: args.company_name,
    created_from: args.created_from,
    created_to: args.created_to,
    marked_as_off_limit: args.marked_as_off_limit,
    owner_email: args.owner_email,
    owner_id: args.owner_id,
    owner_name: args.owner_name,
    updated_from: args.updated_from,
    updated_to: args.updated_to,
    company_slug: args.company_slug,
    exact_search: args.exact_search,
    sort_by: args.sort_by ?? "updatedon",
    sort_order: args.sort_order ?? "desc",
    custom_fields: args.custom_fields,
  });

  return mapSearchCompaniesResult(result);
}

export async function executeCreateCompany(
  client: RecruitCrmClient,
  args: CreateCompanyInput,
): Promise<CreateCompanyResult> {
  if (!args.allow_duplicate) {
    await assertNoCreateCompanyDuplicates(client, args);
  }
  const company = await client.createCompany(args);
  return mapCreatedCompanyResult(company, "created");
}

export async function executeUpdateCompany(
  client: RecruitCrmClient,
  args: UpdateCompanyInput,
): Promise<CreateCompanyResult> {
  const company = await client.updateCompany(args.company_slug, args);
  return mapCreatedCompanyResult(company, "updated");
}

export async function executeSearchContacts(
  client: RecruitCrmClient,
  args: SearchContactsInput,
): Promise<SearchContactsResult> {
  validateSearchContactsFilters(args);

  if (!args.contact_slug && args.custom_fields && args.custom_fields.length > 0) {
    const customFields = await client.getEntityCustomFields("contact");
    validateCustomFieldFilters(args.custom_fields, customFields, "contact");
  }

  const result = await client.searchContacts({
    page: args.page ?? 1,
    limit: args.limit,
    created_from: args.created_from,
    created_to: args.created_to,
    email: args.email,
    first_name: args.first_name,
    last_name: args.last_name,
    linkedin: args.linkedin,
    marked_as_off_limit: args.marked_as_off_limit,
    owner_email: args.owner_email,
    owner_id: args.owner_id,
    owner_name: args.owner_name,
    updated_from: args.updated_from,
    updated_to: args.updated_to,
    company_slug: args.company_slug,
    contact_number: args.contact_number,
    contact_slug: args.contact_slug,
    exact_search: args.exact_search,
    sort_by: args.sort_by ?? "updatedon",
    sort_order: args.sort_order ?? "desc",
    custom_fields: args.custom_fields,
  });

  return mapSearchContactsResult(result, {
    includeContactInfo: args.include_contact_info ?? false,
  });
}

export async function executeSearchHotlists(
  client: RecruitCrmClient,
  args: SearchHotlistsInput,
): Promise<SearchHotlistsResult> {
  const result = await client.searchHotlists({
    page: args.page ?? 1,
    name: args.name,
    shared: args.shared,
    related_to_type: args.related_to_type,
  });

  return mapSearchHotlistsResult(result, {
    includeRelatedSlugs: Boolean(args.name),
  });
}

export async function executeCreateHotlist(
  client: RecruitCrmClient,
  args: CreateHotlistInput,
): Promise<CreateHotlistResult> {
  const result = await client.createHotlist(args);
  return mapCreateHotlistResult(result);
}

export async function executeSearchTasks(client: RecruitCrmClient, args: SearchTasksInput): Promise<SearchTasksResult> {
  validateRelatedFilters(args);
  const normalizedArgs = normalizeTaskDateRanges(args);

  let result;

  try {
    result = await client.searchTasks({
      page: normalizedArgs.page ?? 1,
      created_from: normalizedArgs.created_from,
      created_to: normalizedArgs.created_to,
      owner_email: normalizedArgs.owner_email,
      owner_id: normalizedArgs.owner_id,
      owner_name: normalizedArgs.owner_name,
      related_to: normalizedArgs.related_to,
      related_to_type: normalizedArgs.related_to_type,
      starting_from: normalizedArgs.starting_from,
      starting_to: normalizedArgs.starting_to,
      title: normalizedArgs.title,
      updated_from: normalizedArgs.updated_from,
      updated_to: normalizedArgs.updated_to,
    });
  } catch (error) {
    throw mapTaskSearchError(error, args);
  }

  return mapSearchTasksResult(result);
}

export async function executeListTaskTypes(client: RecruitCrmClient): Promise<ListTaskTypesResult> {
  const result = await client.listTaskTypes();

  return mapListTaskTypesResult(result);
}

export async function executeCreateTask(client: RecruitCrmClient, args: CreateTaskInput): Promise<CreateTaskResult> {
  validateRelatedFilters(args);

  const taskTypes = await client.listTaskTypes();
  validateTaskTypeId(args.task_type_id, taskTypes);

  const result = await client.createTask(args);

  return mapCreateTaskResult(result);
}

export async function executeUpdateTask(client: RecruitCrmClient, args: UpdateTaskInput): Promise<CreateTaskResult> {
  validateActivityUpdateHasFields(args, ["task_id", "updated_by"], "update_task");
  validateRelatedFilters(args);

  if (args.task_type_id !== undefined) {
    const taskTypes = await client.listTaskTypes();
    validateTaskTypeId(args.task_type_id, taskTypes);
  }

  const result = await client.updateTask(args.task_id, args);

  return mapCreateTaskResult(result);
}

export async function executeSearchMeetings(
  client: RecruitCrmClient,
  args: SearchMeetingsInput,
): Promise<SearchMeetingsResult> {
  validateRelatedFilters(args);

  const result = await client.searchMeetings({
    page: args.page ?? 1,
    created_from: args.created_from,
    created_to: args.created_to,
    owner_email: args.owner_email,
    owner_id: args.owner_id,
    owner_name: args.owner_name,
    related_to: args.related_to,
    related_to_type: args.related_to_type,
    starting_from: args.starting_from,
    starting_to: args.starting_to,
    title: args.title,
    updated_from: args.updated_from,
    updated_to: args.updated_to,
  });

  return mapSearchMeetingsResult(result);
}

export async function executeListMeetingTypes(client: RecruitCrmClient): Promise<ListMeetingTypesResult> {
  const result = await client.listMeetingTypes();

  return mapListMeetingTypesResult(result);
}

export async function executeCreateMeeting(
  client: RecruitCrmClient,
  args: CreateMeetingInput,
): Promise<CreateMeetingResult> {
  if (args.meeting_type_id !== undefined) {
    const meetingTypes = await client.listMeetingTypes();
    validateMeetingTypeId(args.meeting_type_id, meetingTypes);
  }

  validateRelatedFilters(args);

  const result = await client.createMeeting({
    ...args,
    do_not_send_calendar_invites: args.do_not_send_calendar_invites ?? true,
    enable_auto_populate_teams: args.enable_auto_populate_teams ?? true,
  });

  return mapCreateMeetingResult(result);
}

export async function executeUpdateMeeting(
  client: RecruitCrmClient,
  args: UpdateMeetingInput,
): Promise<CreateMeetingResult> {
  validateActivityUpdateHasFields(args, ["meeting_id", "updated_by"], "update_meeting");

  if (args.meeting_type_id !== undefined) {
    const meetingTypes = await client.listMeetingTypes();
    validateMeetingTypeId(args.meeting_type_id, meetingTypes);
  }

  validateRelatedFilters(args);

  const result = await client.updateMeeting(args.meeting_id, {
    ...args,
    do_not_send_calendar_invites: args.do_not_send_calendar_invites ?? true,
  });

  return mapCreateMeetingResult(result);
}

export async function executeSearchNotes(client: RecruitCrmClient, args: SearchNotesInput): Promise<SearchNotesResult> {
  validateRelatedFilters(args);

  const result = await client.searchNotes({
    page: args.page ?? 1,
    added_from: args.added_from,
    added_to: args.added_to,
    related_to: args.related_to,
    related_to_type: args.related_to_type,
    updated_from: args.updated_from,
    updated_to: args.updated_to,
  });

  return mapSearchNotesResult(result);
}

export async function executeListNoteTypes(client: RecruitCrmClient): Promise<ListNoteTypesResult> {
  const result = await client.listNoteTypes();

  return mapListNoteTypesResult(result);
}

export async function executeCreateNote(client: RecruitCrmClient, args: CreateNoteInput): Promise<CreateNoteResult> {
  const noteTypes = await client.listNoteTypes();
  validateNoteTypeId(args.note_type_id, noteTypes);

  const result = await client.createNote(args);

  return mapCreateNoteResult(result);
}

export async function executeUpdateNote(client: RecruitCrmClient, args: UpdateNoteInput): Promise<CreateNoteResult> {
  validateActivityUpdateHasFields(args, ["note_id", "updated_by"], "update_note");
  validateRelatedFilters(args);

  if (args.note_type_id !== undefined) {
    const noteTypes = await client.listNoteTypes();
    validateNoteTypeId(args.note_type_id, noteTypes);
  }

  const result = await client.updateNote(args.note_id, args);

  return mapCreateNoteResult(result);
}

export async function executeSearchCallLogs(
  client: RecruitCrmClient,
  args: SearchCallLogsInput,
): Promise<SearchCallLogsResult> {
  validateRelatedFilters(args);
  validateCallLogRelatedType(args.related_to_type);

  const result = await client.searchCallLogs({
    page: args.page ?? 1,
    call_type: args.call_type,
    related_to: args.related_to,
    related_to_type: args.related_to_type,
    starting_from: args.starting_from,
    starting_to: args.starting_to,
    updated_from: args.updated_from,
    updated_to: args.updated_to,
  });

  return mapSearchCallLogsResult(result);
}

export async function executeListCallTypes(client: RecruitCrmClient): Promise<ListCallTypesResult> {
  const result = await client.listCallTypes();

  return mapListCallTypesResult(result);
}

export async function executeCreateCallLog(
  client: RecruitCrmClient,
  args: CreateCallLogInput,
): Promise<CreateCallLogResult> {
  const callTypes = await client.listCallTypes();
  validateCallLogCustomTypeId(args.custom_call_type_id, callTypes);

  const result = await client.createCallLog(args);

  return mapCreateCallLogResult(result);
}

export async function executeUpdateCallLog(
  client: RecruitCrmClient,
  args: UpdateCallLogInput,
): Promise<CreateCallLogResult> {
  validateActivityUpdateHasFields(args, ["call_log_id", "updated_by"], "update_call_log");
  validateRelatedFilters(args);
  validateCallLogRelatedType(args.related_to_type);

  if (args.custom_call_type_id !== undefined) {
    const callTypes = await client.listCallTypes();
    validateCallLogCustomTypeId(args.custom_call_type_id, callTypes);
  }

  const result = await client.updateCallLog(args.call_log_id, args);

  return mapCreateCallLogResult(result);
}

export async function executeGetCandidateDetails(
  client: RecruitCrmClient,
  args: GetCandidateDetailsInput,
): Promise<CandidateDetailsResult> {
  const uniqueSlugs = Array.from(new Set(args.candidate_slugs));
  const settled = await Promise.allSettled(
    uniqueSlugs.map((slug) => client.getCandidateDetails(slug)),
  );

  const candidates: CandidateDetail[] = [];
  const errors: CandidateDetailsError[] = [];

  settled.forEach((outcome, idx) => {
    const slug = uniqueSlugs[idx];
    if (outcome.status === "fulfilled") {
      candidates.push(outcome.value);
    } else {
      const reason = outcome.reason;
      errors.push({
        slug,
        error: reason instanceof Error ? reason.message : String(reason),
        status_code: reason instanceof RecruitCrmApiError ? reason.statusCode ?? null : null,
      });
    }
  });

  return {
    requested_count: uniqueSlugs.length,
    successful_count: candidates.length,
    failed_count: errors.length,
    candidates,
    errors,
  };
}

export async function executeGetJobDetails(
  client: RecruitCrmClient,
  args: GetJobDetailsInput,
): Promise<JobDetailsResult> {
  const uniqueSlugs = Array.from(new Set(args.job_slugs));
  const settled = await Promise.allSettled(uniqueSlugs.map((slug) => client.getJobDetails(slug)));

  const jobs: JobDetail[] = [];
  const errors: JobDetailsError[] = [];

  settled.forEach((outcome, idx) => {
    const slug = uniqueSlugs[idx];
    if (outcome.status === "fulfilled") {
      jobs.push(outcome.value);
    } else {
      const reason = outcome.reason;
      errors.push({
        slug,
        error: reason instanceof Error ? reason.message : String(reason),
        status_code: reason instanceof RecruitCrmApiError ? reason.statusCode ?? null : null,
      });
    }
  });

  return {
    requested_count: uniqueSlugs.length,
    successful_count: jobs.length,
    failed_count: errors.length,
    jobs,
    errors,
  };
}

export async function executeGetCompanyDetails(
  client: RecruitCrmClient,
  args: GetCompanyDetailsInput,
): Promise<CompanyDetailsResult> {
  const uniqueSlugs = Array.from(new Set(args.company_slugs));
  const settled = await Promise.allSettled(uniqueSlugs.map((slug) => client.getCompanyDetails(slug)));

  const companies: CompanyDetail[] = [];
  const errors: CompanyDetailsError[] = [];

  settled.forEach((outcome, idx) => {
    const slug = uniqueSlugs[idx];
    if (outcome.status === "fulfilled") {
      companies.push(outcome.value);
    } else {
      const reason = outcome.reason;
      errors.push({
        slug,
        error: reason instanceof Error ? reason.message : String(reason),
        status_code: reason instanceof RecruitCrmApiError ? reason.statusCode ?? null : null,
      });
    }
  });

  return {
    requested_count: uniqueSlugs.length,
    successful_count: companies.length,
    failed_count: errors.length,
    companies,
    errors,
  };
}

export async function executeGetContactDetails(
  client: RecruitCrmClient,
  args: GetContactDetailsInput,
): Promise<ContactDetailsResult> {
  const uniqueSlugs = Array.from(new Set(args.contact_slugs));
  const settled = await Promise.allSettled(uniqueSlugs.map((slug) => client.getContactDetails(slug)));

  const contacts: ContactDetail[] = [];
  const errors: ContactDetailsError[] = [];

  settled.forEach((outcome, idx) => {
    const slug = uniqueSlugs[idx];
    if (outcome.status === "fulfilled") {
      contacts.push(outcome.value);
    } else {
      const reason = outcome.reason;
      errors.push({
        slug,
        error: reason instanceof Error ? reason.message : String(reason),
        status_code: reason instanceof RecruitCrmApiError ? reason.statusCode ?? null : null,
      });
    }
  });

  return {
    requested_count: uniqueSlugs.length,
    successful_count: contacts.length,
    failed_count: errors.length,
    contacts,
    errors,
  };
}

export async function executeAddRecordsToHotlist(
  client: RecruitCrmClient,
  args: AddRecordsToHotlistInput,
): Promise<AddRecordsToHotlistResult> {
  const uniqueSlugs = Array.from(new Set(args.related_slugs));
  const addedSlugs: string[] = [];
  const errors: Array<{
    slug: string;
    error: string;
    status_code: number | null;
  }> = [];

  for (const slug of uniqueSlugs) {
    try {
      await client.addRecordToHotlist(args.hotlist_id, slug);
      addedSlugs.push(slug);
    } catch (error) {
      errors.push({
        slug,
        error: error instanceof Error ? error.message : String(error),
        status_code: error instanceof RecruitCrmApiError ? error.statusCode ?? null : null,
      });
    }
  }

  return {
    hotlist_id: args.hotlist_id,
    requested_count: uniqueSlugs.length,
    successful_count: addedSlugs.length,
    failed_count: errors.length,
    added_slugs: addedSlugs,
    errors,
  };
}

export async function executeGetJobAssignedCandidates(
  client: RecruitCrmClient,
  jobSlug: string,
  args: GetJobAssignedCandidatesInput,
): Promise<JobAssignedCandidatesResult> {
  const result = await client.getJobAssignedCandidates(jobSlug, {
    page: args.page ?? 1,
    limit: args.limit ?? 100,
    status_id: args.status_id,
  });

  return mapJobAssignedCandidatesResult(jobSlug, result);
}

export async function executeListCandidateHiringStages(
  client: RecruitCrmClient,
  args: ListCandidateHiringStagesInput = {},
): Promise<CandidateHiringStagesResult> {
  const result = await client.listCandidateHiringStages({
    hiring_pipeline_id: args.hiring_pipeline_id ?? 0,
  });

  return mapCandidateHiringStagesResult(result);
}

export async function executeListPitchStages(client: RecruitCrmClient): Promise<ListPitchStagesResult> {
  const result = await client.listPitchStages();

  return mapListPitchStagesResult(result);
}

export async function executePitchCandidateToContact(
  client: RecruitCrmClient,
  args: PitchCandidateToContactInput,
): Promise<PitchCandidateToContactResult> {
  if (!args.allow_duplicate) {
    await assertNoExistingCandidateContactPitch(client, args);
  }

  const result = await client.pitchCandidateToContact(args);

  return mapPitchCandidateToContactResult(result);
}

export async function executeUpdateCandidatePitchStage(
  client: RecruitCrmClient,
  args: UpdateCandidatePitchStageInput,
): Promise<UpdateCandidatePitchStageResult> {
  const result = await client.updateCandidatePitchStage(args);

  return mapUpdateCandidatePitchStageResult(result);
}

export async function executeGetPitchHistory(
  client: RecruitCrmClient,
  entityType: PitchEntityType,
  entitySlug: string,
): Promise<PitchHistoryResult> {
  const result = await client.getPitchHistory(entityType, entitySlug);

  return mapPitchHistoryResult(entityType, entitySlug, result);
}

export async function executeGetPitchedRecords(
  client: RecruitCrmClient,
  entityType: PitchEntityType,
  entitySlug: string,
): Promise<PitchedRecordsResult> {
  const result = await client.getPitchedRecords(entityType, entitySlug);

  return mapPitchedRecordsResult(entityType, entitySlug, result);
}

const PREPARE_CLIENT_BRIEF_DEFAULTS = {
  lookbackDays: 30,
  maxOpenJobs: 5,
  maxRelatedContacts: 15,
  maxAssignedCandidatesPerJob: 50,
  feedbackWaitDaysThreshold: 3,
  contactActivityLimit: 3,
} as const;

const PREPARE_CLIENT_BRIEF_OPEN_JOB_STATUS = 1;
const PREPARE_CLIENT_BRIEF_VIEW_URL_PREFIX = "https://app.recruitcrm.io/";
const PREPARE_CLIENT_BRIEF_CLIENT_FACING_STAGE_MARKERS = [
  "client",
  "submit",
  "shortlist",
  "cv sent",
  "resume sent",
  "interview",
  "offer",
] as const;

type PrepareClientBriefJobSummary = SearchJobsResult["jobs"][number];
type PrepareClientBriefResolvedJobSummary = PrepareClientBriefJobSummary & { slug: string };
type PrepareClientBriefContactRecord = Record<string, unknown>;
type PrepareClientBriefRelatedContactState = {
  relationships: Set<string>;
  jobSlugs: Set<string>;
};

export async function executePrepareClientBrief(
  client: RecruitCrmClient,
  args: PrepareClientBriefInput,
): Promise<PrepareClientBriefResult> {
  if (!args.contact_slug && !args.company_slug) {
    throw new RecruitCrmApiError("prepare_client_brief requires contact_slug, company_slug, or both.");
  }

  const lookbackDays = args.lookback_days ?? PREPARE_CLIENT_BRIEF_DEFAULTS.lookbackDays;
  const maxOpenJobs = args.max_open_jobs ?? PREPARE_CLIENT_BRIEF_DEFAULTS.maxOpenJobs;
  const maxRelatedContacts = args.max_related_contacts ?? PREPARE_CLIENT_BRIEF_DEFAULTS.maxRelatedContacts;
  const maxAssignedCandidates =
    args.max_assigned_candidates_per_job ?? PREPARE_CLIENT_BRIEF_DEFAULTS.maxAssignedCandidatesPerJob;
  const feedbackWaitDays =
    args.feedback_wait_days_threshold ?? PREPARE_CLIENT_BRIEF_DEFAULTS.feedbackWaitDaysThreshold;
  const includeActivity = args.include_activity ?? true;
  const includePipelineSummary = args.include_pipeline_summary ?? true;
  const includeContactInfo = args.include_contact_info ?? false;

  const errors: PrepareClientBriefError[] = [];
  const ownerNames = await fetchAnalyzeUserNameMap(client).catch((error) => {
    errors.push(buildPrepareClientBriefError("users", error));
    return new Map<number, string>();
  });

  let primaryContactDetail: ContactDetail | null = null;
  if (args.contact_slug) {
    try {
      primaryContactDetail = await client.getContactDetails(args.contact_slug);
    } catch (error) {
      errors.push(buildPrepareClientBriefError("contact", error, args.contact_slug));
    }
  }

  const resolvedCompanySlug =
    args.company_slug ?? clientBriefString((primaryContactDetail as Record<string, unknown> | null)?.company_slug);

  let companyDetail: CompanyDetail | null = null;
  if (resolvedCompanySlug) {
    try {
      companyDetail = await client.getCompanyDetails(resolvedCompanySlug);
    } catch (error) {
      errors.push(buildPrepareClientBriefError("company", error, resolvedCompanySlug));
    }
  }

  const relatedContactStates = new Map<string, PrepareClientBriefRelatedContactState>();
  const contactRecords = new Map<string, PrepareClientBriefContactRecord>();
  if (primaryContactDetail) {
    const slug = clientBriefString(primaryContactDetail.slug);
    if (slug) {
      contactRecords.set(slug, primaryContactDetail as PrepareClientBriefContactRecord);
      addPrepareClientBriefContactRelation(relatedContactStates, slug, "input_contact");
    }
  } else if (args.contact_slug) {
    addPrepareClientBriefContactRelation(relatedContactStates, args.contact_slug, "input_contact");
  }

  if (companyDetail) {
    for (const slug of clientBriefStringList((companyDetail as Record<string, unknown>).contact_slug)) {
      addPrepareClientBriefContactRelation(relatedContactStates, slug, "account_contact");
    }
  }

  if (resolvedCompanySlug) {
    try {
      const companyContacts = await executeSearchContacts(client, {
        page: 1,
        limit: maxRelatedContacts,
        company_slug: resolvedCompanySlug,
        include_contact_info: includeContactInfo,
      });
      for (const contact of companyContacts.contacts) {
        contactRecords.set(contact.slug, contact as unknown as PrepareClientBriefContactRecord);
        addPrepareClientBriefContactRelation(relatedContactStates, contact.slug, "account_contact");
      }
    } catch (error) {
      errors.push(buildPrepareClientBriefError("contacts", error, resolvedCompanySlug));
    }
  }

  const { jobs, truncated: jobsTruncated } = await fetchPrepareClientBriefJobs(client, {
    contactSlug: args.contact_slug,
    companySlug: resolvedCompanySlug,
    maxOpenJobs,
    errors,
  });

  for (const job of jobs) {
    if (job.contact_slug) {
      addPrepareClientBriefContactRelation(
        relatedContactStates,
        job.contact_slug,
        "primary_contact_on_job",
        job.slug,
      );
    }
    for (const slug of job.secondary_contact_slugs) {
      addPrepareClientBriefContactRelation(
        relatedContactStates,
        slug,
        "secondary_contact_on_job",
        job.slug,
      );
    }
  }

  const relatedContactSlugs = orderPrepareClientBriefContactSlugs(
    relatedContactStates,
    args.contact_slug,
    maxRelatedContacts,
  );
  await fetchPrepareClientBriefContactDetails(client, relatedContactSlugs, contactRecords, errors);

  const activityByEntity = new Map<string, PrepareClientBriefActivitySummary>();
  if (includeActivity) {
    const activityEntities: Array<{ entity_type: "company" | "contact" | "job"; entity_slug: string }> = [];
    if (resolvedCompanySlug) {
      activityEntities.push({ entity_type: "company", entity_slug: resolvedCompanySlug });
    }

    const contactActivityLimit = Math.min(
      PREPARE_CLIENT_BRIEF_DEFAULTS.contactActivityLimit,
      relatedContactSlugs.length,
    );
    for (const slug of relatedContactSlugs.slice(0, contactActivityLimit)) {
      activityEntities.push({ entity_type: "contact", entity_slug: slug });
    }

    for (const job of jobs) {
      activityEntities.push({ entity_type: "job", entity_slug: job.slug });
    }

    const settled = await Promise.allSettled(
      activityEntities.map((entity) => fetchPrepareClientBriefActivity(client, entity, lookbackDays)),
    );
    settled.forEach((outcome, idx) => {
      const entity = activityEntities[idx];
      if (outcome.status === "fulfilled") {
        activityByEntity.set(clientBriefActivityKey(entity.entity_type, entity.entity_slug), outcome.value);
      } else {
        errors.push(buildPrepareClientBriefError("activity", outcome.reason, entity.entity_slug));
      }
    });
  }

  const relatedContacts = relatedContactSlugs
    .map((slug) =>
      buildPrepareClientBriefContact({
        slug,
        record: contactRecords.get(slug),
        state: relatedContactStates.get(slug),
        activity: activityByEntity.get(clientBriefActivityKey("contact", slug)) ?? null,
        ownerNames,
        includeContactInfo,
      }),
    )
    .filter((contact): contact is PrepareClientBriefContact => contact !== null);

  const contactBySlug = new Map<string, PrepareClientBriefContact>();
  for (const contact of relatedContacts) contactBySlug.set(contact.slug, contact);

  let assignedCandidatePagesChecked = 0;
  let assignmentsTruncated = false;
  const briefJobs: PrepareClientBriefJob[] = [];
  for (const job of jobs) {
    let pipeline: PrepareClientBriefJobPipelineSummary | null = null;
    if (includePipelineSummary) {
      try {
        const assigned = await executeGetJobAssignedCandidates(client, job.slug, {
          page: 1,
          limit: maxAssignedCandidates,
        });
        assignedCandidatePagesChecked += 1;
        assignmentsTruncated = assignmentsTruncated || assigned.has_more;
        pipeline = buildPrepareClientBriefPipelineSummary(
          assigned.assigned_candidates,
          assigned.has_more,
          feedbackWaitDays,
        );
      } catch (error) {
        errors.push(buildPrepareClientBriefError("assignments", error, job.slug));
      }
    }

    const activity = activityByEntity.get(clientBriefActivityKey("job", job.slug)) ?? null;
    briefJobs.push(
      buildPrepareClientBriefJob({
        job,
        pipeline,
        activity,
        contactBySlug,
        ownerNames,
        feedbackWaitDays,
      }),
    );
  }

  let pitchedCandidates: PrepareClientBriefResult["pitched_candidates"] = null;
  if (args.contact_slug) {
    try {
      const pitched = await executeGetPitchedRecords(client, "contact", args.contact_slug);
      pitchedCandidates = {
        returned_count: pitched.returned_count,
        records: pitched.records,
      };
    } catch (error) {
      errors.push(buildPrepareClientBriefError("pitch", error, args.contact_slug));
    }
  }

  const activity = Array.from(activityByEntity.values());
  const primaryContact = args.contact_slug ? contactBySlug.get(args.contact_slug) ?? null : null;
  const clientCompany = companyDetail
    ? buildPrepareClientBriefCompany(companyDetail, ownerNames)
    : resolvedCompanySlug
      ? {
          slug: resolvedCompanySlug,
          name: null,
          owner: null,
          owner_name: null,
          city: null,
          state: null,
          country: null,
          website: null,
          marked_as_off_limit: null,
          view_url: clientBriefEntityViewUrl("company", resolvedCompanySlug),
        }
      : null;

  const accountHealth = buildPrepareClientBriefAccountHealth({
    jobs: briefJobs,
    activity,
    lookbackDays,
  });
  const suggested = buildPrepareClientBriefSuggestedTalkingPoints({
    jobs: briefJobs,
    primaryContact,
    company: clientCompany,
    accountHealth,
    pitchedCandidates,
  });
  const followups = buildPrepareClientBriefRecommendedFollowups({
    jobs: briefJobs,
    companySlug: resolvedCompanySlug,
    contactSlug: args.contact_slug,
  });

  return {
    brief_type: "client",
    scope: {
      input_contact_slug: args.contact_slug ?? null,
      input_company_slug: args.company_slug ?? null,
      resolved_company_slug: resolvedCompanySlug ?? null,
      lookback_days: lookbackDays,
      generated_at: new Date().toISOString(),
    },
    client: {
      company: clientCompany,
      primary_contact: primaryContact,
      related_contacts: relatedContacts,
    },
    account_health: accountHealth,
    jobs: briefJobs,
    pitched_candidates: pitchedCandidates,
    activity,
    suggested_talking_points: suggested,
    recommended_followups: followups,
    coverage: {
      jobs_checked: briefJobs.length,
      jobs_truncated: jobsTruncated,
      related_contacts_checked: relatedContacts.length,
      activity_entities_checked: activity.length,
      assigned_candidate_pages_checked: assignedCandidatePagesChecked,
      assignments_truncated: assignmentsTruncated,
      included_contact_info: includeContactInfo,
    },
    errors,
  };
}

async function fetchPrepareClientBriefJobs(
  client: RecruitCrmClient,
  input: {
    contactSlug?: string;
    companySlug?: string | null;
    maxOpenJobs: number;
    errors: PrepareClientBriefError[];
  },
): Promise<{ jobs: PrepareClientBriefResolvedJobSummary[]; truncated: boolean }> {
  const jobsBySlug = new Map<string, PrepareClientBriefResolvedJobSummary>();
  let truncated = false;

  const runSearch = async (filters: SearchJobsInput): Promise<void> => {
    try {
      const result = await executeSearchJobs(client, {
        page: 1,
        limit: input.maxOpenJobs,
        job_status: PREPARE_CLIENT_BRIEF_OPEN_JOB_STATUS,
        sort_by: "updatedon",
        sort_order: "desc",
        ...filters,
      });
      truncated = truncated || result.has_more;
      for (const job of result.jobs) {
        if (job.slug && !jobsBySlug.has(job.slug)) {
          jobsBySlug.set(job.slug, job as PrepareClientBriefResolvedJobSummary);
        }
      }
    } catch (error) {
      input.errors.push(buildPrepareClientBriefError("jobs", error, filters.company_slug ?? filters.contact_slug ?? filters.secondary_contact_slug));
    }
  };

  if (input.companySlug) {
    await runSearch({ company_slug: input.companySlug });
  } else if (input.contactSlug) {
    await runSearch({ contact_slug: input.contactSlug });
    await runSearch({ secondary_contact_slug: input.contactSlug });
  }

  return {
    jobs: Array.from(jobsBySlug.values()).slice(0, input.maxOpenJobs),
    truncated: truncated || jobsBySlug.size > input.maxOpenJobs,
  };
}

async function fetchPrepareClientBriefContactDetails(
  client: RecruitCrmClient,
  slugs: string[],
  contactRecords: Map<string, PrepareClientBriefContactRecord>,
  errors: PrepareClientBriefError[],
): Promise<void> {
  const toFetch = slugs.filter((slug) => {
    const existing = contactRecords.get(slug);
    return !existing || existing.owner === undefined;
  });
  const settled = await Promise.allSettled(toFetch.map((slug) => client.getContactDetails(slug)));
  settled.forEach((outcome, idx) => {
    const slug = toFetch[idx];
    if (outcome.status === "fulfilled") {
      contactRecords.set(slug, outcome.value as PrepareClientBriefContactRecord);
    } else {
      errors.push(buildPrepareClientBriefError("contacts", outcome.reason, slug));
    }
  });
}

function addPrepareClientBriefContactRelation(
  map: Map<string, PrepareClientBriefRelatedContactState>,
  slug: string | null | undefined,
  relationship: string,
  jobSlug?: string | null,
): void {
  if (!slug) return;
  let state = map.get(slug);
  if (!state) {
    state = { relationships: new Set<string>(), jobSlugs: new Set<string>() };
    map.set(slug, state);
  }
  state.relationships.add(relationship);
  if (jobSlug) state.jobSlugs.add(jobSlug);
}

function orderPrepareClientBriefContactSlugs(
  states: Map<string, PrepareClientBriefRelatedContactState>,
  inputContactSlug: string | undefined,
  maxRelatedContacts: number,
): string[] {
  const slugs = Array.from(states.keys());
  slugs.sort((a, b) => {
    if (a === inputContactSlug) return -1;
    if (b === inputContactSlug) return 1;
    const aState = states.get(a);
    const bState = states.get(b);
    const aJob = aState?.jobSlugs.size ?? 0;
    const bJob = bState?.jobSlugs.size ?? 0;
    if (aJob !== bJob) return bJob - aJob;
    return a.localeCompare(b);
  });
  return slugs.slice(0, maxRelatedContacts);
}

function buildPrepareClientBriefCompany(
  company: CompanyDetail,
  ownerNames: Map<number, string>,
): PrepareClientBriefCompany {
  const raw = company as Record<string, unknown>;
  const slug = clientBriefString(raw.slug);
  const owner = toAnalyzeFiniteNumber(raw.owner);
  return {
    slug,
    name: clientBriefString(raw.company_name),
    owner,
    owner_name: owner !== null ? ownerNames.get(owner) ?? null : null,
    city: clientBriefString(raw.city),
    state: clientBriefString(raw.state),
    country: clientBriefString(raw.country),
    website: clientBriefString(raw.website),
    marked_as_off_limit: clientBriefMarkedAsOffLimit(raw),
    view_url: clientBriefString(raw.resource_url) ?? (slug ? clientBriefEntityViewUrl("company", slug) : null),
  };
}

function buildPrepareClientBriefContact(input: {
  slug: string;
  record: PrepareClientBriefContactRecord | undefined;
  state: PrepareClientBriefRelatedContactState | undefined;
  activity: PrepareClientBriefActivitySummary | null;
  ownerNames: Map<number, string>;
  includeContactInfo: boolean;
}): PrepareClientBriefContact | null {
  const record = input.record ?? { slug: input.slug };
  const owner = toAnalyzeFiniteNumber(record.owner);
  const firstName = clientBriefString(record.first_name);
  const lastName = clientBriefString(record.last_name);
  const out: PrepareClientBriefContact = {
    slug: input.slug,
    name: buildAnalyzeName(firstName, lastName) ?? clientBriefString(record.name),
    designation: clientBriefString(record.designation),
    company_slug: clientBriefString(record.company_slug),
    owner,
    owner_name: owner !== null ? input.ownerNames.get(owner) ?? null : null,
    view_url: clientBriefString(record.resource_url) ?? clientBriefEntityViewUrl("contact", input.slug),
    relationships: Array.from(input.state?.relationships ?? []).sort(),
    job_slugs: Array.from(input.state?.jobSlugs ?? []).sort(),
    last_activity_at: input.activity?.last_touch_at ?? clientBriefString(record.last_communication),
  };

  if (input.includeContactInfo) {
    out.email = clientBriefString(record.email);
    out.contact_number = clientBriefString(record.contact_number);
    out.linkedin = clientBriefString(record.linkedin);
  }

  return out;
}

function buildPrepareClientBriefJob(input: {
  job: PrepareClientBriefResolvedJobSummary;
  pipeline: PrepareClientBriefJobPipelineSummary | null;
  activity: PrepareClientBriefActivitySummary | null;
  contactBySlug: Map<string, PrepareClientBriefContact>;
  ownerNames: Map<number, string>;
  feedbackWaitDays: number;
}): PrepareClientBriefJob {
  const job = input.job;
  const owner = job.owner;
  const primary = job.contact_slug ? input.contactBySlug.get(job.contact_slug) ?? null : null;
  const secondary = job.secondary_contact_slugs
    .map((slug) => input.contactBySlug.get(slug) ?? null)
    .filter((contact): contact is PrepareClientBriefContact => contact !== null);

  const risks: string[] = [];
  const talkingPoints: string[] = [];
  const waiting = input.pipeline?.candidates_waiting_on_client ?? [];
  if (waiting.length > 0) {
    risks.push(`${waiting.length} candidate(s) waiting on client-facing feedback.`);
    talkingPoints.push(
      `Ask for feedback on ${waiting.slice(0, 3).map((c) => c.name ?? c.candidate_slug).join(", ")}.`,
    );
  }
  if (input.pipeline && input.pipeline.active_count === 0) {
    risks.push("No active candidates in this job pipeline.");
    talkingPoints.push("Confirm whether this role is still active and whether requirements should be recalibrated.");
  }
  if (secondary.length > 0) {
    talkingPoints.push("Confirm which primary or secondary contact owns candidate feedback for this job.");
  }
  if (input.activity && input.activity.last_touch_at === null) {
    risks.push("No recent notes, meetings, or calls found in the lookback window.");
  }

  return {
    slug: job.slug,
    name: job.name,
    status_label: job.job_status?.label ?? null,
    days_open: job.created_on ? analyzeDaysBetween(job.created_on) : null,
    number_of_openings: job.number_of_openings,
    owner,
    owner_name: owner !== null ? input.ownerNames.get(owner) ?? null : null,
    company_slug: job.company_slug,
    contact_slug: job.contact_slug,
    secondary_contact_slugs: job.secondary_contact_slugs,
    hiring_pipeline_id: job.hiring_pipeline_id,
    view_url: clientBriefEntityViewUrl("job", job.slug),
    primary_contact: primary ? stripPrepareClientBriefContactForJob(primary) : null,
    secondary_contacts: secondary.map(stripPrepareClientBriefContactForJob),
    pipeline_summary: input.pipeline,
    activity: input.activity,
    risks,
    talking_points: talkingPoints,
  };
}

function stripPrepareClientBriefContactForJob(contact: PrepareClientBriefContact): PrepareClientBriefJobContact {
  const out: PrepareClientBriefJobContact = {
    slug: contact.slug,
    name: contact.name,
    designation: contact.designation,
    company_slug: contact.company_slug,
    owner: contact.owner,
    owner_name: contact.owner_name,
    view_url: contact.view_url,
  };
  if (contact.email !== undefined) out.email = contact.email;
  if (contact.contact_number !== undefined) out.contact_number = contact.contact_number;
  if (contact.linkedin !== undefined) out.linkedin = contact.linkedin;
  return out;
}

function buildPrepareClientBriefPipelineSummary(
  assignedCandidates: AssignedCandidateSummary[],
  hasMore: boolean,
  feedbackWaitDays: number,
): PrepareClientBriefJobPipelineSummary {
  const terminalLabels = ANALYZE_JOB_PIPELINE_DEFAULTS.terminalStageLabels.map((label) => label.toLowerCase());
  const stageMap = new Map<
    string,
    { stage_id: number | null; label: string; candidates: PrepareClientBriefWaitingCandidate[]; days: number[] }
  >();
  let terminalCount = 0;

  for (const candidate of assignedCandidates) {
    if (isAnalyzeTerminal(candidate.status_label, terminalLabels)) {
      terminalCount += 1;
      continue;
    }

    const label = candidate.status_label ?? "Unknown";
    const key = `${candidate.status_id ?? "null"}::${label}`;
    let stage = stageMap.get(key);
    if (!stage) {
      stage = { stage_id: candidate.status_id, label, candidates: [], days: [] };
      stageMap.set(key, stage);
    }
    const days = candidate.stage_date ? analyzeDaysBetween(candidate.stage_date) : null;
    if (days !== null) stage.days.push(days);
    stage.candidates.push({
      candidate_slug: candidate.candidate_slug,
      name: buildAnalyzeName(candidate.first_name, candidate.last_name),
      current_stage: candidate.status_label,
      days_in_current_stage: days,
      last_activity_at: candidate.updated_on,
    });
  }

  const stages = Array.from(stageMap.values());
  const stageCounts = stages
    .map((stage) => ({
      stage_id: stage.stage_id,
      label: stage.label,
      count: stage.candidates.length,
      median_days_in_stage: stage.days.length > 0 ? analyzeMedian(stage.days) : null,
    }))
    .sort((a, b) => b.count - a.count);

  const bottleneck = stageCounts[0]
    ? {
        stage_label: stageCounts[0].label,
        count: stageCounts[0].count,
        median_days_in_stage: stageCounts[0].median_days_in_stage,
        reason: `Largest active stage (${stageCounts[0].count} candidates).`,
      }
    : null;

  const waiting = stages
    .filter((stage) => isPrepareClientBriefClientFacingStage(stage.label))
    .flatMap((stage) => stage.candidates)
    .filter(
      (candidate) =>
        candidate.days_in_current_stage !== null && candidate.days_in_current_stage >= feedbackWaitDays,
    )
    .sort((a, b) => (b.days_in_current_stage ?? 0) - (a.days_in_current_stage ?? 0));

  const activeCount = stages.reduce((sum, stage) => sum + stage.candidates.length, 0);
  return {
    assigned_count: assignedCandidates.length,
    active_count: activeCount,
    terminal_count: terminalCount,
    stage_counts: stageCounts,
    bottleneck,
    candidates_waiting_on_client: waiting,
    has_more_assigned_candidates: hasMore,
  };
}

async function fetchPrepareClientBriefActivity(
  client: RecruitCrmClient,
  entity: { entity_type: "company" | "contact" | "job"; entity_slug: string },
  lookbackDays: number,
): Promise<PrepareClientBriefActivitySummary> {
  const since = analyzeIsoDaysAgo(lookbackDays);
  const notesPromise = executeSearchNotes(client, {
    page: 1,
    related_to: entity.entity_slug,
    related_to_type: entity.entity_type,
    updated_from: since,
  });
  const meetingsPromise = executeSearchMeetings(client, {
    page: 1,
    related_to: entity.entity_slug,
    related_to_type: entity.entity_type,
    updated_from: since,
  });
  const tasksPromise = executeSearchTasks(client, {
    page: 1,
    related_to: entity.entity_slug,
    related_to_type: entity.entity_type,
    updated_from: since,
  });
  const callLogsPromise =
    entity.entity_type === "job"
      ? Promise.resolve({ page: 1, returned_count: 0, has_more: false, call_logs: [] } satisfies SearchCallLogsResult)
      : executeSearchCallLogs(client, {
          page: 1,
          related_to: entity.entity_slug,
          related_to_type: entity.entity_type,
          updated_from: since,
        });

  const [notes, meetings, tasks, callLogs] = await Promise.all([
    notesPromise,
    meetingsPromise,
    tasksPromise,
    callLogsPromise,
  ]);

  const lastNoteAt = pickLatestString(notes.notes.flatMap((note) => [note.updated_on, note.created_on]));
  const lastMeetingAt = pickLatestString(
    meetings.meetings.flatMap((meeting) => [meeting.start_date, meeting.updated_on, meeting.created_on]),
  );
  const lastCallAt = pickLatestString(
    callLogs.call_logs.flatMap((call) => [call.call_started_on, call.updated_on, call.created_on]),
  );
  const nextTaskDueAt = pickEarliestFutureString(tasks.tasks.map((task) => task.start_date));

  return {
    entity_type: entity.entity_type,
    entity_slug: entity.entity_slug,
    notes_count: notes.returned_count,
    meetings_count: meetings.returned_count,
    tasks_count: tasks.returned_count,
    call_logs_count: callLogs.returned_count,
    last_note_at: lastNoteAt,
    last_meeting_at: lastMeetingAt,
    last_call_at: lastCallAt,
    next_task_due_at: nextTaskDueAt,
    last_touch_at: pickLatestString([lastNoteAt, lastMeetingAt, lastCallAt]),
  };
}

function buildPrepareClientBriefAccountHealth(input: {
  jobs: PrepareClientBriefJob[];
  activity: PrepareClientBriefActivitySummary[];
  lookbackDays: number;
}): PrepareClientBriefResult["account_health"] {
  const activeCandidates = input.jobs.reduce((sum, job) => sum + (job.pipeline_summary?.active_count ?? 0), 0);
  const waitingCandidates = input.jobs.reduce(
    (sum, job) => sum + (job.pipeline_summary?.candidates_waiting_on_client.length ?? 0),
    0,
  );
  const noActiveJobs = input.jobs.filter((job) => job.pipeline_summary?.active_count === 0).length;
  const lastTouchAt = pickLatestString(input.activity.map((activity) => activity.last_touch_at));
  const nextTaskDueAt = pickEarliestFutureString(input.activity.map((activity) => activity.next_task_due_at));

  const reasons: string[] = [];
  if (waitingCandidates > 0) reasons.push(`${waitingCandidates} candidate(s) waiting on client-facing feedback.`);
  if (noActiveJobs > 0) reasons.push(`${noActiveJobs} open job(s) have no active candidates in the checked window.`);
  if (input.jobs.length > 0 && lastTouchAt === null) {
    reasons.push(`No recent notes, meetings, or calls found in the last ${input.lookbackDays} days.`);
  }

  const relationshipRisk =
    waitingCandidates >= 3 || (input.jobs.length > 0 && lastTouchAt === null)
      ? "high"
      : waitingCandidates > 0 || noActiveJobs > 0
        ? "medium"
        : "low";

  return {
    open_jobs_count: input.jobs.length,
    jobs_returned: input.jobs.length,
    active_candidates_count: activeCandidates,
    candidates_waiting_on_client_count: waitingCandidates,
    last_touch_at: lastTouchAt,
    next_task_due_at: nextTaskDueAt,
    relationship_risk: relationshipRisk,
    relationship_risk_reasons: reasons,
  };
}

function buildPrepareClientBriefSuggestedTalkingPoints(input: {
  jobs: PrepareClientBriefJob[];
  primaryContact: PrepareClientBriefContact | null;
  company: PrepareClientBriefCompany | null;
  accountHealth: PrepareClientBriefResult["account_health"];
  pitchedCandidates: PrepareClientBriefResult["pitched_candidates"];
}): string[] {
  const out: string[] = [];
  const waitingJobs = input.jobs.filter(
    (job) => (job.pipeline_summary?.candidates_waiting_on_client.length ?? 0) > 0,
  );
  if (waitingJobs.length > 0) {
    const first = waitingJobs[0];
    const names = first.pipeline_summary?.candidates_waiting_on_client
      .slice(0, 3)
      .map((candidate) => candidate.name ?? candidate.candidate_slug)
      .join(", ");
    out.push(`Ask for feedback on ${names} for ${first.name ?? first.slug}.`);
  }

  const thinJobs = input.jobs.filter((job) => job.pipeline_summary?.active_count === 0);
  if (thinJobs.length > 0) {
    out.push(`Confirm whether ${thinJobs[0].name ?? thinJobs[0].slug} is still active or needs recalibration.`);
  }

  if (input.jobs.some((job) => job.secondary_contacts.length > 0)) {
    out.push("Confirm which primary or secondary client contact owns feedback and next steps for each open job.");
  }

  if (input.accountHealth.last_touch_at === null && input.jobs.length > 0) {
    out.push("Use the call to reset priorities because no recent client touchpoint was found in the lookback window.");
  }

  if (input.pitchedCandidates && input.pitchedCandidates.returned_count > 0) {
    out.push(`Review ${input.pitchedCandidates.returned_count} pitched candidate(s) tied to this contact.`);
  }

  if (out.length === 0) {
    const label = input.primaryContact?.name ?? input.company?.name ?? "the client";
    out.push(`Confirm priorities, open-role urgency, and expected feedback timing with ${label}.`);
  }

  return out;
}

function buildPrepareClientBriefRecommendedFollowups(input: {
  jobs: PrepareClientBriefJob[];
  companySlug: string | null | undefined;
  contactSlug: string | null | undefined;
}): PrepareClientBriefResult["recommended_followups"] {
  const out: PrepareClientBriefResult["recommended_followups"] = [];
  const waitingJob = input.jobs.find((job) => (job.pipeline_summary?.candidates_waiting_on_client.length ?? 0) > 0);
  if (waitingJob) {
    out.push({
      action: "create_task",
      reason: "Chase client feedback for candidates waiting in client-facing stages.",
      related_to_type: "job",
      related_to: waitingJob.slug,
    });
  }

  const thinJob = input.jobs.find((job) => job.pipeline_summary?.active_count === 0);
  if (thinJob) {
    out.push({
      action: "review_pipeline",
      reason: "Review sourcing plan because this open job has no active candidates in the checked window.",
      related_to_type: "job",
      related_to: thinJob.slug,
    });
  }

  const noteTarget = input.companySlug ?? input.contactSlug;
  if (noteTarget) {
    out.push({
      action: "create_note",
      reason: "Log the client conversation, changed priorities, and feedback commitments after the call.",
      related_to_type: input.companySlug ? "company" : "contact",
      related_to: noteTarget,
    });
  }

  return out;
}

function isPrepareClientBriefClientFacingStage(label: string | null): boolean {
  if (!label) return false;
  const normalized = label.trim().toLowerCase();
  return PREPARE_CLIENT_BRIEF_CLIENT_FACING_STAGE_MARKERS.some((marker) => normalized.includes(marker));
}

function buildPrepareClientBriefError(
  source: PrepareClientBriefError["source"],
  reason: unknown,
  slug?: string | null,
): PrepareClientBriefError {
  return {
    source,
    slug: slug ?? undefined,
    message: reason instanceof Error ? reason.message : String(reason),
    status_code: reason instanceof RecruitCrmApiError ? reason.statusCode ?? null : null,
  };
}

function clientBriefActivityKey(entityType: string, entitySlug: string): string {
  return `${entityType}:${entitySlug}`;
}

function clientBriefString(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function clientBriefStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(clientBriefString).filter((item): item is string => item !== null);
  }
  const single = clientBriefString(value);
  return single ? [single] : [];
}

function clientBriefMarkedAsOffLimit(raw: Record<string, unknown>): boolean | null {
  if (!("off_limit_status_id" in raw) && !("status_label" in raw)) return null;
  const statusId = clientBriefString(raw.off_limit_status_id);
  const statusLabel = clientBriefString(raw.status_label);
  return statusId !== null || statusLabel !== null;
}

function clientBriefEntityViewUrl(entityType: string, slug: string): string {
  return `${PREPARE_CLIENT_BRIEF_VIEW_URL_PREFIX}${entityType}/${slug}`;
}

function pickLatestString(values: Array<string | null | undefined>): string | null {
  let best: string | null = null;
  let bestMs = -Infinity;
  for (const value of values) {
    if (!value) continue;
    const ms = Date.parse(value);
    if (Number.isNaN(ms)) continue;
    if (ms > bestMs) {
      bestMs = ms;
      best = value;
    }
  }
  return best;
}

function pickEarliestFutureString(values: Array<string | null | undefined>): string | null {
  const now = Date.now();
  let best: string | null = null;
  let bestMs = Infinity;
  for (const value of values) {
    if (!value) continue;
    const ms = Date.parse(value);
    if (Number.isNaN(ms) || ms < now) continue;
    if (ms < bestMs) {
      bestMs = ms;
      best = value;
    }
  }
  return best;
}

export async function executeAssignCandidateToJob(
  client: RecruitCrmClient,
  args: AssignCandidateToJobInput,
): Promise<AssignCandidateToJobResult> {
  const result = await client.assignCandidateToJob({
    candidate_slug: args.candidate_slug,
    job_slug: args.job_slug,
    updated_by: args.updated_by,
  });

  return mapAssignCandidateToJobResult(result);
}

export async function executeUpdateCandidateHiringStage(
  client: RecruitCrmClient,
  args: UpdateCandidateHiringStageInput,
): Promise<UpdateCandidateHiringStageResult> {
  const result = await client.updateCandidateHiringStage({
    candidate_slug: args.candidate_slug,
    job_slug: args.job_slug,
    status_id: args.status_id,
    remark: args.remark,
    stage_date: args.stage_date,
    updated_by: args.updated_by,
    create_placement: args.create_placement ?? false,
  });

  return mapUpdateCandidateHiringStageResult(result);
}

export async function executeListJobStatuses(
  client: RecruitCrmClient,
): Promise<JobStatusesResult> {
  const result = await client.listJobStatuses();

  return mapJobStatusesResult(result);
}

function validateJobMutationInput(args: CreateJobInput | UpdateJobInput): void {
  if (args.secondary_contact_slugs && args.secondary_contact_slugs.length > 0 && !args.company_slug) {
    throw new RecruitCrmApiError("company_slug is required when secondary_contact_slugs are provided.");
  }

  if (
    args.minimum_experience !== undefined &&
    args.maximum_experience !== undefined &&
    args.minimum_experience > args.maximum_experience
  ) {
    throw new RecruitCrmApiError("minimum_experience cannot be greater than maximum_experience.");
  }

  if (
    args.min_annual_salary !== undefined &&
    args.max_annual_salary !== undefined &&
    args.min_annual_salary > args.max_annual_salary
  ) {
    throw new RecruitCrmApiError("min_annual_salary cannot be greater than max_annual_salary.");
  }
}

function validateUpdateJobHasFields(args: UpdateJobInput): void {
  const ignoredFields = new Set(["job_slug", "updated_by"]);
  const hasUpdateField = Object.entries(args).some(
    ([key, value]) => !ignoredFields.has(key) && value !== undefined,
  );

  if (!hasUpdateField) {
    throw new RecruitCrmApiError("update_job requires at least one field to update in addition to job_slug and updated_by.");
  }
}

async function assertNoExistingCandidateContactPitch(
  client: RecruitCrmClient,
  args: PitchCandidateToContactInput,
): Promise<void> {
  let response;
  try {
    response = await client.getPitchedRecords("candidate", args.candidate_slug);
  } catch (error) {
    throw new RecruitCrmApiError(
      "Unable to complete duplicate check for pitch_candidate_to_contact. Try get_pitched_records manually before pitching, or call pitch_candidate_to_contact with allow_duplicate=true to create another pitch row.",
      error instanceof RecruitCrmApiError ? error.statusCode : undefined,
      error,
    );
  }

  const existing = (response.data?.records ?? []).find((record) => {
    if (record.contact_slug == null) return false;
    return String(record.contact_slug) === args.contact_slug;
  });

  if (!existing) {
    return;
  }

  const labels = [
    `candidate_slug: ${args.candidate_slug}`,
    `contact_slug: ${args.contact_slug}`,
    existing.status_id != null ? `status_id: ${existing.status_id}` : null,
    existing.status_label != null
      ? `status_label: ${existing.status_label}`
      : existing.candidate_status != null
        ? `status_label: ${existing.candidate_status}`
        : null,
    existing.stage_date != null ? `stage_date: ${existing.stage_date}` : null,
    existing.created_on != null ? `created_on: ${existing.created_on}` : null,
    existing.updated_on != null ? `updated_on: ${existing.updated_on}` : null,
  ].filter((label): label is string => label !== null);

  throw new RecruitCrmApiError(
    `Potential duplicate pitch found before pitch_candidate_to_contact: ${labels.join(", ")}. To create another pitch row for the same candidate/contact pair, call pitch_candidate_to_contact with allow_duplicate=true.`,
  );
}

type CreateCompanyDuplicateSearchField = "company_name";

type CreateCompanyDuplicateMatch = {
  slug: string;
  id: number | string | null;
  company_name: string | null;
  matched_on: CreateCompanyDuplicateSearchField[];
};

async function assertNoCreateCompanyDuplicates(
  client: RecruitCrmClient,
  args: CreateCompanyInput,
): Promise<void> {
  const duplicateFields: Array<{ field: CreateCompanyDuplicateSearchField; value: string | undefined }> = [
    { field: "company_name", value: args.company_name },
  ].filter((item): item is { field: CreateCompanyDuplicateSearchField; value: string } => item.value !== undefined);

  if (duplicateFields.length === 0) {
    return;
  }

  const matches = new Map<string, CreateCompanyDuplicateMatch>();

  for (const { field, value } of duplicateFields) {
    let response;
    const filters: SearchCompaniesInput = {
      page: 1,
      exact_search: true,
      sort_by: "updatedon",
      sort_order: "desc",
    };
    filters[field] = value;

    try {
      response = await client.searchCompanies(filters);
    } catch (error) {
      throw new RecruitCrmApiError(
        `Unable to complete duplicate check for create_company using ${field}. Try search_companies manually before creating the company.`,
        error instanceof RecruitCrmApiError ? error.statusCode : undefined,
        error,
      );
    }

    for (const company of response.data) {
      const slug = company.slug != null ? String(company.slug) : null;
      if (!slug) continue;

      const existing = matches.get(slug);
      if (existing) {
        if (!existing.matched_on.includes(field)) {
          existing.matched_on.push(field);
        }
        continue;
      }

      matches.set(slug, {
        slug,
        id: company.id ?? null,
        company_name: normalizeDuplicateCandidateName(company.company_name),
        matched_on: [field],
      });
    }
  }

  if (matches.size === 0) {
    return;
  }

  const examples = Array.from(matches.values())
    .slice(0, 5)
    .map((match) => {
      const idLabel = match.id != null ? String(match.id) : "unavailable";
      const label = match.company_name
        ? `company_slug: ${match.slug} (company_id: ${idLabel}, ${match.company_name})`
        : `company_slug: ${match.slug} (company_id: ${idLabel})`;
      return `${label} matched on ${match.matched_on.join(", ")}`;
    })
    .join("; ");

  throw new RecruitCrmApiError(
    `Potential duplicate company found before create_company: ${examples}. To create a confirmed duplicate, call create_company with allow_duplicate=true. To update the existing record, call update_company with company_slug set to the chosen company slug.`,
  );
}

type CreateContactDuplicateSearchField = "email" | "contact_number" | "linkedin";

type CreateContactDuplicateMatch = {
  slug: string;
  id: number | string | null;
  first_name: string | null;
  last_name: string | null;
  matched_on: CreateContactDuplicateSearchField[];
};

async function assertNoCreateContactDuplicates(
  client: RecruitCrmClient,
  args: CreateContactInput,
): Promise<void> {
  const duplicateFields: Array<{ field: CreateContactDuplicateSearchField; value: string | undefined }> = [
    { field: "email", value: args.email },
    { field: "contact_number", value: args.contact_number },
    { field: "linkedin", value: args.linkedin },
  ].filter((item): item is { field: CreateContactDuplicateSearchField; value: string } => item.value !== undefined);

  if (duplicateFields.length === 0) {
    return;
  }

  const matches = new Map<string, CreateContactDuplicateMatch>();

  for (const { field, value } of duplicateFields) {
    let response;
    const filters: SearchContactsInput = {
      page: 1,
      exact_search: true,
      sort_by: "updatedon",
      sort_order: "desc",
    };
    filters[field] = value;

    try {
      response = await client.searchContacts(filters);
    } catch (error) {
      throw new RecruitCrmApiError(
        `Unable to complete duplicate check for create_contact using ${field}. Try search_contacts manually before creating the contact.`,
        error instanceof RecruitCrmApiError ? error.statusCode : undefined,
        error,
      );
    }

    for (const contact of response.data) {
      const slug = contact.slug != null ? String(contact.slug) : null;
      if (!slug) continue;

      const existing = matches.get(slug);
      if (existing) {
        if (!existing.matched_on.includes(field)) {
          existing.matched_on.push(field);
        }
        continue;
      }

      matches.set(slug, {
        slug,
        id: contact.id ?? null,
        first_name: normalizeDuplicateCandidateName(contact.first_name),
        last_name: normalizeDuplicateCandidateName(contact.last_name),
        matched_on: [field],
      });
    }
  }

  if (matches.size === 0) {
    return;
  }

  const examples = Array.from(matches.values())
    .slice(0, 5)
    .map((match) => {
      const name = [match.first_name, match.last_name].filter(Boolean).join(" ");
      const idLabel = match.id != null ? String(match.id) : "unavailable";
      const label = name
        ? `contact_slug: ${match.slug} (contact_id: ${idLabel}, ${name})`
        : `contact_slug: ${match.slug} (contact_id: ${idLabel})`;
      return `${label} matched on ${match.matched_on.join(", ")}`;
    })
    .join("; ");

  throw new RecruitCrmApiError(
    `Potential duplicate contact found before create_contact: ${examples}. To create a confirmed duplicate, call create_contact with allow_duplicate=true. To update the existing record, call update_contact with contact_slug set to the chosen contact slug.`,
  );
}

export async function executeCreateContact(
  client: RecruitCrmClient,
  args: CreateContactInput,
): Promise<CreateContactResult> {
  if (!args.allow_duplicate) {
    await assertNoCreateContactDuplicates(client, args);
  }
  const contact = await client.createContact(args);
  return mapCreatedContactResult(contact, "created");
}

export async function executeUpdateContact(
  client: RecruitCrmClient,
  args: UpdateContactInput,
): Promise<CreateContactResult> {
  const contact = await client.updateContact(args.contact_slug, args);
  return mapCreatedContactResult(contact, "updated");
}

export async function executeListContactStages(
  client: RecruitCrmClient,
): Promise<ListContactStagesResult> {
  const result = await client.listContactStages();
  return mapListContactStagesResult(result);
}

export async function executeListOffLimitStatuses(
  client: RecruitCrmClient,
): Promise<ListOffLimitStatusesResult> {
  const result = await client.listOffLimitStatuses();
  return mapListOffLimitStatusesResult(result);
}

export async function executeMarkCandidateOffLimit(
  client: RecruitCrmClient,
  args: MarkCandidateOffLimitInput,
): Promise<MarkCandidateOffLimitResult> {
  const result = await client.markCandidateOffLimit(args);
  return mapMarkCandidateOffLimitResult(result);
}

export async function executeMarkContactOffLimit(
  client: RecruitCrmClient,
  args: MarkContactOffLimitInput,
): Promise<MarkContactOffLimitResult> {
  const result = await client.markContactOffLimit(args);
  return mapMarkContactOffLimitResult(result);
}

export async function executeMarkCompanyOffLimit(
  client: RecruitCrmClient,
  args: MarkCompanyOffLimitInput,
): Promise<MarkCompanyOffLimitResult> {
  const result = await client.markCompanyOffLimit(args);
  return mapMarkCompanyOffLimitResult(result);
}

export async function executeMarkRecordsAvailable(
  client: RecruitCrmClient,
  args: MarkRecordsAvailableInput,
): Promise<MarkRecordsAvailableResult> {
  validateMarkRecordsAvailableInput(args);

  const result = await client.markRecordsAvailable(args);
  return mapMarkRecordsAvailableResult(args.record_type, result);
}

export async function executeGetCandidateJobAssignmentHiringStageHistory(
  client: RecruitCrmClient,
  candidateSlug: string,
): Promise<CandidateJobAssignmentHiringStageHistoryResult> {
  const result = await client.getCandidateJobAssignmentHiringStageHistory(candidateSlug);

  return mapCandidateJobAssignmentHiringStageHistoryResult(candidateSlug, result);
}

export async function executeListCustomFields(
  client: RecruitCrmClient,
  entityType: ListCustomFieldsInput["entity_type"],
  includeNonSearchable = false,
): Promise<CustomFieldListResult> {
  const allFields =
    entityType === "candidates"
      ? await client.getCandidateCustomFields()
      : (await client.getCustomFields()).filter((f) => normalizeEntityType(f.entity_type) === entityType);
  const filteredFields = filterCandidateCustomFields(allFields, includeNonSearchable);

  return {
    returned_count: filteredFields.length,
    fields: filteredFields.map(mapCandidateCustomFieldSummary),
  };
}

export async function executeGetCustomFieldDetails(
  client: RecruitCrmClient,
  fieldId: number,
  entityType: GetCustomFieldDetailsInput["entity_type"],
): Promise<CustomFieldDetail> {
  const fields =
    entityType === "candidates"
      ? await client.getCandidateCustomFields()
      : (await client.getCustomFields()).filter(
          (item) => normalizeEntityType(item.entity_type) === entityType,
        );
  const field = fields.find((item) => item.field_id === fieldId);

  if (!field) {
    throw new RecruitCrmApiError(`Unknown custom field field_id: ${fieldId} for entity type "${entityType}".`);
  }

  return mapCandidateCustomFieldDetail(field);
}

function normalizeEntityType(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const lower = raw.trim().toLowerCase();
  // API may return singular ("candidate") — normalize to plural form used in tool inputs
  const singularToPlural: Record<string, string> = {
    candidate: "candidates",
    contact: "contacts",
    company: "companies",
    job: "jobs",
    deal: "deals",
  };
  return singularToPlural[lower] ?? lower;
}

export async function executeGetCustomFieldDependencies(
  client: RecruitCrmClient,
  entityType: string,
  fieldId?: number,
): Promise<CustomFieldDependenciesOutput> {
  return client.getCustomFieldDependencies(entityType, fieldId);
}

type CreateCandidateDuplicateSearchField = "email" | "contact_number" | "linkedin";

type CreateCandidateDuplicateMatch = {
  slug: string;
  id: number | string | null;
  first_name: string | null;
  last_name: string | null;
  matched_on: CreateCandidateDuplicateSearchField[];
};

async function assertNoCreateCandidateDuplicates(
  client: RecruitCrmClient,
  args: CreateCandidateInput,
): Promise<void> {
  const duplicateFields: Array<{ field: CreateCandidateDuplicateSearchField; value: string | undefined }> = [
    { field: "email", value: args.email },
    { field: "contact_number", value: args.contact_number },
    { field: "linkedin", value: args.linkedin },
  ].filter((item): item is { field: CreateCandidateDuplicateSearchField; value: string } => item.value !== undefined);

  if (duplicateFields.length === 0) {
    return;
  }

  const matches = new Map<string, CreateCandidateDuplicateMatch>();

  for (const { field, value } of duplicateFields) {
    let response;
    const filters: SearchCandidatesInput = {
      page: 1,
      exact_search: true,
      sort_by: "updatedon",
      sort_order: "desc",
    };
    filters[field] = value;

    try {
      response = await client.searchCandidates(filters);
    } catch (error) {
      throw new RecruitCrmApiError(
        `Unable to complete duplicate check for create_candidate using ${field}. Try search_candidates manually before creating the candidate.`,
        error instanceof RecruitCrmApiError ? error.statusCode : undefined,
        error,
      );
    }

    for (const candidate of response.data) {
      const existing = matches.get(candidate.slug);
      if (existing) {
        if (!existing.matched_on.includes(field)) {
          existing.matched_on.push(field);
        }
        continue;
      }

      matches.set(candidate.slug, {
        slug: candidate.slug,
        id: candidate.id ?? null,
        first_name: normalizeDuplicateCandidateName(candidate.first_name),
        last_name: normalizeDuplicateCandidateName(candidate.last_name),
        matched_on: [field],
      });
    }
  }

  if (matches.size === 0) {
    return;
  }

  const examples = Array.from(matches.values())
    .slice(0, 5)
    .map((match) => {
      const name = [match.first_name, match.last_name].filter(Boolean).join(" ");
      const idLabel = match.id != null ? String(match.id) : "unavailable";
      const label = name
        ? `candidate_slug: ${match.slug} (candidate_id: ${idLabel}, ${name})`
        : `candidate_slug: ${match.slug} (candidate_id: ${idLabel})`;
      return `${label} matched on ${match.matched_on.join(", ")}`;
    })
    .join("; ");

  throw new RecruitCrmApiError(
    `Potential duplicate candidate found before create_candidate: ${examples}. To create a confirmed duplicate, call create_candidate with allow_duplicate=true. To update the existing record, call update_candidate with candidate_slug set to the chosen candidate slug.`,
  );
}

function normalizeDuplicateCandidateName(value: string | number | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = String(value).trim();
  return normalized === "" ? null : normalized;
}

function mapCreateCandidateHistoryError(
  source: CreateCandidateHistoryError["source"],
  error: unknown,
): CreateCandidateHistoryError {
  return {
    source,
    error: error instanceof Error ? error.message : String(error),
    status_code: error instanceof RecruitCrmApiError ? error.statusCode ?? null : null,
  };
}

function validateRelatedFilters(args: { related_to?: string; related_to_type?: string }): void {
  const hasRelatedTo = args.related_to !== undefined;
  const hasRelatedToType = args.related_to_type !== undefined;

  if (hasRelatedTo !== hasRelatedToType) {
    throw new RecruitCrmApiError("related_to and related_to_type must be provided together.");
  }
}

function validateActivityUpdateHasFields(
  args: object,
  ignoredFields: string[],
  toolName: string,
): void {
  const ignored = new Set(ignoredFields);
  const hasUpdateField = Object.entries(args).some(([key, value]) => !ignored.has(key) && value !== undefined);

  if (!hasUpdateField) {
    throw new RecruitCrmApiError(
      `${toolName} requires at least one field to update in addition to ${ignoredFields.join(" and ")}.`,
    );
  }
}

function validateNoteTypeId(noteTypeId: number, noteTypes: RecruitCrmNoteType[]): void {
  const match = noteTypes.some((noteType) => {
    if (noteType.id === undefined || noteType.id === null || noteType.id === "") {
      return false;
    }

    return Number(noteType.id) === noteTypeId;
  });

  if (match) {
    return;
  }

  const availableTypes = noteTypes
    .slice(0, 10)
    .map((noteType) => {
      const label = noteType.label === undefined || noteType.label === null ? "Unlabeled" : String(noteType.label);
      return `${label} (${String(noteType.id ?? "no id")})`;
    })
    .join(", ");

  throw new RecruitCrmApiError(
    `Unknown note_type_id ${noteTypeId}. Call list_note_types and use one of the returned note type IDs.${availableTypes ? ` Available examples: ${availableTypes}.` : ""}`,
  );
}

function validateTaskTypeId(taskTypeId: number, taskTypes: RecruitCrmTaskType[]): void {
  const match = taskTypes.some((taskType) => {
    if (taskType.id === undefined || taskType.id === null || taskType.id === "") {
      return false;
    }

    return Number(taskType.id) === taskTypeId;
  });

  if (match) {
    return;
  }

  const availableTypes = taskTypes
    .slice(0, 10)
    .map((taskType) => {
      const label = taskType.label === undefined || taskType.label === null ? "Unlabeled" : String(taskType.label);
      return `${label} (${String(taskType.id ?? "no id")})`;
    })
    .join(", ");

  throw new RecruitCrmApiError(
    `Unknown task_type_id ${taskTypeId}. Call list_task_types and use one of the returned task type IDs.${availableTypes ? ` Available examples: ${availableTypes}.` : ""}`,
  );
}

function validateMeetingTypeId(meetingTypeId: number, meetingTypes: RecruitCrmMeetingType[]): void {
  const match = meetingTypes.some((meetingType) => {
    if (meetingType.id === undefined || meetingType.id === null || meetingType.id === "") {
      return false;
    }

    return Number(meetingType.id) === meetingTypeId;
  });

  if (match) {
    return;
  }

  const availableTypes = meetingTypes
    .slice(0, 10)
    .map((meetingType) => {
      const label = meetingType.label === undefined || meetingType.label === null ? "Unlabeled" : String(meetingType.label);
      return `${label} (${String(meetingType.id ?? "no id")})`;
    })
    .join(", ");

  throw new RecruitCrmApiError(
    `Unknown meeting_type_id ${meetingTypeId}. Call list_meeting_types and use one of the returned meeting type IDs.${availableTypes ? ` Available examples: ${availableTypes}.` : ""}`,
  );
}

function validateSearchContactsFilters(args: SearchContactsInput): void {
  const filterKeys: Array<keyof SearchContactsInput> = [
    "created_from",
    "created_to",
    "email",
    "first_name",
    "last_name",
    "linkedin",
    "marked_as_off_limit",
    "owner_email",
    "owner_id",
    "owner_name",
    "updated_from",
    "updated_to",
    "company_slug",
    "contact_number",
    "contact_slug",
  ];

  const hasAtLeastOneFilter =
    filterKeys.some((key) => args[key] !== undefined) ||
    (args.custom_fields !== undefined && args.custom_fields.length > 0);

  if (!hasAtLeastOneFilter) {
    throw new RecruitCrmApiError(
      "search_contacts requires at least one filter. sort_by, sort_order, page, exact_search, and include_contact_info do not count by themselves.",
    );
  }
}

function validateMarkRecordsAvailableInput(args: MarkRecordsAvailableInput): void {
  const hasContactCascade = args.mark_contact_available !== undefined;
  const hasCandidateCascade = args.mark_candidate_available !== undefined;

  if (args.record_type === "company") {
    if (!hasContactCascade || !hasCandidateCascade) {
      throw new RecruitCrmApiError(
        "For company records, mark_records_available requires both mark_contact_available and mark_candidate_available. Use true to also mark the related records available, or false to leave that related record type unchanged.",
      );
    }

    return;
  }

  if (hasContactCascade || hasCandidateCascade) {
    throw new RecruitCrmApiError(
      "mark_contact_available and mark_candidate_available are only supported when record_type is company.",
    );
  }
}

function validateCallLogCustomTypeId(customCallTypeId: number, callTypes: Array<{ id?: number | string | null; label?: string | number | null }>): void {
  const match = callTypes.some((callType) => {
    if (callType.id === undefined || callType.id === null || callType.id === "") {
      return false;
    }

    return Number(callType.id) === customCallTypeId;
  });

  if (match) {
    return;
  }

  const availableTypes = callTypes
    .slice(0, 10)
    .map((callType) => {
      const label = callType.label === undefined || callType.label === null ? "Unlabeled" : String(callType.label);
      return `${label} (${String(callType.id ?? "no id")})`;
    })
    .join(", ");

  throw new RecruitCrmApiError(
    `Unknown custom_call_type_id ${customCallTypeId}. Call list_call_types and use one of the returned call type IDs.${availableTypes ? ` Available examples: ${availableTypes}.` : ""}`,
  );
}

function validateCallLogRelatedType(relatedToType: string | undefined): void {
  if (relatedToType === undefined) {
    return;
  }

  const normalizedType = relatedToType.trim().toLowerCase();

  if (normalizedType === "job" || normalizedType === "deal") {
    throw new RecruitCrmApiError(
      "Recruit CRM call log search does not support related_to_type=job or related_to_type=deal.",
    );
  }
}

function normalizeTaskDateRanges(args: SearchTasksInput): SearchTasksInput {
  return {
    ...args,
    page: args.page ?? 1,
    created_from: args.created_from ?? getImplicitRangeStart(args.created_to),
    starting_from: args.starting_from ?? getImplicitRangeStart(args.starting_to),
    updated_from: args.updated_from ?? getImplicitRangeStart(args.updated_to),
  };
}

function getImplicitRangeStart(upperBound: string | undefined): string | undefined {
  if (upperBound === undefined) {
    return undefined;
  }

  return "1970-01-01";
}

function mapTaskSearchError(error: unknown, args: SearchTasksInput): RecruitCrmApiError {
  if (!(error instanceof RecruitCrmApiError)) {
    return new RecruitCrmApiError("Recruit CRM task search failed.", undefined, error);
  }

  if (error.statusCode === 500 && (args.updated_from !== undefined || args.updated_to !== undefined)) {
    return new RecruitCrmApiError(
      "Recruit CRM task search failed for this updated-on date range. Try a narrower updated_from/updated_to range.",
      error.statusCode,
      error,
    );
  }

  if (error.statusCode === 500 && (args.created_from !== undefined || args.created_to !== undefined)) {
    return new RecruitCrmApiError(
      "Recruit CRM task search failed for this created-on date range. Try adding created_from or narrowing the created_from/created_to window.",
      error.statusCode,
      error,
    );
  }

  if (error.statusCode === 500 && (args.starting_from !== undefined || args.starting_to !== undefined)) {
    return new RecruitCrmApiError(
      "Recruit CRM task search failed for this due-date range. Try adding starting_from or narrowing the starting_from/starting_to window.",
      error.statusCode,
      error,
    );
  }

  return error;
}

function formatResult(
  result:
    | SearchCandidatesResult
    | SearchCompaniesResult
    | SearchContactsResult
    | SearchHotlistsResult
    | SearchJobsResult
    | SearchMeetingsResult
    | SearchNotesResult
    | SearchCallLogsResult
    | SearchTasksResult
    | ListUsersResult
    | ListTeamsResult
    | ListCandidateQuestionsResult
    | ListHiringPipelinesResult
    | ListLanguagesAndProficienciesResult
    | ListCurrenciesResult
    | ListQualificationsResult
    | ListXmlJobboardsResult
    | ListCallTypesResult
    | ListMeetingTypesResult
    | ListNoteTypesResult
    | ListOffLimitStatusesResult
    | ListTaskTypesResult
    | CreateCandidateResult
    | CreateCompanyResult
    | CreateJobResult
    | CreateCallLogResult
    | CreateHotlistResult
    | CreateMeetingResult
    | CreateNoteResult
    | CreateTaskResult
    | CandidateDetailsResult
    | CompanyDetailsResult
    | ContactDetailsResult
    | AddRecordsToHotlistResult
    | JobDetailsResult
    | JobAssignedCandidatesResult
    | CandidateHiringStagesResult
    | ListPitchStagesResult
    | PitchCandidateToContactResult
    | UpdateCandidatePitchStageResult
    | PitchHistoryResult
    | PitchedRecordsResult
    | JobStatusesResult
    | CandidateJobAssignmentHiringStageHistoryResult
    | CandidateCustomFieldListResult
    | CandidateCustomFieldDetail
    | CustomFieldDependenciesOutput
    | PrepareClientBriefResult
    | AnalyzeJobPipelineResult
    | AssignCandidateToJobResult
    | UpdateCandidateHiringStageResult
    | CreateContactResult
    | ListContactStagesResult
    | MarkCandidateOffLimitResult
    | MarkContactOffLimitResult
    | MarkCompanyOffLimitResult
    | MarkRecordsAvailableResult,
) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(result, null, 2),
      },
    ],
    structuredContent: result,
  };
}

// =====================================================================
// analyze_job_pipeline — composite executor + helpers
// =====================================================================

const ANALYZE_JOB_PIPELINE_STAGE_HISTORY_BATCH = 10;
const ANALYZE_JOB_PIPELINE_ASSIGNED_PAGE_LIMIT = 100;
const ANALYZE_JOB_PIPELINE_PAGES_PER_WINDOW = 3;
const ANALYZE_JOB_PIPELINE_ACTIVITY_WINDOW_DAYS = 30;
const ANALYZE_JOB_PIPELINE_VIEW_URL_PREFIX = "https://app.recruitcrm.io/job/";

type AnalyzeStageHistoryItem = RecruitCrmCandidateJobAssignmentHiringStageHistoryItem;

export async function executeAnalyzeJobPipeline(
  client: RecruitCrmClient,
  args: AnalyzeJobPipelineInput,
): Promise<AnalyzeJobPipelineResult> {
  const startPage = args.start_page ?? ANALYZE_JOB_PIPELINE_DEFAULTS.startPage;
  const idleThreshold = args.idle_days_threshold ?? ANALYZE_JOB_PIPELINE_DEFAULTS.idleDaysThreshold;
  const maxActive = args.max_active_candidates ?? ANALYZE_JOB_PIPELINE_DEFAULTS.maxActiveCandidates;
  const maxPlaced = args.max_placed_candidates ?? ANALYZE_JOB_PIPELINE_DEFAULTS.maxPlacedCandidates;
  const terminalLabels = (
    args.terminal_stage_labels ?? ANALYZE_JOB_PIPELINE_DEFAULTS.terminalStageLabels
  ).map((label) => label.trim().toLowerCase());
  const hireLabels = ANALYZE_JOB_PIPELINE_DEFAULTS.hireStageLabels.map((l) => l.trim().toLowerCase());
  const intakeLabels = ANALYZE_JOB_PIPELINE_DEFAULTS.intakeStageLabels.map((l) => l.trim().toLowerCase());
  // Auto-skip activity on follow-up windows to avoid redundant calls.
  const includeActivity = startPage === 1 ? args.include_activity ?? true : false;
  // Time metrics are opt-in. When false (default), we skip ALL per-candidate /history calls
  // and use the assignments endpoint's stage_date for days_in_current_stage. ~7 calls total.
  const includeTimeMetrics = args.include_time_metrics ?? false;

  const errors: AnalyzeJobPipelineError[] = [];
  const truncated: AnalyzeJobPipelineResult["truncated"] = {};

  const [job, ownerName] = await Promise.all([
    client.getJobDetails(args.job_slug),
    fetchAnalyzeUserNameMap(client).catch(() => new Map<number, string>()),
  ]).then(([j, users]) => {
    const ownerId = toAnalyzeFiniteNumber(j.owner);
    return [j, ownerId !== null ? users.get(ownerId) ?? null : null] as const;
  });
  const jobHeader = buildAnalyzeJobHeader(args.job_slug, job, ownerName);

  const { assignments, lastFetchedPage, hasMoreAfterWindow } = await fetchAssignmentsWindow(
    client,
    args.job_slug,
    startPage,
    errors,
  );
  const endPage = lastFetchedPage ?? startPage;
  const nextWindowStartPage = hasMoreAfterWindow ? endPage + 1 : null;
  if (hasMoreAfterWindow) {
    truncated.assignments = true;
  }

  const activeAssignments: AssignedCandidateSummary[] = [];
  const placedAssignments: AssignedCandidateSummary[] = [];
  const terminalStagesSummary: Record<string, number> = {};
  for (const assignment of assignments) {
    if (isAnalyzeTerminal(assignment.status_label, terminalLabels)) {
      const key = assignment.status_label ?? "Unknown";
      terminalStagesSummary[key] = (terminalStagesSummary[key] ?? 0) + 1;
      if (isAnalyzeHired(assignment.status_label, hireLabels)) {
        placedAssignments.push(assignment);
      }
    } else {
      activeAssignments.push(assignment);
    }
  }
  const terminalCount = assignments.length - activeAssignments.length;

  // History fetching is gated by include_time_metrics. Default is OFF — we use stage_date
  // from the assignments payload for days_in_current_stage and skip all /history calls.
  let historyByCandidate: Map<string, AnalyzeStageHistoryItem[]> = new Map();
  let placedHistoryByCandidate: Map<string, AnalyzeStageHistoryItem[]> = new Map();
  let activeHistoryFetched = 0;
  let placedHistoryFetched = 0;

  if (includeTimeMetrics) {
    const candidatesForHistory = activeAssignments.slice(0, maxActive);
    if (activeAssignments.length > maxActive) {
      truncated.active_candidates = true;
    }
    if (candidatesForHistory.length > 0) {
      historyByCandidate = await fetchAnalyzeStageHistories(
        client,
        candidatesForHistory.map((a) => a.candidate_slug),
        errors,
        "stage_history",
      );
      activeHistoryFetched = candidatesForHistory.length;
    }

    const placedForHistory = placedAssignments.slice(0, maxPlaced);
    if (placedAssignments.length > maxPlaced) {
      truncated.placed_candidates = true;
    }
    if (placedForHistory.length > 0) {
      placedHistoryByCandidate = await fetchAnalyzeStageHistories(
        client,
        placedForHistory.map((a) => a.candidate_slug),
        errors,
        "placed_history",
      );
      placedHistoryFetched = placedForHistory.length;
    }
  }

  const stageGroups = buildAnalyzeStageGroups(
    activeAssignments,
    historyByCandidate,
    args.job_slug,
  );
  const idleCandidates = buildAnalyzeIdleList(stageGroups, idleThreshold);
  const bottleneck = computeAnalyzeBottleneck(stageGroups);

  const timeMetrics = includeTimeMetrics
    ? buildAnalyzeTimeMetrics({
        jobSlug: args.job_slug,
        activeAssignments,
        placedAssignments,
        historyByCandidate,
        placedHistoryByCandidate,
        intakeLabels,
        activeHistoryFetched,
        placedHistoryFetched,
      })
    : null;

  const activity = includeActivity ? await fetchAnalyzeActivity(client, args.job_slug, errors) : null;

  const suggested = buildAnalyzeSuggestedActions({
    activeCount: activeAssignments.length,
    terminalCount,
    placedCount: placedAssignments.length,
    idleCandidates,
    bottleneck,
    activity,
    timeMetrics,
    includeTimeMetrics,
    idleThreshold,
    truncated,
    startPage,
    endPage,
    analyzedCount: assignments.length,
    nextWindowStartPage,
  });

  return {
    job: jobHeader,
    pipeline: {
      window: {
        start_page: startPage,
        end_page: endPage,
        analyzed_count: assignments.length,
      },
      next_window: nextWindowStartPage !== null ? { start_page: nextWindowStartPage } : null,
      total_assigned_in_window: assignments.length,
      active_count: activeAssignments.length,
      terminal_count: terminalCount,
      terminal_stages_summary: terminalStagesSummary,
      stages: stageGroups,
    },
    bottleneck,
    idle_candidates: idleCandidates,
    activity,
    time_metrics: timeMetrics,
    truncated,
    errors,
    suggested_actions: suggested,
  };
}

function buildAnalyzeJobHeader(
  jobSlug: string,
  job: JobDetail,
  ownerName: string | null,
): AnalyzeJobPipelineResult["job"] {
  const status = job.job_status as { label?: unknown } | undefined | null;
  const statusLabel = typeof status?.label === "string" ? status.label : null;
  const createdOn = typeof job.created_on === "string" ? job.created_on : null;

  return {
    slug: jobSlug,
    name: typeof job.name === "string" ? job.name : null,
    status_label: statusLabel,
    owner: toAnalyzeFiniteNumber(job.owner),
    owner_name: ownerName,
    company_slug: typeof job.company_slug === "string" ? job.company_slug : null,
    created_on: createdOn,
    days_open: createdOn ? analyzeDaysBetween(createdOn) : null,
    number_of_openings: toAnalyzeFiniteNumber(job.number_of_openings),
    view_url: `${ANALYZE_JOB_PIPELINE_VIEW_URL_PREFIX}${jobSlug}`,
    hiring_pipeline_id: toAnalyzeFiniteNumber(job.hiring_pipeline_id),
  };
}

async function fetchAnalyzeUserNameMap(
  client: RecruitCrmClient,
): Promise<Map<number, string>> {
  const users = await client.listUsers({ include_teams: false });
  const map = new Map<number, string>();
  for (const u of users) {
    const id = toAnalyzeFiniteNumber(u.id);
    if (id === null) continue;
    const first = typeof u.first_name === "string" ? u.first_name.trim() : "";
    const last = typeof u.last_name === "string" ? u.last_name.trim() : "";
    const full = `${first} ${last}`.trim();
    if (full.length > 0) map.set(id, full);
  }
  return map;
}

async function fetchAssignmentsWindow(
  client: RecruitCrmClient,
  jobSlug: string,
  startPage: number,
  errors: AnalyzeJobPipelineError[],
): Promise<{
  assignments: AssignedCandidateSummary[];
  lastFetchedPage: number | null;
  hasMoreAfterWindow: boolean;
}> {
  const out: AssignedCandidateSummary[] = [];
  let lastFetchedPage: number | null = null;
  let lastNextPageUrl: string | null = null;
  let lastDataLength = 0;

  for (let offset = 0; offset < ANALYZE_JOB_PIPELINE_PAGES_PER_WINDOW; offset += 1) {
    const page = startPage + offset;
    let result: unknown;
    try {
      result = await client.getJobAssignedCandidates(jobSlug, {
        page,
        limit: ANALYZE_JOB_PIPELINE_ASSIGNED_PAGE_LIMIT,
      });
    } catch (error) {
      errors.push(buildAnalyzeErrorEntry("assignments", error));
      // Stop the loop on mid-window failure; we don't know what's beyond.
      return { assignments: out, lastFetchedPage, hasMoreAfterWindow: false };
    }

    const dataArray = (result as { data?: unknown }).data;
    const items = Array.isArray(dataArray) ? dataArray : [];
    if (items.length === 0 && offset > 0) {
      // Empty page beyond the first attempt — stop early but still record this page as fetched.
      lastFetchedPage = page;
      lastNextPageUrl = null;
      lastDataLength = 0;
      break;
    }

    for (const raw of items) {
      const summary = mapAnalyzeRawAssignment(raw);
      if (summary) out.push(summary);
    }

    lastFetchedPage = page;
    lastDataLength = items.length;
    const nextPageUrl = (result as { next_page_url?: string | null }).next_page_url;
    lastNextPageUrl = typeof nextPageUrl === "string" && nextPageUrl.length > 0 ? nextPageUrl : null;

    if (!lastNextPageUrl && items.length < ANALYZE_JOB_PIPELINE_ASSIGNED_PAGE_LIMIT) {
      // Definitively the last page.
      break;
    }
  }

  // Determine "more beyond window" without an extra probe call:
  // - prefer next_page_url presence on the last successfully-fetched page;
  // - fall back to "page was full" heuristic when next_page_url is missing.
  const hasMoreAfterWindow =
    lastNextPageUrl !== null || lastDataLength === ANALYZE_JOB_PIPELINE_ASSIGNED_PAGE_LIMIT;

  return { assignments: out, lastFetchedPage, hasMoreAfterWindow };
}

function mapAnalyzeRawAssignment(raw: unknown): AssignedCandidateSummary | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const candidate = r.candidate as Record<string, unknown> | undefined;
  const status = r.status as Record<string, unknown> | undefined;
  const slug = candidate?.slug;
  if (typeof slug !== "string" || slug.length === 0) return null;

  return {
    candidate_slug: slug,
    first_name: typeof candidate?.first_name === "string" ? (candidate.first_name as string) : null,
    last_name: typeof candidate?.last_name === "string" ? (candidate.last_name as string) : null,
    position: typeof candidate?.position === "string" ? (candidate.position as string) : null,
    current_organization:
      typeof candidate?.current_organization === "string"
        ? (candidate.current_organization as string)
        : null,
    current_status:
      typeof candidate?.current_status === "string" ? (candidate.current_status as string) : null,
    city: typeof candidate?.city === "string" ? (candidate.city as string) : null,
    country: typeof candidate?.country === "string" ? (candidate.country as string) : null,
    updated_on:
      typeof candidate?.updated_on === "string" ? (candidate.updated_on as string) : null,
    stage_date: typeof r.stage_date === "string" ? (r.stage_date as string) : null,
    status_id: toAnalyzeFiniteNumber(status?.status_id),
    status_label: typeof status?.label === "string" ? (status.label as string) : null,
  };
}

async function fetchAnalyzeStageHistories(
  client: RecruitCrmClient,
  slugs: string[],
  errors: AnalyzeJobPipelineError[],
  errorSource: AnalyzeJobPipelineError["source"] = "stage_history",
): Promise<Map<string, AnalyzeStageHistoryItem[]>> {
  const result = new Map<string, AnalyzeStageHistoryItem[]>();
  for (let i = 0; i < slugs.length; i += ANALYZE_JOB_PIPELINE_STAGE_HISTORY_BATCH) {
    const batch = slugs.slice(i, i + ANALYZE_JOB_PIPELINE_STAGE_HISTORY_BATCH);
    const settled = await Promise.allSettled(
      batch.map((slug) => client.getCandidateJobAssignmentHiringStageHistory(slug)),
    );
    settled.forEach((outcome, idx) => {
      const slug = batch[idx];
      if (outcome.status === "fulfilled") {
        const items = (outcome.value as unknown as AnalyzeStageHistoryItem[]) ?? [];
        result.set(slug, items);
      } else {
        errors.push(buildAnalyzeErrorEntry(errorSource, outcome.reason, slug));
      }
    });
  }
  return result;
}

function buildAnalyzeStageGroups(
  active: AssignedCandidateSummary[],
  historyByCandidate: Map<string, AnalyzeStageHistoryItem[]>,
  jobSlug: string,
): AnalyzeJobPipelineStageGroup[] {
  const groupMap = new Map<string, AnalyzeJobPipelineStageGroup>();

  for (const a of active) {
    const label = a.status_label ?? "Unknown";
    const key = `${a.status_id ?? "null"}::${label}`;
    let group = groupMap.get(key);
    if (!group) {
      group = {
        stage_id: a.status_id,
        label,
        count: 0,
        candidates: [],
      };
      groupMap.set(key, group);
    }
    group.count += 1;

    const history = historyByCandidate.get(a.candidate_slug);
    const filtered = history
      ? history
          .filter((h) => typeof h.job_slug === "string" && h.job_slug === jobSlug)
          .sort((x, y) => analyzeSortDescByUpdatedOn(x, y))
      : null;

    let daysInCurrentStage: number | null = null;

    if (filtered && filtered.length > 0) {
      const latest = filtered[0];
      const currentStageId = toAnalyzeFiniteNumber(latest.candidate_status_id);
      const enteredAt =
        findAnalyzeEntryIntoCurrentStage(filtered, currentStageId) ??
        analyzeStringOrNull(latest.updated_on);
      if (enteredAt) daysInCurrentStage = analyzeDaysBetween(enteredAt);
    } else if (a.stage_date) {
      // No history fetched (or no entries match this job_slug) → use assignment-level stage_date.
      // This is the default path when include_time_metrics=false (saves N /history calls).
      daysInCurrentStage = analyzeDaysBetween(a.stage_date);
    }

    group.candidates.push({
      candidate_slug: a.candidate_slug,
      name: buildAnalyzeName(a.first_name, a.last_name),
      days_in_current_stage: daysInCurrentStage,
    });
  }

  return Array.from(groupMap.values()).sort((a, b) => b.count - a.count);
}

function findAnalyzeEntryIntoCurrentStage(
  sortedDesc: AnalyzeStageHistoryItem[],
  currentStageId: number | null,
): string | null {
  let candidateTime: string | null = null;
  for (const entry of sortedDesc) {
    const entryStageId = toAnalyzeFiniteNumber(entry.candidate_status_id);
    const updatedOn = analyzeStringOrNull(entry.updated_on);
    if (entryStageId === currentStageId && updatedOn) {
      candidateTime = updatedOn;
      continue;
    }
    if (entryStageId !== currentStageId) {
      break;
    }
  }
  return candidateTime;
}

function buildAnalyzeIdleList(
  stageGroups: AnalyzeJobPipelineStageGroup[],
  threshold: number,
): AnalyzeJobPipelineIdleCandidate[] {
  const out: AnalyzeJobPipelineIdleCandidate[] = [];
  for (const group of stageGroups) {
    for (const c of group.candidates) {
      if (c.days_in_current_stage !== null && c.days_in_current_stage > threshold) {
        out.push({
          candidate_slug: c.candidate_slug,
          name: c.name,
          current_stage: group.label,
          days_in_current_stage: c.days_in_current_stage,
        });
      }
    }
  }
  return out.sort((a, b) => b.days_in_current_stage - a.days_in_current_stage);
}

function computeAnalyzeBottleneck(
  stageGroups: AnalyzeJobPipelineStageGroup[],
): AnalyzeJobPipelineBottleneck | null {
  if (stageGroups.length === 0) return null;

  let best: { group: AnalyzeJobPipelineStageGroup; medianDays: number } | null = null;
  for (const group of stageGroups) {
    const days = group.candidates
      .map((c) => c.days_in_current_stage)
      .filter((d): d is number => typeof d === "number");
    if (days.length === 0) continue;
    const m = analyzeMedian(days);
    if (
      !best ||
      group.count > best.group.count ||
      (group.count === best.group.count && m > best.medianDays)
    ) {
      best = { group, medianDays: m };
    }
  }
  if (!best) return null;
  return {
    stage_label: best.group.label,
    count: best.group.count,
    median_days_in_stage: best.medianDays,
    reason: `Largest active stage (${best.group.count} candidates) with median ${best.medianDays}d in stage`,
  };
}

async function fetchAnalyzeActivity(
  client: RecruitCrmClient,
  jobSlug: string,
  errors: AnalyzeJobPipelineError[],
): Promise<AnalyzeJobPipelineActivity> {
  const since = analyzeIsoDaysAgo(ANALYZE_JOB_PIPELINE_ACTIVITY_WINDOW_DAYS);
  const todayMs = Date.now();

  const [notesOutcome, meetingsOutcome, tasksOutcome] = await Promise.allSettled([
    client.searchNotes({
      page: 1,
      related_to: jobSlug,
      related_to_type: "job",
      updated_from: since,
    }),
    client.searchMeetings({
      page: 1,
      related_to: jobSlug,
      related_to_type: "job",
      updated_from: since,
    }),
    client.searchTasks({
      page: 1,
      related_to: jobSlug,
      related_to_type: "job",
    }),
  ]);

  let notes30d = 0;
  let lastNoteAt: string | null = null;
  if (notesOutcome.status === "fulfilled") {
    const data = analyzeExtractDataArray(notesOutcome.value);
    notes30d = data.length;
    lastNoteAt = pickAnalyzeLatestTimestamp(data, ["updated_on", "created_on"]);
  } else {
    errors.push(buildAnalyzeErrorEntry("activity", notesOutcome.reason, "notes"));
  }

  let meetings30d = 0;
  let lastMeetingAt: string | null = null;
  if (meetingsOutcome.status === "fulfilled") {
    const data = analyzeExtractDataArray(meetingsOutcome.value);
    meetings30d = data.length;
    lastMeetingAt = pickAnalyzeLatestTimestamp(data, ["start_date", "updated_on", "created_on"]);
  } else {
    errors.push(buildAnalyzeErrorEntry("activity", meetingsOutcome.reason, "meetings"));
  }

  let tasksTotal = 0;
  let nextTaskDueAt: string | null = null;
  let nextTaskMs = Infinity;
  if (tasksOutcome.status === "fulfilled") {
    const data = analyzeExtractDataArray(tasksOutcome.value);
    tasksTotal = data.length;
    for (const raw of data) {
      if (!raw || typeof raw !== "object") continue;
      const t = raw as Record<string, unknown>;
      const due = analyzeStringOrNull(t.start_date);
      if (!due) continue;
      const ms = Date.parse(due);
      if (Number.isNaN(ms)) continue;
      if (ms >= todayMs && ms < nextTaskMs) {
        nextTaskMs = ms;
        nextTaskDueAt = due;
      }
    }
  } else {
    errors.push(buildAnalyzeErrorEntry("activity", tasksOutcome.reason, "tasks"));
  }

  return {
    notes_30d: notes30d,
    meetings_30d: meetings30d,
    tasks_total: tasksTotal,
    next_task_due_at: nextTaskDueAt,
    last_note_at: lastNoteAt,
    last_meeting_at: lastMeetingAt,
  };
}

function buildAnalyzeSuggestedActions(input: {
  activeCount: number;
  terminalCount: number;
  placedCount: number;
  idleCandidates: AnalyzeJobPipelineIdleCandidate[];
  bottleneck: AnalyzeJobPipelineBottleneck | null;
  activity: AnalyzeJobPipelineActivity | null;
  timeMetrics: AnalyzeJobPipelineTimeMetrics | null;
  includeTimeMetrics: boolean;
  idleThreshold: number;
  truncated: AnalyzeJobPipelineResult["truncated"];
  startPage: number;
  endPage: number;
  analyzedCount: number;
  nextWindowStartPage: number | null;
}): string[] {
  const out: string[] = [];

  if (input.activeCount === 0) {
    out.push(
      "No active candidates in pipeline — consider sourcing or reactivating dormant candidates.",
    );
  }

  if (input.idleCandidates.length > 0) {
    const sample = input.idleCandidates
      .slice(0, 3)
      .map((c) => c.name ?? c.candidate_slug)
      .join(", ");
    out.push(
      `${input.idleCandidates.length} candidate(s) idle >${input.idleThreshold}d (e.g. ${sample}) — push for an update or move stage.`,
    );
  }

  if (
    input.bottleneck &&
    input.bottleneck.count >= 3 &&
    input.bottleneck.median_days_in_stage >= input.idleThreshold
  ) {
    out.push(
      `Bottleneck: '${input.bottleneck.stage_label}' has ${input.bottleneck.count} candidates with median ${input.bottleneck.median_days_in_stage}d — investigate stage handoff.`,
    );
  }

  if (input.activity) {
    if (input.activity.notes_30d === 0 && input.activity.meetings_30d === 0) {
      out.push(
        "No notes or meetings logged in the last 30 days — log a status update or schedule a client touchpoint.",
      );
    }
    if (input.activity.next_task_due_at) {
      out.push(
        `Next scheduled task on this job is due ${input.activity.next_task_due_at} — confirm it's still on track.`,
      );
    }
  }

  if (input.truncated.active_candidates) {
    out.push(
      "Active-candidate stage history was truncated — re-run with a higher max_active_candidates for full coverage of time-to-stage / time-to-first-action.",
    );
  }

  if (input.truncated.placed_candidates) {
    out.push(
      "Placed-candidate stage history was truncated — re-run with a higher max_placed_candidates for full coverage of time-to-hire.",
    );
  }

  // Time-metric availability hint:
  if (!input.includeTimeMetrics && input.placedCount > 0) {
    out.push(
      `${input.placedCount} placement(s) on this job — re-run with include_time_metrics=true to compute time-to-hire (adds ${Math.min(input.placedCount, ANALYZE_JOB_PIPELINE_DEFAULTS.maxPlacedCandidates)} extra /history calls).`,
    );
  }

  // Pagination nudge — last so the LLM surfaces it after the diagnosis.
  if (input.nextWindowStartPage !== null) {
    const firstIdx = (input.startPage - 1) * ANALYZE_JOB_PIPELINE_ASSIGNED_PAGE_LIMIT + 1;
    const lastIdx = firstIdx + input.analyzedCount - 1;
    out.push(
      `Analyzed candidates ${firstIdx}–${lastIdx} of an estimated ${lastIdx}+ assigned candidates. There are more candidates beyond this batch — let me know if you want me to analyze the next ${ANALYZE_JOB_PIPELINE_ASSIGNED_PAGE_LIMIT * ANALYZE_JOB_PIPELINE_PAGES_PER_WINDOW} (start_page=${input.nextWindowStartPage}).`,
    );
  }

  return out;
}

function isAnalyzeTerminal(label: string | null, terminalLabels: string[]): boolean {
  if (!label) return false;
  return terminalLabels.includes(label.trim().toLowerCase());
}

function isAnalyzeHired(label: string | null, hireLabels: string[]): boolean {
  if (!label) return false;
  return hireLabels.includes(label.trim().toLowerCase());
}

// =====================================================================
// Time-metric helpers (only invoked when include_time_metrics is true)
// =====================================================================

function buildAnalyzeTimeMetrics(input: {
  jobSlug: string;
  activeAssignments: AssignedCandidateSummary[];
  placedAssignments: AssignedCandidateSummary[];
  historyByCandidate: Map<string, AnalyzeStageHistoryItem[]>;
  placedHistoryByCandidate: Map<string, AnalyzeStageHistoryItem[]>;
  intakeLabels: string[];
  activeHistoryFetched: number;
  placedHistoryFetched: number;
}): AnalyzeJobPipelineTimeMetrics {
  const allFetched = new Map<string, AnalyzeStageHistoryItem[]>();
  for (const [slug, items] of input.historyByCandidate) allFetched.set(slug, items);
  for (const [slug, items] of input.placedHistoryByCandidate) allFetched.set(slug, items);

  const time_to_hire = computeAnalyzeTimeToHire(
    input.placedAssignments,
    input.placedHistoryByCandidate,
    input.jobSlug,
  );

  const time_to_stage = computeAnalyzeTimeToStage(
    [...input.activeAssignments, ...input.placedAssignments],
    allFetched,
    input.jobSlug,
    input.intakeLabels,
  );

  const time_to_first_action = computeAnalyzeTimeToFirstAction(
    input.activeAssignments,
    input.historyByCandidate,
    input.jobSlug,
    input.intakeLabels,
  );

  return {
    time_to_hire,
    time_to_stage,
    time_to_first_action,
    coverage: {
      active_history_fetched: input.activeHistoryFetched,
      active_total: input.activeAssignments.length,
      placed_history_fetched: input.placedHistoryFetched,
      placed_total: input.placedAssignments.length,
    },
  };
}

function computeAnalyzeTimeToHire(
  placed: AssignedCandidateSummary[],
  histories: Map<string, AnalyzeStageHistoryItem[]>,
  jobSlug: string,
): AnalyzeJobPipelineTimeToHire | null {
  const placements: AnalyzeJobPipelineTimeToHirePlacement[] = [];
  for (const p of placed) {
    const history = histories.get(p.candidate_slug);
    if (!history) continue;
    const filtered = history
      .filter((h) => typeof h.job_slug === "string" && h.job_slug === jobSlug)
      .sort((x, y) => analyzeSortDescByUpdatedOn(x, y));
    if (filtered.length === 0) continue;
    const earliest = filtered[filtered.length - 1];
    const latest = filtered[0];
    const start = analyzeStringOrNull(earliest.updated_on);
    const end = analyzeStringOrNull(latest.updated_on);
    if (!start || !end) continue;
    const days = analyzeDaysBetween(start, end);
    if (!Number.isFinite(days) || days < 0) continue;
    placements.push({
      candidate_slug: p.candidate_slug,
      name: buildAnalyzeName(p.first_name, p.last_name),
      days_to_hire: days,
    });
  }
  if (placements.length === 0) return null;
  const sorted = [...placements].sort((a, b) => a.days_to_hire - b.days_to_hire);
  return {
    first_days: sorted[0].days_to_hire,
    avg_days: roundAnalyzeAvg(sorted.map((p) => p.days_to_hire)),
    sample_size: sorted.length,
    placements: sorted,
  };
}

function computeAnalyzeTimeToStage(
  candidates: AssignedCandidateSummary[],
  histories: Map<string, AnalyzeStageHistoryItem[]>,
  jobSlug: string,
  intakeLabels: string[],
): Record<string, AnalyzeJobPipelineTimeToStageEntry> {
  const perStage = new Map<string, number[]>();
  for (const c of candidates) {
    const history = histories.get(c.candidate_slug);
    if (!history) continue;
    const filtered = history
      .filter((h) => typeof h.job_slug === "string" && h.job_slug === jobSlug)
      .sort((x, y) => analyzeSortDescByUpdatedOn(x, y));
    if (filtered.length === 0) continue;
    const earliest = filtered[filtered.length - 1];
    const start = analyzeStringOrNull(earliest.updated_on);
    if (!start) continue;
    const seenStages = new Set<string>();
    // Walk oldest → newest. For each stage transition, capture days from start.
    for (let i = filtered.length - 1; i >= 0; i -= 1) {
      const entry = filtered[i];
      const label = analyzeStringOrNull(entry.candidate_status);
      if (!label) continue;
      if (intakeLabels.includes(label.trim().toLowerCase())) continue;
      if (seenStages.has(label)) continue;
      seenStages.add(label);
      const at = analyzeStringOrNull(entry.updated_on);
      if (!at) continue;
      const days = analyzeDaysBetween(start, at);
      if (!Number.isFinite(days) || days < 0) continue;
      const arr = perStage.get(label) ?? [];
      arr.push(days);
      perStage.set(label, arr);
    }
  }
  const out: Record<string, AnalyzeJobPipelineTimeToStageEntry> = {};
  for (const [label, vals] of perStage) {
    if (vals.length === 0) continue;
    const sorted = [...vals].sort((a, b) => a - b);
    out[label] = {
      first_days: sorted[0],
      avg_days: roundAnalyzeAvg(sorted),
      sample_size: sorted.length,
    };
  }
  return out;
}

function computeAnalyzeTimeToFirstAction(
  active: AssignedCandidateSummary[],
  histories: Map<string, AnalyzeStageHistoryItem[]>,
  jobSlug: string,
  intakeLabels: string[],
): AnalyzeJobPipelineTimeToFirstAction | null {
  if (active.length === 0) return null;
  const daysToAction: number[] = [];
  let stuck = 0;
  let sampled = 0;
  for (const a of active) {
    const history = histories.get(a.candidate_slug);
    if (!history) continue;
    const filtered = history
      .filter((h) => typeof h.job_slug === "string" && h.job_slug === jobSlug)
      .sort((x, y) => analyzeSortDescByUpdatedOn(x, y));
    if (filtered.length === 0) continue;
    sampled += 1;
    const earliest = filtered[filtered.length - 1];
    const start = analyzeStringOrNull(earliest.updated_on);
    if (!start) continue;
    // Walk oldest → newest, find first non-intake stage entry.
    let firstActionAt: string | null = null;
    for (let i = filtered.length - 1; i >= 0; i -= 1) {
      const label = analyzeStringOrNull(filtered[i].candidate_status);
      if (!label) continue;
      if (intakeLabels.includes(label.trim().toLowerCase())) continue;
      firstActionAt = analyzeStringOrNull(filtered[i].updated_on);
      break;
    }
    if (firstActionAt) {
      const d = analyzeDaysBetween(start, firstActionAt);
      if (Number.isFinite(d) && d >= 0) daysToAction.push(d);
    } else {
      stuck += 1;
    }
  }
  return {
    avg_days: daysToAction.length > 0 ? roundAnalyzeAvg(daysToAction) : null,
    stuck_in_intake: stuck,
    sample_size: sampled,
  };
}

function roundAnalyzeAvg(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

function analyzeSortDescByUpdatedOn(
  a: AnalyzeStageHistoryItem,
  b: AnalyzeStageHistoryItem,
): number {
  const aTime = analyzeParseTime(a.updated_on);
  const bTime = analyzeParseTime(b.updated_on);
  return bTime - aTime;
}

function analyzeParseTime(value: unknown): number {
  const s = analyzeStringOrNull(value);
  if (!s) return 0;
  const ms = Date.parse(s);
  return Number.isNaN(ms) ? 0 : ms;
}

function analyzeStringOrNull(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function buildAnalyzeName(first: string | null, last: string | null): string | null {
  const joined = [first, last]
    .filter((v): v is string => typeof v === "string" && v.length > 0)
    .join(" ");
  return joined.length > 0 ? joined : null;
}

function analyzeDaysBetween(isoA: string, isoB: string = new Date().toISOString()): number {
  const a = Date.parse(isoA);
  const b = Date.parse(isoB);
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.max(0, Math.floor(Math.abs(b - a) / (1000 * 60 * 60 * 24)));
}

function analyzeIsoDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function analyzeMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

function toAnalyzeFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function analyzeExtractDataArray(payload: unknown): unknown[] {
  if (!payload || typeof payload !== "object") return [];
  const data = (payload as { data?: unknown }).data;
  return Array.isArray(data) ? data : [];
}

function pickAnalyzeLatestTimestamp(items: unknown[], fields: string[]): string | null {
  let best: string | null = null;
  let bestMs = -Infinity;
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    for (const field of fields) {
      const v = (item as Record<string, unknown>)[field];
      if (typeof v === "string") {
        const ms = Date.parse(v);
        if (!Number.isNaN(ms) && ms > bestMs) {
          bestMs = ms;
          best = v;
        }
        break;
      }
    }
  }
  return best;
}

function buildAnalyzeErrorEntry(
  source: AnalyzeJobPipelineError["source"],
  reason: unknown,
  slug?: string,
): AnalyzeJobPipelineError {
  return {
    source,
    slug,
    message: reason instanceof Error ? reason.message : String(reason),
    status_code:
      reason instanceof RecruitCrmApiError ? reason.statusCode ?? null : null,
  };
}
