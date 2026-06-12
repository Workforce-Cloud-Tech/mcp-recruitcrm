import * as z from "zod/v4";

import { RecruitCrmApiError, formatIssuePath, invalidApiResponse, mapFetchError, mapHttpError } from "../errors.js";
import type { AppConfig } from "../config.js";
import { nodeHttpTransport, type HttpTransport } from "./http.js";
import type {
  RecruitCrmCandidateCustomField,
  RecruitCrmHiringPipelineResponse,
  RecruitCrmJobStatusListResponse,
  RecruitCrmCandidateJobAssignmentHiringStageHistoryResponse,
  RecruitCrmJobAssignedCandidatesResponse,
  RecruitCrmCallLogSearchResponse,
  RecruitCrmCallLogTypeListResponse,
  CandidateDetail,
  CandidateHistoryCreateResponse,
  CompanyDetail,
  ContactDetail,
  CreatedCandidate,
  CreatedCallLog,
  CreatedCompany,
  CreatedContact,
  CreatedHotlist,
  CreatedJob,
  CreatedMeeting,
  CreatedNote,
  CreatedTask,
  CreateCandidateEducationHistoryInput,
  CreateCandidateInput,
  CreateCandidateWorkHistoryInput,
  CreateCallLogInput,
  CreateCompanyInput,
  CreateContactInput,
  CreateHotlistInput,
  CreateJobInput,
  CreateMeetingInput,
  CreateNoteInput,
  CreateTaskInput,
  GetJobAssignedCandidatesInput,
  JobDetail,
  ListTeamsInput,
  ListCandidatesInput,
  ListCompaniesInput,
  ListContactsInput,
  ListJobsInput,
  ListUsersInput,
  MarkCandidateOffLimitInput,
  MarkCompanyOffLimitInput,
  MarkContactOffLimitInput,
  MarkRecordsAvailableInput,
  RecruitCrmCandidateQuestion,
  RecruitCrmCurrency,
  RecruitCrmHiringPipelineSummary,
  RecruitCrmLanguage,
  RecruitCrmMarkCandidateOffLimitResponse,
  RecruitCrmMarkCompanyOffLimitResponse,
  RecruitCrmMarkContactOffLimitResponse,
  RecruitCrmMarkRecordsAvailableResponse,
  RecruitCrmOffLimitStatusListResponse,
  RecruitCrmPitchActionResponse,
  RecruitCrmPitchPipelineResponse,
  RecruitCrmPitchRecordsResponse,
  RecruitCrmQualification,
  RecruitCrmTeam,
  RecruitCrmXmlJobboardsResponse,
  RecruitCrmContactSearchResponse,
  RecruitCrmCompanySearchResponse,
  RecruitCrmContactStagePipelineResponse,
  RecruitCrmHotlistSearchResponse,
  RecruitCrmJobSearchResponse,
  RecruitCrmMeetingSearchResponse,
  RecruitCrmMeetingTypeListResponse,
  RecruitCrmNoteSearchResponse,
  RecruitCrmNoteTypeListResponse,
  RecruitCrmSearchResponse,
  RecruitCrmTaskSearchResponse,
  RecruitCrmTaskTypeListResponse,
  RecruitCrmUserListResponse,
  SearchCandidatesInput,
  SearchCallLogsInput,
  SearchCompaniesInput,
  SearchContactsInput,
  SearchHotlistsInput,
  SearchJobsInput,
  SearchMeetingsInput,
  SearchNotesInput,
  SearchTasksInput,
  SearchCandidateCustomFieldFilter,
  CustomFieldDependenciesOutput,
  AssignCandidateToJobInput,
  ListCandidateHiringStagesInput,
  PitchCandidateToContactInput,
  RecruitCrmCandidateHiringStageUpdateResponse,
  RecruitCrmCandidateJobAssignmentResponse,
  PitchEntityType,
  UpdateCandidatePitchStageInput,
  UpdateCandidateHiringStageInput,
  UpdateCallLogInput,
  UpdateCandidateInput,
  UpdateCompanyInput,
  UpdateContactInput,
  UpdateJobInput,
  UpdateMeetingInput,
  UpdateNoteInput,
  UpdateTaskInput,
} from "./types.js";

const nullableNumberOrStringSchema = z.union([z.number(), z.string(), z.null()]).optional();
const nullableStringLikeSchema = z.union([z.string(), z.number(), z.null()]).optional();

const candidateSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    slug: z.union([z.string(), z.number()]).transform((value) => String(value)),
    first_name: nullableStringLikeSchema,
    last_name: nullableStringLikeSchema,
    email: nullableStringLikeSchema,
    contact_number: nullableStringLikeSchema,
    linkedin: nullableStringLikeSchema,
    current_organization: nullableStringLikeSchema,
    current_status: nullableStringLikeSchema,
    city: nullableStringLikeSchema,
    country: nullableStringLikeSchema,
    updated_on: nullableStringLikeSchema,
    created_on: nullableStringLikeSchema,
    position: nullableStringLikeSchema,
    resource_url: nullableStringLikeSchema,
  })
  .passthrough();

const searchResponseSchema = z.union([
  z
    .object({
      current_page: z.coerce.number().int().positive().optional(),
      next_page_url: z.union([z.string(), z.null()]).optional(),
      data: z.array(candidateSchema),
    })
    .passthrough(),
  z.array(z.unknown()).length(0).transform(
    (): RecruitCrmSearchResponse => ({
      current_page: 1,
      next_page_url: null,
      data: [],
    }),
  ),
]);

const assignedCandidateStatusSchema = z
  .object({
    status_id: nullableNumberOrStringSchema,
    label: nullableStringLikeSchema,
  })
  .passthrough();

const assignedCandidateSchema = z
  .object({
    candidate: candidateSchema,
    stage_date: nullableStringLikeSchema,
    status: z.union([assignedCandidateStatusSchema, z.null()]).optional(),
  })
  .passthrough();

const jobAssignedCandidatesResponseSchema = z.union([
  z
    .object({
      current_page: z.coerce.number().int().positive().optional(),
      next_page_url: z.union([z.string(), z.null()]).optional(),
      data: z.array(assignedCandidateSchema),
    })
    .passthrough(),
  z.array(z.unknown()).length(0).transform(
    (): RecruitCrmJobAssignedCandidatesResponse => ({
      current_page: 1,
      next_page_url: null,
      data: [],
    }),
  ),
]);

const hiringStageSchema = z
  .object({
    stage_id: nullableNumberOrStringSchema,
    status_id: nullableNumberOrStringSchema,
    label: nullableStringLikeSchema,
  })
  .passthrough();

const hiringPipelineResponseSchema = z.array(hiringStageSchema);

const pitchStageSchema = z
  .object({
    status_id: nullableNumberOrStringSchema,
    label: nullableStringLikeSchema,
  })
  .passthrough();

const pitchPipelineResponseSchema: z.ZodType<RecruitCrmPitchPipelineResponse> = z.array(pitchStageSchema);

const pitchRecordSchema = z
  .object({
    candidate_slug: nullableStringLikeSchema,
    contact_slug: nullableStringLikeSchema,
    status_id: nullableNumberOrStringSchema,
    status_label: nullableStringLikeSchema,
    candidate_status: nullableStringLikeSchema,
    remark: nullableStringLikeSchema,
    stage_date: nullableStringLikeSchema,
    contact_title: nullableStringLikeSchema,
    contact_name: nullableStringLikeSchema,
    candidate_name: nullableStringLikeSchema,
    candidate_position: nullableStringLikeSchema,
    created_on: nullableStringLikeSchema,
    created_by: nullableNumberOrStringSchema,
    updated_on: nullableStringLikeSchema,
    updated_by: nullableNumberOrStringSchema,
  })
  .passthrough();

const pitchActionResponseSchema: z.ZodType<RecruitCrmPitchActionResponse> = z
  .object({
    success: z.union([z.boolean(), z.string(), z.number(), z.null()]).optional(),
    successCode: nullableNumberOrStringSchema,
    statusCode: nullableNumberOrStringSchema,
    message: nullableStringLikeSchema,
    data: pitchRecordSchema,
  })
  .passthrough();

const pitchRecordsResponseSchema: z.ZodType<RecruitCrmPitchRecordsResponse> = z
  .object({
    data: z
      .object({
        records: z.array(pitchRecordSchema).optional(),
      })
      .passthrough()
      .optional(),
    message: nullableStringLikeSchema,
    status: z.union([z.boolean(), z.string(), z.number(), z.null()]).optional(),
    statusCode: nullableNumberOrStringSchema,
    "status code": nullableNumberOrStringSchema,
  })
  .passthrough();

const candidateHiringStageUpdateResponseSchema = z
  .object({
    job_slug: z.union([z.string(), z.number()]),
    candidate_slug: z.union([z.string(), z.number()]),
    status: z
      .object({
        status_id: z.union([z.number(), z.string()]),
        label: nullableStringLikeSchema,
      })
      .passthrough(),
    remark: nullableStringLikeSchema,
    stage_date: nullableStringLikeSchema,
    visibility: z.union([z.number(), z.string(), z.boolean(), z.null()]).optional(),
    shared_list_url: nullableStringLikeSchema,
    updated_on: nullableStringLikeSchema,
    updated_by: nullableNumberOrStringSchema,
  })
  .passthrough();

const jobStatusSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    label: nullableStringLikeSchema,
  })
  .passthrough();

const jobStatusListResponseSchema = z.array(jobStatusSchema);

const offLimitStatusSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    status_label: nullableStringLikeSchema,
    sequence_no: nullableNumberOrStringSchema,
    default: z.union([z.number(), z.string(), z.boolean(), z.null()]).optional(),
  })
  .passthrough();

const offLimitStatusListResponseSchema = z.array(offLimitStatusSchema);

const markOffLimitSlugListSchema = z.union([
  z.string(),
  z.number(),
  z.array(z.union([z.string(), z.number(), z.null()])),
  z.null(),
]);

const markCandidateOffLimitResponseSchema = z
  .object({
    candidate_slugs: markOffLimitSlugListSchema.optional(),
    status_id: nullableNumberOrStringSchema,
    end_date: nullableStringLikeSchema,
    reason: nullableStringLikeSchema,
    remark: nullableStringLikeSchema,
  })
  .passthrough();

const markContactOffLimitResponseSchema = z
  .object({
    contact_slugs: markOffLimitSlugListSchema.optional(),
    status_id: nullableNumberOrStringSchema,
    end_date: nullableStringLikeSchema,
    reason: nullableStringLikeSchema,
    remark: nullableStringLikeSchema,
  })
  .passthrough();

const markCompanyOffLimitResponseSchema = z
  .object({
    company_slugs: markOffLimitSlugListSchema.optional(),
    status_id: nullableNumberOrStringSchema,
    end_date: nullableStringLikeSchema,
    reason: nullableStringLikeSchema,
    remark: nullableStringLikeSchema,
  })
  .passthrough();

const markRecordsAvailableBooleanSchema = z.union([z.number(), z.string(), z.boolean(), z.null()]).optional();

const markRecordsAvailableResponseSchema = z
  .object({
    candidate_slugs: markOffLimitSlugListSchema.optional(),
    contact_slugs: markOffLimitSlugListSchema.optional(),
    company_slugs: markOffLimitSlugListSchema.optional(),
    mark_contact_available: markRecordsAvailableBooleanSchema,
    mark_candidate_available: markRecordsAvailableBooleanSchema,
    remark: nullableStringLikeSchema,
  })
  .passthrough();

const teamUserSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    first_name: nullableStringLikeSchema,
    last_name: nullableStringLikeSchema,
    email: nullableStringLikeSchema,
    contact_number: nullableStringLikeSchema,
    avatar: nullableStringLikeSchema,
  })
  .passthrough();

const teamSchema: z.ZodType<RecruitCrmTeam> = z
  .object({
    team_id: nullableNumberOrStringSchema,
    team_name: nullableStringLikeSchema,
    users: z.array(z.union([z.number(), z.string(), teamUserSchema, z.null()])).nullish(),
  })
  .passthrough();

const teamListResponseSchema = z.array(teamSchema);

const candidateQuestionSchema: z.ZodType<RecruitCrmCandidateQuestion> = z
  .object({
    id: nullableNumberOrStringSchema,
    question: nullableStringLikeSchema,
  })
  .passthrough();

const candidateQuestionListResponseSchema = z.array(candidateQuestionSchema);

const hiringPipelineSummarySchema: z.ZodType<RecruitCrmHiringPipelineSummary> = z
  .object({
    id: nullableNumberOrStringSchema,
    name: nullableStringLikeSchema,
  })
  .passthrough();

const hiringPipelineListResponseSchema = z.array(hiringPipelineSummarySchema);

const languageSchema: z.ZodType<RecruitCrmLanguage> = z
  .object({
    language_id: nullableNumberOrStringSchema,
    code: nullableStringLikeSchema,
    language_name: nullableStringLikeSchema,
  })
  .passthrough();

const languageListResponseSchema = z.array(languageSchema);

const currencySchema: z.ZodType<RecruitCrmCurrency> = z
  .object({
    currency_id: nullableNumberOrStringSchema,
    code: nullableStringLikeSchema,
    country: nullableStringLikeSchema,
    currency: nullableStringLikeSchema,
    symbol: nullableStringLikeSchema,
  })
  .passthrough();

const currencyListResponseSchema = z.array(currencySchema);

const qualificationSchema: z.ZodType<RecruitCrmQualification> = z
  .object({
    qualification_id: nullableNumberOrStringSchema,
    label: nullableStringLikeSchema,
  })
  .passthrough();

const qualificationListResponseSchema = z.array(qualificationSchema);

const xmlJobboardSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    label: nullableStringLikeSchema,
  })
  .passthrough();

const xmlJobboardsResponseSchema: z.ZodType<RecruitCrmXmlJobboardsResponse> = z
  .object({
    default_xml_feeds: z.array(xmlJobboardSchema).optional(),
    custom_xml_feeds: z.array(xmlJobboardSchema).optional(),
  })
  .passthrough();

const userReferenceSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    first_name: nullableStringLikeSchema,
    last_name: nullableStringLikeSchema,
  })
  .passthrough();

const salaryTypeSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    label: nullableStringLikeSchema,
  })
  .passthrough();

const jobSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    slug: nullableStringLikeSchema,
    name: nullableStringLikeSchema,
    company_slug: nullableStringLikeSchema,
    contact_slug: nullableStringLikeSchema,
    secondary_contact_slugs: z.array(z.union([z.string(), z.number(), z.null()])).nullish(),
    note_for_candidates: nullableStringLikeSchema,
    number_of_openings: nullableNumberOrStringSchema,
    minimum_experience: nullableNumberOrStringSchema,
    maximum_experience: nullableNumberOrStringSchema,
    min_annual_salary: nullableNumberOrStringSchema,
    max_annual_salary: nullableNumberOrStringSchema,
    salary_type: z.union([salaryTypeSchema, z.string(), z.number(), z.null()]).optional(),
    job_status: z.union([jobStatusSchema, z.null()]).optional(),
    job_skill: nullableStringLikeSchema,
    job_type: nullableStringLikeSchema,
    pay_rate: nullableNumberOrStringSchema,
    bill_rate: nullableNumberOrStringSchema,
    job_category: nullableStringLikeSchema,
    city: nullableStringLikeSchema,
    locality: nullableStringLikeSchema,
    state: nullableStringLikeSchema,
    country: nullableStringLikeSchema,
    enable_job_application_form: z.union([z.number(), z.string(), z.boolean(), z.null()]).optional(),
    application_form_url: nullableStringLikeSchema,
    created_on: nullableStringLikeSchema,
    updated_on: nullableStringLikeSchema,
    owner: z.union([z.number(), z.string(), userReferenceSchema, z.null()]).optional(),
    hiring_pipeline_id: nullableNumberOrStringSchema,
  })
  .passthrough();

const jobSearchResponseSchema = z.union([
  z
    .object({
      current_page: z.coerce.number().int().positive().optional(),
      next_page_url: z.union([z.string(), z.null()]).optional(),
      data: z.array(jobSchema),
    })
    .passthrough(),
  z.array(z.unknown()).length(0).transform(
    (): RecruitCrmJobSearchResponse => ({
      current_page: 1,
      next_page_url: null,
      data: [],
    }),
  ),
]);

const companySchema = z
  .object({
    id: nullableNumberOrStringSchema,
    slug: nullableStringLikeSchema,
    company_name: nullableStringLikeSchema,
    website: nullableStringLikeSchema,
    city: nullableStringLikeSchema,
    locality: nullableStringLikeSchema,
    state: nullableStringLikeSchema,
    country: nullableStringLikeSchema,
    postal_code: nullableStringLikeSchema,
    address: nullableStringLikeSchema,
    owner: nullableNumberOrStringSchema,
    contact_slug: z
      .union([z.array(z.union([z.string(), z.number(), z.null()])), z.string(), z.number(), z.null()])
      .optional(),
    is_child_company: z.union([z.string(), z.number(), z.boolean(), z.null()]).optional(),
    is_parent_company: z.union([z.string(), z.number(), z.boolean(), z.null()]).optional(),
    child_company_slugs: z.array(z.union([z.string(), z.number(), z.null()])).nullish(),
    parent_company_slug: nullableStringLikeSchema,
    off_limit_status_id: nullableNumberOrStringSchema,
    status_label: nullableStringLikeSchema,
    off_limit_reason: nullableStringLikeSchema,
    off_limit_end_date: nullableStringLikeSchema,
    created_on: nullableStringLikeSchema,
    updated_on: nullableStringLikeSchema,
  })
  .passthrough();

const companySearchResponseSchema = z.union([
  z
    .object({
      current_page: z.coerce.number().int().positive().optional(),
      next_page_url: z.union([z.string(), z.null()]).optional(),
      data: z.array(companySchema),
    })
    .passthrough(),
  z.array(z.unknown()).length(0).transform(
    (): RecruitCrmCompanySearchResponse => ({
      current_page: 1,
      next_page_url: null,
      data: [],
    }),
  ),
]);

const contactSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    slug: z.union([z.string(), z.number()]).transform((value) => String(value)),
    first_name: nullableStringLikeSchema,
    last_name: nullableStringLikeSchema,
    email: nullableStringLikeSchema,
    contact_number: nullableStringLikeSchema,
    linkedin: nullableStringLikeSchema,
    company_slug: nullableStringLikeSchema,
    additional_company_slugs: z.array(z.union([z.string(), z.number(), z.null()])).nullish(),
    designation: nullableStringLikeSchema,
    city: nullableStringLikeSchema,
    locality: nullableStringLikeSchema,
    created_on: nullableStringLikeSchema,
    updated_on: nullableStringLikeSchema,
  })
  .passthrough();

const contactSearchResponseSchema = z.union([
  z
    .object({
      current_page: z.coerce.number().int().positive().optional(),
      next_page_url: z.union([z.string(), z.null()]).optional(),
      data: z.array(contactSchema),
    })
    .passthrough(),
  z.array(z.unknown()).length(0).transform(
    (): RecruitCrmContactSearchResponse => ({
      current_page: 1,
      next_page_url: null,
      data: [],
    }),
  ),
]);

const contactStagePipelineItemSchema = z
  .object({
    stage_id: nullableNumberOrStringSchema,
    label: nullableStringLikeSchema,
  })
  .passthrough();

const contactStagePipelineResponseSchema = z.array(contactStagePipelineItemSchema);

const hotlistSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    name: nullableStringLikeSchema,
    related_to_type: nullableStringLikeSchema,
    related: z.union([z.string(), z.number(), z.null()]).optional(),
    shared: z.union([z.number(), z.string(), z.boolean(), z.null()]).optional(),
    created_by: nullableNumberOrStringSchema,
  })
  .passthrough();

const hotlistSearchResponseSchema = z.union([
  z
    .object({
      current_page: z.coerce.number().int().positive().optional(),
      next_page_url: z.union([z.string(), z.null()]).optional(),
      data: z.array(hotlistSchema),
    })
    .passthrough(),
  z.array(z.unknown()).length(0).transform(
    (): RecruitCrmHotlistSearchResponse => ({
      current_page: 1,
      next_page_url: null,
      data: [],
    }),
  ),
]);

const userTeamSchema = z
  .object({
    team_id: nullableNumberOrStringSchema,
    team_name: nullableStringLikeSchema,
  })
  .passthrough();

const userSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    first_name: nullableStringLikeSchema,
    last_name: nullableStringLikeSchema,
    email: nullableStringLikeSchema,
    contact_number: nullableStringLikeSchema,
    status: nullableStringLikeSchema,
    teams: z.array(z.union([userTeamSchema, z.number()])).nullish(),
  })
  .passthrough();

const userListResponseSchema = z.array(userSchema);

const taskTypeSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    label: nullableStringLikeSchema,
  })
  .passthrough();

const taskTypeListResponseSchema = z.array(taskTypeSchema);

const activityRelatedSchema = z
  .object({
    first_name: nullableStringLikeSchema,
    last_name: nullableStringLikeSchema,
    company_name: nullableStringLikeSchema,
    name: nullableStringLikeSchema,
  })
  .passthrough();

const taskCollaboratorSchema = z
  .object({
    attendee_type: nullableStringLikeSchema,
    attendee_id: nullableStringLikeSchema,
    display_name: nullableStringLikeSchema,
    attendee: z.unknown().optional(),
  })
  .passthrough();

const taskCollaboratorUserSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    first_name: nullableStringLikeSchema,
    last_name: nullableStringLikeSchema,
    email: nullableStringLikeSchema,
    contact_number: nullableStringLikeSchema,
    avatar: nullableStringLikeSchema,
  })
  .passthrough();

const taskCollaboratorTeamSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    team_id: nullableNumberOrStringSchema,
    team_name: nullableStringLikeSchema,
  })
  .passthrough();

const taskAssociatedSlugsSchema = z
  .union([z.array(z.union([z.string(), z.number(), z.null()])), z.string(), z.number(), z.null()])
  .optional();

const taskSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    related_to: nullableStringLikeSchema,
    task_type: z.union([taskTypeSchema, z.array(taskTypeSchema), z.null()]).optional(),
    related_to_type: nullableStringLikeSchema,
    related_to_name: nullableStringLikeSchema,
    related: z.union([activityRelatedSchema, z.null()]).optional(),
    description: nullableStringLikeSchema,
    title: nullableStringLikeSchema,
    status: nullableNumberOrStringSchema,
    start_date: nullableStringLikeSchema,
    reminder_date: nullableStringLikeSchema,
    reminder: nullableNumberOrStringSchema,
    owner: nullableNumberOrStringSchema,
    created_on: nullableStringLikeSchema,
    updated_on: nullableStringLikeSchema,
    created_by: nullableNumberOrStringSchema,
    updated_by: nullableNumberOrStringSchema,
    associated_candidates: taskAssociatedSlugsSchema,
    associated_contacts: taskAssociatedSlugsSchema,
    associated_companies: taskAssociatedSlugsSchema,
    associated_jobs: taskAssociatedSlugsSchema,
    associated_deals: taskAssociatedSlugsSchema,
    collaborators: z.union([z.array(taskCollaboratorSchema), z.null()]).optional(),
    collaborator_users: z
      .union([z.array(z.union([taskCollaboratorUserSchema, z.number(), z.string(), z.null()])), z.null()])
      .optional(),
    collaborator_teams: z
      .union([
        z.array(z.union([taskCollaboratorTeamSchema, z.number(), z.string(), z.null()])),
        z.null(),
      ])
      .optional(),
  })
  .passthrough();

const taskSearchResponseSchema = z
  .union([
    z
      .object({
        current_page: z.coerce.number().int().positive().optional(),
        next_page_url: z.union([z.string(), z.null()]).optional(),
        data: z.array(taskSchema),
      })
      .passthrough(),
    z.array(z.unknown()).length(0).transform(
      (): RecruitCrmTaskSearchResponse => ({
        current_page: 1,
        next_page_url: null,
        data: [],
      }),
    ),
  ]);

const meetingTypeSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    label: nullableStringLikeSchema,
  })
  .passthrough();

const meetingSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    title: nullableStringLikeSchema,
    meeting_type: z.union([meetingTypeSchema, z.array(meetingTypeSchema), z.null()]).optional(),
    description: nullableStringLikeSchema,
    address: nullableStringLikeSchema,
    reminder: nullableNumberOrStringSchema,
    start_date: nullableStringLikeSchema,
    end_date: nullableStringLikeSchema,
    related_to: nullableStringLikeSchema,
    related_to_type: nullableStringLikeSchema,
    related: z.union([activityRelatedSchema, z.string(), z.null()]).optional(),
    do_not_send_calendar_invites: z.union([z.number(), z.string(), z.boolean(), z.null()]).optional(),
    status: nullableNumberOrStringSchema,
    reminder_date: nullableStringLikeSchema,
    all_day: z.union([z.number(), z.string(), z.boolean(), z.null()]).optional(),
    owner: nullableNumberOrStringSchema,
    created_on: nullableStringLikeSchema,
    updated_on: nullableStringLikeSchema,
    created_by: nullableNumberOrStringSchema,
    updated_by: nullableNumberOrStringSchema,
  })
  .passthrough();

const meetingSearchResponseSchema = z
  .union([
    z
      .object({
        current_page: z.coerce.number().int().positive().optional(),
        next_page_url: z.union([z.string(), z.null()]).optional(),
        data: z.array(meetingSchema),
      })
      .passthrough(),
    z.array(z.unknown()).length(0).transform(
      (): RecruitCrmMeetingSearchResponse => ({
        current_page: 1,
        next_page_url: null,
        data: [],
      }),
    ),
  ]);

const meetingTypeListResponseSchema = z.array(meetingTypeSchema);

const createdMeetingSchema = meetingSchema.extend({
  associated_candidates: z.array(z.union([z.string(), z.number()])).optional(),
  associated_companies: z.array(z.union([z.string(), z.number()])).optional(),
  associated_contacts: z.array(z.union([z.string(), z.number()])).optional(),
  associated_jobs: z.array(z.union([z.string(), z.number()])).optional(),
  associated_deals: z.array(z.union([z.string(), z.number()])).optional(),
  collaborator_users: z.array(z.union([z.number(), z.string()])).optional(),
  collaborator_teams: z.array(z.union([z.number(), z.string()])).optional(),
});

const noteTypeSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    label: nullableStringLikeSchema,
  })
  .passthrough();

const noteTypeListResponseSchema = z.array(noteTypeSchema);

const noteCollaboratorUserSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    first_name: nullableStringLikeSchema,
    last_name: nullableStringLikeSchema,
    email: nullableStringLikeSchema,
    contact_number: nullableStringLikeSchema,
    avatar: nullableStringLikeSchema,
  })
  .passthrough();

const noteCollaboratorTeamSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    team_id: nullableNumberOrStringSchema,
    team_name: nullableStringLikeSchema,
  })
  .passthrough();

const noteAssociatedSlugsSchema = z
  .union([z.array(z.union([z.string(), z.number(), z.null()])), z.string(), z.number(), z.null()])
  .optional();

const noteSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    note_type: z.union([noteTypeSchema, z.array(noteTypeSchema), z.null()]).optional(),
    description: nullableStringLikeSchema,
    related_to: nullableStringLikeSchema,
    related_to_type: nullableStringLikeSchema,
    related: z.union([activityRelatedSchema, z.null()]).optional(),
    created_on: nullableStringLikeSchema,
    updated_on: nullableStringLikeSchema,
    created_by: nullableNumberOrStringSchema,
    updated_by: nullableNumberOrStringSchema,
    resource_url: nullableStringLikeSchema,
    associated_candidates: noteAssociatedSlugsSchema,
    associated_contacts: noteAssociatedSlugsSchema,
    associated_companies: noteAssociatedSlugsSchema,
    associated_jobs: noteAssociatedSlugsSchema,
    associated_deals: noteAssociatedSlugsSchema,
    collaborator_users: z.union([z.array(noteCollaboratorUserSchema), z.null()]).optional(),
    collaborator_teams: z
      .union([
        z.array(z.union([noteCollaboratorTeamSchema, z.number(), z.string(), z.null()])),
        z.null(),
      ])
      .optional(),
  })
  .passthrough();

const noteSearchResponseSchema = z
  .union([
    z
      .object({
        current_page: z.coerce.number().int().positive().optional(),
        next_page_url: z.union([z.string(), z.null()]).optional(),
        data: z.array(noteSchema),
      })
      .passthrough(),
    z.array(z.unknown()).length(0).transform(
      (): RecruitCrmNoteSearchResponse => ({
        current_page: 1,
        next_page_url: null,
        data: [],
      }),
    ),
  ]);

const callLogTypeSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    label: nullableStringLikeSchema,
  })
  .passthrough();

const callLogSchema = z
  .object({
    id: nullableNumberOrStringSchema,
    call_type: nullableStringLikeSchema,
    custom_call_type: z.union([callLogTypeSchema, z.array(callLogTypeSchema), z.null()]).optional(),
    call_started_on: nullableStringLikeSchema,
    contact_number: nullableStringLikeSchema,
    call_notes: nullableStringLikeSchema,
    related_to: nullableStringLikeSchema,
    related_to_type: nullableStringLikeSchema,
    related: z.union([activityRelatedSchema, z.string(), z.null()]).optional(),
    duration: nullableNumberOrStringSchema,
    created_on: nullableStringLikeSchema,
    updated_on: nullableStringLikeSchema,
    created_by: nullableNumberOrStringSchema,
    updated_by: nullableNumberOrStringSchema,
  })
  .passthrough();

const callLogSearchResponseSchema = z
  .union([
    z
      .object({
        current_page: z.coerce.number().int().positive().optional(),
        next_page_url: z.union([z.string(), z.null()]).optional(),
        data: z.array(callLogSchema),
      })
      .passthrough(),
    z.array(z.unknown()).length(0).transform(
      (): RecruitCrmCallLogSearchResponse => ({
        current_page: 1,
        next_page_url: null,
        data: [],
      }),
    ),
  ]);

const callLogTypeListResponseSchema = z.array(callLogTypeSchema);

const createdCallLogSchema = callLogSchema.extend({
  associated_candidates: z.array(z.union([z.string(), z.number()])).optional(),
  associated_contacts: z.array(z.union([z.string(), z.number()])).optional(),
  associated_companies: z.array(z.union([z.string(), z.number()])).optional(),
  associated_jobs: z.array(z.union([z.string(), z.number()])).optional(),
  associated_deals: z.array(z.union([z.string(), z.number()])).optional(),
  collaborator_users: z.array(z.union([z.number(), z.string()])).optional(),
  collaborator_teams: z.array(z.union([z.number(), z.string()])).optional(),
});

const candidateJobAssignmentHiringStageHistoryItemSchema = z
  .object({
    job_slug: nullableStringLikeSchema,
    job_name: nullableStringLikeSchema,
    company_slug: nullableStringLikeSchema,
    company_name: nullableStringLikeSchema,
    job_status_id: nullableNumberOrStringSchema,
    job_status_label: nullableStringLikeSchema,
    candidate_status_id: nullableNumberOrStringSchema,
    candidate_status: nullableStringLikeSchema,
    remark: nullableStringLikeSchema,
    updated_by: nullableNumberOrStringSchema,
    updated_on: nullableStringLikeSchema,
  })
  .passthrough();

const candidateJobAssignmentHiringStageHistoryResponseSchema = z.array(
  candidateJobAssignmentHiringStageHistoryItemSchema,
);

const candidateCustomFieldSchema = z
  .object({
    field_id: z.coerce.number().int().positive(),
    field_type: z.string(),
    field_name: z.string(),
    default_value: z.unknown().optional(),
  })
  .passthrough();

const candidateCustomFieldsResponseSchema = z.array(candidateCustomFieldSchema);

type NestedFieldNode = {
  field_id: number;
  field_name: string;
  field_type: string;
  dependency: Record<string, string> | unknown[];
  visibility: Record<string, string> | unknown[];
  children: Record<string, unknown> | unknown[];
};

const nestedCustomFieldsResponseSchema = z.union([
  z.record(z.string(), z.unknown()),
  z.array(z.unknown()).length(0).transform((): Record<string, unknown> => ({})),
]);
const candidateDetailSchema: z.ZodType<CandidateDetail> = z
  .object({
    id: nullableNumberOrStringSchema,
    slug: nullableStringLikeSchema,
    custom_fields: z.array(z.unknown()).optional(),
    work_history: z.array(z.unknown()).optional(),
    education_history: z.array(z.unknown()).optional(),
  })
  .passthrough();
const companyDetailSchema: z.ZodType<CompanyDetail> = z
  .object({
    id: nullableNumberOrStringSchema,
    slug: nullableStringLikeSchema,
    custom_fields: z.array(z.unknown()).optional(),
  })
  .passthrough();
const contactDetailSchema: z.ZodType<ContactDetail> = z
  .object({
    id: nullableNumberOrStringSchema,
    slug: nullableStringLikeSchema,
    company_slug: nullableStringLikeSchema,
    custom_fields: z.array(z.unknown()).optional(),
  })
  .passthrough();
const jobDetailSchema: z.ZodType<JobDetail> = z
  .object({
    id: nullableNumberOrStringSchema,
    slug: nullableStringLikeSchema,
    company_slug: nullableStringLikeSchema,
    contact_slug: nullableStringLikeSchema,
    secondary_contact_slugs: z.array(z.unknown()).nullish(),
    job_questions: z.array(z.unknown()).optional(),
    custom_fields: z.array(z.unknown()).optional(),
    targetcompanies: z.array(z.unknown()).optional(),
    collaborator_users: z.array(z.unknown()).optional(),
    collaborator_teams: z.array(z.unknown()).optional(),
    xml_feeds: z.array(z.unknown()).optional(),
  })
  .passthrough();
const candidateHistoryCreateResponseSchema: z.ZodType<CandidateHistoryCreateResponse> = z
  .object({
    success: z.union([z.boolean(), z.number(), z.string(), z.null()]).optional(),
    statusCode: nullableNumberOrStringSchema,
    message: nullableStringLikeSchema,
  })
  .passthrough();

export class RecruitCrmClient {
  readonly #apiToken: string;
  readonly #baseUrl: string;
  readonly #timeoutMs: number;
  readonly #debugSchemaErrors: boolean;
  readonly #transport: HttpTransport;

  constructor(config: AppConfig, transport: HttpTransport = nodeHttpTransport) {
    this.#apiToken = config.apiToken;
    this.#baseUrl = config.baseUrl;
    this.#timeoutMs = config.timeoutMs;
    this.#debugSchemaErrors = config.debugSchemaErrors;
    this.#transport = transport;
  }

  async searchCandidates(filters: SearchCandidatesInput): Promise<RecruitCrmSearchResponse> {
    const request = buildSearchCandidatesRequest(filters);

    return this.#requestJson("/candidates/search", searchResponseSchema, request, "Candidate");
  }

  async listCandidates(filters: ListCandidatesInput): Promise<RecruitCrmSearchResponse> {
    const request = buildListPaginationRequest(filters);

    return this.#requestJson("/candidates", searchResponseSchema, request, "Candidate");
  }

  async createCandidate(input: CreateCandidateInput): Promise<CreatedCandidate> {
    const request = buildCreateCandidateRequest(input);

    return this.#requestJson("/candidates", candidateSchema, request, "Candidate");
  }

  async updateCandidate(candidateSlug: string, input: UpdateCandidateInput): Promise<CreatedCandidate> {
    const request = buildUpdateCandidateRequest(input);

    return this.#requestJson(
      `/candidates/${encodeURIComponent(candidateSlug)}`,
      candidateSchema,
      request,
      "Candidate",
    );
  }

  async createCandidateWorkHistory(
    candidateSlug: string,
    workHistory: CreateCandidateWorkHistoryInput[],
  ): Promise<CandidateHistoryCreateResponse> {
    const request = buildCreateCandidateWorkHistoryRequest(candidateSlug, workHistory);

    return this.#requestJson(
      "/candidates/work-history/create",
      candidateHistoryCreateResponseSchema,
      request,
      "Candidate work history",
    );
  }

  async createCandidateEducationHistory(
    candidateSlug: string,
    educationHistory: CreateCandidateEducationHistoryInput[],
  ): Promise<CandidateHistoryCreateResponse> {
    const request = buildCreateCandidateEducationHistoryRequest(candidateSlug, educationHistory);

    return this.#requestJson(
      "/candidates/education-history/create",
      candidateHistoryCreateResponseSchema,
      request,
      "Candidate education history",
    );
  }

  async getJobAssignedCandidates(
    jobSlug: string,
    filters: GetJobAssignedCandidatesInput,
  ): Promise<RecruitCrmJobAssignedCandidatesResponse> {
    const request = buildGetJobAssignedCandidatesRequest(filters);

    return this.#requestJson(
      `/jobs/${encodeURIComponent(jobSlug)}/assigned-candidates`,
      jobAssignedCandidatesResponseSchema,
      request,
      "Job",
    );
  }

  async searchJobs(filters: SearchJobsInput): Promise<RecruitCrmJobSearchResponse> {
    const request = buildSearchJobsRequest(filters);

    return this.#requestJson("/jobs/search", jobSearchResponseSchema, request, "Job");
  }

  async listJobs(filters: ListJobsInput): Promise<RecruitCrmJobSearchResponse> {
    const request = buildListPaginationRequest(filters);

    return this.#requestJson("/jobs", jobSearchResponseSchema, request, "Job");
  }

  async createJob(input: CreateJobInput): Promise<CreatedJob> {
    return this.#requestJson(
      "/jobs",
      jobSchema,
      buildCreateJobRequest(input),
      "Job",
    );
  }

  async updateJob(jobSlug: string, input: UpdateJobInput): Promise<CreatedJob> {
    return this.#requestJson(
      `/jobs/${encodeURIComponent(jobSlug)}`,
      jobSchema,
      buildUpdateJobRequest(input),
      "Job",
    );
  }

  async searchCompanies(filters: SearchCompaniesInput): Promise<RecruitCrmCompanySearchResponse> {
    const request = buildSearchCompaniesRequest(filters);

    return this.#requestJson("/companies/search", companySearchResponseSchema, request, "Company");
  }

  async listCompanies(filters: ListCompaniesInput): Promise<RecruitCrmCompanySearchResponse> {
    const request = buildListPaginationRequest(filters);

    return this.#requestJson("/companies", companySearchResponseSchema, request, "Company");
  }

  async createCompany(input: CreateCompanyInput): Promise<CreatedCompany> {
    return this.#requestJson(
      "/companies",
      companySchema,
      buildCreateCompanyRequest(input),
      "Company",
    );
  }

  async updateCompany(companySlug: string, input: UpdateCompanyInput): Promise<CreatedCompany> {
    return this.#requestJson(
      `/companies/${encodeURIComponent(companySlug)}`,
      companySchema,
      buildUpdateCompanyRequest(input),
      "Company",
    );
  }

  async searchContacts(filters: SearchContactsInput): Promise<RecruitCrmContactSearchResponse> {
    const request = buildSearchContactsRequest(filters);

    return this.#requestJson("/contacts/search", contactSearchResponseSchema, request, "Contact");
  }

  async listContacts(filters: ListContactsInput): Promise<RecruitCrmContactSearchResponse> {
    const request = buildListPaginationRequest(filters);

    return this.#requestJson("/contacts", contactSearchResponseSchema, request, "Contact");
  }

  async createContact(input: CreateContactInput): Promise<CreatedContact> {
    return this.#requestJson(
      "/contacts",
      contactSchema,
      buildCreateContactRequest(input),
      "Contact",
    );
  }

  async updateContact(contactSlug: string, input: UpdateContactInput): Promise<CreatedContact> {
    return this.#requestJson(
      `/contacts/${encodeURIComponent(contactSlug)}`,
      contactSchema,
      buildUpdateContactRequest(input),
      "Contact",
    );
  }

  async listContactStages(): Promise<RecruitCrmContactStagePipelineResponse> {
    return this.#requestJson("/sales-pipeline", contactStagePipelineResponseSchema, {}, "Contact stage");
  }

  async listOffLimitStatuses(): Promise<RecruitCrmOffLimitStatusListResponse> {
    return this.#requestJson("/off-limit-status", offLimitStatusListResponseSchema, {}, "Off-limit status");
  }

  async markCandidateOffLimit(
    input: MarkCandidateOffLimitInput,
  ): Promise<RecruitCrmMarkCandidateOffLimitResponse> {
    return this.#requestJson(
      "/candidates/mark-off-limit",
      markCandidateOffLimitResponseSchema,
      buildMarkCandidateOffLimitRequest(input),
      "Candidate off-limit",
    );
  }

  async markContactOffLimit(input: MarkContactOffLimitInput): Promise<RecruitCrmMarkContactOffLimitResponse> {
    return this.#requestJson(
      "/contacts/mark-off-limit",
      markContactOffLimitResponseSchema,
      buildMarkContactOffLimitRequest(input),
      "Contact off-limit",
    );
  }

  async markCompanyOffLimit(input: MarkCompanyOffLimitInput): Promise<RecruitCrmMarkCompanyOffLimitResponse> {
    return this.#requestJson(
      "/companies/mark-off-limit",
      markCompanyOffLimitResponseSchema,
      buildMarkCompanyOffLimitRequest(input),
      "Company off-limit",
    );
  }

  async markRecordsAvailable(input: MarkRecordsAvailableInput): Promise<RecruitCrmMarkRecordsAvailableResponse> {
    try {
      if (input.record_type === "candidate") {
        return await this.#requestJson(
          "/candidates/mark-as-available",
          markRecordsAvailableResponseSchema,
          buildMarkCandidateAvailableRequest(input),
          "Candidate availability",
        );
      }

      if (input.record_type === "contact") {
        return await this.#requestJson(
          "/contacts/mark-as-available",
          markRecordsAvailableResponseSchema,
          buildMarkContactAvailableRequest(input),
          "Contact availability",
        );
      }

      return await this.#requestJson(
        "/companies/mark-as-available",
        markRecordsAvailableResponseSchema,
        buildMarkCompanyAvailableRequest(input),
        "Company availability",
      );
    } catch (error) {
      throw normalizeMarkRecordsAvailableError(error, input.record_type);
    }
  }

  async searchHotlists(filters: SearchHotlistsInput): Promise<RecruitCrmHotlistSearchResponse> {
    const request = buildSearchHotlistsRequest(filters);

    return this.#requestJson("/hotlists/search", hotlistSearchResponseSchema, request, "Hotlist");
  }

  async createHotlist(input: CreateHotlistInput): Promise<CreatedHotlist> {
    return this.#requestJson(
      "/hotlists",
      hotlistSchema,
      {
        method: "POST",
        jsonBody: input,
      },
      "Hotlist",
    );
  }

  async listUsers(filters: ListUsersInput): Promise<RecruitCrmUserListResponse> {
    const request = buildListUsersRequest(filters);

    return this.#requestJson("/users", userListResponseSchema, request, "User");
  }

  async listTeams(input: ListTeamsInput = {}): Promise<RecruitCrmTeam[]> {
    const query = new URLSearchParams();
    if (input.expand !== undefined) query.set("expand", input.expand);

    return this.#requestJson("/teams", teamListResponseSchema, { query }, "Team");
  }

  async listCandidateQuestions(): Promise<RecruitCrmCandidateQuestion[]> {
    return this.#requestJson("/candidate-questions", candidateQuestionListResponseSchema, {}, "Candidate question");
  }

  async listHiringPipelines(): Promise<RecruitCrmHiringPipelineSummary[]> {
    return this.#requestJson("/hiring-pipelines", hiringPipelineListResponseSchema, {}, "Hiring pipeline");
  }

  async listLanguages(): Promise<RecruitCrmLanguage[]> {
    return this.#requestJson("/languages", languageListResponseSchema, {}, "Language");
  }

  async listCurrencies(): Promise<RecruitCrmCurrency[]> {
    return this.#requestJson("/currencies", currencyListResponseSchema, {}, "Currency");
  }

  async listQualifications(): Promise<RecruitCrmQualification[]> {
    return this.#requestJson("/qualifications", qualificationListResponseSchema, {}, "Qualification");
  }

  async listXmlJobboards(): Promise<RecruitCrmXmlJobboardsResponse> {
    return this.#requestJson("/jobs/list-xml-jobboards", xmlJobboardsResponseSchema, {}, "XML job board");
  }

  async addRecordToHotlist(hotlistId: number, relatedSlug: string): Promise<void> {
    await this.#request(
      `/hotlists/${encodeURIComponent(String(hotlistId))}/add-record`,
      {
        method: "POST",
        jsonBody: {
          related: relatedSlug,
        },
      },
      "Hotlist",
    );
  }

  async searchTasks(filters: SearchTasksInput): Promise<RecruitCrmTaskSearchResponse> {
    const request = buildSearchTasksRequest(filters);

    return this.#requestJson("/tasks/search", taskSearchResponseSchema, request, "Task");
  }

  async listTaskTypes(): Promise<RecruitCrmTaskTypeListResponse> {
    return this.#requestJson("/task-types", taskTypeListResponseSchema, {}, "Task type");
  }

  async createTask(input: CreateTaskInput): Promise<CreatedTask> {
    const request = buildCreateTaskRequest(input);

    return this.#requestJson("/tasks", taskSchema, request, "Task");
  }

  async updateTask(taskId: number, input: UpdateTaskInput): Promise<CreatedTask> {
    const request = buildUpdateTaskRequest(input);

    return this.#requestJson(`/tasks/${encodeURIComponent(String(taskId))}`, taskSchema, request, "Task");
  }

  async searchMeetings(filters: SearchMeetingsInput): Promise<RecruitCrmMeetingSearchResponse> {
    const request = buildSearchMeetingsRequest(filters);

    return this.#requestJson("/meetings/search", meetingSearchResponseSchema, request, "Meeting");
  }

  async listMeetingTypes(): Promise<RecruitCrmMeetingTypeListResponse> {
    return this.#requestJson("/meeting-types", meetingTypeListResponseSchema, {}, "Meeting type");
  }

  async createMeeting(input: CreateMeetingInput): Promise<CreatedMeeting> {
    const request = buildCreateMeetingRequest(input);

    return this.#requestJson("/meetings", createdMeetingSchema, request, "Meeting");
  }

  async updateMeeting(meetingId: number, input: UpdateMeetingInput): Promise<CreatedMeeting> {
    const request = buildUpdateMeetingRequest(input);

    return this.#requestJson(
      `/meetings/${encodeURIComponent(String(meetingId))}`,
      createdMeetingSchema,
      request,
      "Meeting",
    );
  }

  async searchNotes(filters: SearchNotesInput): Promise<RecruitCrmNoteSearchResponse> {
    const request = buildSearchNotesRequest(filters);

    return this.#requestJson("/notes/search", noteSearchResponseSchema, request, "Note");
  }

  async listNoteTypes(): Promise<RecruitCrmNoteTypeListResponse> {
    return this.#requestJson("/note-types", noteTypeListResponseSchema, {}, "Note type");
  }

  async createNote(input: CreateNoteInput): Promise<CreatedNote> {
    const request = buildCreateNoteRequest(input);

    return this.#requestJson("/notes", noteSchema, request, "Note");
  }

  async updateNote(noteId: number, input: UpdateNoteInput): Promise<CreatedNote> {
    const request = buildUpdateNoteRequest(input);

    return this.#requestJson(`/notes/${encodeURIComponent(String(noteId))}`, noteSchema, request, "Note");
  }

  async searchCallLogs(filters: SearchCallLogsInput): Promise<RecruitCrmCallLogSearchResponse> {
    const request = buildSearchCallLogsRequest(filters);

    return this.#requestJson("/call-logs/search", callLogSearchResponseSchema, request, "Call log");
  }

  async listCallTypes(): Promise<RecruitCrmCallLogTypeListResponse> {
    return this.#requestJson("/custom-call-types", callLogTypeListResponseSchema, {}, "Call type");
  }

  async createCallLog(input: CreateCallLogInput): Promise<CreatedCallLog> {
    const request = buildCreateCallLogRequest(input);

    return this.#requestJson("/call-logs", createdCallLogSchema, request, "Call log");
  }

  async updateCallLog(callLogId: number, input: UpdateCallLogInput): Promise<CreatedCallLog> {
    const request = buildUpdateCallLogRequest(input);

    return this.#requestJson(
      `/call-logs/${encodeURIComponent(String(callLogId))}`,
      createdCallLogSchema,
      request,
      "Call log",
    );
  }

  async getCandidateJobAssignmentHiringStageHistory(
    candidateSlug: string,
  ): Promise<RecruitCrmCandidateJobAssignmentHiringStageHistoryResponse> {
    return this.#requestJson(
      `/candidates/${encodeURIComponent(candidateSlug)}/history`,
      candidateJobAssignmentHiringStageHistoryResponseSchema,
      {},
      "Candidate",
    );
  }

  async getCandidateDetails(candidateSlug: string): Promise<CandidateDetail> {
    return this.#requestJson(
      `/candidates/${encodeURIComponent(candidateSlug)}`,
      candidateDetailSchema,
      {},
      "Candidate",
    );
  }

  async getCompanyDetails(companySlug: string): Promise<CompanyDetail> {
    return this.#requestJson(
      `/companies/${encodeURIComponent(companySlug)}`,
      companyDetailSchema,
      {},
      "Company",
    );
  }

  async getContactDetails(contactSlug: string): Promise<ContactDetail> {
    return this.#requestJson(
      `/contacts/${encodeURIComponent(contactSlug)}`,
      contactDetailSchema,
      {},
      "Contact",
    );
  }

  async getJobDetails(jobSlug: string): Promise<JobDetail> {
    return this.#requestJson(`/jobs/${encodeURIComponent(jobSlug)}`, jobDetailSchema, {}, "Job");
  }

  async getCustomFields(): Promise<RecruitCrmCandidateCustomField[]> {
    return this.#requestJson(
      "/custom-fields",
      candidateCustomFieldsResponseSchema,
      {},
      "Custom field",
    );
  }

  async getCandidateCustomFields(): Promise<RecruitCrmCandidateCustomField[]> {
    return this.#requestJson(
      "/custom-fields/candidates",
      candidateCustomFieldsResponseSchema,
      {},
      "Candidate custom field",
    );
  }

  async getEntityCustomFields(entityType: "contact" | "job" | "company"): Promise<RecruitCrmCandidateCustomField[]> {
    const query = new URLSearchParams({ entity_type: entityType });
    return this.#requestJson(
      "/custom-fields",
      candidateCustomFieldsResponseSchema,
      { query },
      `${entityType} custom field`,
    );
  }

  async getCustomFieldDependencies(entityType: string, fieldId?: number): Promise<CustomFieldDependenciesOutput> {
    const query = new URLSearchParams({ entity_type: entityType });
    if (fieldId !== undefined) query.set("field_id", String(fieldId));
    const raw = await this.#requestJson(
      "/nested-custom-fields",
      nestedCustomFieldsResponseSchema,
      { query },
      "nested custom fields",
    );
    return buildCustomFieldDependenciesOutput(entityType, raw as Record<string, unknown>);
  }

  async listCandidateHiringStages(
    input: ListCandidateHiringStagesInput = {},
  ): Promise<RecruitCrmHiringPipelineResponse> {
    const pipelineId = input.hiring_pipeline_id ?? 0;
    return this.#requestJson(
      `/hiring-pipelines/${encodeURIComponent(String(pipelineId))}`,
      hiringPipelineResponseSchema,
      {},
      "Hiring pipeline",
    );
  }

  async listPitchStages(): Promise<RecruitCrmPitchPipelineResponse> {
    return this.#requestJson("/pitch-pipeline", pitchPipelineResponseSchema, {}, "Pitch pipeline");
  }

  async pitchCandidateToContact(input: PitchCandidateToContactInput): Promise<RecruitCrmPitchActionResponse> {
    return this.#requestJson(
      `/pitch/${encodeURIComponent(input.candidate_slug)}/contact/${encodeURIComponent(input.contact_slug)}`,
      pitchActionResponseSchema,
      buildPitchCandidateToContactRequest(input),
      "Candidate pitch",
    );
  }

  async updateCandidatePitchStage(input: UpdateCandidatePitchStageInput): Promise<RecruitCrmPitchActionResponse> {
    return this.#requestJson(
      `/pitch/${encodeURIComponent(input.candidate_slug)}/updated-stage/${encodeURIComponent(input.contact_slug)}`,
      pitchActionResponseSchema,
      buildUpdateCandidatePitchStageRequest(input),
      "Candidate pitch stage",
    );
  }

  async getPitchHistory(entityType: PitchEntityType, entitySlug: string): Promise<RecruitCrmPitchRecordsResponse> {
    const entityPath = entityType === "candidate" ? "pitch-candidate-history" : "pitch-contact-history";
    return this.#requestJson(
      `/pitch/${entityPath}/${encodeURIComponent(entitySlug)}`,
      pitchRecordsResponseSchema,
      {},
      "Pitch history",
    );
  }

  async getPitchedRecords(entityType: PitchEntityType, entitySlug: string): Promise<RecruitCrmPitchRecordsResponse> {
    return this.#requestJson(
      `/pitch/${encodeURIComponent(entityType)}/pitch-stage/${encodeURIComponent(entitySlug)}`,
      pitchRecordsResponseSchema,
      {},
      "Pitch stage",
    );
  }

  async updateCandidateHiringStage(
    input: UpdateCandidateHiringStageInput,
  ): Promise<RecruitCrmCandidateHiringStageUpdateResponse> {
    const request = buildUpdateCandidateHiringStageRequest(input);
    const path = `/candidates/${encodeURIComponent(input.candidate_slug)}/hiring-stages/${encodeURIComponent(input.job_slug)}`;

    try {
      return await this.#requestJson(
        path,
        candidateHiringStageUpdateResponseSchema,
        request,
        "Candidate hiring stage",
      );
    } catch (error) {
      if (
        error instanceof RecruitCrmApiError &&
        error.message.startsWith("Recruit CRM API returned an unexpected response shape")
      ) {
        throw new RecruitCrmApiError(
          "Recruit CRM did not confirm the candidate hiring stage update. The candidate/job assignment may not exist, updated_by may be invalid, or the stage may not be valid for this job's hiring pipeline.",
          error.statusCode,
          error,
        );
      }

      throw error;
    }
  }

  async assignCandidateToJob(
    input: AssignCandidateToJobInput,
  ): Promise<RecruitCrmCandidateJobAssignmentResponse> {
    const request = buildAssignCandidateToJobRequest(input);
    const path = `/candidates/${encodeURIComponent(input.candidate_slug)}/assign`;

    try {
      return await this.#requestJson(
        path,
        candidateHiringStageUpdateResponseSchema,
        request,
        "Candidate",
      );
    } catch (error) {
      if (
        error instanceof RecruitCrmApiError &&
        error.message.startsWith("Recruit CRM API returned an unexpected response shape")
      ) {
        throw new RecruitCrmApiError(
          "Recruit CRM did not confirm the candidate job assignment. The candidate or job may not exist, updated_by may be invalid, or the candidate may already be assigned to this job.",
          error.statusCode,
          error,
        );
      }

      throw error;
    }
  }

  async listJobStatuses(): Promise<RecruitCrmJobStatusListResponse> {
    return this.#requestJson("/jobs-pipeline", jobStatusListResponseSchema, {}, "Job pipeline");
  }

  async #request(path: string, options: RequestOptions = {}, entity?: string): Promise<{ bodyText: string }> {
    const url = new URL(`${this.#baseUrl}${path}`);

    if (options.query) {
      url.search = options.query.toString();
    }

    let response;

    try {
      response = await this.#transport({
        url,
        method: options.method ?? "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.#apiToken}`,
        },
        jsonBody: options.jsonBody,
        timeoutMs: this.#timeoutMs,
      });
    } catch (error) {
      throw mapFetchError(error);
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw mapHttpError(response.statusCode, response.bodyText, entity);
    }

    return response;
  }

  async #requestJson<T>(
    path: string,
    schema: z.ZodType<T>,
    options: RequestOptions = {},
    entity?: string,
  ): Promise<T> {
    const response = await this.#request(path, options, entity);

    let payload: unknown;

    try {
      payload = JSON.parse(response.bodyText);
    } catch {
      throw invalidApiResponse(path);
    }

    const parsed = schema.safeParse(payload);

    if (!parsed.success) {
      this.#logSchemaIssues(path, parsed.error.issues);
      throw invalidApiResponse(path, parsed.error.issues);
    }

    return parsed.data;
  }

  #logSchemaIssues(path: string, issues: Array<{ path: PropertyKey[]; message: string }>): void {
    if (!this.#debugSchemaErrors || issues.length === 0) {
      return;
    }

    const formattedIssues = issues
      .slice(0, 5)
      .map((issue) => `${formatIssuePath(issue.path)}: ${issue.message}`)
      .join("; ");
    const moreIssues = issues.length > 5 ? `; +${issues.length - 5} more` : "";

    console.error(`Recruit CRM schema mismatch for ${path}: ${formattedIssues}${moreIssues}`);
  }
}

export type RequestOptions = {
  method?: "GET" | "POST";
  query?: URLSearchParams;
  jsonBody?: unknown;
};

export type GetRequestOptions = RequestOptions;

type SearchCustomFieldsBody = Array<{
  field_id: number;
  filter_type: string;
  filter_value?: string | number;
}>;

export function buildSearchCandidatesRequest(filters: SearchCandidatesInput): GetRequestOptions {
  const query = new URLSearchParams();
  const page = normalizePage(filters.page);
  const limit = normalizeLimit(filters.limit);

  query.set("page", String(page));
  query.set("limit", String(limit));

  if (filters.candidate_slug) {
    query.set("candidate_slug", filters.candidate_slug);
    return { query };
  }

  setStringParam(query, "created_from", filters.created_from);
  setStringParam(query, "created_to", filters.created_to);
  setStringParam(query, "email", filters.email);
  setStringParam(query, "first_name", filters.first_name);
  setStringParam(query, "last_name", filters.last_name);
  setStringParam(query, "linkedin", filters.linkedin);
  setBooleanParam(query, "marked_as_off_limit", filters.marked_as_off_limit);
  setStringParam(query, "owner_email", filters.owner_email);
  setStringParam(query, "owner_id", filters.owner_id);
  setStringParam(query, "owner_name", filters.owner_name);
  setStringParam(query, "state", filters.state);
  setStringParam(query, "updated_from", filters.updated_from);
  setStringParam(query, "updated_to", filters.updated_to);
  setStringParam(query, "contact_number", filters.contact_number);
  setStringParam(query, "country", filters.country);
  setBooleanParam(query, "exact_search", filters.exact_search);
  query.set("sort_by", filters.sort_by ?? "updatedon");
  query.set("sort_order", filters.sort_order ?? "desc");

  const customFields = buildSearchCustomFieldsBody(filters.custom_fields);

  if (!customFields) {
    return { query };
  }

  return {
    query,
    jsonBody: {
      custom_fields: customFields,
    },
  };
}

export function buildListPaginationRequest(
  filters: { limit?: number; page?: number; sort_by?: "createdon" | "updatedon"; sort_order?: "asc" | "desc" },
): GetRequestOptions {
  const query = new URLSearchParams();
  const page = normalizePage(filters.page);
  const limit = normalizeLimit(filters.limit);

  query.set("page", String(page));
  query.set("limit", String(limit));
  query.set("sort_by", filters.sort_by ?? "updatedon");
  query.set("sort_order", filters.sort_order ?? "desc");

  return { query };
}

export const buildListCandidatesRequest = buildListPaginationRequest;
export const buildListContactsRequest = buildListPaginationRequest;

export function buildCreateJobRequest(input: CreateJobInput): RequestOptions {
  return {
    method: "POST",
    jsonBody: buildJobBody(input),
  };
}

export function buildUpdateJobRequest(input: UpdateJobInput): RequestOptions {
  return {
    method: "POST",
    jsonBody: buildJobBody(input),
  };
}

export function buildCreateContactRequest(input: CreateContactInput): RequestOptions {
  const {
    contact_slug: _contactSlug,
    allow_duplicate: _allowDuplicate,
    custom_fields,
    ...fields
  } = input as CreateContactInput & { contact_slug?: string };
  const body = stripUndefinedValues(fields);
  if (custom_fields !== undefined) {
    body.custom_fields = custom_fields.map((cf) => ({ field_id: cf.field_id, value: cf.value }));
  }
  return { method: "POST", jsonBody: body };
}

export function buildCreateCompanyRequest(input: CreateCompanyInput): RequestOptions {
  const { allow_duplicate: _allowDuplicate, custom_fields, ...fields } = input;
  const body = stripUndefinedValues(fields);
  if (custom_fields !== undefined) {
    body.custom_fields = custom_fields.map((cf) => ({ field_id: cf.field_id, value: cf.value }));
  }
  return { method: "POST", jsonBody: body };
}

export function buildUpdateCompanyRequest(input: UpdateCompanyInput): RequestOptions {
  const { company_slug: _companySlug, custom_fields, ...fields } = input;
  const body = stripUndefinedValues(fields);
  if (custom_fields !== undefined) {
    body.custom_fields = custom_fields.map((cf) => ({ field_id: cf.field_id, value: cf.value }));
  }
  return { method: "POST", jsonBody: body };
}

export function buildUpdateContactRequest(input: UpdateContactInput): RequestOptions {
  const { contact_slug: _contactSlug, custom_fields, ...fields } = input;
  const body = stripUndefinedValues(fields);
  if (custom_fields !== undefined) {
    body.custom_fields = custom_fields.map((cf) => ({ field_id: cf.field_id, value: cf.value }));
  }
  return { method: "POST", jsonBody: body };
}

export function buildMarkCandidateOffLimitRequest(input: MarkCandidateOffLimitInput): RequestOptions {
  return {
    method: "POST",
    jsonBody: stripUndefinedValues({
      candidate_slugs: input.candidate_slugs.join(","),
      status_id: input.status_id,
      end_date: input.end_date,
      reason: input.reason,
    }),
  };
}

export function buildMarkContactOffLimitRequest(input: MarkContactOffLimitInput): RequestOptions {
  return {
    method: "POST",
    jsonBody: stripUndefinedValues({
      contact_slugs: input.contact_slugs.join(","),
      status_id: input.status_id,
      end_date: input.end_date,
      reason: input.reason,
    }),
  };
}

export function buildMarkCompanyOffLimitRequest(input: MarkCompanyOffLimitInput): RequestOptions {
  return {
    method: "POST",
    jsonBody: stripUndefinedValues({
      company_slugs: input.company_slugs.join(","),
      status_id: input.status_id,
      end_date: input.end_date,
      reason: input.reason,
      mark_contact_off_limit: input.mark_contact_off_limit,
      mark_candidate_off_limit: input.mark_candidate_off_limit,
    }),
  };
}

export function buildMarkCandidateAvailableRequest(input: Pick<MarkRecordsAvailableInput, "slugs">): RequestOptions {
  return {
    method: "POST",
    jsonBody: {
      candidate_slugs: input.slugs.join(","),
    },
  };
}

export function buildMarkContactAvailableRequest(input: Pick<MarkRecordsAvailableInput, "slugs">): RequestOptions {
  return {
    method: "POST",
    jsonBody: {
      contact_slugs: input.slugs.join(","),
    },
  };
}

export function buildMarkCompanyAvailableRequest(
  input: Pick<MarkRecordsAvailableInput, "slugs" | "mark_contact_available" | "mark_candidate_available">,
): RequestOptions {
  return {
    method: "POST",
    jsonBody: stripUndefinedValues({
      company_slugs: input.slugs.join(","),
      mark_contact_available: input.mark_contact_available,
      mark_candidate_available: input.mark_candidate_available,
    }),
  };
}

function normalizeMarkRecordsAvailableError(
  error: unknown,
  recordType: MarkRecordsAvailableInput["record_type"],
): unknown {
  if (
    error instanceof RecruitCrmApiError &&
    error.statusCode === 422 &&
    /at least one value must change/i.test(error.message)
  ) {
    return new RecruitCrmApiError(
      `Recruit CRM did not mark the ${recordType} record(s) available because they are already available or the requested availability settings would not change anything. No record was changed.`,
      error.statusCode,
      error,
    );
  }

  return error;
}

function buildJobBody(input: CreateJobInput | UpdateJobInput): Record<string, unknown> {
  const {
    job_slug: _jobSlug,
    custom_fields,
    secondary_contact_slugs,
    targetcompanies,
    collaborator_user_ids,
    collaborator_team_ids,
    enable_auto_populate_teams,
    ...fields
  } = input as (CreateJobInput | UpdateJobInput) & { job_slug?: string };
  const body = stripUndefinedValues(fields);

  setOptionalCsvBody(body, "secondary_contact_slugs", secondary_contact_slugs);
  setOptionalCsvBody(body, "targetcompanies", targetcompanies);
  setOptionalCsvBody(body, "collaborator_user_ids", collaborator_user_ids);
  setOptionalCsvBody(body, "collaborator_team_ids", collaborator_team_ids);

  if (enable_auto_populate_teams !== undefined) {
    body.enable_auto_populate_teams = enable_auto_populate_teams ? 1 : 0;
  }

  if (custom_fields !== undefined) {
    body.custom_fields = custom_fields.map((cf) => ({ field_id: cf.field_id, value: cf.value }));
  }

  return body;
}

export function buildCreateCandidateRequest(input: CreateCandidateInput): RequestOptions {
  return {
    method: "POST",
    jsonBody: buildCreateCandidateBody(input),
  };
}

export function buildUpdateCandidateRequest(input: UpdateCandidateInput): RequestOptions {
  return {
    method: "POST",
    jsonBody: buildUpdateCandidateBody(input),
  };
}

export function buildCreateCandidateWorkHistoryRequest(
  candidateSlug: string,
  workHistory: CreateCandidateWorkHistoryInput[],
): RequestOptions {
  return {
    method: "POST",
    jsonBody: workHistory.map((entry) => ({
      candidate_slug: candidateSlug,
      ...stripUndefinedValues(entry),
    })),
  };
}

export function buildCreateCandidateEducationHistoryRequest(
  candidateSlug: string,
  educationHistory: CreateCandidateEducationHistoryInput[],
): RequestOptions {
  return {
    method: "POST",
    jsonBody: educationHistory.map((entry) => ({
      candidate_slug: candidateSlug,
      ...stripUndefinedValues(entry),
    })),
  };
}

export function buildSearchHotlistsRequest(filters: SearchHotlistsInput): GetRequestOptions {
  const query = new URLSearchParams();
  const page = normalizePage(filters.page);

  query.set("page", String(page));
  query.set("related_to_type", filters.related_to_type);
  setStringParam(query, "name", filters.name);
  setNumberParam(query, "shared", filters.shared);

  return { query };
}

export function buildListUsersRequest(filters: Pick<ListUsersInput, "include_teams">): GetRequestOptions {
  if (!filters.include_teams) {
    return {};
  }

  const query = new URLSearchParams();
  query.set("expand", "team");

  return { query };
}

export function buildSearchJobsRequest(filters: SearchJobsInput): GetRequestOptions {
  const query = new URLSearchParams();
  const page = normalizePage(filters.page);
  const limit = normalizeLimit(filters.limit);

  query.set("page", String(page));
  query.set("limit", String(limit));

  if (filters.job_slug) {
    query.set("job_slug", filters.job_slug);
    return { query };
  }

  setStringParam(query, "city", filters.city);
  setStringParam(query, "company_name", filters.company_name);
  setStringParam(query, "company_slug", filters.company_slug);
  setStringParam(query, "contact_email", filters.contact_email);
  setStringParam(query, "contact_name", filters.contact_name);
  setStringParam(query, "contact_number", filters.contact_number);
  setStringParam(query, "contact_slug", filters.contact_slug);
  setStringParam(query, "country", filters.country);
  setStringParam(query, "created_from", filters.created_from);
  setStringParam(query, "created_to", filters.created_to);
  setNumberParam(query, "enable_job_application_form", filters.enable_job_application_form);
  setStringParam(query, "full_address", filters.full_address);
  setStringParam(query, "job_category", filters.job_category);
  setStringParam(query, "job_skill", filters.job_skill);
  setNumberParam(query, "job_status", filters.job_status);
  setNumberParam(query, "job_type", filters.job_type);
  setStringParam(query, "locality", filters.locality);
  setStringParam(query, "name", filters.name);
  setStringParam(query, "note_for_candidates", filters.note_for_candidates);
  setStringParam(query, "owner_email", filters.owner_email);
  setStringParam(query, "owner_id", filters.owner_id);
  setStringParam(query, "owner_name", filters.owner_name);
  setStringParam(query, "secondary_contact_email", filters.secondary_contact_email);
  setStringParam(query, "secondary_contact_name", filters.secondary_contact_name);
  setStringParam(query, "secondary_contact_number", filters.secondary_contact_number);
  setStringParam(query, "secondary_contact_slug", filters.secondary_contact_slug);
  setStringParam(query, "updated_from", filters.updated_from);
  setStringParam(query, "updated_to", filters.updated_to);
  setBooleanParam(query, "exact_search", filters.exact_search);
  query.set("sort_by", filters.sort_by ?? "updatedon");
  query.set("sort_order", filters.sort_order ?? "desc");

  const customFields = buildSearchCustomFieldsBody(filters.custom_fields);

  if (!customFields) {
    return { query };
  }

  return {
    query,
    jsonBody: {
      custom_fields: customFields,
    },
  };
}

export function buildGetJobAssignedCandidatesRequest(filters: GetJobAssignedCandidatesInput): GetRequestOptions {
  const query = new URLSearchParams();
  const page = normalizePage(filters.page);
  const limit = normalizeAssignedCandidatesLimit(filters.limit);

  query.set("page", String(page));
  query.set("limit", String(limit));
  setStringParam(query, "status_id", filters.status_id);

  return { query };
}

export function buildSearchCompaniesRequest(filters: SearchCompaniesInput): GetRequestOptions {
  const query = new URLSearchParams();
  const page = normalizePage(filters.page);
  const limit = normalizeLimit(filters.limit);

  query.set("page", String(page));
  query.set("limit", String(limit));

  if (filters.company_slug) {
    query.set("company_slug", filters.company_slug);
    return { query };
  }

  setStringParam(query, "company_name", filters.company_name);
  setStringParam(query, "created_from", filters.created_from);
  setStringParam(query, "created_to", filters.created_to);
  setBooleanParam(query, "marked_as_off_limit", filters.marked_as_off_limit);
  setStringParam(query, "owner_email", filters.owner_email);
  setNumberParam(query, "owner_id", filters.owner_id);
  setStringParam(query, "owner_name", filters.owner_name);
  setStringParam(query, "updated_from", filters.updated_from);
  setStringParam(query, "updated_to", filters.updated_to);
  setBooleanParam(query, "exact_search", filters.exact_search);
  query.set("sort_by", filters.sort_by ?? "updatedon");
  query.set("sort_order", filters.sort_order ?? "desc");

  const customFields = buildSearchCustomFieldsBody(filters.custom_fields);

  if (!customFields) {
    return { query };
  }

  return {
    query,
    jsonBody: {
      custom_fields: customFields,
    },
  };
}

export function buildSearchContactsRequest(filters: SearchContactsInput): GetRequestOptions {
  const query = new URLSearchParams();
  const page = normalizePage(filters.page);
  const limit = normalizeLimit(filters.limit);

  query.set("page", String(page));
  query.set("limit", String(limit));

  if (filters.contact_slug) {
    query.set("contact_slug", filters.contact_slug);
    return { query };
  }

  setStringParam(query, "created_from", filters.created_from);
  setStringParam(query, "created_to", filters.created_to);
  setStringParam(query, "email", filters.email);
  setStringParam(query, "first_name", filters.first_name);
  setStringParam(query, "last_name", filters.last_name);
  setStringParam(query, "linkedin", filters.linkedin);
  setBooleanParam(query, "marked_as_off_limit", filters.marked_as_off_limit);
  setStringParam(query, "owner_email", filters.owner_email);
  setStringParam(query, "owner_id", filters.owner_id);
  setStringParam(query, "owner_name", filters.owner_name);
  setStringParam(query, "updated_from", filters.updated_from);
  setStringParam(query, "updated_to", filters.updated_to);
  setStringParam(query, "company_slug", filters.company_slug);
  setStringParam(query, "contact_number", filters.contact_number);
  setBooleanParam(query, "exact_search", filters.exact_search);
  query.set("sort_by", filters.sort_by ?? "updatedon");
  query.set("sort_order", filters.sort_order ?? "desc");

  const customFields = buildSearchCustomFieldsBody(filters.custom_fields);

  if (!customFields) {
    return { query };
  }

  return {
    query,
    jsonBody: {
      custom_fields: customFields,
    },
  };
}

export function buildSearchTasksRequest(filters: SearchTasksInput): GetRequestOptions {
  const query = new URLSearchParams();
  const page = normalizePage(filters.page);

  query.set("page", String(page));
  setStringParam(query, "created_from", filters.created_from);
  setStringParam(query, "created_to", filters.created_to);
  setStringParam(query, "owner_email", filters.owner_email);
  setStringParam(query, "owner_id", filters.owner_id);
  setStringParam(query, "owner_name", filters.owner_name);
  setStringParam(query, "related_to", filters.related_to);
  setStringParam(query, "related_to_type", filters.related_to_type);
  setStringParam(query, "starting_from", filters.starting_from);
  setStringParam(query, "starting_to", filters.starting_to);
  setStringParam(query, "title", filters.title);
  setStringParam(query, "updated_from", filters.updated_from);
  setStringParam(query, "updated_to", filters.updated_to);

  return { query };
}

export function buildCreateTaskRequest(input: CreateTaskInput): RequestOptions {
  const body: Record<string, unknown> = {
    task_type_id: input.task_type_id,
    title: input.title,
    description: input.description,
    reminder: input.reminder,
    start_date: input.start_date,
    owner_id: input.owner_id,
    created_by: input.created_by,
  };

  setOptionalStringBody(body, "related_to", input.related_to);
  setOptionalStringBody(body, "related_to_type", input.related_to_type);
  setOptionalNumberBody(body, "updated_by", input.updated_by);
  setOptionalCsvBody(body, "associated_candidates", input.associated_candidates);
  setOptionalCsvBody(body, "associated_companies", input.associated_companies);
  setOptionalCsvBody(body, "associated_contacts", input.associated_contacts);
  setOptionalCsvBody(body, "associated_jobs", input.associated_jobs);
  setOptionalCsvBody(body, "associated_deals", input.associated_deals);
  setOptionalCsvBody(body, "collaborators", input.collaborator_user_ids);
  setOptionalCsvBody(body, "collaborator_team_ids", input.collaborator_team_ids);

  if (input.enable_auto_populate_teams !== undefined) {
    body.enable_auto_populate_teams = input.enable_auto_populate_teams ? 1 : 0;
  }

  return {
    method: "POST",
    jsonBody: body,
  };
}

export function buildUpdateTaskRequest(input: UpdateTaskInput): RequestOptions {
  const {
    task_id: _taskId,
    collaborator_user_ids,
    collaborator_team_ids,
    enable_auto_populate_teams,
    associated_candidates,
    associated_companies,
    associated_contacts,
    associated_jobs,
    associated_deals,
    ...fields
  } = input;
  const body = stripUndefinedValues(fields);

  setOptionalCsvBody(body, "associated_candidates", associated_candidates);
  setOptionalCsvBody(body, "associated_companies", associated_companies);
  setOptionalCsvBody(body, "associated_contacts", associated_contacts);
  setOptionalCsvBody(body, "associated_jobs", associated_jobs);
  setOptionalCsvBody(body, "associated_deals", associated_deals);
  setOptionalCsvBody(body, "collaborators", collaborator_user_ids);
  setOptionalCsvBody(body, "collaborator_team_ids", collaborator_team_ids);

  if (enable_auto_populate_teams !== undefined) {
    body.enable_auto_populate_teams = enable_auto_populate_teams ? 1 : 0;
  }

  return {
    method: "POST",
    jsonBody: body,
  };
}

export function buildSearchMeetingsRequest(filters: SearchMeetingsInput): GetRequestOptions {
  const query = new URLSearchParams();
  const page = normalizePage(filters.page);

  query.set("page", String(page));
  setStringParam(query, "created_from", filters.created_from);
  setStringParam(query, "created_to", filters.created_to);
  setStringParam(query, "owner_email", filters.owner_email);
  setStringParam(query, "owner_id", filters.owner_id);
  setStringParam(query, "owner_name", filters.owner_name);
  setStringParam(query, "related_to", filters.related_to);
  setStringParam(query, "related_to_type", filters.related_to_type);
  setStringParam(query, "starting_from", filters.starting_from);
  setStringParam(query, "starting_to", filters.starting_to);
  setStringParam(query, "title", filters.title);
  setStringParam(query, "updated_from", filters.updated_from);
  setStringParam(query, "updated_to", filters.updated_to);

  return { query };
}

export function buildCreateMeetingRequest(input: CreateMeetingInput): RequestOptions {
  const body: Record<string, unknown> = {
    title: input.title,
    reminder: input.reminder,
    start_date: input.start_date,
    end_date: input.end_date,
    owner_id: input.owner_id,
    created_by: input.created_by,
    do_not_send_calendar_invites: input.do_not_send_calendar_invites ? 1 : 0,
    enable_auto_populate_teams: input.enable_auto_populate_teams ? 1 : 0,
  };

  setOptionalNumberBody(body, "meeting_type_id", input.meeting_type_id);
  setOptionalStringBody(body, "description", input.description);
  setOptionalStringBody(body, "address", input.address);
  setOptionalStringBody(body, "related_to", input.related_to);
  setOptionalStringBody(body, "related_to_type", input.related_to_type);
  setOptionalNumberBody(body, "updated_by", input.updated_by);
  setOptionalCsvBody(body, "attendee_contacts", input.attendee_contacts);
  setOptionalCsvBody(body, "attendee_candidates", input.attendee_candidates);
  setOptionalCsvBody(body, "attendee_users", input.attendee_users);
  setOptionalCsvBody(body, "associated_candidates", input.associated_candidates);
  setOptionalCsvBody(body, "associated_companies", input.associated_companies);
  setOptionalCsvBody(body, "associated_contacts", input.associated_contacts);
  setOptionalCsvBody(body, "associated_jobs", input.associated_jobs);
  setOptionalCsvBody(body, "associated_deals", input.associated_deals);
  setOptionalCsvBody(body, "collaborator_user_ids", input.collaborator_user_ids);
  setOptionalCsvBody(body, "collaborator_team_ids", input.collaborator_team_ids);

  return {
    method: "POST",
    jsonBody: body,
  };
}

export function buildUpdateMeetingRequest(input: UpdateMeetingInput): RequestOptions {
  const {
    meeting_id: _meetingId,
    attendee_contacts,
    attendee_candidates,
    attendee_users,
    associated_candidates,
    associated_companies,
    associated_contacts,
    associated_jobs,
    associated_deals,
    collaborator_user_ids,
    collaborator_team_ids,
    do_not_send_calendar_invites,
    enable_auto_populate_teams,
    ...fields
  } = input;
  const body = stripUndefinedValues(fields);

  setOptionalCsvBody(body, "attendee_contacts", attendee_contacts);
  setOptionalCsvBody(body, "attendee_candidates", attendee_candidates);
  setOptionalCsvBody(body, "attendee_users", attendee_users);
  setOptionalCsvBody(body, "associated_candidates", associated_candidates);
  setOptionalCsvBody(body, "associated_companies", associated_companies);
  setOptionalCsvBody(body, "associated_contacts", associated_contacts);
  setOptionalCsvBody(body, "associated_jobs", associated_jobs);
  setOptionalCsvBody(body, "associated_deals", associated_deals);
  setOptionalCsvBody(body, "collaborator_user_ids", collaborator_user_ids);
  setOptionalCsvBody(body, "collaborator_team_ids", collaborator_team_ids);

  if (do_not_send_calendar_invites !== undefined) {
    body.do_not_send_calendar_invites = do_not_send_calendar_invites ? 1 : 0;
  }

  if (enable_auto_populate_teams !== undefined) {
    body.enable_auto_populate_teams = enable_auto_populate_teams ? 1 : 0;
  }

  return {
    method: "POST",
    jsonBody: body,
  };
}

export function buildSearchNotesRequest(filters: SearchNotesInput): GetRequestOptions {
  const query = new URLSearchParams();
  const page = normalizePage(filters.page);

  query.set("page", String(page));
  setStringParam(query, "added_from", filters.added_from);
  setStringParam(query, "added_to", filters.added_to);
  setStringParam(query, "related_to", filters.related_to);
  setStringParam(query, "related_to_type", filters.related_to_type);
  setStringParam(query, "updated_from", filters.updated_from);
  setStringParam(query, "updated_to", filters.updated_to);

  return { query };
}

export function buildCreateNoteRequest(input: CreateNoteInput): RequestOptions {
  const body: Record<string, unknown> = {
    note_type_id: input.note_type_id,
    description: input.description,
    related_to: input.related_to,
    related_to_type: input.related_to_type,
    created_by: input.created_by,
  };

  setOptionalNumberBody(body, "updated_by", input.updated_by);
  setOptionalCsvBody(body, "associated_candidates", input.associated_candidates);
  setOptionalCsvBody(body, "associated_companies", input.associated_companies);
  setOptionalCsvBody(body, "associated_contacts", input.associated_contacts);
  setOptionalCsvBody(body, "associated_jobs", input.associated_jobs);
  setOptionalCsvBody(body, "associated_deals", input.associated_deals);
  setOptionalCsvBody(body, "collaborator_user_ids", input.collaborator_user_ids);
  setOptionalCsvBody(body, "collaborator_team_ids", input.collaborator_team_ids);

  if (input.enable_auto_populate_teams !== undefined) {
    body.enable_auto_populate_teams = input.enable_auto_populate_teams ? 1 : 0;
  }

  return {
    method: "POST",
    jsonBody: body,
  };
}

export function buildUpdateNoteRequest(input: UpdateNoteInput): RequestOptions {
  const {
    note_id: _noteId,
    associated_candidates,
    associated_companies,
    associated_contacts,
    associated_jobs,
    associated_deals,
    collaborator_user_ids,
    collaborator_team_ids,
    enable_auto_populate_teams,
    ...fields
  } = input;
  const body = stripUndefinedValues(fields);

  setOptionalCsvBody(body, "associated_candidates", associated_candidates);
  setOptionalCsvBody(body, "associated_companies", associated_companies);
  setOptionalCsvBody(body, "associated_contacts", associated_contacts);
  setOptionalCsvBody(body, "associated_jobs", associated_jobs);
  setOptionalCsvBody(body, "associated_deals", associated_deals);
  setOptionalCsvBody(body, "collaborator_user_ids", collaborator_user_ids);
  setOptionalCsvBody(body, "collaborator_team_ids", collaborator_team_ids);

  if (enable_auto_populate_teams !== undefined) {
    body.enable_auto_populate_teams = enable_auto_populate_teams ? 1 : 0;
  }

  return {
    method: "POST",
    jsonBody: body,
  };
}

export function buildSearchCallLogsRequest(filters: SearchCallLogsInput): GetRequestOptions {
  const query = new URLSearchParams();
  const page = normalizePage(filters.page);

  query.set("page", String(page));
  setStringParam(query, "call_type", filters.call_type);
  setStringParam(query, "related_to", filters.related_to);
  setStringParam(query, "related_to_type", filters.related_to_type);
  setStringParam(query, "starting_from", filters.starting_from);
  setStringParam(query, "starting_to", filters.starting_to);
  setStringParam(query, "updated_from", filters.updated_from);
  setStringParam(query, "updated_to", filters.updated_to);

  return { query };
}

export function buildCreateCallLogRequest(input: CreateCallLogInput): RequestOptions {
  const body: Record<string, unknown> = {
    call_type: input.call_type,
    custom_call_type_id: input.custom_call_type_id,
    call_started_on: input.call_started_on,
    related_to_type: input.related_to_type,
    created_by: input.created_by,
    updated_by: input.updated_by,
  };

  setOptionalStringBody(body, "contact_number", input.contact_number);
  setOptionalStringBody(body, "call_notes", input.call_notes);
  setOptionalStringBody(body, "related_to", input.related_to);
  setOptionalStringBody(body, "duration", input.duration);
  setOptionalCsvBody(body, "associated_candidates", input.associated_candidates);
  setOptionalCsvBody(body, "associated_contacts", input.associated_contacts);
  setOptionalCsvBody(body, "associated_companies", input.associated_companies);
  setOptionalCsvBody(body, "associated_jobs", input.associated_jobs);
  setOptionalCsvBody(body, "associated_deals", input.associated_deals);
  setOptionalCsvBody(body, "collaborator_user_ids", input.collaborator_user_ids);
  setOptionalCsvBody(body, "collaborator_team_ids", input.collaborator_team_ids);

  if (input.enable_auto_populate_teams !== undefined) {
    body.enable_auto_populate_teams = input.enable_auto_populate_teams ? 1 : 0;
  }

  return {
    method: "POST",
    jsonBody: body,
  };
}

export function buildUpdateCallLogRequest(input: UpdateCallLogInput): RequestOptions {
  const {
    call_log_id: _callLogId,
    associated_candidates,
    associated_contacts,
    associated_companies,
    associated_jobs,
    associated_deals,
    collaborator_user_ids,
    collaborator_team_ids,
    enable_auto_populate_teams,
    ...fields
  } = input;
  const body = stripUndefinedValues(fields);

  setOptionalCsvBody(body, "associated_candidates", associated_candidates);
  setOptionalCsvBody(body, "associated_contacts", associated_contacts);
  setOptionalCsvBody(body, "associated_companies", associated_companies);
  setOptionalCsvBody(body, "associated_jobs", associated_jobs);
  setOptionalCsvBody(body, "associated_deals", associated_deals);
  setOptionalCsvBody(body, "collaborator_user_ids", collaborator_user_ids);
  setOptionalCsvBody(body, "collaborator_team_ids", collaborator_team_ids);

  if (enable_auto_populate_teams !== undefined) {
    body.enable_auto_populate_teams = enable_auto_populate_teams ? 1 : 0;
  }

  return {
    method: "POST",
    jsonBody: body,
  };
}

function buildCandidateBodyFields(
  candidateFields: Record<string, unknown>,
  custom_fields: CreateCandidateInput["custom_fields"],
): Record<string, unknown> {
  const body = stripUndefinedValues(candidateFields);

  if (custom_fields !== undefined) {
    body.custom_fields = custom_fields.map((cf) => ({
      field_id: cf.field_id,
      value: Array.isArray(cf.value) ? cf.value.join(",") : cf.value,
    }));
  }

  return body;
}

function buildCreateCandidateBody(input: CreateCandidateInput): Record<string, unknown> {
  const {
    work_history: _workHistory,
    education_history: _educationHistory,
    allow_duplicate: _allowDuplicate,
    existing_candidate_slug: _existingCandidateSlug,
    custom_fields,
    ...candidateFields
  } = input as CreateCandidateInput & { existing_candidate_slug?: string };

  return buildCandidateBodyFields(candidateFields, custom_fields);
}

function buildUpdateCandidateBody(input: UpdateCandidateInput): Record<string, unknown> {
  const {
    work_history: _workHistory,
    education_history: _educationHistory,
    candidate_slug: _candidateSlug,
    existing_candidate_slug: _existingCandidateSlug,
    custom_fields,
    ...candidateFields
  } = input as UpdateCandidateInput & { existing_candidate_slug?: string };

  return buildCandidateBodyFields(candidateFields, custom_fields);
}

function stripUndefinedValues(input: object): Record<string, unknown> {
  const output: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      output[key] = value;
    }
  }

  return output;
}

function setStringParam(params: URLSearchParams, key: string, value: string | undefined): void {
  if (value !== undefined) {
    params.set(key, value);
  }
}

function setNumberParam(params: URLSearchParams, key: string, value: number | undefined): void {
  if (value !== undefined) {
    params.set(key, String(value));
  }
}

function setBooleanParam(params: URLSearchParams, key: string, value: boolean | undefined): void {
  if (value !== undefined) {
    params.set(key, String(value));
  }
}

function setOptionalNumberBody(body: Record<string, unknown>, key: string, value: number | undefined): void {
  if (value !== undefined) {
    body[key] = value;
  }
}

function setOptionalStringBody(body: Record<string, unknown>, key: string, value: string | undefined): void {
  if (value !== undefined) {
    body[key] = value;
  }
}

function setOptionalCsvBody(
  body: Record<string, unknown>,
  key: string,
  values: Array<string | number> | undefined,
): void {
  if (values !== undefined && values.length > 0) {
    body[key] = values.map((value) => String(value)).join(",");
  }
}

function buildSearchCustomFieldsBody(
  filters: SearchCandidateCustomFieldFilter[] | undefined,
): SearchCustomFieldsBody | undefined {
  if (!filters || filters.length === 0) {
    return undefined;
  }

  return filters.map((filter) => {
    if (filter.filter_value === undefined) {
      return {
        field_id: filter.field_id,
        filter_type: filter.filter_type,
      };
    }

    return {
      field_id: filter.field_id,
      filter_type: filter.filter_type,
      filter_value: filter.filter_value,
    };
  });
}

function buildCustomFieldDependenciesOutput(
  entityType: string,
  raw: Record<string, unknown>,
): CustomFieldDependenciesOutput {
  const dependencies: CustomFieldDependenciesOutput["dependencies"] = [];

  function collectDependencies(parent: NestedFieldNode, children: Record<string, unknown> | unknown[]): void {
    if (Array.isArray(children)) return;
    for (const child of Object.values(children)) {
      const dep = child as NestedFieldNode;
      const depIsObj = !Array.isArray(dep.dependency) && typeof dep.dependency === "object" && dep.dependency !== null;
      const visIsObj =
        !Array.isArray(dep.visibility) && typeof dep.visibility === "object" && dep.visibility !== null;
      const depMap = depIsObj ? (dep.dependency as Record<string, string>) : {};
      const visMap = visIsObj ? (dep.visibility as Record<string, string>) : {};

      if (depIsObj && Object.keys(depMap).length > 0) {
        const parentOptionToChildOptions: Record<string, string[]> = {};
        for (const [parentOption, childOptionsStr] of Object.entries(depMap)) {
          parentOptionToChildOptions[parentOption] = childOptionsStr.split(",").map((s) => s.trim()).filter(Boolean);
        }
        dependencies.push({
          parent_field_id: parent.field_id,
          parent_field_name: parent.field_name,
          parent_field_type: parent.field_type,
          child_field_id: dep.field_id,
          child_field_name: dep.field_name,
          child_field_type: dep.field_type,
          dependency_type: "value_filter",
          parent_option_to_child_options: parentOptionToChildOptions,
        });
      } else if (visIsObj && Object.keys(visMap).length > 0) {
        dependencies.push({
          parent_field_id: parent.field_id,
          parent_field_name: parent.field_name,
          parent_field_type: parent.field_type,
          child_field_id: dep.field_id,
          child_field_name: dep.field_name,
          child_field_type: dep.field_type,
          dependency_type: "visibility",
          visible_when_parent_is: Object.keys(visMap),
        });
      }

      if (!Array.isArray(dep.children)) {
        collectDependencies(dep, dep.children);
      }
    }
  }

  for (const topLevel of Object.values(raw)) {
    const node = topLevel as NestedFieldNode;
    collectDependencies(node, node.children);
  }

  return { entity_type: entityType, dependency_count: dependencies.length, dependencies };
}

function normalizePage(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value) || value < 1) {
    return 1;
  }

  return Math.floor(value);
}

function normalizeLimit(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value) || value < 1) {
    return 100;
  }

  return Math.floor(value);
}

function normalizeAssignedCandidatesLimit(value: number | undefined): number {
  return Math.min(normalizeLimit(value), 100);
}

export function buildUpdateCandidateHiringStageRequest(input: UpdateCandidateHiringStageInput): RequestOptions {
  return {
    method: "POST",
    jsonBody: stripUndefinedValues({
      status_id: input.status_id,
      remark: input.remark,
      stage_date: input.stage_date,
      updated_by: input.updated_by,
      create_placement: input.create_placement,
    }),
  };
}

export function buildPitchCandidateToContactRequest(input: PitchCandidateToContactInput): RequestOptions {
  const query = new URLSearchParams();
  query.set("created_by", String(input.created_by));

  return {
    method: "POST",
    query,
  };
}

export function buildUpdateCandidatePitchStageRequest(input: UpdateCandidatePitchStageInput): RequestOptions {
  const query = new URLSearchParams();
  query.set("updated_by", String(input.updated_by));

  return {
    method: "POST",
    query,
    jsonBody: stripUndefinedValues({
      status_id: input.status_id,
      stage_date: input.stage_date,
      remark: input.remark,
    }),
  };
}

export function buildAssignCandidateToJobRequest(input: AssignCandidateToJobInput): RequestOptions {
  const query = new URLSearchParams();
  query.set("job_slug", input.job_slug);
  query.set("updated_by", String(input.updated_by));

  return {
    method: "POST",
    query,
  };
}
